import React, { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function Home() {
  useScrollReveal();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
            AI Advisory and Custom Builds
          </div>
          
          <h1 className="font-syne font-extrabold text-white text-[36px] md:text-[56px] leading-[1.1] tracking-[-0.03em] max-w-[800px] reveal">
            You're too busy running your business to figure out what AI can do for it.
          </h1>
          
          <p className="font-sans text-jai-muted-white text-[18px] leading-[1.7] max-w-[540px] mt-6 reveal">
            j.ai works with founders and operators to find where AI fits, build what actually helps, and make sure it sticks.
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
      <section className="w-full bg-jai-pure-white py-[120px]">
        <div className="max-w-[760px] mx-auto px-6 reveal-container">
          <span className="block text-jai-cobalt font-semibold text-[11px] uppercase tracking-[0.1em] mb-4 reveal">
            The Reality
          </span>
          <h2 className="font-syne font-extrabold text-jai-dark-text text-[40px] leading-[1.2] mb-8 reveal">
            AI is moving faster than any business owner can keep up with.
          </h2>
          
          <div className="space-y-6 text-jai-muted-text text-[17px] leading-[1.8]">
            <p className="reveal">
              New tools drop every week. Everyone's talking about automation, agents, workflows. But most of it isn't built for businesses like yours. And the people selling it aren't operators — they're enthusiasts.
            </p>
            <p className="reveal">
              The gap between what AI can do and what your business is actually using is costing you time, money, and competitive edge every single month.
            </p>
            <p className="reveal">
              You don't need to become an AI expert. You need someone who already is one — and knows how to translate that into results for a business like yours.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="w-full bg-jai-navy py-[120px]">
        <div className="max-w-[900px] mx-auto px-6 reveal-container">
          <span className="block text-jai-muted-white font-semibold text-[11px] uppercase tracking-[0.1em] mb-4 reveal">
            How We Work
          </span>
          <h2 className="font-syne font-extrabold text-white text-[40px] leading-[1.2] mb-16 reveal">
            Two ways to work together.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div className="border-t-[2px] border-jai-cobalt pt-8 reveal">
              <h3 className="font-syne font-extrabold text-white text-[22px] mb-4">j.ai Advisory</h3>
              <p className="text-jai-muted-white text-[16px] leading-[1.8]">
                You need someone who stays current so you don't have to. Monthly retainer. Regular sessions. Honest guidance on what's worth your attention and what isn't. No fluff, no upsells — just a reliable thinking partner for the AI decisions your business is facing.
              </p>
            </div>
            
            <div className="border-t-[2px] border-jai-cobalt pt-8 reveal">
              <h3 className="font-syne font-extrabold text-white text-[22px] mb-4">j.ai Builds</h3>
              <p className="text-jai-muted-white text-[16px] leading-[1.8]">
                You have a specific problem. We build the specific solution. Custom AI workflows, internal tools, automations, and systems that plug into how your business actually works. Scoped projects, clear deliverables, real outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY J.AI SECTION */}
      <section className="w-full bg-jai-off-white py-[120px]">
        <div className="max-w-[760px] mx-auto px-6 reveal-container">
          <span className="block text-jai-cobalt font-semibold text-[11px] uppercase tracking-[0.1em] mb-4 reveal">
            Why j.ai
          </span>
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
              Every business has a different set of bottlenecks. We find yours, figure out where AI can move the needle, and either guide you through it or build it for you.
            </p>
            <p className="reveal">
              No theory. No hype. Just a clear-eyed look at your business and what's actually possible right now.
            </p>
          </div>
        </div>
      </section>

      {/* WHO I WORK WITH SECTION */}
      <section className="w-full bg-jai-cobalt py-[120px]">
        <div className="max-w-[760px] mx-auto px-6 reveal-container">
          <span className="block text-jai-muted-white font-semibold text-[11px] uppercase tracking-[0.1em] mb-4 reveal">
            Who This Is For
          </span>
          <h2 className="font-syne font-extrabold text-white text-[40px] leading-[1.2] mb-8 reveal">
            Founders and operators ready to actually implement.
          </h2>
          
          <p className="text-jai-muted-white text-[17px] leading-[1.8] reveal">
            Running businesses between 10 and 50 people who know their team is spending time on work that shouldn't be manual anymore. You don't need to understand AI. You need the outcome. If you're serious about implementing, not just exploring, j.ai is built for you.
          </p>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="cta" className="w-full bg-jai-navy py-[140px]">
        <div className="max-w-[900px] mx-auto px-6 text-center reveal-container">
          <h2 className="font-syne font-extrabold text-white text-[48px] leading-[1.1] tracking-[-0.02em] mx-auto max-w-[700px] reveal">
            Ready to see what AI can do for your business?
          </h2>
          
          <p className="text-jai-muted-white text-[18px] leading-[1.7] max-w-[600px] mx-auto mt-6 reveal">
            Book a call. We'll look at how your business runs, where the biggest opportunities are, and how we can use AI to solve your problems.
          </p>
          
          <div className="mt-10 reveal">
            <a 
              href="YOUR_CALENDLY_LINK"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-active-scale inline-block bg-jai-cobalt text-white font-semibold text-[15px] px-[36px] py-[16px] rounded-[4px] transition-transform"
            >
              Book a Discovery Call
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-jai-footer-bg py-[60px]">
        <div className="max-w-[900px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-0">
          
          <div className="text-center md:text-left flex flex-col items-center md:items-start gap-2">
            <span className="font-syne font-extrabold text-white text-[18px]">j.ai</span>
            <span className="text-jai-muted-white text-[13px]">AI Advisory and Custom Builds for SMEs</span>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3">
            <a 
              href="mailto:jai.ai@zohomail.in" 
              className="text-jai-muted-white text-[13px] hover:underline decoration-white/30 underline-offset-4 transition-all"
            >
              jai.ai@zohomail.in
            </a>
            
            <a 
              href="https://linkedin.com" 
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
