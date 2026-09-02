import React, { useEffect, useRef, useState } from "react";

type Stage = {
  label: string;
  summary: string;
  detailLabel: string;
  items: string[];
  chips?: string[][];
};

// Copy is drawn from the existing donna page and FAQ — no invented claims.
const STAGES: Stage[] = [
  {
    label: "Client",
    summary: "Completes your custom intake form and provides everything you need upfront.",
    detailLabel: "What the client does",
    items: [
      "Receives a link — no account to create, no password to remember.",
      "Fills the form at their own pace; progress saves as they go.",
      "Uploads the documents your matter type actually requires.",
    ],
  },
  {
    label: "donna",
    summary: "Collects, organises and processes your client’s information automatically.",
    detailLabel: "What donna does",
    items: [
      "Validates what came in and requests anything still missing.",
      "Organises the answers into the fields your firm already uses.",
      "Notifies the team once the file is complete — not before.",
    ],
  },
  {
    label: "Your PMS + AI",
    summary: "Creates matters and lets you work with your firm’s data in plain English.",
    detailLabel: "Where it lands",
    items: [
      "A contact and matter are created in your practice management system.",
      "You query the file in plain English through your AI assistant.",
    ],
    chips: [
      ["Clio", "Smokeball", "Actionstep", "myCase", "LEAP"],
      ["Claude", "ChatGPT", "Kimi"],
    ],
  },
];

const CYCLE_MS = 2100;
const CYCLE_MS_REDUCED = 3200;

export default function FlowBanner() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % STAGES.length),
      reduce ? CYCLE_MS_REDUCED : CYCLE_MS
    );
    timer.current = id;
    return () => clearInterval(id);
  }, [playing, reduce]);

  function pick(i: number) {
    setActive(i);
    setPlaying(false);
  }

  function onKey(e: React.KeyboardEvent, i: number) {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + STAGES.length) % STAGES.length;
    tabRefs.current[n]?.focus();
    pick(n);
  }

  const stage = STAGES[active];

  return (
    <section className="fb-sec" id="donna">
      <div className="wrap">
        <div className="fb-head">
          <h2 className="fb-title">How it moves.</h2>
          <button
            type="button"
            className="fb-play"
            aria-pressed={playing}
            onClick={() => setPlaying((p) => !p)}
          >
            <span className={`fb-glyph${playing ? " is-pause" : ""}`} aria-hidden="true" />
            {playing ? "Pause" : "Watch it move"}
          </button>
        </div>

        <div className="fb-banner">
          <div className="fb-track">
            <div
              className="fb-fill"
              style={{ left: `${active * (100 / STAGES.length)}%` }}
            />
          </div>

          <div className="fb-rail" role="tablist" aria-label="How donna moves a matter">
            {STAGES.map((s, i) => (
              <button
                key={s.label}
                type="button"
                role="tab"
                className="fb-stage"
                aria-selected={i === active}
                aria-controls="fb-panel"
                ref={(el) => { tabRefs.current[i] = el; }}
                onClick={() => pick(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className="fb-n">STAGE {String(i + 1).padStart(2, "0")}</span>
                <span className="fb-label">{s.label}</span>
                <span className="fb-summary">{s.summary}</span>
              </button>
            ))}
          </div>

          <div className="fb-detail" id="fb-panel" role="tabpanel" aria-live="polite">
            <div className="fb-what">{stage.detailLabel.toUpperCase()}</div>
            <div key={active} className={reduce ? "" : "fb-swap"}>
              <ul className="fb-items">
                {stage.items.map((t) => <li key={t}>{t}</li>)}
              </ul>
              {stage.chips?.map((group, g) => (
                <div className="fb-chips" key={g}>
                  {group.map((c) => <span className="fb-chip" key={c}>{c}</span>)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
