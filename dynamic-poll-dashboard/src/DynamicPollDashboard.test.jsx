import {
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import {
  cleanup,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DynamicPollDashboard from "./DynamicPollDashboard.jsx";

const { chartInstances } = vi.hoisted(() => ({
  chartInstances: [],
}));

vi.mock("chart.js/auto", () => {
  class MockChart {
    constructor(canvas, configuration) {
      this.canvas = canvas;
      this.configuration = configuration;

      this.data = {
        labels: [...configuration.data.labels],
        datasets: configuration.data.datasets.map((dataset) => ({
          ...dataset,
          data: [...dataset.data],
        })),
      };

      this.update = vi.fn();
      this.destroy = vi.fn();

      chartInstances.push(this);
    }
  }

  return {
    default: MockChart,
  };
});

function getPollOptionCard(optionName) {
  const heading = screen.getByRole("heading", {
    name: new RegExp(`^${optionName}$`, "i"),
  });

  return heading.closest("article");
}

function getTotalVoteCounter() {
  return screen.getByText(/^\d+ votes?$/i, {
    selector: ".total-votes",
  });
}

beforeEach(() => {
  cleanup();
  chartInstances.length = 0;
});

describe("DynamicPollDashboard", () => {
  test("renders all poll options with zero votes", () => {
    render(<DynamicPollDashboard />);

    expect(
      screen.getByRole("heading", {
        name: /dynamic poll dashboard/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /vote for react/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /vote for vue/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /vote for angular/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /vote for svelte/i,
      })
    ).toBeInTheDocument();

    expect(getTotalVoteCounter()).toHaveTextContent("0 votes");

    for (const framework of ["React", "Vue", "Angular", "Svelte"]) {
      const optionCard = getPollOptionCard(framework);

      expect(optionCard).not.toBeNull();
      expect(within(optionCard).getByText("0 votes")).toBeInTheDocument();
      expect(within(optionCard).getByText("0%")).toBeInTheDocument();
    }

    expect(
      screen.getByRole("button", {
        name: /reset poll/i,
      })
    ).toBeDisabled();
  });

  test("creates one bar chart when the component mounts", () => {
    render(<DynamicPollDashboard />);

    expect(chartInstances).toHaveLength(1);
    expect(chartInstances[0].configuration.type).toBe("bar");

    expect(chartInstances[0].data.labels).toEqual([
      "React",
      "Vue",
      "Angular",
      "Svelte",
    ]);

    expect(chartInstances[0].data.datasets[0].data).toEqual([
      0,
      0,
      0,
      0,
    ]);
  });

  test("updates React state and the existing chart after a vote", async () => {
    const user = userEvent.setup();

    render(<DynamicPollDashboard />);

    const chart = chartInstances[0];
    const initialUpdateCount = chart.update.mock.calls.length;

    await user.click(
      screen.getByRole("button", {
        name: /vote for react/i,
      })
    );

    const reactCard = getPollOptionCard("React");

    expect(getTotalVoteCounter()).toHaveTextContent("1 vote");
    expect(within(reactCard).getByText("1 vote")).toBeInTheDocument();
    expect(within(reactCard).getByText("100%")).toBeInTheDocument();

    expect(chartInstances).toHaveLength(1);

    expect(chart.data.datasets[0].data).toEqual([
      1,
      0,
      0,
      0,
    ]);

    expect(chart.update).toHaveBeenCalledTimes(
      initialUpdateCount + 1
    );
  });

  test("tracks multiple votes across different options", async () => {
    const user = userEvent.setup();

    render(<DynamicPollDashboard />);

    await user.click(
      screen.getByRole("button", {
        name: /vote for react/i,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: /vote for vue/i,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: /vote for vue/i,
      })
    );

    const reactCard = getPollOptionCard("React");
    const vueCard = getPollOptionCard("Vue");

    expect(getTotalVoteCounter()).toHaveTextContent("3 votes");
    expect(within(reactCard).getByText("1 vote")).toBeInTheDocument();
    expect(within(vueCard).getByText("2 votes")).toBeInTheDocument();

    expect(chartInstances[0].data.datasets[0].data).toEqual([
      1,
      2,
      0,
      0,
    ]);
  });

  test("does not create percentages containing NaN when no votes exist", () => {
    render(<DynamicPollDashboard />);

    expect(screen.queryByText(/nan/i)).not.toBeInTheDocument();
    expect(screen.getAllByText("0%")).toHaveLength(4);
  });

  test("resets all vote values and updates the chart", async () => {
    const user = userEvent.setup();

    render(<DynamicPollDashboard />);

    await user.click(
      screen.getByRole("button", {
        name: /vote for react/i,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: /vote for angular/i,
      })
    );

    const resetButton = screen.getByRole("button", {
      name: /reset poll/i,
    });

    expect(resetButton).toBeEnabled();

    await user.click(resetButton);

    expect(getTotalVoteCounter()).toHaveTextContent("0 votes");
    expect(resetButton).toBeDisabled();

    for (const framework of ["React", "Vue", "Angular", "Svelte"]) {
      const optionCard = getPollOptionCard(framework);

      expect(within(optionCard).getByText("0 votes")).toBeInTheDocument();
      expect(within(optionCard).getByText("0%")).toBeInTheDocument();
    }

    expect(chartInstances[0].data.datasets[0].data).toEqual([
      0,
      0,
      0,
      0,
    ]);
  });

  test("destroys the Chart.js instance when the component unmounts", () => {
    const { unmount } = render(<DynamicPollDashboard />);

    const chart = chartInstances[0];

    expect(chart.destroy).not.toHaveBeenCalled();

    unmount();

    expect(chart.destroy).toHaveBeenCalledTimes(1);
  });
});
