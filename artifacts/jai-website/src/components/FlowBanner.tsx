import React from "react";

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
  return (
    <section className="fb-sec" id="donna">
      <div className="wrap">
        <h2 className="fb-title">How it moves.</h2>

        <div className="fb-banner">
          <ol className="fb-rail">
            {STAGES.map((s, i) => (
              <li className={`fb-stage${i === 1 ? " is-key" : ""}`} key={s.label}>
                <span className="fb-n">STAGE {String(i + 1).padStart(2, "0")}</span>
                <span className="fb-label">{s.label}</span>
                <span className="fb-summary">{s.summary}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
