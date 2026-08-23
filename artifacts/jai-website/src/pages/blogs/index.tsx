import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Reveal, Wordmark, MobileSheet, EMAIL, LINKEDIN } from "@/components/shared";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  readTime: string;
}

export const POSTS: BlogPost[] = [
  {
    slug: "legaltech-consolidation-wave",
    title: "Legal Tech's Consolidation Wave Is Here",
    date: "2026-08-13",
    category: "LegalTech",
    excerpt: "Three acquisitions landed in the space of a few weeks. Here's what legal tech's consolidation wave means if you're the one buying software right now.",
    readTime: "5 min read",
  },
  {
    slug: "clio-ecosystem-2026",
    title: "The Clio Ecosystem in 2026: Where the Opportunity Actually Lives",
    date: "2026-08-13",
    category: "LegalTech",
    excerpt: "Clio has evolved far beyond practice management. Here's the full picture of what the ecosystem looks like — and where the gaps are that AI agents can fill.",
    readTime: "6 min read",
  },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogIndex() {
  const [menu, setMenu] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="blog-root">
      <div className="l-mast">
        <div className="in">
          <Wordmark />
          <div className="nav">
            <Link href="/">Work</Link>
            <Link href="/legal">Legal</Link>
            <a className="live">Blog</a>
          </div>
          <button className="hamb" onClick={() => setMenu(true)} aria-label="Open menu" style={{ color: "var(--paper)" }}><span /><span /><span /></button>
        </div>
      </div>
      <MobileSheet open={menu} onClose={() => setMenu(false)} dark links={[
        { label: "Work", href: "/" },
        { label: "Legal", href: "/legal" },
        { label: "Blog", href: "/blog" },
      ]} />

      <section className="blog-hero">
        <div className="wrap">
          <Reveal className="eyebrow" style={{ color: "var(--accent-on-dark)" }}>j.ai · thinking out loud</Reveal>
          <Reveal as="h1">The blog.</Reveal>
          <Reveal as="p" className="blog-lede">LegalTech analysis, AI agent breakdowns, and founder notes from building jdotai.</Reveal>
        </div>
      </section>

      <section className="blog-list">
        <div className="wrap">
          {POSTS.length === 0 ? (
            <Reveal>
              <div className="blog-empty">
                <div className="blog-empty-icon">✦</div>
                <p>First posts incoming. Atlas is already researching.</p>
              </div>
            </Reveal>
          ) : (
            <div className="blog-grid">
              {POSTS.map((p) => (
                <Reveal key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="blog-card">
                    <div className="blog-card-top">
                      <span className="blog-cat">{p.category}</span>
                      <span className="blog-read">{p.readTime}</span>
                    </div>
                    <h2 className="blog-title">{p.title}</h2>
                    <p className="blog-excerpt">{p.excerpt}</p>
                    <div className="blog-meta">{formatDate(p.date)}</div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

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
