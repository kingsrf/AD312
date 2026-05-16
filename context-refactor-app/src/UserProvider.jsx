import { useState } from "react";
import { UserContext } from "./userContext.js";

export default function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: "King Sambonge",
    email: "king@example.com",
    themePreference: "dark",
  });

  function updateThemePreference() {
    setUser((previousUser) => ({
      ...previousUser,
      themePreference:
        previousUser.themePreference === "light" ? "dark" : "light",
    }));
  }

  return (
    <UserContext.Provider value={{ user, updateThemePreference }}>
      {children}
    </UserContext.Provider>
  );
}
