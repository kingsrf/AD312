// src/ShoppingListWithImmer.test.jsx
import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ShoppingListWithImmer from "./ShoppingListWithImmer.jsx";

function addItem(
  name,
  quantity = "2",
  category = "Test Category",
  notes = "Test notes"
) {
  fireEvent.change(screen.getByPlaceholderText(/item name/i), {
    target: { value: name },
  });

  fireEvent.change(screen.getByPlaceholderText(/quantity/i), {
    target: { value: quantity },
  });

  fireEvent.change(screen.getByPlaceholderText(/category/i), {
    target: { value: category },
  });

  fireEvent.change(screen.getByPlaceholderText(/notes/i), {
    target: { value: notes },
  });

  fireEvent.click(screen.getByRole("button", { name: /add item/i }));
}

describe("ShoppingListWithImmer", () => {
  test("renders initial shopping list items", () => {
    render(<ShoppingListWithImmer />);

    expect(screen.getByText("Apples")).toBeInTheDocument();
    expect(screen.getByText("Milk")).toBeInTheDocument();
  });

  test("adds a new item successfully", () => {
    render(<ShoppingListWithImmer />);

    addItem("Bread", "2", "Bakery", "Whole wheat");

    expect(screen.getByText("Bread")).toBeInTheDocument();
    expect(screen.getByText(/whole wheat/i)).toBeInTheDocument();
  });

  test("prevents empty item names", () => {
    render(<ShoppingListWithImmer />);

    addItem("   ");

    expect(screen.getByText(/please enter an item name/i)).toBeInTheDocument();
  });

  test("prevents duplicate items case-insensitively", () => {
    render(<ShoppingListWithImmer />);

    addItem("apples");

    expect(screen.getByText(/item already exists/i)).toBeInTheDocument();
  });

  test("prevents invalid quantity values", () => {
    render(<ShoppingListWithImmer />);

    addItem("Bananas", "0");

    expect(
      screen.getByText(/quantity must be greater than zero/i)
    ).toBeInTheDocument();
  });

  test("prevents quantities above 50", () => {
    render(<ShoppingListWithImmer />);

    addItem("Rice", "51");

    expect(
      screen.getByText(/quantity cannot be greater than 50/i)
    ).toBeInTheDocument();
  });

  test("increases quantity using updateItem", () => {
    render(<ShoppingListWithImmer />);

    fireEvent.click(
      screen.getAllByRole("button", { name: /increase quantity/i })[0]
    );

    const applesCard = screen.getByText("Apples").closest(".shopping-card");

    expect(applesCard).toHaveTextContent("Quantity: 4");
    expect(applesCard).toHaveTextContent("Updated quantity to 4");
  });

  test("updates item notes", () => {
    render(<ShoppingListWithImmer />);

    vi.spyOn(window, "prompt").mockReturnValue("Updated test note");

    fireEvent.click(screen.getAllByRole("button", { name: /update notes/i })[0]);

    expect(screen.getByText(/updated test note/i)).toBeInTheDocument();

    window.prompt.mockRestore();
  });

  test("removes an item from the list", () => {
    render(<ShoppingListWithImmer />);

    fireEvent.click(screen.getAllByRole("button", { name: /remove/i })[0]);

    expect(screen.queryByText("Apples")).not.toBeInTheDocument();
  });
});
