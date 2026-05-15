import { render, screen, fireEvent, within } from "@testing-library/react";
import UserProfileWithImmer from "./UserProfileWithImmer";

describe("UserProfileWithImmer Component", () => {
  function getProfileCard() {
    const profileHeading = screen.getByText(/current user profile/i);
    return profileHeading.closest("section");
  }

  test("renders initial user profile correctly", () => {
    render(<UserProfileWithImmer />);

    const profileCard = getProfileCard();

    expect(within(profileCard).getByText(/King Sambonge/i)).toBeInTheDocument();
    expect(within(profileCard).getByText(/206-555-1234/i)).toBeInTheDocument();
    expect(
      within(profileCard).getByText(/1000 1st Ave N, Seattle, WA/i)
    ).toBeInTheDocument();
  });

  test("updates name correctly", () => {
    render(<UserProfileWithImmer />);

    fireEvent.change(screen.getByPlaceholderText(/enter name/i), {
      target: { value: "King SRF" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update name/i }));

    const profileCard = getProfileCard();

    expect(within(profileCard).getByText(/King SRF/i)).toBeInTheDocument();
  });

  test("updates contact details correctly", () => {
    render(<UserProfileWithImmer />);

    fireEvent.change(screen.getByPlaceholderText(/enter phone/i), {
      target: { value: "999-888-7777" },
    });

    fireEvent.change(screen.getByPlaceholderText(/enter address/i), {
      target: { value: "Seattle Downtown" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /update contact details/i,
      })
    );

    const profileCard = getProfileCard();

    expect(
      within(profileCard).getByText(/999-888-7777/i)
    ).toBeInTheDocument();

    expect(
      within(profileCard).getByText(/Seattle Downtown/i)
    ).toBeInTheDocument();
  });

  test("toggles newsletter subscription", () => {
    render(<UserProfileWithImmer />);

    const newsletterButton = screen.getByRole("button", {
      name: /^subscribed$/i,
    });

    fireEvent.click(newsletterButton);

    const profileCard = getProfileCard();

    expect(
      within(profileCard).getByText(/Unsubscribed/i)
    ).toBeInTheDocument();
  });

  test("toggles notifications", () => {
    render(<UserProfileWithImmer />);

    const notificationButton = screen.getByRole("button", {
      name: /^on$/i,
    });

    fireEvent.click(notificationButton);

    const profileCard = getProfileCard();

    expect(within(profileCard).getByText(/^Off$/i)).toBeInTheDocument();
  });

  test("prevents empty name updates", () => {
    render(<UserProfileWithImmer />);

    fireEvent.change(screen.getByPlaceholderText(/enter name/i), {
      target: { value: "   " },
    });

    fireEvent.click(screen.getByRole("button", { name: /update name/i }));

    expect(
      screen.getByText(/name cannot be empty/i)
    ).toBeInTheDocument();
  });

  test("prevents empty contact fields", () => {
    render(<UserProfileWithImmer />);

    fireEvent.change(screen.getByPlaceholderText(/enter phone/i), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByPlaceholderText(/enter address/i), {
      target: { value: "" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /update contact details/i,
      })
    );

    expect(
      screen.getByText(/phone and address cannot be empty/i)
    ).toBeInTheDocument();
  });

  test("toggles newsletter multiple times without crashing", () => {
    render(<UserProfileWithImmer />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /^subscribed$/i,
      })
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /^unsubscribed$/i,
      })
    );

    const profileCard = getProfileCard();

    expect(
      within(profileCard).getByText(/Subscribed/i)
    ).toBeInTheDocument();
  });
});
