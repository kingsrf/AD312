// app/routes/_index.tsx
import { Link } from "react-router";

export default function Home() {
  return (
    <section className="page-card hero-section">
      <h1>Recipe Router App</h1>

      <p>
        Welcome to the Recipe Gallery routing assignment. This app converts a
        simple state-based gallery into a modern multi-page React Router
        application.
      </p>

      <Link to="/gallery" className="primary-link">
        View Recipe Gallery
      </Link>
    </section>
  );
}
