import { describe, test, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import ThemeProvider from "./ThemeProvider.jsx";
import App from "./App.jsx";

function renderWithThemeProvider() {
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

function getCurrentThemeValue() {
  const themeCard = screen.getByRole("heading", {
    name: /global theme switcher/i,
  }).closest("section");

  return within(themeCard).getByTestId("current-theme");
}

beforeEach(() => {
  localStorage.clear();
});

describe("Global Theme Switcher", () => {
  test("renders with light mode by default", () => {
    renderWithThemeProvider();

    expect(screen.getByText(/current theme:/i)).toBeInTheDocument();
    expect(getCurrentThemeValue()).toHaveTextContent("light");

    expect(
      screen.getByRole("button", { name: /switch to dark mode/i })
    ).toBeInTheDocument();
  });

  test("toggles from light mode to dark mode", () => {
    renderWithThemeProvider();

    fireEvent.click(
      screen.getByRole("button", { name: /switch to dark mode/i })
    );

    expect(getCurrentThemeValue()).toHaveTextContent("dark");

    expect(
      screen.getByRole("button", { name: /switch to light mode/i })
    ).toBeInTheDocument();
  });

  test("toggles from dark mode back to light mode", () => {
    renderWithThemeProvider();

    fireEvent.click(
      screen.getByRole("button", { name: /switch to dark mode/i })
    );

    fireEvent.click(
      screen.getByRole("button", { name: /switch to light mode/i })
    );

    expect(getCurrentThemeValue()).toHaveTextContent("light");
  });

  test("saves selected theme to localStorage", () => {
    renderWithThemeProvider();

    fireEvent.click(
      screen.getByRole("button", { name: /switch to dark mode/i })
    );

    expect(localStorage.getItem("theme")).toBe("dark");
  });

  test("loads saved dark theme from localStorage", () => {
    localStorage.setItem("theme", "dark");

    renderWithThemeProvider();

    expect(getCurrentThemeValue()).toHaveTextContent("dark");

    expect(
      screen.getByRole("button", { name: /switch to light mode/i })
    ).toBeInTheDocument();
  });

  test("theme classes are applied to the main container", () => {
    renderWithThemeProvider();

    const mainContainer = screen.getByRole("main");

    expect(mainContainer).toHaveClass("light-mode");

    fireEvent.click(
      screen.getByRole("button", { name: /switch to dark mode/i })
    );

    expect(mainContainer).toHaveClass("dark-mode");
  });
});
