// src/App.jsx
import { useContext } from "react";
import { ThemeContext } from "./theme.js";
import ThemeSwitcher from "./ThemeSwitcher.jsx";
import "./App.css";

export default function App() {
  const { theme, currentTheme } = useContext(ThemeContext);

  return (
    <main
      className={`app-container ${theme === "dark" ? "dark-mode" : "light-mode"}`}
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.text,
      }}
    >
      <section className="theme-card">
        <h1>Global Theme Switcher</h1>

        <p>
          This app uses React Context API to manage a global light and dark
          theme across the entire application.
        </p>

        <p>
          Current theme: <strong data-testid="current-theme">{theme}</strong>
        </p>

        <ThemeSwitcher />
      </section>

      <section className="preview-grid">
        <div className="preview-card">
          <h2>Global State</h2>
          <p>
            The theme value is stored in context, so any component can access it
            without prop drilling.
          </p>
        </div>

        <div className="preview-card">
          <h2>Dynamic Styling</h2>
          <p>
            The app changes CSS classes and colors based on the active theme.
          </p>
        </div>

        <div className="preview-card">
          <h2>Persistent Preference</h2>
          <p>
            The selected theme is saved in localStorage and restored when the app
            reloads.
          </p>
        </div>
      </section>
    </main>
  );
}
