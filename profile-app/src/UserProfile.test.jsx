import { describe, test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import UserProfile from "./UserProfile.jsx";

describe("UserProfile Component", () => {
  test("updates address with all valid inputs", () => {
    render(<UserProfile />);

    fireEvent.change(screen.getByPlaceholderText(/street/i), {
      target: { value: "456 New St" },
    });
    fireEvent.change(screen.getByPlaceholderText(/city/i), {
      target: { value: "New York" },
    });
    fireEvent.change(screen.getByPlaceholderText(/country/i), {
      target: { value: "USA" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update address/i }));

    expect(screen.getByText(/456 New St/)).toBeInTheDocument();
    expect(screen.getByText(/New York/)).toBeInTheDocument();
    expect(screen.getByText(/USA/)).toBeInTheDocument();
  });

  test("updates only city while keeping other address fields unchanged", () => {
    render(<UserProfile />);

    fireEvent.change(screen.getByPlaceholderText(/city/i), {
      target: { value: "Chicago" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update address/i }));

    expect(screen.getByText(/1000 1st Ave N/)).toBeInTheDocument();
    expect(screen.getByText(/Chicago/)).toBeInTheDocument();
    expect(screen.getByText(/United States/)).toBeInTheDocument();
  });

  test("updates only street while keeping city and country unchanged", () => {
    render(<UserProfile />);

    fireEvent.change(screen.getByPlaceholderText(/street/i), {
      target: { value: "789 Broadway" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update address/i }));

    expect(screen.getByText(/789 Broadway/)).toBeInTheDocument();
    expect(screen.getByText(/Seattle/)).toBeInTheDocument();
    expect(screen.getByText(/United States/)).toBeInTheDocument();
  });

  test("leaves address unchanged if all inputs are empty", () => {
    render(<UserProfile />);

    fireEvent.change(screen.getByPlaceholderText(/street/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText(/city/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText(/country/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update address/i }));

    expect(screen.getByText(/1000 1st Ave N/)).toBeInTheDocument();
    expect(screen.getByText(/Seattle/)).toBeInTheDocument();
    expect(screen.getByText(/United States/)).toBeInTheDocument();
  });

  test("trims whitespace from inputs before updating", () => {
    render(<UserProfile />);

    fireEvent.change(screen.getByPlaceholderText(/street/i), {
      target: { value: "   999 Trimmed Rd   " },
    });
    fireEvent.change(screen.getByPlaceholderText(/city/i), {
      target: { value: "   Trimtown   " },
    });
    fireEvent.change(screen.getByPlaceholderText(/country/i), {
      target: { value: "   Trimland   " },
    });

    fireEvent.click(screen.getByRole("button", { name: /update address/i }));

    expect(screen.getByText("999 Trimmed Rd")).toBeInTheDocument();
    expect(screen.getByText("Trimtown")).toBeInTheDocument();
    expect(screen.getByText("Trimland")).toBeInTheDocument();
  });

  test("handles special characters in address", () => {
    render(<UserProfile />);

    fireEvent.change(screen.getByPlaceholderText(/street/i), {
      target: { value: "Main St #101" },
    });
    fireEvent.change(screen.getByPlaceholderText(/city/i), {
      target: { value: "St. Louis" },
    });
    fireEvent.change(screen.getByPlaceholderText(/country/i), {
      target: { value: "U.S.A." },
    });

    fireEvent.click(screen.getByRole("button", { name: /update address/i }));

    expect(screen.getByText(/Main St #101/)).toBeInTheDocument();
    expect(screen.getByText(/St. Louis/)).toBeInTheDocument();
    expect(screen.getByText(/U.S.A./)).toBeInTheDocument();
  });
});
