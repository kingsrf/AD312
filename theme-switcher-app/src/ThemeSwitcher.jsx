// src/ThemeSwitcher.jsx
import { useContext } from "react";
import { ThemeContext } from "./theme.js";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button className="theme-button" onClick={toggleTheme}>
      {theme === "light" ? "🌙 Switch to Dark Mode" : "☀️ Switch to Light Mode"}
    </button>
  );
}
