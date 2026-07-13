import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

function initCalEmbed() {
  if ((window as any).__calInitDone) return;
  (window as any).__calInitDone = true;

  (function (C: any, A: string, L: string) {
    const p = (a: any, ar: any) => a.q.push(ar);
    const d = C.document;
    C.Cal = C.Cal || function (...args: any[]) {
      const cal = C.Cal;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement("script")).src = A;
        cal.loaded = true;
      }
      if (args[0] === L) {
        const api: any = (...a: any[]) => p(api, a);
        const namespace = args[1];
        api.q = api.q || [];
        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], args);
          p(cal, ["initNamespace", namespace]);
        } else p(cal, args);
        return;
      }
      p(cal, args);
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");

  const Cal = (window as any).Cal;
  Cal("init", "discovery-call", { origin: "https://app.cal.com" });
  Cal.config = Cal.config || {};
  Cal.config.forwardQueryParams = true;

  Cal.ns["discovery-call"]("inline", {
    elementOrSelector: "#legal-cal-inline-discovery-call",
    config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
    calLink: "jai.ai/discovery-call",
  });

  Cal.ns["discovery-call"]("ui", {
    hideEventTypeDetails: false,
    layout: "month_view",
  });
}

const agents = [
  {
    name: "Hermes",
    subtitle: "Past Client Reactivation",
    desc: "Reads your closed matter history and drafts a personalised re-engagement email for clients who haven't been contacted in over 12 months.",
    trigger: "Runs daily",
    output: "Draft re-engagement email, one-click lawyer approval",
  },
  {
    name: "Athena",
    subtitle: "Pre-Meeting Brief Generator",
    desc: "Reads every intake form the moment it's submitted, pulls prior matter history, and generates a structured brief before the meeting even starts.",
    trigger: "Intake form submitted",
    output: "Brief delivered within 90 seconds",
  },
  {
    name: "Hestia",
    subtitle: "New Client Welcome Email",
    desc: "Drafts a warm, personalised welcome email referencing the client's specific situation the moment a new client is confirmed.",
    trigger: "New client confirmed",
    output: "Draft welcome email queued for approval",
  },
  {
    name: "Plutus",
    subtitle: "Unbilled Time & WIP Chaser",
    desc: "Scans every open matter for unbilled time and sends each fee earner a clean weekly summary of what's sitting unbilled.",
    trigger: "Weekly, Monday 7am",
    output: "Internal nudge email per fee earner",
  },
  {
    name: "Charis",
    subtitle: "Post-Matter Referral & Review",
    desc: "Drafts a thank-you email with a natural review ask and referral line 7 days after a matter closes, while the relationship is still warm.",
    trigger: "7 days after matter closes",
    output: "Draft thank-you + review ask, queued for approval",
  },
  {
    name: "Apollo",
    subtitle: "Cross-Sell Intelligence",
    desc: "Matches every client's matter history against a service opportunity matrix and drafts targeted cross-sell outreach for the gaps it finds.",
    trigger: "Weekly",
    output: "Draft cross-sell email per opportunity, queued for approval",
  },
];

export default function Legal() {
  useScrollReveal();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    initCalEmbed();
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans text-jai-dark-text bg-jai-off-white selection:bg-jai-cobalt selection:text-white">

      {/* NAV */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-jai-cobalt ${
          scrolled ? "border-b border-white/15" : "border-b border-transparent"
        }`}
      >
        <div className="max-w-[900px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <span className="font-syne font-extrabold text-[20px] text-white tracking-tight">j.ai</span>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-white/70 text-[14px] hover:text-white transition-colors"
            >
              Home
            </Link>
            <a
              href="#cta"
              className="btn-active-scale border border-white text-white bg-transparent rounded-[4px] px-[20px] py-[8px] text-[14px] font-semibold transition-colors hover:bg-white/5"
            >
              Book a Call
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative w-full min-h-[100dvh] bg-jai-cobalt pt-[64px] flex items-center">
        <div className="max-w-[900px] mx-auto px-6 w-full reveal-container">
          <div className="inline-block border border-white text-jai-muted-white rounded-[20px] px-[16px] py-[10px] text-[11px] tracking-[0.08em] uppercase mb-8 reveal">
            For Law Firms
          </div>

          <h1 className="font-syne font-extrabold text-white text-[36px] md:text-[56px] leading-[1.1] tracking-[-0.03em] max-w-[800px] reveal">
            Built for law firms.
          </h1>

          <p className="font-sans text-jai-muted-white text-[18px] leading-[1.7] max-w-[600px] mt-6 reveal">
            AI agents that run in draft mode for 2–3 weeks with every new firm. Nothing sends to a client without a lawyer approving it first. Works with Smokeball and Clio.
          </p>

          <div className="mt-10 reveal">
            <a
              href="#cta"
              className="btn-active-scale inline-block bg-jai-cobalt border-[2px] border-white/30 text-white font-semibold text-[15px] px-[32px] py-[14px] rounded-[4px] transition-colors hover:bg-white/5"
            >
              Book a Discovery Call
            </a>
          </div>
        </div>
      </section>

      {/* AGENT GRID */}
      <section className="w-full bg-jai-pure-white py-[120px]">
        <div className="max-w-[900px] mx-auto px-6 reveal-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {agents.map((agent) => (
              <div key={agent.name} className="border-t-[2px] border-jai-cobalt pt-8 reveal">
                <h3 className="font-syne font-extrabold text-jai-dark-text text-[20px] leading-tight">
                  {agent.name}
                </h3>
                <p className="text-jai-cobalt text-[13px] font-semibold tracking-wide uppercase mt-1 mb-4">
                  {agent.subtitle}
                </p>
                <p className="text-jai-muted-text text-[15px] leading-[1.7] mb-6">
                  {agent.desc}
                </p>
                <div className="space-y-2">
                  <p className="text-[13px] text-jai-dark-text">
                    <span className="font-semibold">Trigger</span>
                    <span className="text-jai-muted-text"> — {agent.trigger}</span>
                  </p>
                  <p className="text-[13px] text-jai-dark-text">
                    <span className="font-semibold">Output</span>
                    <span className="text-jai-muted-text"> — {agent.output}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="w-full bg-jai-navy py-[100px]">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-12 reveal-container">
            <h2 className="font-syne font-extrabold text-white text-[48px] leading-[1.1] tracking-[-0.02em] mx-auto max-w-[700px] reveal">
              Ready to put these agents to work in your firm?
            </h2>
            <p className="text-jai-muted-white text-[18px] leading-[1.7] max-w-[600px] mx-auto mt-6 reveal">
              Pick a time below. We'll walk through your workflows and which agents make sense to start with.
            </p>
          </div>

          <div
            id="legal-cal-inline-discovery-call"
            style={{ width: "100%", height: 700, overflow: "scroll" }}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-jai-footer-bg py-[60px]">
        <div className="max-w-[900px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-0">

          <div className="text-center md:text-left flex flex-col items-center md:items-start gap-2">
            <span className="font-syne font-extrabold text-white text-[18px]">j.ai</span>
            <span className="text-jai-muted-white text-[13px]">AI Advisory and Custom Tools for SMEs</span>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <a
              href="mailto:admin@jdotai.com"
              className="text-jai-muted-white text-[13px] hover:underline decoration-white/30 underline-offset-4 transition-all"
            >
              admin@jdotai.com
            </a>

            <a
              href="https://www.linkedin.com/in/jai-dhingra/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-jai-muted-white hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            <span className="text-jai-muted-white text-[12px] mt-1">
              &copy; 2026 j.ai. All rights reserved.
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
