import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "wouter";
import { Reveal, Wordmark, MobileSheet, EMAIL, LINKEDIN } from "@/components/shared";
import { POSTS, CONTENT } from "./posts";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

// Inline **bold** inside a line of prose.
function inline(text: string, key: string | number): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  if (parts.length === 1) return text;
  return (
    <React.Fragment key={key}>
      {parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p))}
    </React.Fragment>
  );
}

function renderContent(md: string) {
  const lines = md.split("\n");
  const out: React.ReactNode[] = [];
  let bullets: React.ReactNode[] = [];
  let ordered: React.ReactNode[] = [];

  const flush = () => {
    if (bullets.length) { out.push(<ul key={`u${out.length}`}>{bullets}</ul>); bullets = []; }
    if (ordered.length) { out.push(<ol key={`o${out.length}`}>{ordered}</ol>); ordered = []; }
  };

  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;

    if (line.startsWith("## ")) {
      flush();
      const text = line.slice(3);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      out.push(<h2 key={i} id={id}>{inline(text, i)}</h2>);
      return;
    }
    // "> CTA: <label> →" is an in-content call to action from the handoff,
    // not body copy. Render it as a real link.
    const cta = line.match(/^>\s*CTA:\s*(.+?)\s*→?\s*$/i);
    if (cta) {
      flush();
      out.push(
        <p key={i} className="blog-inline-cta">
          <Link href="/donna">{cta[1]} →</Link>
        </p>
      );
      return;
    }
    if (line.startsWith("> ")) {
      flush();
      out.push(<blockquote key={i}>{inline(line.slice(2), i)}</blockquote>);
      return;
    }
    if (line.startsWith("- ")) {
      if (ordered.length) flush();
      bullets.push(<li key={i}>{inline(line.slice(2), i)}</li>);
      return;
    }
    const num = line.match(/^(\d+)\.\s+(.*)$/);
    if (num) {
      if (bullets.length) flush();
      ordered.push(<li key={i}>{inline(num[2], i)}</li>);
      return;
    }
    flush();
    out.push(<p key={i}>{inline(line, i)}</p>);
  });

  flush();
  return out;
}

function Chrome({ children, menu, setMenu }: { children: React.ReactNode; menu: boolean; setMenu: (v: boolean) => void }) {
  return (
    <div className="blog-root">
      <div className="h-mast">
        <div className="in">
          <Wordmark />
          <div className="nav">
            <Link href="/">Home</Link>
            <Link href="/donna">Legal</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <button className="hamb" onClick={() => setMenu(true)} aria-label="Open menu"><span /><span /><span /></button>
        </div>
      </div>
      <MobileSheet open={menu} onClose={() => setMenu(false)} dark links={[
        { label: "Home", href: "/" },
        { label: "Legal", href: "/donna" },
        { label: "Blog", href: "/blog" },
      ]} />
      {children}
      <footer className="h-footer">
        <div className="in">
          <div>
            <Wordmark className="mk" />
            <div className="tag">AI advisory and custom tools</div>
          </div>
          <div className="r">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
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

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const [menu, setMenu] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const post = POSTS.find((p) => p.slug === slug);
  const content = CONTENT[slug];


  // Related: same category first, then fill from the rest.
  const related = useMemo(() => {
    if (!post) return [];
    const same = POSTS.filter(p => p.slug !== post.slug && p.category === post.category);
    const rest = POSTS.filter(p => p.slug !== post.slug && p.category !== post.category);
    return [...same, ...rest].slice(0, 3);
  }, [post]);

  if (!post || !content) {
    return (
      <Chrome menu={menu} setMenu={setMenu}>
        <section className="blog-hero">
          <div className="wrap">
            <h1>Post not found.</h1>
            <p className="blog-lede">That article doesn’t exist, or the address has changed.</p>
            <Link href="/blog" className="btn btn-line" style={{ marginTop: 32, display: "inline-block" }}>← Back to blogs</Link>
          </div>
        </section>
      </Chrome>
    );
  }

  return (
    <Chrome menu={menu} setMenu={setMenu}>
      <article className="blog-article">
        <div className="wrap">
          <nav className="blog-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog">Blogs</Link>
            <span aria-hidden="true">/</span>
            <span>{post.category}</span>
          </nav>

          <div className="blog-article-top">
            <span className="blog-cat">{post.category}</span>
            <span className="blog-read">{post.readTime}</span>
            <span className="blog-date">{formatDate(post.date)}</span>
          </div>
          <h1 className="blog-article-title">{post.title}</h1>
          <p className="blog-article-excerpt">{post.excerpt}</p>
          <div className="blog-divider" />

          <div className="blog-body">{renderContent(content)}</div>

          <div className="blog-footer-cta">
            <p>Wondering what this would look like inside your firm?</p>
            <Link href="/donna" className="btn btn-solid">See what you could automate</Link>
          </div>

          {related.length > 0 && (
            <section className="blog-related" aria-labelledby="related-heading">
              <h2 id="related-heading">Keep reading</h2>
              <div className="blog-related-grid">
                {related.map(r => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="blog-related-card">
                    <span className="blog-cat">{r.category}</span>
                    <span className="blog-related-title">{r.title}</span>
                    <span className="blog-read">{r.readTime}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="blog-author">
            <p className="blog-author-name">Jai Dhingra</p>
            <p className="blog-author-bio">
              Founder of j.ai. Builds AI agents and workflow automation for solo and small law firms —
              including donna, an intake and practice-management connector.
            </p>
          </div>
        </div>
      </article>
    </Chrome>
  );
}
