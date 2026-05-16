// src/UserProfile.jsx
import { useContext } from "react";
import { UserContext } from "./userContext.js";

export default function UserProfile() {
  const { user, updateThemePreference } = useContext(UserContext);

  if (!user) {
    return <p className="error-message">No user data available.</p>;
  }

  return (
    <section className="profile-card">
      <h2>User Profile</h2>

      <p>
        <strong>Name:</strong> {user.name}
      </p>

      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <p>
        <strong>Theme Preference:</strong> {user.themePreference}
      </p>

      <button className="theme-toggle-button" onClick={updateThemePreference}>
        Toggle Theme Preference
      </button>
    </section>
  );
}
