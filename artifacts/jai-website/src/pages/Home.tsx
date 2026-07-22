import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

const BLUE = "#2C3EE8";
const NAVY = "#0F1729";
const WHITE = "#FFFFFF";

// ── Animation hooks ──────────────────────────────────────────────────────────

function useReveal(ref: React.RefObject<HTMLElement>, delay = 0) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => el.classList.add("revealed"), delay); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
}

function WordReveal({ text, color = "#fff", style = {} }: { text: string; color?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const words = text.split(" ");
  return (
    <div ref={ref} style={style}>
      {words.map((w, i) => (
        <span key={i} style={{
          display: "inline-block", marginRight: "0.28em", color,
          opacity: triggered ? 1 : 0, transform: triggered ? "translateY(0)" : "translateY(16px)",
          transition: `opacity 0.45s ease ${triggered ? i * 70 : 0}ms, transform 0.45s ease ${triggered ? i * 70 : 0}ms`
        }}>{w}</span>
      ))}
    </div>
  );
}

function CountUp({ end, prefix = "", suffix = "", color = BLUE }: { end: number; prefix?: string; suffix?: string; color?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1400; const step = 16; const steps = dur / step; let cur = 0;
        const id = setInterval(() => {
          cur++; setVal(Math.round((cur / steps) * end));
          if (cur >= steps) { setVal(end); clearInterval(id); }
        }, step);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref} style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 36, color }}>{prefix}{val}{suffix}</span>;
}

export default function Home() {
  const [navCompressed, setNavCompressed] = useState(false);

  useEffect(() => {
    const h = () => setNavCompressed(window.scrollY > 80);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const script = document.createElement("script");
      script.src = "https://app.cal.com/embed/embed.js";
      script.async = true;
      script.onload = () => {
        const Cal = (window as any).Cal;
        if (!Cal) return;
        Cal("init", "home-dc", { origin: "https://app.cal.com" });
        Cal.ns["home-dc"]("inline", { elementOrSelector: "#home-cal-inline", config: { layout: "month_view" }, calLink: "jai.ai/discovery-call" });
        Cal.ns["home-dc"]("ui", { hideEventTypeDetails: false, layout: "month_view" });
      };
      document.head.appendChild(script);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const navH = navCompressed ? 48 : 68;
  const industries = [
    { label: "Legal", href: "/legal", live: true },
    { label: "HR", live: false }, { label: "Recruitment", live: false },
    { label: "Insurance", live: false }, { label: "Real Estate", live: false }, { label: "Finance", live: false },
  ];

  // ── stagger cards util ────────────────────────────────────────────────────
  function StaggerSection({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const el = ref.current; if (!el) return;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          Array.from(el.children).forEach((child, i) => {
            setTimeout(() => (child as HTMLElement).classList.add("revealed"), i * 100);
          });
          obs.disconnect();
        }
      }, { threshold: 0.1 });
      obs.observe(el);
      return () => obs.disconnect();
    }, []);
    return <div ref={ref} style={style}>{children}</div>;
  }

  // ── reveal paragraph util ─────────────────────────────────────────────────
  function RevealEl({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const el = ref.current; if (!el) return;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { setTimeout(() => el.classList.add("revealed"), delay); obs.disconnect(); }
      }, { threshold: 0.1 });
      obs.observe(el);
      return () => obs.disconnect();
    }, []);
    return (
      <div ref={ref} className="reveal-el" style={style}>{children}</div>
    );
  }

  const globalCss = `
    .reveal-el { opacity:0; transform:translateY(18px); transition:opacity 0.5s ease, transform 0.5s ease; }
    .reveal-el.revealed { opacity:1; transform:translateY(0); }
    .stagger-item { opacity:0; transform:translateY(20px); transition:opacity 0.45s ease, transform 0.45s ease; }
    .stagger-item.revealed { opacity:1; transform:translateY(0); }
    .side-left { opacity:0; transform:translateX(-36px); transition:opacity 0.5s ease, transform 0.5s ease; }
    .side-right { opacity:0; transform:translateX(36px); transition:opacity 0.5s ease, transform 0.5s ease; }
    .side-left.revealed, .side-right.revealed { opacity:1; transform:translateX(0); }
  `;

  return (
    <div style={{ minHeight: "100dvh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{globalCss}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: BLUE, transition: "all 0.3s" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", height: navH, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "height 0.3s" }}>
          <Link href="/"><img src="/logo-white.png" alt="j.ai" style={{ height: navCompressed ? 32 : 48, width: "auto", cursor: "pointer", transition: "height 0.3s" }} /></Link>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {industries.map(ind => ind.live
              ? <Link key={ind.label} href={ind.href!} style={{ color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{ind.label}</Link>
              : <span key={ind.label} className="coming-soon-nav" style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, fontWeight: 600, position: "relative", cursor: "default" }}>
                  {ind.label}
                  <span style={{ position: "absolute", top: "100%", marginTop: 8, left: "50%", transform: "translateX(-50%)", background: NAVY, color: "#fff", fontSize: 10, padding: "3px 8px", borderRadius: 4, whiteSpace: "nowrap", opacity: 0, pointerEvents: "none", transition: "opacity 0.15s", zIndex: 99 }} className="tt">Coming soon</span>
                </span>
            )}
            <a href="#cta" style={{ border: "1px solid #fff", color: "#fff", background: "transparent", borderRadius: 4, padding: "8px 20px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Book a Call</a>
          </div>
        </div>
      </nav>

      {/* 1 — HERO — blue */}
      <section style={{ background: BLUE, minHeight: "100dvh", position: "relative", display: "flex", alignItems: "center", paddingTop: navH }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <WordReveal text="You're too busy running your business to figure out what AI can do for you."
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(36px,5vw,58px)", lineHeight: 1.08, letterSpacing: "-0.03em", maxWidth: 800, marginBottom: 24 }} />
          <RevealEl delay={600} style={{ marginBottom: 40 }}>
            <p style={{ color: "#fff", fontSize: 18, lineHeight: 1.7, maxWidth: 540, margin: 0 }}>That's exactly what j.ai does for you.</p>
          </RevealEl>
          <RevealEl delay={750}>
            <a href="#cta" style={{ display: "inline-block", background: "#fff", color: BLUE, fontWeight: 600, fontSize: 15, padding: "14px 32px", borderRadius: 6, textDecoration: "none", transition: "transform 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e => { (e.target as HTMLElement).style.transform = "translateY(-2px) scale(1.02)"; (e.target as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.transform = ""; (e.target as HTMLElement).style.boxShadow = ""; }}>
              Book a Discovery Call
            </a>
          </RevealEl>
        </div>
      </section>

      {/* 2 — PROBLEM — white, black text */}
      <section style={{ background: WHITE, minHeight: "100dvh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <WordReveal text="AI is moving faster than you can keep up with."
            color="#1A1A2E"
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(32px,4vw,40px)", lineHeight: 1.2, maxWidth: 700, marginBottom: 32 }} />
          <div style={{ maxWidth: 700 }}>
            {["New tools drop every week. Everyone's talking about automation, agents, workflows. And somewhere in all that noise is something that could genuinely save your team 10 hours a week, but you don't have time to find it, test it, or figure out if it even applies to your business.",
              "Meanwhile your competitors already have. They're running leaner, moving faster, and delivering more.",
              "Every week you don't, the gap widens."
            ].map((text, i) => (
              <RevealEl key={i} delay={i * 120}>
                <p style={{ color: "#555566", fontSize: 17, lineHeight: 1.8, margin: "0 0 24px" }}>{text}</p>
              </RevealEl>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — SERVICES — navy, hover lift cards with icons */}
      <section style={{ background: NAVY, minHeight: "100dvh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <WordReveal text="Built around how your business actually runs."
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(32px,4vw,40px)", lineHeight: 1.2, maxWidth: 700, marginBottom: 48 }} />
          <StaggerSection style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[
              { title: "j.ai Advisory", icon: "◎", body: "You need someone who stays on top of the AI market so you don't have to. Every month I map what's changed, what applies to your business, and exactly what to do about it." },
              { title: "j.ai Labs", icon: "⌘", body: "When the right solution doesn't exist off the shelf, I build it. Custom automations, AI agents, and workflow tools designed around how your business actually runs." },
            ].map(item => (
              <div key={item.title} className="stagger-item" style={{ background: "rgba(44,62,232,0.15)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 32, transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s", cursor: "default" }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.transform = "translateY(-4px)"; el.style.borderColor = "rgba(255,255,255,0.3)"; el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.3)"; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.transform = ""; el.style.borderColor = "rgba(255,255,255,0.12)"; el.style.boxShadow = ""; }}>
                <div style={{ fontSize: 24, marginBottom: 16, opacity: 0.6 }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", margin: "0 0 12px" }}>{item.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.8, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </StaggerSection>
        </div>
      </section>

      {/* 4 — WHY — blue */}
      <section style={{ background: BLUE, minHeight: "100dvh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <WordReveal text="You started your business to do the work you're good at."
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(32px,4vw,40px)", lineHeight: 1.2, maxWidth: 700, marginBottom: 32 }} />
          <div style={{ maxWidth: 700 }}>
            {["Not to spend hours on tasks that slow your growth, drain your team, and pull you away from what actually matters.",
              "AI can give you those hours back.",
              "Every business has work that runs on people instead of systems. Repetitive, manual, time-consuming work that your team is too good to be doing. That's what AI is made for, and that's exactly where we come in.",
              "j.ai finds it, builds it, and makes it work. Directly in your business. Around how you actually operate."
            ].map((text, i) => (
              <RevealEl key={i} delay={i * 120}>
                <p style={{ color: "#fff", fontSize: 17, lineHeight: 1.8, margin: "0 0 24px" }}>{text}</p>
              </RevealEl>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — CTA — white */}
      <section id="cta" style={{ background: WHITE, minHeight: "100dvh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <WordReveal text="Ready to see what AI can do for your business?"
            color="#1A1A2E"
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(32px,4vw,48px)", lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: 700, margin: "0 auto 24px", textAlign: "center" }} />
          <RevealEl delay={500}>
            <p style={{ color: "#555566", fontSize: 18, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 48px", textAlign: "center" }}>
              Pick a time below. We'll discuss how your business runs, where the biggest opportunities are, and how we can use AI to solve your problems.
            </p>
          </RevealEl>
          <div id="home-cal-inline" style={{ width: "100%", height: 700, overflow: "scroll" }} />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0a0a0a", padding: "60px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Link href="/"><img src="/logo-blue.png" alt="j.ai" style={{ height: 28, width: "auto", cursor: "pointer" }} /></Link>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>AI Advisory and Custom Tools for SMEs</span>
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
