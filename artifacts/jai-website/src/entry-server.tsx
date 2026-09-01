import { renderToString } from "react-dom/server";
import { Router, Route, Switch, type BaseLocationHook } from "wouter";
import Home from "@/pages/Home";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/not-found";
import BlogIndex from "@/pages/blogs/index";
import BlogPost from "@/pages/blogs/BlogPost";
import { POSTS } from "@/pages/blogs/posts";

type RouteMeta = {
  Component: React.ComponentType;
  title: string;
  description: string;
};

const staticRoutes: Record<string, RouteMeta> = {
  "/": {
    Component: Home,
    title: "j.ai - AI agents and custom tools for Legal",
    description:
      "j.ai works with founders to find where AI fits their business, build what actually helps, and make sure it sticks.",
  },
  "/legal": {
    Component: Legal,
    title: "j.ai - AI agents for law firms",
    description:
      "AI agents that reactivate past clients, brief you before meetings, catch unbilled time, and flag cross-sell gaps — built into how your firm already works.",
  },
  "/donna": {
    Component: Legal,
    title: "donna - AI intake and PMS connector for law firms | j.ai",
    description:
      "donna connects your practice management system to your AI assistant and collects exactly what your firm needs at intake. Built by j.ai.",
  },
  "/blog": {
    Component: BlogIndex,
    title: "Blog - AI implementation for law firms | j.ai",
    description:
      "Practical writing on AI implementation, workflow automation and client intake for solo and small law firms.",
  },
};

// One prerenderable route per published article.
const postRoutes: Record<string, RouteMeta> = Object.fromEntries(
  POSTS.map((p) => [
    `/blog/${p.slug}`,
    {
      Component: BlogPost,
      title: p.titleTag || `${p.title} | j.ai`,
      description: p.excerpt,
    },
  ])
);

export const routes: Record<string, RouteMeta> = { ...staticRoutes, ...postRoutes };

export const notFoundMeta: RouteMeta = {
  Component: NotFound,
  title: "j.ai - Page not found",
  description: "The page you're looking for doesn't exist.",
};

function staticLocationHook(path: string): BaseLocationHook {
  const useStaticLocation = () => [path, () => {}] as [string, () => void];
  useStaticLocation.searchHook = () => "";
  return useStaticLocation;
}

export function render(url: string) {
  const route = routes[url] ?? notFoundMeta;
  // Render through a real Switch so /blog/:slug resolves its params.
  const html = renderToString(
    <Router hook={staticLocationHook(url)}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/legal" component={Legal} />
        <Route path="/donna" component={Legal} />
        <Route path="/blog" component={BlogIndex} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
  return { html, title: route.title, description: route.description };
}
