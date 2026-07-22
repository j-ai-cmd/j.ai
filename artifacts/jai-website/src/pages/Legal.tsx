import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

const WEBHOOK_URL = "https://hook.eu1.make.com/waciaz78ykdmfaxh4glg6vdhjjqi4jh5";
const BLUE = "#2C3EE8";
const NAVY = "#0F1729";

function FloatingShapes({ bg }: { bg: "blue" | "navy" | "white" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const shapes = useRef<any[]>([]);
  const strokeColor = bg === "white"
    ? (a: number) => `rgba(44,62,232,${a})`
    : (a: number) => `rgba(255,255,255,${a})`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0, raf = 0;
    function resize() { W = canvas!.width = canvas!.offsetWidth; H = canvas!.height = canvas!.offsetHeight; }
    resize();
    shapes.current = Array.from({ length: 16 }, () => ({
      x: Math.random() * 1200, y: Math.random() * 800,
      r: 10 + Math.random() * 40, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      type: Math.random() > 0.4 ? "circle" : "cross",
    }));
    function draw() {
      ctx.clearRect(0, 0, W, H);
      shapes.current.forEach(s => {
        s.x += s.vx; s.y += s.vy;
        if (s.x < -50 || s.x > W + 50) s.vx *= -1;
        if (s.y < -50 || s.y > H + 50) s.vy *= -1;
        const dist = Math.hypot(mouse.current.x - s.x, mouse.current.y - s.y);
        const pull = Math.max(0, 1 - dist / 180);
        s.x += (mouse.current.x - s.x) * pull * 0.018;
        s.y += (mouse.current.y - s.y) * pull * 0.018;
        ctx.strokeStyle = strokeColor(0.08 + pull * 0.28);
        ctx.lineWidth = 0.8 + pull * 1.5;
        if (s.type === "circle") {
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r + pull * 12, 0, Math.PI * 2); ctx.stroke();
        } else {
          const sz = s.r + pull * 10;
          ctx.beginPath();
          ctx.moveTo(s.x - sz, s.y); ctx.lineTo(s.x + sz, s.y);
          ctx.moveTo(s.x, s.y - sz); ctx.lineTo(s.x, s.y + sz);
          ctx.stroke();
        }
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef}
      onMouseMove={e => { const r = canvasRef.current?.getBoundingClientRect(); if (r) mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top }; }}
      onMouseLeave={() => { mouse.current = { x: -1000, y: -1000 }; }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "all" }}
    />
  );
}

function Section({ bg, children, id }: { bg: "blue" | "navy" | "white"; children: React.ReactNode; id?: string }) {
  const bgColor = bg === "blue" ? BLUE : bg === "navy" ? NAVY : "#FFFFFF";
  const textColor = bg === "white" ? "#1A1A2E" : "#FFFFFF";
  return (
    <section id={id} style={{ background: bgColor, color: textColor, minHeight: "100dvh", position: "relative", display: "flex", alignItems: "center" }}>
      <FloatingShapes bg={bg} />
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        {children}
      </div>
    </section>
  );
}

const agentList = [
  { key: "hermes", name: "Hermes", role: "Past client reactivation", dot: "#4ade80", badge: "3 ready", badgeClass: "bg-green-100 text-green-800", desc: "Scans closed matters and drafts re-engagement emails for clients who have not been contacted in over 12 months.", meta: ["Connected to Smokeball", "847 matters scanned", "3 drafts ready"], steps: [{ t: "Connected to Smokeball", d: "Authenticated · api.smokeball.com.au · token valid" }, { t: "Scanning 847 closed matters", d: "Filtering: closed more than 12 months ago" }, { t: "3 clients qualify", d: "Margaret Chen · Robert Okafor · Susan Park" }, { t: "Fetching contact details", d: "Names and emails pulled from contacts API" }, { t: "Checking contact log", d: "None contacted in last 6 months · all clear" }], draft: { head: "Draft ready · Margaret Chen · Wills and Trusts", subj: "Reviewing your estate plan", body: "Hi Margaret,\n\nIt has been over two years since we helped you put your Will and Powers of Attorney in place. Life changes quickly, and it is worth making sure everything still reflects your wishes.\n\nWe would love to offer you a brief complimentary review. Would 20 minutes work sometime in the next few weeks?\n\nWarm regards,\nSutton Family Law", actions: true, wip: false }, approved: { head: "Draft 1 of 3 · Margaret Chen · approved", subj: "Reviewing your estate plan", body: "Hi Margaret,\n\nIt has been over two years since we helped you put your Will and Powers of Attorney in place.\n\nWe would love to offer a brief review. Would 20 minutes work?\n\nWarm regards, Sutton Family Law", wip: false } },
  { key: "athena", name: "Athena", role: "Pre-meeting brief", dot: "#2C3EE8", badge: "Running", badgeClass: "bg-blue-100 text-blue-800", desc: "Reads the intake form the moment it is submitted and delivers a structured brief before the meeting starts.", meta: ["James Okafor", "Form received 2 min ago", "Prior matter found"], steps: [{ t: "Intake form received", d: "James Okafor · submitted 2 minutes ago" }, { t: "Searching prior matters", d: "1 prior matter found · property purchase 2021" }, { t: "Pulling meeting notes", d: "2 file notes found from prior consultation" }, { t: "Analysing intake answers", d: "Divorce flagged · no current Will · blended family" }], draft: { head: "Brief ready · James Okafor · 10am", subj: "Pre-meeting brief", body: "Background: Returning client. Enquiring about estate planning post-divorce.\n\nMeeting notes: Intention to update estate plan after property settled.\n\nRed flags: Recent divorce · No current Will · Blended family\n\nSteer: Prioritise EPOA and super nominations.", actions: false, wip: false }, approved: { head: "Brief · James Okafor · approved", subj: "Pre-meeting brief", body: "Background: Returning client. Enquiring about estate planning post-divorce.\n\nRed flags: Recent divorce · No Will · Blended family\n\nSteer: Prioritise EPOA and super nominations.", wip: false } },
  { key: "hestia", name: "Hestia", role: "New client welcome", dot: "#4ade80", badge: "1 ready", badgeClass: "bg-green-100 text-green-800", desc: "Drafts a warm, personalised welcome email the moment a new client is confirmed.", meta: ["Sarah Williams", "Confirmed today", "Draft ready"], steps: [{ t: "New client confirmed", d: "Sarah Williams · property settlement" }, { t: "Pulling matter details", d: "Matter type, responsible lawyer, firm name" }], draft: { head: "Draft ready · Sarah Williams", subj: "Welcome to Sutton Family Law, Sarah", body: "Hi Sarah,\n\nIt was great to meet you today. We are glad to be helping you with your property settlement.\n\nWe will be in touch shortly with your engagement letter.\n\nWarm regards,\nSutton Family Law", actions: true, wip: false }, approved: { head: "Welcome · Sarah Williams · approved", subj: "Welcome to Sutton Family Law, Sarah", body: "Hi Sarah,\n\nIt was great to meet you today. We will be in touch shortly with your engagement letter.\n\nWarm regards, Sutton Family Law", wip: false } },
  { key: "plutus", name: "Plutus", role: "Unbilled time chaser", dot: "#f59e0b", badge: "Monday", badgeClass: "bg-yellow-100 text-yellow-800", desc: "Surfaces unbilled WIP every Monday so it does not get written off. Goes to the fee earner only, never clients.", meta: ["Last run: Monday", "3 matters found", "3,520 surfaced"], steps: [{ t: "Connected to billing data", d: "Pulling all open matters with time entries" }, { t: "Finding unbilled WIP", d: "Entries older than 14 days · 3 matters found" }], draft: { head: "WIP summary ready · fee earner only", subj: "wip", body: "", actions: false, wip: true }, approved: { head: "WIP summary · sent Monday", subj: "Your unbilled time this week", body: "wip", wip: true } },
  { key: "charis", name: "Charis", role: "Post-matter referral", dot: "#4ade80", badge: "2 ready", badgeClass: "bg-green-100 text-green-800", desc: "Drafts a thank-you with a soft review ask and referral line 7 days after a matter closes.", meta: ["2 matters closed", "This week", "2 drafts ready"], steps: [{ t: "Matter closed detected", d: "David Okafor · estate planning · closed 7 days ago" }, { t: "Checking excluded matter types", d: "Estate planning not excluded · proceeding" }], draft: { head: "Draft ready · David Okafor", subj: "Thank you, David", body: "Hi David,\n\nNow that your matter is wrapped up, we just wanted to say thank you for trusting us. It was a genuine pleasure.\n\nIf you have a moment, a Google review would mean a lot. And if you know anyone who needs estate planning help, we would love an introduction.\n\nWarmly,\nSutton Family Law", actions: true, wip: false }, approved: { head: "Draft 1 of 2 · David Okafor · approved", subj: "Thank you, David", body: "Hi David, thank you for trusting us. A Google review would mean a lot. And if you know anyone who needs help, we would love an introduction. Warmly, Sutton Family Law", wip: false } },
  { key: "apollo", name: "Apollo", role: "Cross-sell intelligence", dot: "#2C3EE8", badge: "Running", badgeClass: "bg-blue-100 text-blue-800", desc: "Reads client matter history against your service matrix and flags cross-sell gaps weekly.", meta: ["312 clients scanned", "3 gaps found", "Drafts ready"], steps: [{ t: "Reading matter history", d: "312 clients · all matter types reviewed" }, { t: "Matching against service matrix", d: "Comparing what each client has vs what they may need" }, { t: "3 gaps identified", d: "Will without EPOA · property without estate plan · business without succession" }], draft: { head: "Cross-sell opportunities · 3 found", subj: "3 clients who may need your help", body: "Margaret Chen · Has Will (2022), no EPOA on file.\n\nRobert Okafor · Property purchase 2021, no estate planning on record.\n\nSarah Williams · Business structure 2020, no succession plan on file.", actions: true, wip: false }, approved: { head: "Cross-sell opportunities · approved", subj: "3 clients who may need your help", body: "Margaret Chen · Has Will (2022), no EPOA.\n\nRobert Okafor · Property 2021, no estate planning.\n\nSarah Williams · Business 2020, no succession plan.", wip: false } },
];

function WipRows() {
  return (
    <div style={{ padding: "0 14px 8px" }}>
      {[["Chen · Property Settlement (18d)", "1,840"], ["Okafor · Estate Planning (22d)", "960"], ["Williams · Family Law (14d)", "720"]].map(([m, a]) => (
        <div key={m} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #eee", fontSize: 12.5 }}>
          <span>{m}</span><span style={{ fontWeight: 600, color: BLUE }}>{a}</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, background: "#f0f2fd", borderRadius: 4, padding: "8px", fontSize: 12.5, fontWeight: 600 }}>
        <span>Total surfaced</span><span style={{ color: BLUE }}>3,520</span>
      </div>
    </div>
  );
}

function AgentFlipCard({ agent, onSelect }: { agent: any; onSelect: (k: string) => void }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div style={{ perspective: 1000, height: 200, cursor: "pointer" }} onClick={() => setFlipped(f => !f)}>
      <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transition: "transform 0.5s", transform: flipped ? "rotateY(180deg)" : "none" }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: agent.dot, display: "block", marginBottom: 16 }} />
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 17, color: "#fff", marginBottom: 4 }}>{agent.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: "auto" }}>{agent.role}</div>
          <div style={{ fontSize: 11, color: BLUE, marginTop: 12 }}>Click to see what it handles</div>
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: BLUE, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 13.5, color: "#e4e6ff", lineHeight: 1.65, marginBottom: "auto", margin: "0 0 16px" }}>{agent.desc}</p>
          <button onClick={e => { e.stopPropagation(); onSelect(agent.key); }} style={{ fontSize: 12, fontWeight: 600, color: "#fff", border: "1px solid rgba(255,255,255,0.4)", background: "transparent", borderRadius: 4, padding: "6px 14px", cursor: "pointer", alignSelf: "flex-start" }}>
            See it run →
          </button>
        </div>
      </div>
    </div>
  );
}

function Console({ initialAgent }: { initialAgent: string }) {
  const [cur, setCur] = useState(initialAgent);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [steps, setSteps] = useState(0);
  const [draftVisible, setDraftVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [approved, setApproved] = useState(false);
  const [approvedBody, setApprovedBody] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setCur(initialAgent); }, [initialAgent]);

  function pick(key: string) { setCur(key); setOverlayOpen(false); setSteps(0); setDraftVisible(false); setEditMode(false); setApproved(false); setApprovedBody(""); }
  function run() {
    setOverlayOpen(true); setSteps(0); setDraftVisible(false); setEditMode(false); setApproved(false); setApprovedBody("");
    const a = agentList.find(x => x.key === cur)!;
    a.steps.forEach((_, i) => setTimeout(() => setSteps(i + 1), (i + 1) * 420));
    setTimeout(() => { setDraftVisible(true); setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 100); }, (a.steps.length + 1) * 420);
  }
  function approve() { const a = agentList.find(x => x.key === cur)!; setApprovedBody(editMode ? editText : a.draft.body); setApproved(true); setOverlayOpen(false); }

  const a = agentList.find(x => x.key === cur)!;
  const isWip = a.draft.wip;

  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 4px 32px rgba(0,0,0,0.12)" }}>
      <div style={{ background: NAVY, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#FF5F57","#FEBC2E","#28C840"].map(c => <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "block" }} />)}
        </div>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", flex: 1, textAlign: "center" }}>j.ai · Agent Console · Sutton Family Law</span>
        <span style={{ fontSize: 11, color: "#4ade80", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pulse 1.5s infinite" }} />6 agents live
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 650 }}>
        <div style={{ background: NAVY, borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ padding: "11px 14px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Agents</div>
          {agentList.map(ag => (
            <button key={ag.key} onClick={() => pick(ag.key)} style={{ width: "100%", padding: "13px 14px", background: cur === ag.key ? "rgba(44,62,232,0.25)" : "transparent", border: "none", borderLeft: `2px solid ${cur === ag.key ? BLUE : "transparent"}`, borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: ag.dot, display: "block", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{ag.name}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginTop: 1 }}>{ag.role}</div>
              </div>
              <span style={{ fontSize: 9.5, padding: "2px 7px", borderRadius: 8, fontWeight: 600, flexShrink: 0 }} className={ag.badgeClass}>{ag.badge}</span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", position: "relative", background: "#fff" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#1A1A2E" }}>{a.name} · {a.role}</div>
              <div style={{ fontSize: 11.5, color: "#555566", marginTop: 2 }}>{a.meta.join(" · ")}</div>
            </div>
            <button onClick={run} style={{ fontSize: 12.5, padding: "8px 18px", background: BLUE, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>▶ See it run</button>
          </div>
          <div style={{ padding: 20, flex: 1, overflowY: "auto" }}>
            {approved ? (
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#dcfce7", color: "#166534", fontSize: 11, fontWeight: 600, padding: "3px 12px", borderRadius: 10, marginBottom: 16 }}>✓ Approved</div>
                <div style={{ background: "#fff", borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)", overflow: "hidden" }}>
                  <div style={{ padding: "8px 14px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555566" }}>
                    <span>{a.approved.head}</span><span style={{ color: "#4ade80" }}>● Approved</span>
                  </div>
                  {a.approved.wip ? <WipRows /> : <div style={{ padding: 14, fontSize: 13, color: "#555566", lineHeight: 1.6 }}><p style={{ fontWeight: 600, color: "#1A1A2E", marginBottom: 8, marginTop: 0 }}>{a.approved.subj}</p><p style={{ whiteSpace: "pre-line", margin: 0 }}>{approvedBody || a.approved.body}</p></div>}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {a.meta.map((m: string) => <span key={m} style={{ fontSize: 11, color: "#555566", background: "#f3f4f8", padding: "3px 12px", borderRadius: 10 }}>{m}</span>)}
                </div>
                <div style={{ padding: "48px 0", textAlign: "center", fontSize: 13.5, color: "#888899", lineHeight: 1.7 }}>
                  Click <strong style={{ color: "#1A1A2E" }}>▶ See it run</strong> to watch this agent work and see what it does.
                </div>
              </div>
            )}
          </div>
          {overlayOpen && (
            <div style={{ position: "absolute", inset: 0, background: "#fff", zIndex: 10, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A2E" }}>Watching {a.name} run</div>
                <button onClick={() => setOverlayOpen(false)} style={{ background: "none", border: "none", fontSize: 20, color: "#888", cursor: "pointer" }}>✕</button>
              </div>
              <div style={{ padding: 20, overflowY: "auto", flex: 1 }} ref={scrollRef}>
                {a.steps.map((s: any, i: number) => (
                  <div key={i} style={{ display: "flex", gap: 11, marginBottom: 16, opacity: i < steps ? 1 : 0, transform: i < steps ? "none" : "translateY(5px)", transition: "opacity 0.3s, transform 0.3s" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#dcfce7", border: "1px solid #bbf7d0", color: "#166534", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>✓</div>
                      {i < a.steps.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 10, background: "#e5e7eb", margin: "2px 0" }} />}
                    </div>
                    <div style={{ paddingTop: 2, flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}>{s.t}</div>
                      <div style={{ fontSize: 11.5, color: "#888899", marginTop: 2 }}>{s.d}</div>
                    </div>
                  </div>
                ))}
                {draftVisible && (
                  <div style={{ display: "flex", gap: 11, marginBottom: 16 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#e0e7ff", border: "1px solid #c7d2fe", color: "#3730a3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, flexShrink: 0, marginTop: 1 }}>AI</div>
                    <div style={{ flex: 1, paddingTop: 2 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E", marginBottom: 8 }}>{a.draft.head}</div>
                      <div style={{ background: "#f7f8ff", border: "1px solid #c5cdf7", borderRadius: 8, overflow: "hidden" }}>
                        {isWip ? <WipRows /> : editMode ? (
                          <textarea style={{ width: "100%", padding: 14, fontSize: 13, color: "#1A1A2E", lineHeight: 1.6, border: "none", background: "transparent", resize: "none", outline: "none", minHeight: 140, fontFamily: "inherit", boxSizing: "border-box" }} value={editText} onChange={e => setEditText(e.target.value)} />
                        ) : (
                          <div style={{ padding: 14, fontSize: 13, color: "#555566", lineHeight: 1.6 }}>
                            <p style={{ fontWeight: 600, color: "#1A1A2E", marginBottom: 8, marginTop: 0 }}>{a.draft.subj}</p>
                            <p style={{ whiteSpace: "pre-line", margin: 0 }}>{a.draft.body}</p>
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 7, padding: 10, borderTop: "1px solid #c5cdf7" }}>
                          {editMode ? (<>
                            <button onClick={approve} style={{ fontSize: 11.5, padding: "5px 14px", background: BLUE, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>Save and approve</button>
                            <button onClick={() => setEditMode(false)} style={{ fontSize: 11.5, padding: "5px 14px", background: "#f3f4f8", color: "#555566", border: "1px solid #e5e7eb", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                          </>) : (<>
                            <button onClick={approve} style={{ fontSize: 11.5, padding: "5px 14px", background: BLUE, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>Approve</button>
                            {!isWip && <button onClick={() => { setEditMode(true); setEditText(a.draft.body); }} style={{ fontSize: 11.5, padding: "5px 14px", background: "#f3f4f8", color: "#555566", border: "1px solid #e5e7eb", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>Edit</button>}
                            {a.draft.actions && !isWip && <button onClick={() => setOverlayOpen(false)} style={{ fontSize: 11.5, padding: "5px 14px", background: "#f3f4f8", color: "#555566", border: "1px solid #e5e7eb", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>Skip</button>}
                          </>)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TestimonialCarousel() {
  const items = [
    { quote: "We had 400 closed matters sitting untouched. Within the first month, Hermes surfaced three clients who came back for new work. One of them turned into a $6,000 estate planning matter.", name: "Managing Partner", firm: "Estate Planning Firm, Sydney AU" },
    { quote: "The pre-meeting brief alone is worth it. I walk into every consultation knowing exactly who I am meeting and what to watch out for. It used to take me 20 minutes. Now it is there before I have finished my coffee.", name: "Principal Solicitor", firm: "Family Law Practice, London UK" },
    { quote: "We were writing off around 2,000 a week in unbilled time without realising it. Plutus surfaced it every Monday. We have recovered most of it just by having someone look at the list.", name: "Senior Associate", firm: "Conveyancing Practice, Melbourne AU" },
    { quote: "Charis sent a thank-you email to a client we had not thought about in months. She replied the same day asking about updating her EPOA. That is a matter we would never have found otherwise.", name: "Principal", firm: "Boutique Practice, London UK" },
  ];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const h = () => setActive(Math.round(el.scrollLeft / (el.scrollWidth / items.length)));
    el.addEventListener("scroll", h, { passive: true });
    return () => el.removeEventListener("scroll", h);
  }, []);
  return (
    <div>
      <div ref={scrollRef} style={{ display: "flex", overflowX: "auto", gap: 20, scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
        {items.map((t, i) => (
          <div key={i} style={{ flexShrink: 0, width: "min(400px, 85vw)", scrollSnapAlign: "center", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 32, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <p style={{ color: "#fff", fontSize: 15, lineHeight: 1.8, marginBottom: 24, marginTop: 0 }}>{t.quote}</p>
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{t.name}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4 }}>{t.firm}</div>
              <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Placeholder · to be replaced</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
        {items.map((_, i) => (
          <button key={i} onClick={() => { const el = scrollRef.current; if (el) { const card = el.children[i] as HTMLElement; card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }); } setActive(i); }} style={{ height: 3, width: i === active ? 32 : 12, borderRadius: 2, background: i === active ? "#fff" : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", padding: 0, transition: "width 0.3s, background 0.3s" }} />
        ))}
      </div>
    </div>
  );
}

function ContactForm() {
  const [fd, setFd] = useState({ name: "", email: "", firmName: "", firmSize: "", pms: "", agents: [] as string[], message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const agentOpts = ["Hermes", "Athena", "Hestia", "Plutus", "Charis", "Apollo", "Custom build"];
  function toggle(a: string) { setFd(p => ({ ...p, agents: p.agents.includes(a) ? p.agents.filter(x => x !== a) : [...p.agents, a] })); }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSubmitting(true); setError("");
    try {
      await fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: fd.name, email: fd.email, firm_name: fd.firmName, firm_size: fd.firmSize, pms: fd.pms, agents_of_interest: fd.agents.join(", "), message: fd.message, submitted_at: new Date().toISOString(), source: "jdotai.com/legal" }) });
      setSubmitted(true);
    } catch { setError("Something went wrong. Please email admin@jdotai.com directly."); }
    setSubmitting(false);
  }
  if (submitted) return (
    <div style={{ background: NAVY, borderRadius: 16, padding: 48, textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16, color: "#4ade80" }}>✓</div>
      <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, color: "#fff", fontSize: 28, margin: "0 0 12px" }}>Got it.</h3>
      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, margin: 0 }}>We will be in touch within 24 hours.</p>
    </div>
  );
  const inp: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff", padding: "8px 12px", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const lbl: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 6 };
  return (
    <form onSubmit={submit} style={{ background: NAVY, borderRadius: 16, padding: 32 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div><label style={lbl}>Full name</label><input required style={inp} type="text" placeholder="Jane Smith" value={fd.name} onChange={e => setFd(p => ({ ...p, name: e.target.value }))} /></div>
        <div><label style={lbl}>Email</label><input required style={inp} type="email" placeholder="jane@smithlaw.com" value={fd.email} onChange={e => setFd(p => ({ ...p, email: e.target.value }))} /></div>
        <div><label style={lbl}>Firm name</label><input required style={inp} type="text" placeholder="Smith Family Law" value={fd.firmName} onChange={e => setFd(p => ({ ...p, firmName: e.target.value }))} /></div>
        <div><label style={lbl}>Firm size</label>
          <select required style={{ ...inp, cursor: "pointer" }} value={fd.firmSize} onChange={e => setFd(p => ({ ...p, firmSize: e.target.value }))}>
            <option value="" disabled>Select staff count</option>
            <option value="1-5">1 to 5</option><option value="6-10">6 to 10</option><option value="11-15">11 to 15</option><option value="15+">15 or more</option>
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 12 }}><label style={lbl}>Practice management system</label>
        <select required style={{ ...inp, cursor: "pointer" }} value={fd.pms} onChange={e => setFd(p => ({ ...p, pms: e.target.value }))}>
          <option value="" disabled>Select your PMS</option>
          <option>Smokeball</option><option>Clio</option><option>LEAP</option><option>Actionstep</option><option>Other</option>
        </select>
      </div>
      <div style={{ marginBottom: 12 }}><label style={lbl}>Which agents interest you?</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {agentOpts.map(a => (
            <button key={a} type="button" onClick={() => toggle(a)} style={{ fontSize: 11.5, padding: "4px 10px", borderRadius: 20, border: "1px solid", borderColor: fd.agents.includes(a) ? BLUE : "rgba(255,255,255,0.2)", background: fd.agents.includes(a) ? BLUE : "transparent", color: "#fff", cursor: "pointer" }}>{a}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 20 }}><label style={lbl}>What do you want to automate?</label>
        <textarea required style={{ ...inp, resize: "none", minHeight: 90 }} placeholder="Describe the tasks taking up your team's time, or the specific workflow you have in mind..." value={fd.message} onChange={e => setFd(p => ({ ...p, message: e.target.value }))} />
      </div>
      {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{error}</p>}
      <button type="submit" disabled={submitting} style={{ width: "100%", background: BLUE, color: "#fff", fontWeight: 600, fontSize: 14, padding: "12px", borderRadius: 8, border: "none", cursor: "pointer", opacity: submitting ? 0.5 : 1 }}>
        {submitting ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
}

export default function Legal() {
  const [navCompressed, setNavCompressed] = useState(false);
  const [activeAgent, setActiveAgent] = useState("hermes");
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setNavCompressed(window.scrollY > 80);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  function selectAgent(key: string) {
    setActiveAgent(key);
    setTimeout(() => consoleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  const navH = navCompressed ? 48 : 68;

  return (
    <div style={{ minHeight: "100dvh", fontFamily: "'DM Sans', sans-serif" }}>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: BLUE }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", height: navH, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "height 0.3s" }}>
          <Link href="/"><img src="/logo-white.png" alt="j.ai" style={{ height: navCompressed ? 32 : 48, width: "auto", cursor: "pointer", transition: "height 0.3s" }} /></Link>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Link href="/" style={{ color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Home</Link>
            <a href="#cta" style={{ border: "1px solid #fff", color: "#fff", background: "transparent", borderRadius: 4, padding: "8px 20px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Book a Call</a>
          </div>
        </div>
      </nav>

      {/* 1 — HERO — blue */}
      <section style={{ background: BLUE, minHeight: "100dvh", position: "relative", display: "flex", alignItems: "center", paddingTop: navH }}>
        <FloatingShapes bg="blue" />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 960, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(36px,5vw,58px)", lineHeight: 1.08, letterSpacing: "-0.03em", color: "#fff", maxWidth: 820, margin: "0 0 24px" }}>
            If a task does not need your judgement, it should not need your time.
          </h1>
          <p style={{ color: "#fff", fontSize: 18, lineHeight: 1.7, maxWidth: 600, margin: "0 0 40px" }}>
            j.ai connects to Smokeball, Clio, LEAP, Actionstep and more. We map every repeatable task in your firm and build agents that handle it.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="#console" style={{ display: "inline-block", background: "#fff", color: BLUE, fontWeight: 600, fontSize: 15, padding: "14px 32px", borderRadius: 6, textDecoration: "none" }}>See the agents run</a>
            <a href="#cta" style={{ display: "inline-block", background: "transparent", border: "2px solid rgba(255,255,255,0.4)", color: "#fff", fontWeight: 600, fontSize: 15, padding: "13px 28px", borderRadius: 6, textDecoration: "none" }}>Book a call</a>
          </div>
        </div>
      </section>

      {/* 2 — AGENT GRID — white */}
      <Section bg="white">
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,36px)", color: "#1A1A2E", margin: "0 0 8px" }}>Six agents. One job.</h2>
        <p style={{ color: "#555566", fontSize: 15, margin: "0 0 40px" }}>Click any card to flip it. Hit "See it run" to watch the agent live.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {agentList.map(ag => <AgentFlipCard key={ag.key} agent={{ ...ag, dot: ag.dot, badgeClass: "", badge: "" }} onSelect={selectAgent} />)}
        </div>
      </Section>

      {/* 3 — CONSOLE — navy */}
      <section id="console" ref={consoleRef} style={{ background: NAVY, minHeight: "100dvh", position: "relative", display: "flex", alignItems: "center" }}>
        <FloatingShapes bg="navy" />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,40px)", color: "#fff", margin: "0 0 8px" }}>Watch any agent run</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, margin: "0 0 40px" }}>Select an agent, click Run, and see exactly what it does.</p>
          <Console initialAgent={activeAgent} />
        </div>
      </section>

      {/* 4 — HOW IT WORKS — blue */}
      <Section bg="blue">
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,40px)", color: "#fff", margin: "0 0 48px" }}>Built around one idea.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
          {[
            { n: "1", t: "We map what does not need you", d: "Your firm runs on a mix of work that needs a lawyer's brain and work that does not. We sit with you, identify every task that is repeatable, predictable, and eating time it should not." },
            { n: "2", t: "We build the agents that handle it", d: "Whether it is a pre-built agent or something custom-built for how your firm works, we configure it, connect it to your practice management system, and run it until exactly right." },
            { n: "3", t: "Everything that needs you lands in your inbox. Nothing else does.", d: "Every agent output arrives for your review before anything happens. You approve, edit, or skip. Nothing ever reaches a client without a human deciding." },
          ].map(item => (
            <div key={item.n}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 56, color: "#fff", opacity: 0.2, lineHeight: 1, marginBottom: 16 }}>{item.n}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 12 }}>{item.t}</div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.75 }}>{item.d}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* 5 — TESTIMONIALS — white */}
      <Section bg="white">
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,40px)", color: "#1A1A2E", margin: "0 0 40px" }}>What firms are saying.</h2>
        <div style={{ background: NAVY, borderRadius: 20, padding: 48 }}>
          <TestimonialCarousel />
        </div>
      </Section>

      {/* 6 — CUSTOM BUILDS + FORM — navy */}
      <Section bg="navy">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48, alignItems: "start" }}>
          <div>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(26px,3vw,36px)", color: "#fff", margin: "0 0 20px", lineHeight: 1.1 }}>Need something built specifically for your firm?</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.75, margin: "0 0 16px" }}>Not every firm runs the same way. If you have a workflow, a process, or a problem that does not fit a standard agent, we will scope and build it from scratch.</p>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.75, margin: 0 }}>Connected to your existing systems. Designed around how you actually work. Delivered as an agent that runs itself.</p>
          </div>
          <ContactForm />
        </div>
      </Section>

      {/* 7 — CTA — blue */}
      <section id="cta" style={{ background: BLUE, minHeight: "100dvh", position: "relative", display: "flex", alignItems: "center" }}>
        <FloatingShapes bg="blue" />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 960, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(30px,4vw,44px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", maxWidth: 720, margin: "0 auto 24px", textAlign: "center" }}>
            Ready to stop doing work that should not need you?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 48px", textAlign: "center" }}>
            Pick a time below and we will map out what is worth automating in your firm.
          </p>
          <iframe src="https://cal.com/jai.ai/discovery-call?embed=true&layout=month_view" style={{ width: "100%", height: 700, border: "none", borderRadius: 12 }} />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0a0a0a", padding: "60px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Link href="/"><img src="/logo-blue.png" alt="j.ai" style={{ height: 28, width: "auto", cursor: "pointer" }} /></Link>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Revenue agents for small law firms</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
            <a href="mailto:admin@jdotai.com" style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, textDecoration: "none" }}>admin@jdotai.com</a>
            <a href="https://www.linkedin.com/in/jai-dhingra/" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.45)" }} aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>© 2026 j.ai. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
