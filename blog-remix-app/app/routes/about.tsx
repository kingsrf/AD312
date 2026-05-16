// app/routes/about.tsx
export default function About() {
  return (
    <section className="page-card">
      <h1>About This Blog</h1>

      <p>
        This blog application demonstrates how to convert a static single-view
        app into a multi-page React Router application.
      </p>

      <p>
        It uses file-based routing, a persistent navigation layout, dynamic post
        routes, URL parameters, and programmatic navigation.
      </p>
    </section>
  );
}
