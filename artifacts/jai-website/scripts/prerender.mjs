import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.resolve(root, "dist");
const ssrDir = path.resolve(root, "dist-ssr");

const template = fs.readFileSync(path.resolve(distDir, "index.html"), "utf-8");
const { render } = await import(path.resolve(ssrDir, "entry-server.js"));

const { routes } = await import(path.resolve(ssrDir, "entry-server.js"));

// Prerender every known route, including one page per published article.
const pages = Object.keys(routes).map((url) => ({
  url,
  out: url === "/" ? "index.html" : `${url.replace(/^\//, "")}/index.html`,
}));

for (const page of pages) {
  const { html, title, description } = render(page.url);
  const canonical = `https://jdotai.com${page.url === "/" ? "" : page.url}`;

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
      "</head>",
      `  <link rel="canonical" href="${canonical}" />\n  </head>`
    )
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const outPath = path.resolve(distDir, page.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, out);
}

fs.rmSync(ssrDir, { recursive: true, force: true });

console.log(`Prerendered ${pages.length} route(s): ${pages.map((p) => p.url).join(", ")}`);
