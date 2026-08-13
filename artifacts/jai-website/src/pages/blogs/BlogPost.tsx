import React, { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { Reveal, Wordmark, MobileSheet, EMAIL, LINKEDIN } from "@/components/shared";
import { POSTS } from "./index";

// Blog post content — Rex adds entries here when publishing via gh CLI
const CONTENT: Record<string, string> = {
  "clio-ecosystem-2026": `
Clio has evolved far beyond traditional practice management. What started as a matter management tool is now a platform — and that distinction matters if you're thinking about where AI agents sit inside a law firm's stack.

## The landscape

Clio's ecosystem in 2026 spans intake (Clio Grow), matter management (Clio Manage), document handling, time tracking, billing, and a growing marketplace of integrations. The platform has north of 150,000 legal professionals on it globally. That's not a tool — that's infrastructure.

When infrastructure reaches that scale, gaps become expensive. Workflows built around Clio still require a human to move information between the tool and the client, between the tool and the fee earner, between one matter stage and the next.

## The real opportunity

The opportunity isn't to replace Clio. The opportunity is to sit on top of it.

AI agents that read from Clio, act on what they find, and draft the communication or task that follows — without requiring a fee earner to check, notice, and do it manually — that's where the value accrues.

Hermes reads closed matters and drafts re-engagement emails. Athena reads an intake form and produces a pre-meeting brief. Hestia sends a welcome the moment a matter opens. None of these replace what Clio does. They make Clio's data do more.

## The breakdown

Every agent in the Donna system connects to Clio at a specific trigger point:

- **Matter opened** → Hestia drafts onboarding email
- **Intake form submitted** → Athena produces brief before the meeting
- **Time entry unbilled 14+ days** → Plutus nudges the fee earner internally
- **Matter closed** → Charis drafts thank-you + review ask
- **Client engagement drops** → Iris flags the relationship before it goes cold

The pattern is the same across all of them: Clio holds the data, the agent acts on it, a human approves before anything reaches a client.

## The so-what

If your firm runs on Clio, you are already sitting on the data that could run these workflows. The question isn't whether AI can do this — it's whether you've connected the data to the action yet.

Most firms haven't. Most of the time it's not a technology problem — it's an integration problem. The tools exist. The connections aren't built.

**If you work in LegalTech, LegalOps, or run a Clio-connected firm:** this is the gap worth understanding now, not later. The firms that build these connections in the next 12 months will run materially leaner than the ones that don't.
  `.trim(),
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function renderContent(md: string) {
  const lines = md.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      elements.push(<h2 key={i}>{line.slice(3)}</h2>);
    } else if (line.startsWith("**") && line.endsWith("**")) {
      const inner = line.slice(2, -2);
      elements.push(<p key={i}><strong>{inner}</strong></p>);
    } else if (line.startsWith("- **")) {
      const match = line.match(/^- \*\*(.+?)\*\* → (.+)$/);
      if (match) {
        elements.push(<li key={i}><strong>{match[1]}</strong>{" → "}{match[2]}</li>);
      } else {
        elements.push(<li key={i}>{line.slice(2)}</li>);
      }
    } else if (line.trim() === "") {
      // skip blank
    } else {
      elements.push(<p key={i}>{line}</p>);
    }
    i++;
  }
  return elements;
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const [menu, setMenu] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const post = POSTS.find((p) => p.slug === slug);
  const content = CONTENT[slug];

  if (!post || !content) {
    return (
      <div className="blog-root">
        <div className="l-mast">
          <div className="in"><Wordmark /><div className="nav"><Link href="/">Work</Link><Link href="/legal">Legal</Link><Link href="/blog">Blog</Link></div></div>
        </div>
        <section className="blog-hero">
          <div className="wrap">
            <Reveal as="h1">Post not found.</Reveal>
            <Reveal><Link href="/blog" className="btn btn-line" style={{ marginTop: 32, display: "inline-block" }}>← Back to blog</Link></Reveal>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="blog-root">
      <div className="l-mast">
        <div className="in">
          <Wordmark />
          <div className="nav">
            <Link href="/">Work</Link>
            <Link href="/legal">Legal</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <button className="hamb" onClick={() => setMenu(true)} aria-label="Open menu" style={{ color: "var(--paper)" }}><span /><span /><span /></button>
        </div>
      </div>
      <MobileSheet open={menu} onClose={() => setMenu(false)} dark links={[
        { label: "Work", href: "/" },
        { label: "Legal", href: "/legal" },
        { label: "Blog", href: "/blog" },
      ]} />

      <article className="blog-article">
        <div className="wrap">
          <Reveal>
            <Link href="/blog" className="blog-back">← Blog</Link>
          </Reveal>
          <Reveal className="blog-article-top">
            <span className="blog-cat">{post.category}</span>
            <span className="blog-read">{post.readTime}</span>
            <span className="blog-date">{formatDate(post.date)}</span>
          </Reveal>
          <Reveal as="h1" className="blog-article-title">{post.title}</Reveal>
          <Reveal as="p" className="blog-article-excerpt">{post.excerpt}</Reveal>
          <Reveal>
            <div className="blog-divider" />
          </Reveal>
          <Reveal>
            <div className="blog-body">
              {renderContent(content)}
            </div>
          </Reveal>
          <Reveal>
            <div className="blog-footer-cta">
              <p>Questions? Thinking about this for your firm?</p>
              <a href="mailto:admin@jdotai.com" className="btn btn-solid">Get in touch</a>
            </div>
          </Reveal>
        </div>
      </article>

      <footer>
        <div className="in">
          <div>
            <Wordmark className="mk" />
            <div className="tag">AI agents for legal firms</div>
          </div>
          <div className="r">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="li-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <span className="cp">© 2026 j.ai</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
