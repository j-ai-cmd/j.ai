import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.resolve(root, "dist");
const ssrDir = path.resolve(root, "dist-ssr");

const template = fs.readFileSync(path.resolve(distDir, "index.html"), "utf-8");
const { render, routes } = await import(path.resolve(ssrDir, "entry-server.js"));

const SITE = "https://jdotai.com";
const esc = (s) => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

// Prerender every known route, including one page per published article.
const pages = Object.keys(routes).map((url) => ({
  url,
  out: url === "/" ? "index.html" : `${url.replace(/^\//, "")}/index.html`,
}));

for (const page of pages) {
  const { html, title, description } = render(page.url);
  const meta = routes[page.url];
  const canonical = `${SITE}${page.url === "/" ? "" : page.url}`;

  // FIX 5 + 6: structured data emitted at build time, not in useEffect.
  const blocks = [];
  if (meta?.article) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: meta.article.headline,
      description: meta.description,
      datePublished: meta.article.datePublished,
      dateModified: meta.article.datePublished,
      articleSection: meta.article.section,
      author: { "@type": "Person", name: "Jai Dhingra", url: "https://www.linkedin.com/in/jai-dhingra/" },
      publisher: { "@type": "Organization", name: "j.ai", url: SITE },
      mainEntityOfPage: canonical,
      image: `${SITE}/og-image.png`,
    });
  }
  if (meta?.faq?.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: meta.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  const ld = blocks
    .map((b) => `  <script type="application/ld+json">${JSON.stringify(b)}</script>`)
    .join("\n");

  const out = template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${description}" />`
    )
    .replace(
      /<meta property="og:title" content=".*?" \/>/,
      `<meta property="og:title" content="${title}" />`
    )
    .replace(
      /<meta property="og:description" content=".*?" \/>/,
      `<meta property="og:description" content="${description}" />`
    )
    .replace(
      /<meta property="og:url" content=".*?" \/>/,
      `<meta property="og:url" content="${canonical}" />`
    )
    .replace(
      /<meta name="twitter:title" content=".*?" \/>/,
      `<meta name="twitter:title" content="${title}" />`
    )
    .replace(
      /<meta name="twitter:description" content=".*?" \/>/,
      `<meta name="twitter:description" content="${description}" />`
    )
    .replace(
      /<meta property="og:type" content=".*?" \/>/,
      `<meta property="og:type" content="${meta?.article ? "article" : "website"}" />`
    )
    .replace(
      "</head>",
      `  <link rel="canonical" href="${canonical}" />\n${ld ? ld + "\n" : ""}  </head>`
    )
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const outPath = path.resolve(distDir, page.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, out);
}

// FIX 3: build sitemap.xml from the same route table that drives prerendering.
const urls = Object.keys(routes).sort((a, b) => a.length - b.length || a.localeCompare(b));
const priority = (u) => (u === "/" ? "1.0" : u === "/donna" ? "0.9" : u === "/blogs" ? "0.8" : "0.7");
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls
    .map(
      (u) =>
        `  <url>\n    <loc>${esc(SITE + (u === "/" ? "/" : u))}</loc>\n` +
        `    <changefreq>weekly</changefreq>\n    <priority>${priority(u)}</priority>\n  </url>`
    )
    .join("\n") +
  "\n</urlset>\n";
fs.writeFileSync(path.resolve(distDir, "sitemap.xml"), sitemap);

fs.rmSync(ssrDir, { recursive: true, force: true });

console.log(`Prerendered ${pages.length} route(s); sitemap: ${urls.length} URLs`);
