import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Reveal, Wordmark, MobileSheet, WEBHOOK_URL, LINKEDIN, EMAIL } from "@/components/shared";
import DonnaConsole from "@/components/DonnaConsole";

const FAQS = [
  { q: "What practice management systems does donna connect to?", a: "Clio, Smokeball, Actionstep, MyLegalCase, and LEAP. We're actively expanding the list - if yours isn't there yet, get in touch." },
  { q: "How long does it take to get set up?", a: "One onboarding call. We collect your details, configure donna for your firm, and you're live within a week." },
  { q: "Do my clients need to create an account?", a: "No. Clients receive a link to the intake form. They fill it in - no login, no password, no friction." },
  { q: "Can I customise the intake form fields?", a: "Yes. Every intake form is built around your practice areas and the information you actually need. You control what's required and what's optional." },
  { q: "How does the MCP connector work?", a: "donna exposes a secure MCP endpoint that your AI assistant (Claude, ChatGPT, or a self-hosted model) connects to. It can then read and write to your PMS in real time, without you having to context-switch." },
];

const PMS_BLOCKS = ["Clio", "Smokeball", "Actionstep", "MyLegalCase", "LEAP"];
const AI_BLOCKS = [
  { label: "Claude"},
  { label: "ChatGPT"},
  { label: "Kimi", note: "Self-hosted" },
];

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
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      {/* MASTHEAD */}
      <div className="h-mast">
        <div className="in">
          <Wordmark />
          <div className="nav">
            <Link href="/">Home</Link>
            <a className="live">donna</a>
          </div>
          <button className="hamb" onClick={() => setMenu(true)} aria-label="Open menu"><span/><span/><span/></button>
        </div>
      </div>
      <MobileSheet open={menu} onClose={() => setMenu(false)} links={[
        { label: "Home", href: "/" },
        { label: "donna", href: "/donna" },
      ]} />

      {/* HERO */}
      <section className="d-hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <Reveal><div className="donna-logo">donna.</div></Reveal>
              <div className="hero-num-list">
                <Reveal className="hero-num-item">
                  <b>1.</b>
                  <span>A custom intake form that collects exactly what your firm needs - and syncs it straight to your practice management system.</span>
                </Reveal>
                <Reveal className="hero-num-item">
                  <b>2.</b>
                  <span>An MCP connector that gives your AI assistant live read/write access to your PMS - so it can actually do the work, not just talk about it.</span>
                </Reveal>
              </div>
              <Reveal className="go">
                <a href="#donna" className="btn btn-solid">Try the demo</a>
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

      {/* DEMO - console placeholder */}
      <section className="demo-section" id="donna">
        <div className="wrap">
          <div className="demo-heading">Try donna.</div>
          <DonnaConsole />
        </div>
      </section>

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
              <p>They get a link. No account, no login. They fill it in on any device.</p>
            </div>
            <div className="s">
              <h4>Syncs with your legal software</h4>
              <p>Submissions go straight into your PMS. No copy-paste, no double handling.</p>
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
                  <p>We'll be in touch within 24 hours.</p>
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
                    <option>MyLegalCase</option>
                    <option>LEAP</option>
                    <option>Other</option>
                  </select>
                  <label className="fl">Primary practice area</label>
                  <select className="fi" value={form.area} onChange={set("area")}>
                    <option value="">Select practice area</option>
                    <option>Family Law</option>
                    <option>Criminal Law</option>
                    <option>Estate Planning</option>
                    <option>Conveyancing</option>
                    <option>Corporate</option>
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
          <Reveal as="h2">Stop doing work that shouldn't need you.</Reveal>
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
            <span className="cp">© 2026 j.ai</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
