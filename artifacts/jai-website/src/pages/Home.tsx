import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

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

    function resize() {
      W = canvas!.width = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
    }
    resize();

    shapes.current = Array.from({ length: 16 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 10 + Math.random() * 40,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      type: Math.random() > 0.4 ? "circle" : "cross",
      angle: Math.random() * Math.PI,
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
        const alpha = 0.08 + pull * 0.28;
        ctx.strokeStyle = strokeColor(alpha);
        ctx.lineWidth = 0.8 + pull * 1.5;
        if (s.type === "circle") {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r + pull * 12, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          const size = s.r + pull * 10;
          ctx.beginPath();
          ctx.moveTo(s.x - size, s.y); ctx.lineTo(s.x + size, s.y);
          ctx.moveTo(s.x, s.y - size); ctx.lineTo(s.x, s.y + size);
          ctx.stroke();
        }
      });
      raf = requestAnimationFrame(draw);
    }

    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  function onMouseMove(e: React.MouseEvent) {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return;
    mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { mouse.current = { x: -1000, y: -1000 }; }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "all" }}
    />
  );
}

function Section({ bg, children }: { bg: "blue" | "navy" | "white"; children: React.ReactNode }) {
  const bgColor = bg === "blue" ? BLUE : bg === "navy" ? NAVY : "#FFFFFF";
  const textColor = bg === "white" ? "#1A1A2E" : "#FFFFFF";
  return (
    <section style={{ background: bgColor, color: textColor, minHeight: "100dvh", position: "relative", display: "flex", alignItems: "center" }}>
      <FloatingShapes bg={bg} />
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 960, margin: "0 auto", padding: "80px 24px" }}>
        {children}
      </div>
    </section>
  );
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

  const navBg = BLUE;
  const h = navCompressed ? 48 : 68;

  const industries = [
    { label: "Legal", href: "/legal", live: true },
    { label: "HR", live: false },
    { label: "Recruitment", live: false },
    { label: "Insurance", live: false },
    { label: "Real Estate", live: false },
    { label: "Finance", live: false },
  ];

  return (
    <div style={{ minHeight: "100dvh", fontFamily: "'DM Sans', sans-serif" }}>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: navBg, transition: "all 0.3s" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", height: h, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "height 0.3s" }}>
          <Link href="/">
            <img src="/logo-white.png" alt="j.ai" style={{ height: navCompressed ? 32 : 48, width: "auto", cursor: "pointer", transition: "height 0.3s" }} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {industries.map(ind => ind.live
              ? <Link key={ind.label} href={ind.href!} style={{ color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{ind.label}</Link>
              : <span key={ind.label} style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, fontWeight: 600 }}>{ind.label}</span>
            )}
            <a href="#cta" style={{ border: "1px solid #fff", color: "#fff", background: "transparent", borderRadius: 4, padding: "8px 20px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Book a Call</a>
          </div>
        </div>
      </nav>

      {/* 1 — HERO — blue */}
      <section style={{ background: BLUE, minHeight: "100dvh", position: "relative", display: "flex", alignItems: "center", paddingTop: h }}>
        <FloatingShapes bg="blue" />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 960, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(36px,5vw,58px)", lineHeight: 1.08, letterSpacing: "-0.03em", color: "#fff", maxWidth: 800, margin: "0 0 24px" }}>
            You're too busy running your business to figure out what AI can do for you.
          </h1>
          <p style={{ color: "#fff", fontSize: 18, lineHeight: 1.7, maxWidth: 540, margin: "0 0 40px" }}>That's exactly what j.ai does for you.</p>
          <a href="#cta" style={{ display: "inline-block", background: "#fff", color: BLUE, fontWeight: 600, fontSize: 15, padding: "14px 32px", borderRadius: 6, textDecoration: "none", transition: "transform 0.15s, box-shadow 0.15s" }}
            onMouseEnter={e => { (e.target as HTMLElement).style.transform = "translateY(-2px)"; (e.target as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.transform = ""; (e.target as HTMLElement).style.boxShadow = ""; }}>
            Book a Discovery Call
          </a>
        </div>
      </section>

      {/* 2 — PROBLEM — white */}
      <Section bg="white">
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(32px,4vw,40px)", lineHeight: 1.2, color: "#1A1A2E", margin: "0 0 32px" }}>
          AI is moving faster than you can keep up with.
        </h2>
        <div style={{ maxWidth: 700 }}>
          {["New tools drop every week. Everyone's talking about automation, agents, workflows. And somewhere in all that noise is something that could genuinely save your team 10 hours a week, but you don't have time to find it, test it, or figure out if it even applies to your business.",
            "Meanwhile your competitors already have. They're running leaner, moving faster, and delivering more.",
            "Every week you don't, the gap widens."
          ].map((p, i) => <p key={i} style={{ color: "#555566", fontSize: 17, lineHeight: 1.8, margin: "0 0 24px" }}>{p}</p>)}
        </div>
      </Section>

      {/* 3 — SERVICES — navy */}
      <Section bg="navy">
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(32px,4vw,40px)", lineHeight: 1.2, color: "#fff", margin: "0 0 48px" }}>
          Built around how your business actually runs.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {[
            { title: "j.ai Advisory", icon: "◎", body: "You need someone who stays on top of the AI market so you don't have to. Every month I map what's changed, what applies to your business, and exactly what to do about it." },
            { title: "j.ai Labs", icon: "⌘", body: "When the right solution doesn't exist off the shelf, I build it. Custom automations, AI agents, and workflow tools designed around how your business actually runs." },
          ].map(item => (
            <div key={item.title} style={{ background: "rgba(44,62,232,0.15)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 32, transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s", cursor: "default" }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.transform = "translateY(-4px)"; el.style.borderColor = "rgba(255,255,255,0.3)"; el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.transform = ""; el.style.borderColor = "rgba(255,255,255,0.12)"; el.style.boxShadow = ""; }}>
              <div style={{ fontSize: 24, marginBottom: 16, opacity: 0.6 }}>{item.icon}</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", margin: "0 0 12px" }}>{item.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.8, margin: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 4 — WHY — blue */}
      <Section bg="blue">
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(32px,4vw,40px)", lineHeight: 1.2, color: "#fff", margin: "0 0 32px" }}>
          You started your business to do the work you're good at.
        </h2>
        <div style={{ maxWidth: 700 }}>
          {["Not to spend hours on tasks that slow your growth, drain your team, and pull you away from what actually matters.",
            "AI can give you those hours back.",
            "Every business has work that runs on people instead of systems. Repetitive, manual, time-consuming work that your team is too good to be doing. That's what AI is made for, and that's exactly where we come in.",
            "j.ai finds it, builds it, and makes it work. Directly in your business. Around how you actually operate."
          ].map((p, i) => <p key={i} style={{ color: "#fff", fontSize: 17, lineHeight: 1.8, margin: "0 0 24px" }}>{p}</p>)}
        </div>
      </Section>

      {/* 5 — WHO — white */}
      <Section bg="white">
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(32px,4vw,40px)", lineHeight: 1.2, color: "#1A1A2E", margin: "0 0 24px" }}>
          Founders and operators ready to actually implement.
        </h2>
        <p style={{ color: "#555566", fontSize: 20, lineHeight: 1.8, maxWidth: 700, margin: 0 }}>
          Running businesses between 10 and 50 people who know their team is spending time on work that should not be manual anymore. You don't need to understand AI. You need the outcome.
        </p>
      </Section>

      {/* 6 — CTA — navy */}
      <section id="cta" style={{ background: NAVY, minHeight: "100dvh", position: "relative", display: "flex", alignItems: "center" }}>
        <FloatingShapes bg="navy" />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 960, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(32px,4vw,48px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", maxWidth: 700, margin: "0 auto 24px", textAlign: "center" }}>
            Ready to see what AI can do for your business?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 48px", textAlign: "center" }}>
            Pick a time below. We'll discuss how your business runs, where the biggest opportunities are, and how we can use AI to solve your problems.
          </p>
          <iframe src="https://cal.com/jai.ai/discovery-call?embed=true&layout=month_view" style={{ width: "100%", height: 700, border: "none", borderRadius: 12 }} />
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
