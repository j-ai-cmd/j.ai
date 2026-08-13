import React, { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { Reveal, Wordmark, MobileSheet, EMAIL, LINKEDIN } from "@/components/shared";
import { POSTS } from "./index";

// Blog post content — Rex adds entries here when publishing via gh CLI
const CONTENT: Record<string, string> = {
  "legaltech-consolidation-wave": `
For years, the story in legal tech was fragmentation. Every workflow, from intake to drafting to research to billing to e-discovery, spawned a dozen point solutions, each pitching itself as the tool your firm couldn't live without. Buyers complained about the noise. Analysts drew crowded landscape maps with fifty logos crammed onto a single slide.

That story just changed. The market is consolidating.

## The landscape

In the space of a few weeks, three deals landed that make the pattern impossible to ignore. Legora, the AI-native legal drafting and review platform, closed its fifth acquisition of the year, picking up Wexler. BigHand, the document and workflow automation vendor, acquired Ayora. And Anaqua, the IP management platform, bought Unified Patents.

Three different corners of legal tech. Three different buyers. One shared logic: consolidate now, before the market picks winners for you.

Artificial Lawyer called this "the great consolidation," and the label fits. Typical legal tech M&A is quiet: a startup running out of runway gets acquihired, a PE fund flips a portfolio company. These three deals are different. Platforms with real revenue and real customers are buying up adjacent capability, fast, in the same quarter Harvey reportedly raised at a $15.5B valuation and Big Tech started going direct to law firms instead of selling through vendors. The category is maturing on every front at once.

## The real opportunity

Consolidation waves like this create two very different experiences, depending on which side of the deal you're on.

If you're a vendor being acquired, or one of the five companies Legora bought this year, the story is usually fine: an exit, a bigger platform, more resources behind the product you built. The risk sits elsewhere.

The risk sits with the buyer. The firm or legal ops team that signed a three-year contract with a standalone point solution six months ago, and now finds that vendor absorbed into a platform with a different roadmap, different pricing, and different priorities. Nobody asked the customer if they wanted to be part of a bigger platform. They just are now.

That's the part of the story most people miss: what happens to everyone who bought from the company that just got bought.

## The breakdown

Look at what's actually being absorbed and you start to see the shape of the next twelve months.

**Legora's five acquisitions this year**, Wexler included, all sit in the AI-native drafting and contract review space: the exact workflow every mid-size firm is under pressure to modernize. Each acquisition adds a feature Legora didn't want to build from scratch. For a firm evaluating drafting tools right now, the practical question has changed. Forget which vendor has the best demo. Ask which vendor will still exist, in its current form, eighteen months from now.

**BigHand's purchase of Ayora** folds workflow and document automation under one roof. Useful if you're already a BigHand customer. Disruptive if you picked Ayora specifically because it wasn't BigHand. Integration timelines, support quality, and pricing all become live questions the moment a deal like this closes, and they rarely get answered before the ink is dry.

**Anaqua buying Unified Patents** consolidates IP management and patent intelligence into a single platform, which sounds efficient until you remember that IP teams often chose smaller, focused tools precisely because the big suites felt bloated and slow to adapt.

The through-line: consolidation makes platforms bigger and, almost always, slower to change. The nimble point solution you picked because it moved fast is now a business unit inside a larger org, with a roadmap set by someone else's priorities.

## The so-what

If you're evaluating legal tech right now, whether you're a firm, an in-house legal ops lead, or a partner deciding what to renew, this matters more than the deal headlines suggest.

Three things worth checking before your next renewal or purchase:

1. **Ownership stability.** Has this vendor been acquired in the last 18 months, or does their funding profile make them a likely acquisition target? Neither answer is disqualifying, but both should change how long a contract you're willing to sign.
2. **Integration debt.** If a vendor you rely on gets bought, what happens to the integrations, APIs, and workflows you've already built around it? Consolidated platforms don't always prioritize backward compatibility for acquired products.
3. **Where the flexibility actually lives.** Big, consolidated platforms are good at breadth. They're rarely good at the specific, slightly unusual workflow your firm actually runs on. That gap includes custom automation, integrations between systems that were never designed to talk to each other, and AI agents tuned to how your intake process actually works instead of how a platform assumes it should work. The next acquisition won't fill it. A builder working close to your firm will.

Use this moment to get specific about what you're actually buying, and from whom.

## If you work in legal tech, legal ops, or you're running a firm evaluating new tools

Watch this closely over the next two quarters. The firms that come out ahead will be the ones who use the shakeout to get deliberate about what they build, what they buy, and who they trust to build it.
`,
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
