import { renderToString } from "react-dom/server";
import { Router, type BaseLocationHook } from "wouter";
import Home from "@/pages/Home";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/not-found";

type RouteMeta = {
  Component: React.ComponentType;
  title: string;
  description: string;
};

export const routes: Record<string, RouteMeta> = {
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
};

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
  const html = renderToString(
    <Router hook={staticLocationHook(url)}>
      <route.Component />
    </Router>
  );
  return { html, title: route.title, description: route.description };
}
