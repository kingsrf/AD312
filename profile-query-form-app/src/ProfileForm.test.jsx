import {
  act,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import ProfileForm from "./ProfileForm.jsx";

const initialProfile = {
  username: "king_s",
  email: "king@example.com",
  bio: "Frontend developer building clean applications.",
  notifications: true,
};

function jsonResponse(data, options = {}) {
  return {
    ok: options.ok ?? true,
    status: options.status ?? 200,
    json: vi.fn().mockResolvedValue(data),
  };
}

function renderProfileForm() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ProfileForm />
    </QueryClientProvider>
  );
}

beforeEach(() => {
  globalThis.fetch = vi.fn(async (_url, requestOptions = {}) => {
    if (requestOptions.method === "PUT") {
      const requestBody = JSON.parse(requestOptions.body);

      return jsonResponse(requestBody);
    }

    return jsonResponse(initialProfile);
  });
});

describe("ProfileForm", () => {
  test("displays a loading block while profile data is loading", () => {
    globalThis.fetch = vi.fn(() => new Promise(() => {}));

    renderProfileForm();

    expect(
      screen.getByText(/loading profile/i)
    ).toBeInTheDocument();
  });

  test("loads server data into the form and begins clean", async () => {
    renderProfileForm();

    expect(
      await screen.findByDisplayValue("king_s")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/email address/i)
    ).toHaveValue("king@example.com");

    expect(screen.getByLabelText(/bio/i)).toHaveValue(
      "Frontend developer building clean applications."
    );

    expect(
      screen.getByLabelText(/enable email notifications/i)
    ).toBeChecked();

    expect(
      screen.getByRole("button", {
        name: /save changes/i,
      })
    ).toBeDisabled();
  });

  test("enables saving after a valid field change", async () => {
    const user = userEvent.setup();

    renderProfileForm();

    const usernameInput =
      await screen.findByLabelText(/username/i);

    await user.clear(usernameInput);
    await user.type(usernameInput, "updated_user");

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /save changes/i,
        })
      ).toBeEnabled();
    });
  });

  test("submits PUT, refetches, and resets dirty state", async () => {
    const user = userEvent.setup();

    let serverProfile = { ...initialProfile };
    let finishPutRequest;

    globalThis.fetch = vi.fn((_url, requestOptions = {}) => {
      if (requestOptions.method === "PUT") {
        const requestBody = JSON.parse(requestOptions.body);

        return new Promise((resolve) => {
          finishPutRequest = () => {
            serverProfile = requestBody;
            resolve(jsonResponse(serverProfile));
          };
        });
      }

      return Promise.resolve(jsonResponse(serverProfile));
    });

    renderProfileForm();

    const usernameInput =
      await screen.findByLabelText(/username/i);

    await user.clear(usernameInput);
    await user.type(usernameInput, "updated_user");

    const saveButton = screen.getByRole("button", {
      name: /save changes/i,
    });

    await waitFor(() => {
      expect(saveButton).toBeEnabled();
    });

    await user.click(saveButton);

    expect(
      screen.getByRole("button", {
        name: /saving/i,
      })
    ).toBeDisabled();

    await act(async () => {
      finishPutRequest();
    });

    await waitFor(() => {
      expect(
        screen.getByText(/profile saved successfully/i)
      ).toBeInTheDocument();
    });

    expect(usernameInput).toHaveValue("updated_user");

    expect(
      screen.getByRole("button", {
        name: /save changes/i,
      })
    ).toBeDisabled();

    const putCall = globalThis.fetch.mock.calls.find(
      ([, options]) => options?.method === "PUT"
    );

    expect(JSON.parse(putCall[1].body)).toEqual({
      ...initialProfile,
      username: "updated_user",
    });

    const getCalls = globalThis.fetch.mock.calls.filter(
      ([, options]) => !options?.method
    );

    expect(getCalls.length).toBeGreaterThanOrEqual(2);
  });

  test("rejects an invalid email before submitting", async () => {
    const user = userEvent.setup();

    renderProfileForm();

    const emailInput =
      await screen.findByLabelText(/email address/i);

    await user.clear(emailInput);
    await user.type(emailInput, "invalid-email");

    expect(
      await screen.findByText(/enter a valid email address/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /save changes/i,
      })
    ).toBeDisabled();

    const putCalls = globalThis.fetch.mock.calls.filter(
      ([, options]) => options?.method === "PUT"
    );

    expect(putCalls).toHaveLength(0);
  });

  test("maps a simulated 409 conflict to the email field", async () => {
    const user = userEvent.setup();

    renderProfileForm();

    const emailInput =
      await screen.findByLabelText(/email address/i);

    await user.clear(emailInput);
    await user.type(emailInput, "conflict@example.com");

    const saveButton = screen.getByRole("button", {
      name: /save changes/i,
    });

    await waitFor(() => {
      expect(saveButton).toBeEnabled();
    });

    await user.click(saveButton);

    expect(
      await screen.findByText(
        /this email is already registered/i
      )
    ).toBeInTheDocument();

    expect(emailInput).toHaveFocus();

    const putCalls = globalThis.fetch.mock.calls.filter(
      ([, options]) => options?.method === "PUT"
    );

    expect(putCalls).toHaveLength(0);
  });

  test("displays a query error when the server is unavailable", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          message: "JSON Server is unavailable.",
        },
        {
          ok: false,
          status: 500,
        }
      )
    );

    renderProfileForm();

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(/json server is unavailable/i);
  });
});
