import React, { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Reveal, Wordmark, MobileSheet, LINKEDIN } from "@/components/shared";
import { RevealHeading, NavLinks, NavCta, FooterEmail } from "@/components/interactive";
import AnimatedTabs from "@/components/smoothui/animated-tabs";
import AnimatedInput from "@/components/smoothui/animated-input";
import { Spotlight } from "@/components/amicro/spotlight";
import { POSTS, CONTENT } from "./posts";
import type { BlogPost } from "./posts";

export { POSTS, CONTENT };
export type { BlogPost };

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const ALL = "All";

export default function BlogIndex() {
  const [menu, setMenu] = useState(false);
  const [cat, setCat] = useState(ALL);
  const [q, setQ] = useState("");
  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    document.title = "Blogs — AI implementation for law firms | j.ai";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", "Practical writing on AI implementation, workflow automation and client intake for solo and small law firms.");
  }, []);

  const categories = useMemo(() => {
    const seen = new Set(POSTS.map(p => p.category));
    return [ALL, ...[...seen].sort()];
  }, []);

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    return POSTS.filter(p =>
      (cat === ALL || p.category === cat) &&
      (!term || `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(term))
    );
  }, [cat, q]);

  // ⌘K / Ctrl+K or "/" jumps to search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, select");
      if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !typing)) {
        e.preventDefault();
        document.querySelector<HTMLInputElement>(".blog-search input")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="blog-root">
      <div className="h-mast">
        <div className="in">
          <Wordmark />
          <div className="nav">
            <NavLinks current="/blogs" />
            <NavCta />
          </div>
          <button className="hamb" onClick={() => setMenu(true)} aria-label="Open menu"><span /><span /><span /></button>
        </div>
      </div>
      <MobileSheet open={menu} onClose={() => setMenu(false)} dark links={[
        { label: "Home", href: "/" },
        { label: "Legal", href: "/donna" },
        { label: "Blogs", href: "/blogs" },
      ]} />

      <section className="blog-hero">
        <div className="wrap">
          <RevealHeading as="h1" text="Blogs." />
          <Reveal as="p" className="blog-lede">
            Practical notes on AI implementation, workflow automation and client intake for solo and small law firms.
          </Reveal>
        </div>
      </section>

      <section className="blog-list">
        <div className="wrap">
          <div className="blog-tools">
            <AnimatedTabs
              className="blog-tabs"
              variant="pill"
              tabs={categories.map(c => ({ id: c, label: c }))}
              activeTab={cat}
              onChange={setCat}
            />
            <AnimatedInput
              className="blog-search"
              label="Search posts  ⌘K"
              placeholder="Intake, Clio, automation…"
              value={q}
              onChange={setQ}
            />
          </div>

          {visible.length === 0 ? (
            <div className="blog-empty"><p>{q ? "No posts match that search." : "Nothing in this category yet."}</p></div>
          ) : (
            <div className="blog-grid">
              {visible.map((p) => (
                <Link key={p.slug} href={`/blogs/${p.slug}`} className="blog-card-link">
                  <Spotlight className="blog-card" glowColor="rgba(122,46,59,0.09)" glowSize={300}>
                  <div className="blog-card-top">
                    <span className="blog-cat">{p.category}</span>
                    <span className="blog-read">{p.readTime}</span>
                  </div>
                  <h2 className="blog-title">{p.title}</h2>
                  <p className="blog-excerpt">{p.excerpt}</p>
                  <div className="blog-meta">{formatDate(p.date)}</div>
                  </Spotlight>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="h-footer">
        <div className="in">
          <div>
            <Wordmark className="mk" />
            <div className="tag">AI advisory and custom tools</div>
          </div>
          <div className="r">
            <FooterEmail />
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="li-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <span className="cp">© 2026 j.ai — Jai Dhingra</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
