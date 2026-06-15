import {
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegistrationForm from "./RegistrationForm.jsx";
import { REGISTRATION_DRAFT_KEY } from "./registrationFormConfig.js";

async function completeValidForm(user) {
  await user.type(
    screen.getByLabelText(/full name/i),
    "Jordan Smith"
  );

  await user.type(
    screen.getByLabelText(/email address/i),
    "jordan@example.com"
  );

  await user.type(
    screen.getByLabelText(/^password$/i),
    "SecurePass1"
  );

  await user.type(
    screen.getByLabelText(/confirm password/i),
    "SecurePass1"
  );

  await user.selectOptions(
    screen.getByLabelText(/role.*account type/i),
    "developer"
  );

  await user.click(
    screen.getByLabelText(/terms and conditions/i)
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe("RegistrationForm", () => {
  test("renders all required fields and focuses full name", async () => {
    render(<RegistrationForm />);

    expect(
      screen.getByRole("form", {
        name: /user registration form/i,
      })
    ).toBeInTheDocument();

    const fullNameInput = screen.getByLabelText(/full name/i);

    await waitFor(() => {
      expect(fullNameInput).toHaveFocus();
    });

    expect(
      screen.getByLabelText(/email address/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^password$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/confirm password/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/role.*account type/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/terms and conditions/i)
    ).toBeInTheDocument();
  });

  test("validates full name and email", async () => {
    render(<RegistrationForm />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Al" },
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "invalid-email" },
    });

    expect(
      await screen.findByText(
        /full name must be at least 3 characters/i
      )
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/enter a valid email address/i)
    ).toBeInTheDocument();
  });

  test("validates password security and matching passwords", async () => {
    const user = userEvent.setup();

    render(<RegistrationForm />);

    await user.type(
      screen.getByLabelText(/^password$/i),
      "password"
    );

    expect(
      await screen.findByText(
        /password must include uppercase, lowercase, and a number/i
      )
    ).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/^password$/i));

    await user.type(
      screen.getByLabelText(/^password$/i),
      "SecurePass1"
    );

    await user.type(
      screen.getByLabelText(/confirm password/i),
      "DifferentPass1"
    );

    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
  });

  test("restores a saved draft without displaying validation warnings", async () => {
    localStorage.setItem(
      REGISTRATION_DRAFT_KEY,
      JSON.stringify({
        fullName: "Saved User",
        email: "saved@example.com",
        role: "product-manager",
        terms: true,
      })
    );

    render(<RegistrationForm />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/full name/i)
      ).toHaveValue("Saved User");
    });

    expect(
      screen.getByLabelText(/email address/i)
    ).toHaveValue("saved@example.com");

    expect(
      screen.getByLabelText(/role.*account type/i)
    ).toHaveValue("product-manager");

    expect(
      screen.getByLabelText(/terms and conditions/i)
    ).toBeChecked();

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("caches non-sensitive values but excludes passwords", async () => {
    const user = userEvent.setup();

    render(<RegistrationForm />);

    await user.type(
      screen.getByLabelText(/full name/i),
      "Cached User"
    );

    await user.type(
      screen.getByLabelText(/^password$/i),
      "SecurePass1"
    );

    await waitFor(() => {
      expect(
        localStorage.getItem(REGISTRATION_DRAFT_KEY)
      ).not.toBeNull();
    });

    const storedDraft = JSON.parse(
      localStorage.getItem(REGISTRATION_DRAFT_KEY)
    );

    expect(storedDraft.fullName).toBe("Cached User");
    expect(storedDraft.password).toBeUndefined();
    expect(storedDraft.confirmPassword).toBeUndefined();
  });

  test("clear draft resets fields, errors, and localStorage", async () => {
    const user = userEvent.setup();

    render(<RegistrationForm />);

    await user.type(
      screen.getByLabelText(/full name/i),
      "Draft User"
    );

    await user.type(
      screen.getByLabelText(/email address/i),
      "invalid-email"
    );

    expect(
      await screen.findByText(/enter a valid email address/i)
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /clear draft/i,
      })
    );

    expect(
      screen.getByLabelText(/full name/i)
    ).toHaveValue("");

    expect(
      screen.getByLabelText(/email address/i)
    ).toHaveValue("");

    expect(
      screen.getByLabelText(/^password$/i)
    ).toHaveValue("");

    expect(
      screen.getByLabelText(/confirm password/i)
    ).toHaveValue("");

    expect(
      screen.getByLabelText(/role.*account type/i)
    ).toHaveValue("");

    expect(
      screen.getByLabelText(/terms and conditions/i)
    ).not.toBeChecked();

    expect(
      localStorage.getItem(REGISTRATION_DRAFT_KEY)
    ).toBeNull();

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("shows loading state, submits, resets, and clears cache", async () => {
    const user = userEvent.setup();

    render(<RegistrationForm submissionDelay={100} />);

    await completeValidForm(user);

    const submitButton = screen.getByRole("button", {
      name: /^register$/i,
    });

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await user.click(submitButton);

    expect(
      screen.getByRole("button", {
        name: /registering/i,
      })
    ).toBeDisabled();

    await waitFor(
      () => {
        expect(
          screen.getByLabelText(/full name/i)
        ).toHaveValue("");
      },
      {
        timeout: 1000,
      }
    );

    expect(
      screen.getByLabelText(/email address/i)
    ).toHaveValue("");

    expect(
      screen.getByLabelText(/^password$/i)
    ).toHaveValue("");

    expect(
      screen.getByLabelText(/confirm password/i)
    ).toHaveValue("");

    expect(
      screen.getByLabelText(/role.*account type/i)
    ).toHaveValue("");

    expect(
      screen.getByLabelText(/terms and conditions/i)
    ).not.toBeChecked();

    expect(
      localStorage.getItem(REGISTRATION_DRAFT_KEY)
    ).toBeNull();

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("removes malformed cached data without crashing", async () => {
    localStorage.setItem(
      REGISTRATION_DRAFT_KEY,
      "{not-valid-json"
    );

    render(<RegistrationForm />);

    await waitFor(() => {
      expect(
        localStorage.getItem(REGISTRATION_DRAFT_KEY)
      ).toBeNull();
    });

    expect(
      screen.getByLabelText(/full name/i)
    ).toHaveValue("");

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
