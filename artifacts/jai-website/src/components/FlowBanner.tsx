import React, { useEffect, useState } from "react";
import HoverExpand from "@/components/smoothui/hover-expand";

type Stage = { label: string; summary: string };

const STAGES: Stage[] = [
  {
    label: "Client",
    summary: "Completes your custom intake form and provides everything you need upfront.",
  },
  {
    label: "donna",
    summary: "Collects, organises and processes your client’s information automatically.",
  },
  {
    label: "Your PMS + AI",
    summary: "Creates matters and lets you work with your firm’s data in plain English.",
  },
];

export default function FlowBanner() {
  // donna opens first; hover (or tap, or arrow keys) opens the others.
  const [active, setActive] = useState(1);
  // Panels stack vertically on narrow screens, where rotated labels don't fit.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    setNarrow(mq.matches);
    const on = (e: MediaQueryListEvent) => setNarrow(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <section className="fb-sec" id="donna">
      <div className="wrap">
        <div className="fb-head">
          <h2 className="fb-title">How it moves.</h2>
          <p className="fb-hint">
            <span className="fb-hint-n">{String(active + 1).padStart(2, "0")}</span> / 03
          </p>
        </div>

        <HoverExpand
          className="fb-expand"
          orientation={narrow ? "vertical" : "horizontal"}
          items={STAGES.map((s, i) => ({ id: `stage-${i}`, title: s.label, description: s.summary }))}
          activeIndex={active}
          onActiveIndexChange={setActive}
          expandedFlex={3}
          collapsedFlex={1}
        />
      </div>
    </section>
  );
}
