import React, { useState } from "react";
import { Link } from "wouter";
import { Reveal, Wordmark, MobileSheet, CAL_EMBED, LINKEDIN, EMAIL } from "@/components/shared";

const COMING = ["HR", "Recruitment", "Insurance", "Real Estate", "Finance"];

export default function Home() {
  const [menu, setMenu] = useState(false);

  return (
    <div>
      {/* MASTHEAD */}
      <div className="h-mast">
        <div className="in">
          <Wordmark />
          <div className="nav">
            <a className="live">Work</a>
            <Link href="/legal">Legal</Link>
            <a href="#book">Book a call</a>
          </div>
          <button className="hamb" onClick={() => setMenu(true)} aria-label="Open menu"><span/><span/><span/></button>
        </div>
      </div>
      <MobileSheet open={menu} onClose={() => setMenu(false)} links={[
        { label: "Work", href: "/" },
        { label: "Legal", href: "/legal" },
        { label: "Book a call", href: "/#book", solid: true },
      ]} />

      {/* HERO */}
      <section className="h-hero">
        <div className="wrap">
          <Reveal className="eyebrow">AI advisory &amp; custom builds · for SMEs</Reveal>
          <Reveal as="h1">New AI tools land every week. You don't have time to work out which ones matter.</Reveal>
          <Reveal as="p" className="lede">j.ai finds the work in your business that still runs on people instead of systems, and builds the tools that take it off your plate.</Reveal>
          <Reveal className="go">
            <a href="#book" className="btn btn-solid">Book a discovery call</a>
            <Link href="/legal" className="txt">See the legal agents →</Link>
          </Reveal>
        </div>
      </section>

      {/* THE GAP */}
      <section className="h-gap">
        <div className="wrap">
          <div className="grid">
            <Reveal as="h2">The gap is quiet, and it widens.</Reveal>
            <div>
              <Reveal as="p">Somewhere in the noise is a tool that could give your team ten hours back a week. Finding it, testing it, and proving it fits your business takes time you don't have.</Reveal>
              <Reveal as="p">Your competitors already found theirs. They run leaner, move faster, and deliver more.</Reveal>
              <Reveal as="p" className="pull">Every week you wait, the gap widens.</Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* TWO OFFERS */}
      <section className="h-offer">
        <div className="wrap">
          <Reveal as="h2">Two ways to work with j.ai.</Reveal>
          <Reveal as="p" className="lead">One keeps you ahead of the market. The other builds what the market doesn't sell.</Reveal>
          <Reveal className="row">
            <div className="no">01</div>
            <div>
              <h3>j.ai Advisory</h3>
              <p>Someone whose job is to stay ahead of the AI market so you don't have to. Every month, a clear map of what changed, what applies to your business, and exactly how to use it.</p>
            </div>
          </Reveal>
          <Reveal className="row">
            <div className="no">02</div>
            <div>
              <h3>j.ai Labs</h3>
              <p>When the tool you need doesn't exist yet, we build it. Custom automations and AI agents, shaped around how your business actually runs.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="h-how">
        <div className="wrap">
          <Reveal as="h2">Find it. Build it. Run it.</Reveal>
          <Reveal className="steps3">
            <div className="s"><div className="k">01 · Find</div><h4>Find the work</h4><p>We sit with how your business runs and find the repetitive, manual work your team is too good to be doing.</p></div>
            <div className="s"><div className="k">02 · Build</div><h4>Build the tool</h4><p>We build the automation or agent that handles it, wired into the tools you already use.</p></div>
            <div className="s"><div className="k">03 · Run</div><h4>Run it live</h4><p>It runs inside your business, with you in control of every output it produces.</p></div>
          </Reveal>
        </div>
      </section>

      {/* WHY */}
      <section className="h-why">
        <div className="wrap">
          <div className="grid">
            <Reveal as="h2">You started your business to do the work you're good at.</Reveal>
            <div>
              <Reveal as="p">Not to lose hours to tasks that slow your growth and pull your team away from the real thing.</Reveal>
              <Reveal as="p" className="beat">AI can give those hours back.</Reveal>
              <Reveal as="p">That's the whole job. We find the work that should run on systems, build the thing that runs it, and hand you back the time.</Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="h-cta" id="book">
        <div className="wrap">
          <div className="grid">
            <div>
              <Reveal as="h2">See what AI could take off your plate.</Reveal>
              <Reveal as="p" className="p">A 30-minute call. We look at how your business runs, where the time goes, and where AI actually fits.</Reveal>
            </div>
            <Reveal className="book">
              <div className="r"><span>Discovery call</span><b>30 min · free</b></div>
              <div className="r"><span>Format</span><b>Video, one to one</b></div>
              <div className="r"><span>You leave with</span><b>A map of where AI fits</b></div>
              <a href="#book" className="btn btn-solid">Book a discovery call</a>
            </Reveal>
          </div>
          <Reveal style={{ marginTop: "clamp(30px,5vw,56px)" }}>
            <iframe src={CAL_EMBED} style={{ width: "100%", height: 680, border: "none", borderRadius: 4, background: "var(--paper)" }} title="Book a call" />
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="in">
          <div>
            <Wordmark className="mk" />
            <div className="tag">AI advisory and custom tools for SMEs</div>
            <div className="fnav">
              {COMING.map(c => <span key={c}>{c} · soon</span>)}
            </div>
          </div>
          <div className="r">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span className="cp">© 2026 j.ai</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
