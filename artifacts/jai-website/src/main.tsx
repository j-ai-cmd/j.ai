import { createRoot, hydrateRoot } from "react-dom/client";
import "./lib/posthog";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root")!;

if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, <App />);
} else {
  createRoot(rootEl).render(<App />);
}
