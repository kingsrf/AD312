// src/Sidebar.jsx
import UserProfile from "./UserProfile.jsx";

export default function Sidebar() {
  return (
    <aside className="sidebar-card">
      <h2>Sidebar</h2>

      <p>
        The Sidebar component also does not receive user props anymore. The user
        data is accessed directly in the deeply nested profile component.
      </p>

      <UserProfile />
    </aside>
  );
}
