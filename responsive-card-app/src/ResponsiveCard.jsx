import { useEffect, useState } from "react";
import "./ResponsiveCard.css";

const MOBILE_BREAKPOINT = 768;

function getCurrentWindowSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export default function ResponsiveCard() {
  const [windowSize, setWindowSize] = useState(getCurrentWindowSize);

  const isMobile = windowSize.width < MOBILE_BREAKPOINT;
  const layoutMode = isMobile ? "Mobile" : "Desktop";

  useEffect(
    () => {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      // Synchronize the state once when the listener is attached.
      handleResize();

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },

    // The empty dependency array attaches one listener when the component mounts.
    // Without it, the effect would run after every render and repeatedly replace the listener.
    []
  );

  return (
    <main
      className={`responsive-page ${
        isMobile ? "mobile-page" : "desktop-page"
      }`}
    >
      <section
        className={`responsive-card ${
          isMobile ? "mobile-card" : "desktop-card"
        }`}
        data-testid="responsive-card"
      >
        <div className="card-header">
          <span className="eyebrow">Live browser tracking</span>

          <h1>Responsive Card</h1>

          <p>
            Resize the browser window to see the dimensions, layout, and colors
            update in real time.
          </p>
        </div>

        <div className="layout-status">
          <span
            className={`status-indicator ${
              isMobile ? "mobile-indicator" : "desktop-indicator"
            }`}
            aria-hidden="true"
          />

          <div>
            <span className="status-label">Current layout</span>

            <strong data-testid="layout-mode">{layoutMode}</strong>
          </div>
        </div>

        <div className="dimension-grid">
          <article className="dimension-card">
            <span>Window Width</span>

            <strong data-testid="width-value">
              {windowSize.width}px
            </strong>
          </article>

          <article className="dimension-card">
            <span>Window Height</span>

            <strong data-testid="height-value">
              {windowSize.height}px
            </strong>
          </article>
        </div>

        <div className="breakpoint-information">
          <h2>Breakpoint Information</h2>

          <p>
            {isMobile
              ? `The window is below ${MOBILE_BREAKPOINT}px, so the mobile layout is active.`
              : `The window is at least ${MOBILE_BREAKPOINT}px, so the desktop layout is active.`}
          </p>
        </div>
      </section>
    </main>
  );
}
