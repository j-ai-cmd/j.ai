import React, { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Reveal, Wordmark, MobileSheet, WEBHOOK_URL, LINKEDIN, EMAIL } from "@/components/shared";
import FlowBanner from "@/components/FlowBanner";
import posthog, { isPostHogEnabled } from "@/lib/posthog";

export const FAQS = [
  { q: "What practice management systems does donna connect to?", a: "Clio, Smokeball, Actionstep, myCase, and LEAP. We’re actively expanding the list — if yours isn’t there yet, get in touch." },
  { q: "How long does it take to get set up?", a: "You are live in 2 weeks." },
  { q: "Do my clients need to create an account?", a: "No. Clients receive a link to the intake form. They fill it in at their own pace, and their progress saves as they go." },
  { q: "How does the MCP connector work?", a: "donna helps you talk to your PMS in plain english. Right in your Claude/ChatGPT." },
];

const PMS_BLOCKS = ["Clio", "Smokeball", "Actionstep", "myCase", "LEAP"];
const AI_BLOCKS = [
  { label: "Claude"},
  { label: "ChatGPT"},
  { label: "Kimi", note: "Self-hosted" },
];

function VideoPlayer({ src, demo }: { src: string; demo: "intake" | "mcp" }) {
  const ref = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const revealControls = () => {
    setShowControls(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowControls(false), 2500);
  };

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen();
  };

  return (
    <div ref={wrapRef} className="d-vid-wrap" onMouseMove={revealControls} onMouseEnter={revealControls} onMouseLeave={() => { if (timerRef.current) clearTimeout(timerRef.current); setShowControls(false); }} onTouchStart={revealControls}>
      <video
        ref={ref}
        src={src}
        playsInline
        preload="metadata"
        className="d-vid-player"
        onClick={togglePlay}
        onPlay={() => {
          if (isPostHogEnabled) {
            posthog.capture("demo_video_played", { demo });
          }
        }}
      />
      <button className="d-vid-play-center" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} style={{ opacity: showControls ? 1 : 0, pointerEvents: showControls ? "auto" : "none" }}>
        {playing
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          : <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
        }
      </button>
      <div className="d-vid-controls" style={{ opacity: showControls ? 1 : 0, pointerEvents: showControls ? "auto" : "none" }}>
        <button className="d-vid-btn" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
          {muted
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M15.54,8.46a5,5,0,0,1,0,7.07"/><path d="M19.07,4.93a10,10,0,0,1,0,14.14"/></svg>
          }
        </button>
        <button className="d-vid-btn" onClick={toggleFullscreen} aria-label="Fullscreen">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
        </button>
      </div>
    </div>
  );
}

export default function Legal() {
  const [menu, setMenu] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", firm: "", pms: "", area: "" });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email) return;
    setLoading(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "jdotai.com/donna", submitted_at: new Date().toISOString() }),
      });
    } catch {}
    setLoading(false);
    setSent(true);
    if (isPostHogEnabled) {
      posthog.capture("lead_enquiry_submitted", {
        practice_management_system: form.pms || "not_selected",
      });
    }
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      {/* MASTHEAD */}
      <div className="h-mast h-mast--dark">
        <div className="in">
          <Wordmark />
          <div className="nav">
            <Link href="/">Home</Link>
            <span className="live" aria-current="page">Legal</span>
            <Link href="/blogs">Blogs</Link>
          </div>
          <button className="hamb" onClick={() => setMenu(true)} aria-label="Open menu"><span/><span/><span/></button>
        </div>
      </div>
      <MobileSheet open={menu} onClose={() => setMenu(false)} links={[
        { label: "Home", href: "/" },
        { label: "Legal", href: "/donna" },
        { label: "Blogs", href: "/blogs" },
      ]} />

      {/* HERO */}
      <section className="d-hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <Reveal><h1 className="donna-logo">donna</h1></Reveal>
              <div className="hero-num-list">
                <Reveal className="hero-num-item">
                  <b>1.</b>
                  <span>An MCP connector that gives your AI assistant live access to your PMS — so you can talk to all your matters.</span>
                </Reveal>
                <Reveal className="hero-num-item">
                  <b>2.</b>
                  <span>A custom intake form that collects exactly what your firm needs — and syncs it straight to your PMS.</span>
                </Reveal>
              </div>
              <Reveal className="go">
                <a href="#donna" className="btn btn-solid">See the demo</a>
                <a href="#contact" className="btn btn-line">Get donna for your firm →</a>
              </Reveal>
            </div>
            <div className="hero-right">
              <Reveal>
                <div className="hero-block-label">Practice management systems (PMS)</div>
                <div className="hero-block-row">
                  {PMS_BLOCKS.map(p => <div key={p} className="hero-block">{p}</div>)}
                </div>
                <div className="hero-block-label" style={{ marginTop: 16 }}>AI assistants</div>
                <div className="hero-block-row">
                  {AI_BLOCKS.map(a => (
                    <div key={a.label} className="hero-block">
                      {a.label} <span>{a.note}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>


      {/* VIDEO SECTION */}
      <section className="d-videos">
        <div className="wrap">
          <Reveal><h2 className="d-vid-heading">See <span style={{ color: "var(--accent)" }}>donna</span> in action.</h2></Reveal>
          <div className="d-vid-grid">
            <Reveal>
              <div className="d-vid-item">
                <p className="d-vid-label">donna Intake</p>
                <VideoPlayer src="/videos/donna-intake.mp4" demo="intake" />
              </div>
            </Reveal>
            <Reveal>
              <div className="d-vid-item">
                <p className="d-vid-label">donna MCP</p>
                <VideoPlayer src="/videos/donna-mcp.mp4" demo="mcp" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <FlowBanner />

      {/* HOW IT WORKS */}
      <section className="d-how">
        <div className="wrap">
          <Reveal as="h2">Custom-built for your firm.</Reveal>
          <Reveal className="steps4">
            <div className="s">
              <h4>Custom intake form</h4>
              <p>We build the intake form custom for you - estate planning, family law, conveyancing. Fields, pages, logic, brand assets, all yours.</p>
            </div>
            <div className="s">
              <h4>Clients complete it themselves</h4>
              <p>A clean, mobile-friendly form your clients finish in minutes. Submissions tracked in real time on a dashboard.</p>
            </div>
            <div className="s">
              <h4>Syncs with your legal software</h4>
              <p>Donna smartly syncs all form submissions to your legal software, creating a matter, contacts, documents etc.</p>
            </div>
            <div className="s">
              <h4>MCP connector</h4>
              <p>Donna MCP connects your legal software with your AI. So you can talk to your software inside Claude or ChatGPT.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="d-faq">
        <div className="wrap">
          <Reveal as="h2">Frequently asked questions.</Reveal>
          <Reveal className="faq-list">
            {FAQS.map((f, i) => (
              <details key={i} className="faq-item">
                <summary>{f.q}<span className="pl">+</span></summary>
                <div className="ans">{f.a}</div>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section className="d-contact" id="contact">
        <div className="wrap">
          <div className="d-contact-grid">
            <Reveal>
              <h2>Want this for your firm?</h2>
              <p className="sub-p">Fill out this form. Our team will contact you within 24 hours.</p>
            </Reveal>
            <Reveal>
              {sent ? (
                <div className="d-form-done">
                  <div className="tick">✓</div>
                  <h3>Submitted.</h3>
                  <p>We’ll be in touch within 24 hours.</p>
                </div>
              ) : (
                <form className="d-form" onSubmit={submit}>
                  <label className="fl">Full name</label>
                  <input className="fi" type="text" placeholder="Jane Smith" value={form.name} onChange={set("name")} />
                  <label className="fl">Email *</label>
                  <input className="fi" type="email" required placeholder="jane@smithlaw.com.au" value={form.email} onChange={set("email")} />
                  <label className="fl">Phone</label>
                  <input className="fi" type="tel" placeholder="+61 4xx xxx xxx" value={form.phone} onChange={set("phone")} />
                  <label className="fl">Firm name</label>
                  <input className="fi" type="text" placeholder="Smith Family Law" value={form.firm} onChange={set("firm")} />
                  <label className="fl">Practice management system</label>
                  <select className="fi" value={form.pms} onChange={set("pms")}>
                    <option value="">Select your PMS</option>
                    <option>Clio</option>
                    <option>Smokeball</option>
                    <option>Actionstep</option>
                    <option>myCase</option>
                    <option>LEAP</option>
                    <option>Other</option>
                  </select>
                  <button className="sub" type="submit" disabled={loading}>
                    {loading ? "Sending…" : "Send enquiry"}
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="wrap">
          <Reveal as="h2">Stop doing work that shouldn’t need you.</Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="h-footer">
        <div className="in">
          <div>
            <Wordmark className="mk" />
            <div className="tag">AI implementation for legal firms</div>
          </div>
          <div className="r">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="li-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
            <span className="cp">© 2026 j.ai — Jai Dhingra</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
