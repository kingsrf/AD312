import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { INITIAL_VOTES, POLL_OPTIONS } from "./pollData.js";
import "./DynamicPollDashboard.css";

export default function DynamicPollDashboard() {
  const [votes, setVotes] = useState(INITIAL_VOTES);

  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const voteValues = POLL_OPTIONS.map((option) => votes[option.id]);

  const totalVotes = voteValues.reduce(
    (currentTotal, voteCount) => currentTotal + voteCount,
    0
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = new Chart(canvasRef.current, {
        type: "bar",

        data: {
          labels: POLL_OPTIONS.map((option) => option.label),

          datasets: [
            {
              label: "Votes",
              data: voteValues,
              backgroundColor: [
                "rgb(97 218 251 / 72%)",
                "rgb(66 184 131 / 72%)",
                "rgb(221 0 49 / 72%)",
                "rgb(255 62 0 / 72%)",
              ],
              borderColor: [
                "rgb(28 141 172)",
                "rgb(35 131 89)",
                "rgb(172 0 38)",
                "rgb(192 47 0)",
              ],
              borderWidth: 2,
              borderRadius: 9,
              borderSkipped: false,
            },
          ],
        },

        options: {
          responsive: true,
          maintainAspectRatio: false,

          animation: {
            duration: 350,
          },

          plugins: {
            legend: {
              display: false,
            },

            title: {
              display: true,
              text: "Favorite JavaScript Framework",
              color: "#252936",
              font: {
                size: 17,
                weight: "bold",
              },
            },

            tooltip: {
              callbacks: {
                label(context) {
                  const voteCount = context.parsed.y;

                  return `${voteCount} ${
                    voteCount === 1 ? "vote" : "votes"
                  }`;
                },
              },
            },
          },

          scales: {
            x: {
              grid: {
                display: false,
              },

              ticks: {
                color: "#525866",
                font: {
                  weight: "bold",
                },
              },
            },

            y: {
              beginAtZero: true,

              suggestedMax: 5,

              ticks: {
                precision: 0,
                stepSize: 1,
                color: "#525866",
              },

              grid: {
                color: "rgb(37 41 54 / 9%)",
              },
            },
          },
        },
      });

      return;
    }

    chartInstanceRef.current.data.datasets[0].data = voteValues;
    chartInstanceRef.current.update();
  }, [voteValues]);

  useEffect(() => {
    // Creating a new Chart on every render without destroying the old instance reuses the same canvas and causes Chart.js canvas rendering and event-listener errors.
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  function addVote(optionId) {
    setVotes((previousVotes) => ({
      ...previousVotes,
      [optionId]: previousVotes[optionId] + 1,
    }));
  }

  function resetPoll() {
    setVotes(INITIAL_VOTES);
  }

  function calculatePercentage(voteCount) {
    if (totalVotes === 0) {
      return 0;
    }

    return Math.round((voteCount / totalVotes) * 100);
  }

  return (
    <main className="poll-page">
      <section className="poll-dashboard">
        <header className="poll-header">
          <span className="eyebrow">Live developer poll</span>

          <h1>Dynamic Poll Dashboard</h1>

          <p>
            Vote for your favorite JavaScript framework and watch the Chart.js
            visualization update in real time.
          </p>
        </header>

        <div className="dashboard-grid">
          <section className="voting-panel">
            <div className="section-heading">
              <div>
                <h2>Cast Your Vote</h2>
                <p>Choose one framework each time you vote.</p>
              </div>

              <span className="total-votes">
                {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
              </span>
            </div>

            <div className="poll-options">
              {POLL_OPTIONS.map((option) => {
                const voteCount = votes[option.id];
                const percentage = calculatePercentage(voteCount);

                return (
                  <article className="poll-option" key={option.id}>
                    <div className="option-details">
                      <div>
                        <h3>{option.label}</h3>

                        <p>
                          {voteCount} {voteCount === 1 ? "vote" : "votes"}
                        </p>
                      </div>

                      <strong>{percentage}%</strong>
                    </div>

                    <div
                      className="percentage-track"
                      aria-label={`${option.label} has ${percentage}% of all votes`}
                    >
                      <div
                        className="percentage-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <button
                      className="vote-button"
                      type="button"
                      onClick={() => addVote(option.id)}
                    >
                      Vote for {option.label}
                    </button>
                  </article>
                );
              })}
            </div>

            <button
              className="reset-button"
              type="button"
              onClick={resetPoll}
              disabled={totalVotes === 0}
            >
              Reset Poll
            </button>
          </section>

          <section className="chart-panel">
            <h2>Live Results</h2>

            <p>
              React manages the vote state while Chart.js controls the canvas.
            </p>

            <div className="chart-container">
              <canvas
                ref={canvasRef}
                role="img"
                aria-label="Bar chart showing the current JavaScript framework poll results"
              >
                Your browser does not support canvas charts.
              </canvas>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
