import React, { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const CALENDLY_URL = "https://calendly.com/jai-ai-zohomail";
const CALENDLY_EMBED_URL =
  "https://calendly.com/jai-ai-zohomail?background_color=0f1729&text_color=ffffff&primary_color=2c3ee8&hide_event_type_details=1&hide_gdpr_banner=1";

function injectCalendlyScript() {
  if (document.getElementById("calendly-script")) return;
  const script = document.createElement("script");
  script.id = "calendly-script";
  script.src = "https://assets.calendly.com/assets/external/widget.js";
  script.async = true;
  document.head.appendChild(script);
}

export default function Home() {
  useScrollReveal();
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pre-load Calendly script when user reaches the "Who I Work With" section
  // so the inline embed is fully ready by the time they scroll to the CTA
  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          injectCalendlyScript();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
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
          <a
            href="#cta"
            className="btn-active-scale border border-white text-white bg-transparent rounded-[4px] px-[20px] py-[8px] text-[14px] font-semibold transition-colors hover:bg-white/5"
          >
            Book a Call
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative w-full min-h-[100dvh] bg-jai-cobalt pt-[64px] flex items-center">
        <div className="max-w-[900px] mx-auto px-6 w-full reveal-container">
          <div className="inline-block border border-white text-jai-muted-white rounded-[20px] px-[16px] py-[10px] text-[11px] tracking-[0.08em] uppercase mb-8 reveal">
            AI Advisory and Custom Tools
          </div>

          <h1 className="font-syne font-extrabold text-white text-[36px] md:text-[56px] leading-[1.1] tracking-[-0.03em] max-w-[800px] reveal">
            You're too busy running your business to figure out what AI can do for you.
          </h1>

          <p className="font-sans text-jai-muted-white text-[18px] leading-[1.7] max-w-[540px] mt-6 reveal">
            That's exactly what j.ai does for you.
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

      {/* PROBLEM SECTION */}
      <section className="w-full bg-jai-pure-white py-[60px]">
        <div className="max-w-[760px] mx-auto px-6 reveal-container">
          <h2 className="font-syne font-extrabold text-jai-dark-text text-[40px] leading-[1.2] mb-8 reveal">
            AI is moving faster than you can keep up with.
          </h2>

          <div className="space-y-6 text-jai-muted-text text-[17px] leading-[1.8]">
            <p className="reveal">
              New tools drop every week. Everyone's talking about automation, agents, workflows. And somewhere in all that noise is something that could genuinely save your team 10 hours a week, but you don't have time to find it, test it, or figure out if it even applies to your business.
            </p>
            <p className="reveal">
              Meanwhile your competitors already have. They're running leaner, moving faster, and delivering more.
            </p>
            <p className="reveal">
              Every week you don't, the gap widens.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="w-full bg-jai-navy py-[120px]">
        <div className="max-w-[900px] mx-auto px-6 reveal-container">
          <h2 className="font-syne font-extrabold text-white text-[40px] leading-[1.2] mb-16 reveal">
            Built around how your business actually runs.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div className="border-t-[2px] border-jai-cobalt pt-8 reveal">
              <h3 className="font-syne font-extrabold text-white text-[22px] mb-4">j.ai Advisory</h3>
              <p className="text-jai-muted-white text-[16px] leading-[1.8]">
                You need someone who stays on top of the AI market so you don't have to. Every month I map what's changed, what applies to your business, and exactly what to do about it. Strategy, tool selection, workflow mapping, direct from me to you, with full attention on your business.
              </p>
            </div>

            <div className="border-t-[2px] border-jai-cobalt pt-8 reveal">
              <h3 className="font-syne font-extrabold text-white text-[22px] mb-4">j.ai Labs</h3>
              <p className="text-jai-muted-white text-[16px] leading-[1.8]">
                When the right solution doesn't exist off the shelf, I build it. Custom automations, AI agents, and workflow tools designed around how your business actually runs. Scoped and built to deliver a specific outcome, not a generic template dropped into your operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY J.AI SECTION */}
      <section className="w-full bg-jai-off-white py-[60px]">
        <div className="max-w-[760px] mx-auto px-6 reveal-container">
          <h2 className="font-syne font-extrabold text-jai-dark-text text-[40px] leading-[1.2] mb-8 reveal">
            You started your business to do the work you're good at.
          </h2>

          <div className="space-y-6 text-jai-muted-text text-[17px] leading-[1.8]">
            <p className="reveal">
              Not to spend hours on tasks that slow your growth, drain your team, and pull you away from what actually matters.
            </p>
            <p className="reveal">
              AI can give you those hours back.
            </p>
            <p className="reveal">
              Every business has work that runs on people instead of systems. Repetitive, manual, time-consuming work that your team is too good to be doing. That's what AI is made for, that's where it belongs, and that's exactly where we come in.
            </p>
            <p className="reveal">
              j.ai finds it, builds it, and makes it work. Directly in your business. Around how you actually operate.
            </p>
          </div>
        </div>
      </section>

      {/* WHO I WORK WITH SECTION — also acts as Calendly pre-load trigger */}
      <section ref={triggerRef} className="w-full bg-jai-cobalt py-[120px]">
        <div className="max-w-[760px] mx-auto px-6 reveal-container">
          <h2 className="font-syne font-extrabold text-white text-[40px] leading-[1.2] mb-8 reveal">
            Founders and operators ready to actually implement.
          </h2>

          <p className="text-[20px] leading-[1.8] reveal" style={{ color: "rgba(255,255,255,0.75)" }}>
            Running businesses between 10 and 50 people who know their team is spending time on work that shouldn't be manual anymore. You don't need to understand AI. You need the outcome. If you're serious about building a leaner, faster operation and ready to actually implement, we'll work well together.
          </p>
        </div>
      </section>

      {/* CTA SECTION — inline Calendly embed */}
      <section id="cta" className="w-full bg-jai-navy py-[100px]">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-12 reveal-container">
            <h2 className="font-syne font-extrabold text-white text-[48px] leading-[1.1] tracking-[-0.02em] mx-auto max-w-[700px] reveal">
              Ready to see what AI can do for your business?
            </h2>
            <p className="text-jai-muted-white text-[18px] leading-[1.7] max-w-[600px] mx-auto mt-6 reveal">
              Pick a time below. We'll discuss how your business runs, where the biggest opportunities are, and how we can use AI to solve your problems.
            </p>
          </div>

          {/* Calendly inline embed */}
          <div
            className="calendly-inline-widget w-full rounded-[4px] overflow-hidden"
            data-url={CALENDLY_EMBED_URL}
            style={{ minWidth: 320, height: 700 }}
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
              href="mailto:jai.ai@zohomail.in"
              className="text-jai-muted-white text-[13px] hover:underline decoration-white/30 underline-offset-4 transition-all"
            >
              jai.ai@zohomail.in
            </a>

            <a
              href="https://www.linkedin.com/company/jai-ai"
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
