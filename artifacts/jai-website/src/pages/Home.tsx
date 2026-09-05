import React, { useState } from "react";
import { Link } from "wouter";
import { Reveal, Wordmark, MobileSheet, LINKEDIN, EMAIL } from "@/components/shared";

export default function Home() {
  const [menu, setMenu] = useState(false);

  return (
    <div>
      {/* MASTHEAD */}
      <div className="h-mast">
        <div className="in">
          <Wordmark />
          <div className="nav">
            <span className="live" aria-current="page">Home</span>
            <Link href="/donna">Legal</Link>
            <Link href="/blogs">Blogs</Link>
            <a href="/donna#contact" className="nav-cta">Contact us</a>
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
      <section className="h-hero">
        <div className="wrap">
          <Reveal as="h1">New AI tools land every week. You don’t have time to work out which ones matter.</Reveal>
          <Reveal as="p" className="lede">j.ai finds the work in your business that still runs on people instead of systems, and builds the tools that take it off your plate.</Reveal>
          <Reveal className="go">
            <Link href="/donna" className="btn btn-solid">See donna</Link>
          </Reveal>
        </div>
      </section>

      {/* THE GAP */}
      <section className="h-gap">
        <div className="wrap">
          <div className="grid">
            <Reveal as="h2">The gap is quiet, and it widens.</Reveal>
            <Reveal>
              <p>Somewhere in the noise is a tool that could give your team ten hours back a week. Finding it, testing it, and proving it fits your business takes time you don’t have.</p>
              <p>Your competitors already found theirs. They run leaner, move faster, and deliver more.</p>
              <p className="pull">Every week you wait, the gap widens.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TWO OFFERS */}
      <section className="h-offer">
        <div className="wrap">
          <Reveal as="h2">Two ways to work with j.ai.</Reveal>
          <div className="row">
            <div className="no">01</div>
            <div>
              <h3>j.ai Advisory</h3>
              <p>Someone whose job is to stay ahead of the AI market so you don’t have to. Every month, a clear map of what changed, what applies to your business, and exactly how to use it.</p>
            </div>
          </div>
          <div className="row">
            <div className="no">02</div>
            <div>
              <h3>j.ai Labs</h3>
              <p>When the tool you need doesn’t exist yet, we build it. Custom automations and AI agents, shaped around how your business actually runs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="h-how">
        <div className="wrap">
          <Reveal as="h2">We strongly believe AI is here to do the work you don’t want, so you can do the work you were meant for.</Reveal>
          <Reveal className="steps3">
            <div className="s">
              <div className="how-num">01</div>
              <h4>We find what drains you</h4>
              <p>The repetitive, manual work your team is too good to be doing. We find it.</p>
            </div>
            <div className="s">
              <div className="how-num">02</div>
              <h4>We build what replaces it</h4>
              <p>An automation or agent that takes it on, wired into the tools you already use.</p>
            </div>
            <div className="s">
              <div className="how-num">03</div>
              <h4>You get your time back</h4>
              <p>It runs inside your business, you stay in control, and the hours return to work that matters.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY */}
      <section className="h-why">
        <div className="wrap">
          <div className="grid">
            <Reveal as="h2">You started your business to do the work you’re good at.</Reveal>
            <Reveal>
              <p>Not to lose hours to tasks that slow your growth and pull your team away from the real thing.</p>
              <p className="beat">AI can give those hours back.</p>
              <p>We find the work that should run on systems, build the thing that runs it, and hand you back the time.</p>
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
            <div className="tag">AI advisory and custom tools</div>
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
