import useWindowSize from "./hooks/useWindowSize.js";
import "./StreamingDashboard.css";

const MOBILE_BREAKPOINT = 768;

const featuredContent = [
  {
    id: 1,
    title: "The Last Horizon",
    category: "Science Fiction",
  },
  {
    id: 2,
    title: "Code Breakers",
    category: "Documentary",
  },
  {
    id: 3,
    title: "Midnight City",
    category: "Drama",
  },
];

export default function StreamingDashboard() {
  const { width, height } = useWindowSize();

  const isMobile = width < MOBILE_BREAKPOINT;
  const layoutMode = isMobile ? "Mobile" : "Desktop";

  return (
    <main
      className={`streaming-page ${
        isMobile ? "mobile-layout" : "desktop-layout"
      }`}
    >
      <section
        className="streaming-dashboard"
        data-testid="streaming-dashboard"
      >
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">StreamSpace</span>
            <h1>Your Watch Dashboard</h1>
          </div>

          <div className="viewport-status">
            <span>Current layout</span>
            <strong data-testid="layout-mode">{layoutMode}</strong>
          </div>
        </header>

        <section className="hero-card">
          <div className="hero-content">
            <span className="content-label">Featured tonight</span>
            <h2>Beyond the Interface</h2>

            <p>
              A developer discovers that the digital world is more connected
              than anyone imagined.
            </p>

            <button type="button">▶ Play Now</button>
          </div>
        </section>

        <section className="viewport-panel">
          <h2>Live Window Size</h2>

          <div className="dimension-grid">
            <article>
              <span>Width</span>
              <strong data-testid="window-width">{width}px</strong>
            </article>

            <article>
              <span>Height</span>
              <strong data-testid="window-height">{height}px</strong>
            </article>
          </div>

          <p>
            {isMobile
              ? `The compact layout is active because the width is below ${MOBILE_BREAKPOINT}px.`
              : `The full layout is active because the width is at least ${MOBILE_BREAKPOINT}px.`}
          </p>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <h2>Continue Watching</h2>
            <span>{featuredContent.length} titles</span>
          </div>

          <div className="content-grid">
            {featuredContent.map((item) => (
              <article className="content-card" key={item.id}>
                <div className="thumbnail">
                  <span>▶</span>
                </div>

                <div className="content-details">
                  <h3>{item.title}</h3>
                  <p>{item.category}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
