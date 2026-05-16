// src/Dashboard.jsx
import Sidebar from "./Sidebar.jsx";

export default function Dashboard() {
  return (
    <section className="dashboard-card">
      <h2>Dashboard</h2>

      <p>
        The Dashboard component no longer receives or passes user props. It only
        renders the next component in the tree.
      </p>

      <Sidebar />
    </section>
  );
}
