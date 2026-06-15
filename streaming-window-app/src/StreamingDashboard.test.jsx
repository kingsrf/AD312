import {
  act,
  cleanup,
  render,
  screen,
} from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import StreamingDashboard from "./StreamingDashboard.jsx";

function setWindowSize(width, height) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });

  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    writable: true,
    value: height,
  });
}

function resizeWindow(width, height) {
  setWindowSize(width, height);

  act(() => {
    window.dispatchEvent(new Event("resize"));
  });
}

beforeEach(() => {
  setWindowSize(1200, 800);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("StreamingDashboard and useWindowSize", () => {
  test("displays the browser's initial width and height", () => {
    render(<StreamingDashboard />);

    expect(screen.getByTestId("window-width")).toHaveTextContent(
      "1200px"
    );

    expect(screen.getByTestId("window-height")).toHaveTextContent(
      "800px"
    );
  });

  test("uses the desktop layout for a wide screen", () => {
    render(<StreamingDashboard />);

    expect(screen.getByTestId("layout-mode")).toHaveTextContent(
      "Desktop"
    );

    expect(
      screen.getByTestId("streaming-dashboard").parentElement
    ).toHaveClass("desktop-layout");
  });

  test("updates dimensions after the browser is resized", () => {
    render(<StreamingDashboard />);

    resizeWindow(1024, 650);

    expect(screen.getByTestId("window-width")).toHaveTextContent(
      "1024px"
    );

    expect(screen.getByTestId("window-height")).toHaveTextContent(
      "650px"
    );
  });

  test("switches to the mobile layout below 768 pixels", () => {
    render(<StreamingDashboard />);

    resizeWindow(480, 760);

    expect(screen.getByTestId("layout-mode")).toHaveTextContent(
      "Mobile"
    );

    expect(
      screen.getByTestId("streaming-dashboard").parentElement
    ).toHaveClass("mobile-layout");
  });

  test("treats exactly 768 pixels as desktop", () => {
    setWindowSize(768, 700);

    render(<StreamingDashboard />);

    expect(screen.getByTestId("layout-mode")).toHaveTextContent(
      "Desktop"
    );
  });

  test("keeps the latest result after rapid resize events", () => {
    render(<StreamingDashboard />);

    resizeWindow(900, 700);
    resizeWindow(600, 750);
    resizeWindow(390, 844);

    expect(screen.getByTestId("window-width")).toHaveTextContent(
      "390px"
    );

    expect(screen.getByTestId("window-height")).toHaveTextContent(
      "844px"
    );

    expect(screen.getByTestId("layout-mode")).toHaveTextContent(
      "Mobile"
    );
  });

  test("adds one resize listener and removes it after unmounting", () => {
    const addListenerSpy = vi.spyOn(window, "addEventListener");
    const removeListenerSpy = vi.spyOn(
      window,
      "removeEventListener"
    );

    const { unmount } = render(<StreamingDashboard />);

    const resizeListenerCall = addListenerSpy.mock.calls.find(
      ([eventName]) => eventName === "resize"
    );

    expect(resizeListenerCall).toBeDefined();

    const resizeHandler = resizeListenerCall[1];

    unmount();

    expect(removeListenerSpy).toHaveBeenCalledWith(
      "resize",
      resizeHandler
    );
  });
});
