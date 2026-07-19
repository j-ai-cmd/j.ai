import React, { useEffect, useState, useRef } from "react";
import { Link } from "wouter";

const CAL_EMBED = `
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", "discovery-call", {origin:"https://app.cal.com"});
Cal.config = Cal.config || {};
Cal.config.forwardQueryParams = true;
Cal.ns["discovery-call"]("inline", {
  elementOrSelector:"#home-cal-inline",
  config: {"layout":"month_view","useSlotsViewOnSmallScreen":"true"},
  calLink: "jai.ai/discovery-call",
});
Cal.ns["discovery-call"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
`;

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function Home() {
  useScrollReveal();
  const [scrolled, setScrolled] = useState(false);
  const [navCompressed, setNavCompressed] = useState(false);

  useEffect(() => {
    const h = () => {
      setScrolled(window.scrollY > 20);
      setNavCompressed(window.scrollY > 80);
    };
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = CAL_EMBED;
    document.body.appendChild(script);
    return () => { try { document.body.removeChild(script); } catch {} };
  }, []);

  const industries = [
    { label: "Legal", href: "/legal", live: true },
    { label: "HR", href: "#", live: false },
    { label: "Recruitment", href: "#", live: false },
    { label: "Insurance", href: "#", live: false },
    { label: "Real Estate", href: "#", live: false },
    { label: "Finance", href: "#", live: false },
  ];

  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans text-[#1A1A2E] bg-[#F7F8FF]">

      {/* NAV — sticky, compresses on scroll */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2C3EE8]">
        <div className={`max-w-[960px] mx-auto px-6 flex items-center justify-between transition-all duration-300 ${navCompressed ? "h-[48px]" : "h-[68px]"}`}>
          <Link href="/">
            <img src="/logo-white.png" alt="j.ai" className={`w-auto cursor-pointer transition-all duration-300 ${navCompressed ? "h-8" : "h-12"}`} />
          </Link>
          <div className="flex items-center gap-5">
            {industries.map(ind => (
              ind.live
                ? <Link key={ind.label} href={ind.href} className="text-white text-[14px] font-semibold hover:text-white/80 transition-colors">{ind.label}</Link>
                : <span key={ind.label} className="text-white/40 text-[14px] font-semibold cursor-default relative group">
                    {ind.label}
                    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#0F1729] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">Coming soon</span>
                  </span>
            ))}
            <a href="#cta" className="border border-white text-white bg-transparent rounded px-5 py-2 text-[14px] font-semibold hover:bg-white/5 transition-colors">Book a Call</a>
          </div>
        </div>

      </nav>

      {/* HERO */}
      <section className="relative w-full min-h-[100dvh] bg-[#2C3EE8] pt-[68px] flex items-center">
        <div className="max-w-[960px] mx-auto px-6 py-[80px] w-full">
          <h1 className="font-outfit font-extrabold text-white text-[38px] md:text-[58px] leading-[1.1] tracking-[-0.03em] max-w-[800px] reveal">
            You're too busy running your business to figure out what AI can do for you.
          </h1>
          <p className="font-sans text-white text-[18px] leading-[1.7] max-w-[540px] mt-6 reveal">
            That's exactly what j.ai does for you.
          </p>
          <div className="mt-10 reveal">
            <a href="#cta" className="inline-block bg-transparent border-2 border-white/40 text-white font-semibold text-[15px] px-[32px] py-[14px] rounded transition-all duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] active:translate-y-0 active:shadow-none">
              Book a Discovery Call
            </a>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="w-full bg-white py-[90px] min-h-[100dvh] flex items-center">
        <div className="max-w-[760px] mx-auto px-6">
          <h2 className="font-outfit font-extrabold text-[#1A1A2E] text-[40px] leading-[1.2] mb-8 reveal">
            AI is moving faster than you can keep up with.
          </h2>
          <div className="space-y-6 text-[#555566] text-[17px] leading-[1.8]">
            <p className="reveal">New tools drop every week. Everyone's talking about automation, agents, workflows. And somewhere in all that noise is something that could genuinely save your team 10 hours a week, but you don't have time to find it, test it, or figure out if it even applies to your business.</p>
            <p className="reveal">Meanwhile your competitors already have. They're running leaner, moving faster, and delivering more.</p>
            <p className="reveal">Every week you don't, the gap widens.</p>
          </div>
        </div>
      </section>

      {/* SERVICES — dark navy with hover cards */}
      <section className="w-full bg-[#0F1729] py-[120px] min-h-[100dvh] flex items-center">
        <div className="max-w-[960px] mx-auto px-6">
          <h2 className="font-outfit font-extrabold text-white text-[40px] leading-[1.2] mb-16 reveal">
            Built around how your business actually runs.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "j.ai Advisory", body: "You need someone who stays on top of the AI market so you don't have to. Every month I map what's changed, what applies to your business, and exactly what to do about it. Strategy, tool selection, workflow mapping, direct from me to you." },
              { title: "j.ai Labs", body: "When the right solution doesn't exist off the shelf, I build it. Custom automations, AI agents, and workflow tools designed around how your business actually runs. Scoped and built to deliver a specific outcome, not a generic template." },
            ].map(item => (
              <div key={item.title} className="reveal bg-white/5 border border-white/10 rounded-xl p-8 transition-all duration-200 hover:-translate-y-[3px] hover:border-white/25 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] cursor-default">
                <h3 className="font-outfit font-extrabold text-white text-[22px] mb-4">{item.title}</h3>
                <p className="text-white/70 text-[16px] leading-[1.8]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="w-full bg-[#F7F8FF] py-[90px] min-h-[100dvh] flex items-center">
        <div className="max-w-[760px] mx-auto px-6">
          <h2 className="font-outfit font-extrabold text-[#1A1A2E] text-[40px] leading-[1.2] mb-8 reveal">
            You started your business to do the work you're good at.
          </h2>
          <div className="space-y-6 text-[#555566] text-[17px] leading-[1.8]">
            <p className="reveal">Not to spend hours on tasks that slow your growth, drain your team, and pull you away from what actually matters.</p>
            <p className="reveal">AI can give you those hours back.</p>
            <p className="reveal">Every business has work that runs on people instead of systems. Repetitive, manual, time-consuming work that your team is too good to be doing. That's what AI is made for, and that's exactly where we come in.</p>
            <p className="reveal">j.ai finds it, builds it, and makes it work. Directly in your business. Around how you actually operate.</p>
          </div>
        </div>
      </section>

      {/* WHO */}
      <section className="w-full bg-[#2C3EE8] py-[120px] min-h-[100dvh] flex items-center">
        <div className="max-w-[760px] mx-auto px-6">
          <h2 className="font-outfit font-extrabold text-white text-[40px] leading-[1.2] mb-8 reveal">
            Founders and operators ready to actually implement.
          </h2>
          <p className="text-white text-[20px] leading-[1.8] reveal">
            Running businesses between 10 and 50 people who know their team is spending time on work that should not be manual anymore. You don't need to understand AI. You need the outcome. If you're serious about building a leaner, faster operation and ready to actually implement, we'll work well together.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="w-full bg-[#0F1729] py-[100px] min-h-[100dvh] flex items-center">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-outfit font-extrabold text-white text-[48px] leading-[1.1] tracking-[-0.02em] mx-auto max-w-[700px] reveal">
              Ready to see what AI can do for your business?
            </h2>
            <p className="text-white/70 text-[18px] leading-[1.7] max-w-[600px] mx-auto mt-6 reveal">
              Pick a time below. We'll discuss how your business runs, where the biggest opportunities are, and how we can use AI to solve your problems.
            </p>
          </div>
          <div id="home-cal-inline" style={{ width: "100%", height: 700, overflow: "scroll" }} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#0A0A0A] py-[60px]">
        <div className="max-w-[960px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/"><img src="/logo-blue.png" alt="j.ai" className="h-7 w-auto cursor-pointer" /></Link>
            <span className="text-white/40 text-[13px]">AI Advisory and Custom Tools for SMEs</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3">
            <a href="mailto:admin@jdotai.com" className="text-white/45 text-[13px] hover:text-white/70 transition-colors">admin@jdotai.com</a>
            <a href="https://www.linkedin.com/in/jai-dhingra/" target="_blank" rel="noopener noreferrer" className="text-white/45 hover:text-white/70 transition-colors" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <span className="text-white/25 text-[12px]">&#169; 2026 j.ai. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
