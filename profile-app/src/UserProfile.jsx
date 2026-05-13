import { useState } from "react";
import "./UserProfile.css";

export default function UserProfile() {
  const [userProfile, setUserProfile] = useState({
    name: "King Sambonge",
    email: "king@example.com",
    address: {
      street: "1000 1st Ave N",
      city: "Seattle",
      country: "United States",
    },
  });

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  function updateAddress(street, city, country) {
    const trimmedStreet = street.trim();
    const trimmedCity = city.trim();
    const trimmedCountry = country.trim();

    setUserProfile((prevProfile) => ({
      ...prevProfile,
      address: {
        ...prevProfile.address,
        street:
          trimmedStreet !== ""
            ? trimmedStreet
            : prevProfile.address.street,
        city:
          trimmedCity !== ""
            ? trimmedCity
            : prevProfile.address.city,
        country:
          trimmedCountry !== ""
            ? trimmedCountry
            : prevProfile.address.country,
      },
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    updateAddress(street, city, country);
  }

  return (
    <div className="profile-container">
      <h1>User Profile Updater</h1>

      <form onSubmit={handleSubmit} className="profile-form">
        <label>
          Street
          <input
            type="text"
            placeholder="Street"
            value={street}
            onChange={(event) => setStreet(event.target.value)}
          />
        </label>

        <label>
          City
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </label>

        <label>
          Country
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
          />
        </label>

        <button type="submit">Update Address</button>
      </form>

      <div className="profile-card">
        <h2>Current Profile</h2>
        <p><strong>Name:</strong> {userProfile.name}</p>
        <p><strong>Email:</strong> {userProfile.email}</p>
        <p><strong>Street:</strong> {userProfile.address.street}</p>
        <p><strong>City:</strong> {userProfile.address.city}</p>
        <p><strong>Country:</strong> {userProfile.address.country}</p>
      </div>
    </div>
  );
}