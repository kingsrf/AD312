import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DogQueryApp from "./DogQueryApp.jsx";

const mockBreeds = {
  data: [
    {
      id: "breed-1",
      attributes: {
        name: "Rottweiler",
        description: "A strong working dog.",
        life: { min: 8, max: 10 },
        male_weight: { min: 50, max: 60 },
        female_weight: { min: 35, max: 48 },
      },
    },
    {
      id: "breed-2",
      attributes: {
        name: "Rough Collie",
        description: "A loyal herding dog.",
        life: { min: 12, max: 14 },
        male_weight: { min: 20, max: 30 },
        female_weight: { min: 18, max: 25 },
      },
    },
    {
      id: "breed-3",
      attributes: {
        name: "Akita",
        description: "A powerful Japanese breed.",
        life: { min: 10, max: 13 },
        male_weight: { min: 45, max: 59 },
        female_weight: { min: 32, max: 45 },
      },
    },
  ],
};

const mockGroups = {
  data: [
    {
      id: "group-1",
      attributes: {
        name: "Working Group",
      },
      relationships: {
        breeds: {
          data: [{ id: "breed-1" }],
        },
      },
    },
    {
      id: "group-2",
      attributes: {
        name: "Herding Group",
      },
      relationships: {
        breeds: {
          data: [{ id: "breed-2" }],
        },
      },
    },
  ],
};

const mockFacts = {
  data: [
    {
      id: "fact-1",
      attributes: {
        body: "Dogs have an excellent sense of smell.",
      },
    },
  ],
};

function renderWithQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <DogQueryApp />
    </QueryClientProvider>
  );
}

beforeEach(() => {
  global.fetch = vi.fn((url) => {
    if (url.includes("/breeds/breed-1")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: mockBreeds.data[0],
          }),
      });
    }

    if (url.includes("/breeds/breed-2")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: mockBreeds.data[1],
          }),
      });
    }

    if (url.endsWith("/breeds")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBreeds),
      });
    }

    if (url.endsWith("/groups")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockGroups),
      });
    }

    if (url.endsWith("/facts")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFacts),
      });
    }

    return Promise.resolve({
      ok: false,
    });
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("DogQueryApp", () => {
  test("renders loading state first", () => {
    renderWithQueryClient();

    expect(screen.getAllByText(/loading data/i).length).toBeGreaterThan(0);
  });

  test("renders dog facts from the API", async () => {
    renderWithQueryClient();

    expect(
      await screen.findByText(/dogs have an excellent sense of smell/i)
    ).toBeInTheDocument();
  });

  test("filters breeds by starting letters and limits suggestions", async () => {
    renderWithQueryClient();

    await screen.findByText(/dogs have an excellent sense of smell/i);

    fireEvent.change(screen.getByPlaceholderText(/search for a breed/i), {
      target: { value: "ro" },
    });

    expect(screen.getByText("Rottweiler")).toBeInTheDocument();
    expect(screen.getByText("Rough Collie")).toBeInTheDocument();
    expect(screen.queryByText("Akita")).not.toBeInTheDocument();
  });

  test("shows no breeds found when search has no matches", async () => {
    renderWithQueryClient();

    await screen.findByText(/dogs have an excellent sense of smell/i);

    fireEvent.change(screen.getByPlaceholderText(/search for a breed/i), {
      target: { value: "zzz" },
    });

    expect(screen.getByText(/no breeds found/i)).toBeInTheDocument();
  });

  test("displays selected breed details and matching dog group", async () => {
  renderWithQueryClient();

  await screen.findByText(/dogs have an excellent sense of smell/i);

  fireEvent.change(screen.getByPlaceholderText(/search for a breed/i), {
    target: { value: "ro" },
  });

  fireEvent.click(screen.getByRole("button", { name: /rottweiler/i }));

  expect(await screen.findByText(/a strong working dog/i)).toBeInTheDocument();
  expect(screen.getByText(/working group/i)).toBeInTheDocument();
});

  test("handles API errors gracefully", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    renderWithQueryClient();

    expect(
      await screen.findAllByText(/failed to fetch data from the dog api/i)
    ).not.toHaveLength(0);
  });
});
