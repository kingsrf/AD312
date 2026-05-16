// src/theme.js
import { createContext } from "react";

export const themes = {
  light: {
    name: "light",
    background: "#f5f5f5",
    text: "#222222",
  },
  dark: {
    name: "dark",
    background: "#1f1f1f",
    text: "#f5f5f5",
  },
};

export const ThemeContext = createContext({
  theme: "light",
  currentTheme: themes.light,
  toggleTheme: () => {},
});
