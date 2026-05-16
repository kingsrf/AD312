// src/App.jsx
import { useContext } from "react";
import UserProvider from "./UserProvider.jsx";
import Dashboard from "./Dashboard.jsx";
import { UserContext } from "./userContext.js";
import "./App.css";

function AppContent() {
  const { user } = useContext(UserContext);

  return (
    <main
      className={`app-container ${
        user?.themePreference === "dark" ? "dark-mode" : "light-mode"
      }`}
    >
      <section className="app-card">
        <h1>Context Refactor App</h1>

        <p className="intro-text">
          This app demonstrates how React Context removes unnecessary prop
          drilling from a component tree.
        </p>

        <Dashboard />
      </section>
    </main>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
