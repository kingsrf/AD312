export const PROFILE_URL = "http://localhost:3001/profile";

export const USER_PROFILE_QUERY_KEY = ["userProfile"];

export const EMPTY_PROFILE = {
  username: "",
  email: "",
  bio: "",
  notifications: false,
};

export class ProfileApiError extends Error {
  constructor({ status = 500, field = null, message }) {
    super(message);

    this.name = "ProfileApiError";
    this.status = status;
    this.field = field;
    this.payload = {
      status,
      field,
      message,
    };
  }
}

async function getErrorMessage(response, fallbackMessage) {
  try {
    const responseBody = await response.json();

    return responseBody.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export async function fetchUserProfile() {
  const response = await fetch(PROFILE_URL);

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      "Unable to load the user profile."
    );

    throw new ProfileApiError({
      status: response.status,
      message,
    });
  }

  return response.json();
}

export async function updateUserProfile(profile) {
  const normalizedProfile = {
    username: profile.username.trim(),
    email: profile.email.trim().toLowerCase(),
    bio: profile.bio.trim(),
    notifications: Boolean(profile.notifications),
  };

  if (normalizedProfile.email === "conflict@example.com") {
    throw new ProfileApiError({
      status: 409,
      field: "email",
      message: "This email is already registered.",
    });
  }

  const response = await fetch(PROFILE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizedProfile),
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      "Unable to update the user profile."
    );

    throw new ProfileApiError({
      status: response.status,
      message,
    });
  }

  return response.json();
}
