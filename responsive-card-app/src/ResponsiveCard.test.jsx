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
import ResponsiveCard from "./ResponsiveCard.jsx";

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

describe("ResponsiveCard", () => {
  test("displays the initial browser width and height", () => {
    render(<ResponsiveCard />);

    expect(screen.getByTestId("width-value")).toHaveTextContent(
      "1200px"
    );

    expect(screen.getByTestId("height-value")).toHaveTextContent(
      "800px"
    );
  });

  test("uses the desktop layout for a wide browser window", () => {
    render(<ResponsiveCard />);

    expect(screen.getByTestId("layout-mode")).toHaveTextContent(
      "Desktop"
    );

    expect(
      screen.getByTestId("responsive-card")
    ).toHaveClass("desktop-card");
  });

  test("updates dimensions in real time after a resize event", () => {
    render(<ResponsiveCard />);

    resizeWindow(980, 640);

    expect(screen.getByTestId("width-value")).toHaveTextContent(
      "980px"
    );

    expect(screen.getByTestId("height-value")).toHaveTextContent(
      "640px"
    );
  });

  test("switches to mobile layout below the breakpoint", () => {
    render(<ResponsiveCard />);

    resizeWindow(500, 760);

    expect(screen.getByTestId("layout-mode")).toHaveTextContent(
      "Mobile"
    );

    expect(
      screen.getByTestId("responsive-card")
    ).toHaveClass("mobile-card");
  });

  test("treats the exact 768 pixel breakpoint as desktop", () => {
    setWindowSize(768, 700);

    render(<ResponsiveCard />);

    expect(screen.getByTestId("layout-mode")).toHaveTextContent(
      "Desktop"
    );

    expect(
      screen.getByTestId("responsive-card")
    ).toHaveClass("desktop-card");
  });

  test("keeps the latest dimensions after rapid resize events", () => {
    render(<ResponsiveCard />);

    resizeWindow(700, 700);
    resizeWindow(620, 720);
    resizeWindow(430, 810);

    expect(screen.getByTestId("width-value")).toHaveTextContent(
      "430px"
    );

    expect(screen.getByTestId("height-value")).toHaveTextContent(
      "810px"
    );

    expect(screen.getByTestId("layout-mode")).toHaveTextContent(
      "Mobile"
    );
  });

  test("removes the resize listener when the component unmounts", () => {
    const addListenerSpy = vi.spyOn(window, "addEventListener");
    const removeListenerSpy = vi.spyOn(
      window,
      "removeEventListener"
    );

    const { unmount } = render(<ResponsiveCard />);

    const resizeRegistration = addListenerSpy.mock.calls.find(
      ([eventName]) => eventName === "resize"
    );

    expect(resizeRegistration).toBeDefined();

    const resizeHandler = resizeRegistration[1];

    unmount();

    expect(removeListenerSpy).toHaveBeenCalledWith(
      "resize",
      resizeHandler
    );
  });
});
