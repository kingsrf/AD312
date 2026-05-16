// src/ContextRefactor.test.jsx
import { describe, test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App.jsx";

describe("Context Refactor App", () => {
  test("renders the main app title", () => {
    render(<App />);

    expect(screen.getByText(/context refactor app/i)).toBeInTheDocument();
  });

  test("displays user profile data from context", () => {
    render(<App />);

    expect(screen.getByText(/king sambonge/i)).toBeInTheDocument();
    expect(screen.getByText(/king@example.com/i)).toBeInTheDocument();
  });

  test("displays the default theme preference", () => {
    render(<App />);

    expect(screen.getByText(/theme preference:/i)).toBeInTheDocument();
    expect(screen.getByText(/dark/i)).toBeInTheDocument();
  });

  test("toggles theme preference from dark to light", () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole("button", { name: /toggle theme preference/i })
    );

    expect(screen.getByText(/light/i)).toBeInTheDocument();
  });

  test("toggles theme preference from light back to dark", () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole("button", { name: /toggle theme preference/i })
    );

    fireEvent.click(
      screen.getByRole("button", { name: /toggle theme preference/i })
    );

    expect(screen.getByText(/dark/i)).toBeInTheDocument();
  });

  test("dashboard and sidebar do not need user props to render profile data", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { name: /^dashboard$/i })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("heading", { name: /^sidebar$/i })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("heading", { name: /^user profile$/i })
  ).toBeInTheDocument();

  expect(screen.getByText(/king sambonge/i)).toBeInTheDocument();
});

});
