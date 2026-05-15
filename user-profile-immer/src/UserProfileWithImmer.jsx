// src/UserProfileWithImmer.jsx
import { useState } from "react";
import { useImmer } from "use-immer";
import "./UserProfileWithImmer.css";

export default function UserProfileWithImmer() {
  const [userProfile, updateUserProfile] = useImmer({
    name: "King Sambonge",
    email: "king@example.com",
    contactDetails: {
      phone: "206-555-1234",
      address: "1000 1st Ave N, Seattle, WA",
    },
    preferences: {
      newsletter: true,
      notifications: true,
    },
  });

  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.contactDetails.phone);
  const [address, setAddress] = useState(userProfile.contactDetails.address);
  const [errorMessage, setErrorMessage] = useState("");

  function updateName() {
    const trimmedName = name.trim();

    if (trimmedName === "") {
      setErrorMessage("Name cannot be empty.");
      return;
    }

    updateUserProfile((draft) => {
      draft.name = trimmedName;
    });

    setErrorMessage("");
  }

  function updateContactDetails() {
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    if (trimmedPhone === "" || trimmedAddress === "") {
      setErrorMessage("Phone and address cannot be empty.");
      return;
    }

    updateUserProfile((draft) => {
      draft.contactDetails.phone = trimmedPhone;
      draft.contactDetails.address = trimmedAddress;
    });

    setErrorMessage("");
  }

  function toggleNewsletterSubscription() {
    updateUserProfile((draft) => {
      draft.preferences.newsletter = !draft.preferences.newsletter;
    });
  }

  function toggleNotifications() {
    updateUserProfile((draft) => {
      draft.preferences.notifications = !draft.preferences.notifications;
    });
  }

  return (
    <div className="profile-immer-container">
      <h1>User Profile with Immer</h1>

      <section className="profile-section">
        <h2>Edit Profile</h2>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setErrorMessage("");
            }}
          />
          <button onClick={updateName}>Update Name</button>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="text"
            placeholder="Enter phone"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setErrorMessage("");
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
              setErrorMessage("");
            }}
          />
        </div>

        <button className="full-width-button" onClick={updateContactDetails}>
          Update Contact Details
        </button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </section>

      <section className="profile-section">
        <h2>Preferences</h2>

        <div className="preference-row">
          <span>Newsletter Subscription</span>
          <button onClick={toggleNewsletterSubscription}>
            {userProfile.preferences.newsletter ? "Subscribed" : "Unsubscribed"}
          </button>
        </div>

        <div className="preference-row">
          <span>Notifications</span>
          <button onClick={toggleNotifications}>
            {userProfile.preferences.notifications ? "On" : "Off"}
          </button>
        </div>
      </section>

      <section className="profile-card">
        <h2>Current User Profile</h2>

        <p>
          <strong>Name:</strong> {userProfile.name}
        </p>

        <p>
          <strong>Email:</strong> {userProfile.email}
        </p>

        <p>
          <strong>Phone:</strong> {userProfile.contactDetails.phone}
        </p>

        <p>
          <strong>Address:</strong> {userProfile.contactDetails.address}
        </p>

        <p>
          <strong>Newsletter:</strong>{" "}
          {userProfile.preferences.newsletter ? "Subscribed" : "Unsubscribed"}
        </p>

        <p>
          <strong>Notifications:</strong>{" "}
          {userProfile.preferences.notifications ? "On" : "Off"}
        </p>
      </section>

      <section className="profile-json">
        <h2>State Preview</h2>
        <pre>{JSON.stringify(userProfile, null, 2)}</pre>
      </section>
    </div>
  );
}
