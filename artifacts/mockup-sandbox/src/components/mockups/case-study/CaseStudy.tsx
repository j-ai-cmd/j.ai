export function CaseStudy() {
  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#0F1729",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Inter:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ maxWidth: 860, width: "100%" }}>

        {/* Heading */}
        <div style={{ marginBottom: 56 }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            marginBottom: 16,
          }}>
            client work
          </p>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 40,
            lineHeight: 1.15,
            color: "#ffffff",
            maxWidth: 560,
          }}>
            What it looks like when we work together.
          </h2>
        </div>

        {/* Case study card */}
        <div style={{
          borderTop: "2px solid #2C3EE8",
          paddingTop: 40,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
        }}>
          {/* Left — context */}
          <div>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#2C3EE8",
              marginBottom: 12,
            }}>
              j.ai Builds — Operations Firm, 18 people
            </p>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 22,
              color: "#ffffff",
              lineHeight: 1.2,
              marginBottom: 20,
            }}>
              Proposal generation that used to take 3 hours now takes 8 minutes.
            </h3>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.6)",
              marginBottom: 16,
            }}>
              Their team was manually pulling client data from three systems, writing proposals in Word, and chasing approvals over email. It consumed a senior consultant's full afternoon, every time.
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.6)",
            }}>
              We built a custom AI workflow that pulls the data, drafts the proposal to their exact format, and routes it for one-click approval. The consultant reviews and sends. Done.
            </p>
          </div>

          {/* Right — outcome metrics */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {[
              { number: "8 min", label: "per proposal, down from 3 hours" },
              { number: "22×", label: "faster turnaround to clients" },
              { number: "1 week", label: "from kickoff to live in production" },
            ].map(({ number, label }) => (
              <div
                key={label}
                style={{
                  borderLeft: "2px solid #2C3EE8",
                  paddingLeft: 24,
                }}
              >
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 36,
                  color: "#ffffff",
                  lineHeight: 1,
                  marginBottom: 6,
                }}>
                  {number}
                </div>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.5,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
