// src/TaskManager.test.jsx
import { describe, test, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import TaskManager from "./TaskManager.jsx";

function addTask(title) {
  const input = screen.getByPlaceholderText(/enter a task/i);
  fireEvent.change(input, { target: { value: title } });
  fireEvent.click(screen.getByRole("button", { name: /add task/i }));
}

function getIncompleteSection() {
  return screen.getByRole("heading", { name: /incomplete tasks/i })
    .parentElement;
}

function getCompletedSection() {
  return screen.getByRole("heading", { name: /completed tasks/i })
    .parentElement;
}

describe("TaskManager", () => {
  test("adds a task with the user-provided title", () => {
    render(<TaskManager />);

    addTask("Do dishes");

    expect(within(getIncompleteSection()).getByText("Do dishes")).toBeInTheDocument();
  });

  test("trims whitespace before adding a task", () => {
    render(<TaskManager />);

    addTask("   Laundry   ");

    expect(within(getIncompleteSection()).getByText("Laundry")).toBeInTheDocument();
    expect(screen.queryByText("   Laundry   ")).not.toBeInTheDocument();
  });

  test("prevents adding empty or whitespace-only tasks", () => {
    render(<TaskManager />);

    addTask("   ");

    expect(screen.getByText(/please enter a task/i)).toBeInTheDocument();
    expect(screen.getByText(/no incomplete tasks/i)).toBeInTheDocument();
  });

  test("prevents duplicate tasks case-insensitively", () => {
    render(<TaskManager />);

    addTask("Food");
    addTask("food");

    expect(screen.getByText(/task already exists/i)).toBeInTheDocument();
    expect(screen.getAllByText("Food")).toHaveLength(1);
  });

  test("moves task to completed section when marked complete", () => {
    render(<TaskManager />);

    addTask("Read book");

    fireEvent.click(
      within(getIncompleteSection()).getByRole("button", {
        name: /mark complete/i,
      })
    );

    expect(within(getCompletedSection()).getByText("Read book")).toBeInTheDocument();
    expect(within(getIncompleteSection()).queryByText("Read book")).not.toBeInTheDocument();
  });

  test("moves task back to incomplete section when marked incomplete", () => {
    render(<TaskManager />);

    addTask("Workout");

    fireEvent.click(screen.getByRole("button", { name: /mark complete/i }));
    fireEvent.click(screen.getByRole("button", { name: /mark incomplete/i }));

    expect(within(getIncompleteSection()).getByText("Workout")).toBeInTheDocument();
    expect(within(getCompletedSection()).queryByText("Workout")).not.toBeInTheDocument();
  });

  test("editing a task updates the title", () => {
    render(<TaskManager />);

    addTask("Typo taks");

    fireEvent.click(screen.getByRole("button", { name: /edit task/i }));

    const editInput = screen.getByDisplayValue("Typo taks");
    fireEvent.change(editInput, { target: { value: "Typo task" } });

    fireEvent.click(screen.getByRole("button", { name: /save task/i }));

    expect(screen.getByText("Typo task")).toBeInTheDocument();
    expect(screen.queryByText("Typo taks")).not.toBeInTheDocument();
  });

  test("cancel edit keeps the original task title", () => {
    render(<TaskManager />);

    addTask("Original task");

    fireEvent.click(screen.getByRole("button", { name: /edit task/i }));

    const editInput = screen.getByDisplayValue("Original task");
    fireEvent.change(editInput, { target: { value: "Changed task" } });

    fireEvent.click(screen.getByRole("button", { name: /cancel edit/i }));

    expect(screen.getByText("Original task")).toBeInTheDocument();
    expect(screen.queryByText("Changed task")).not.toBeInTheDocument();
  });

  test("delete removes a task", () => {
    render(<TaskManager />);

    addTask("Delete me");

    fireEvent.click(screen.getByRole("button", { name: /delete task/i }));

    expect(screen.queryByText("Delete me")).not.toBeInTheDocument();
    expect(screen.getByText(/no incomplete tasks/i)).toBeInTheDocument();
  });

  test("completed tasks do not show edit button", () => {
    render(<TaskManager />);

    addTask("Finished task");

    fireEvent.click(screen.getByRole("button", { name: /mark complete/i }));

    expect(
      within(getCompletedSection()).queryByRole("button", {
        name: /edit task/i,
      })
    ).not.toBeInTheDocument();
  });
});
