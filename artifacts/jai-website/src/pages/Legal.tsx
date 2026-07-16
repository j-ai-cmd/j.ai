import React, { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

function initCalEmbed() {
  if ((window as any).__calLegalDone) return;
  (window as any).__calLegalDone = true;
  (function (C: any, A: string, L: string) {
    const p = (a: any, ar: any) => a.q.push(ar);
    const d = C.document;
    C.Cal = C.Cal || function (...args: any[]) {
      const cal = C.Cal;
      if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }
      if (args[0] === L) { const api: any = (...a: any[]) => p(api, a); const namespace = args[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], args); p(cal, ["initNamespace", namespace]); } else p(cal, args); return; }
      p(cal, args);
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");
  const Cal = (window as any).Cal;
  Cal("init", "discovery-call", { origin: "https://app.cal.com" });
  Cal.config = Cal.config || {};
  Cal.config.forwardQueryParams = true;
  Cal.ns["discovery-call"]("inline", { elementOrSelector: "#legal-cal-inline-discovery-call", config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" }, calLink: "jai.ai/discovery-call" });
  Cal.ns["discovery-call"]("ui", { hideEventTypeDetails: false, layout: "month_view" });
}

const agents: Record<string, any> = {
  hermes: {
    name: "Hermes — Past client reactivation", sub: "Runs daily · 847 closed matters scanned · 3 qualified",
    meta: ["Smokeball connected", "847 matters scanned", "3 drafts ready"],
    steps: [
      { t: "Connected to Smokeball", d: "Authenticated · api.smokeball.com.au · token valid" },
      { t: "Scanning 847 closed matters", d: "Filtering: closed more than 12 months ago" },
      { t: "3 clients qualify", d: "Margaret Chen · Robert Okafor · Susan Park" },
      { t: "Fetching contact details", d: "Names and emails pulled from contacts API" },
      { t: "Checking contact log", d: "None contacted in last 6 months — all clear" },
    ],
    draft: { head: "Draft ready · Margaret Chen · Wills & Trusts", subj: "Reviewing your estate plan — it's been a while", body: "Hi Margaret,\n\nIt's been over two years since we helped you put your Will and Powers of Attorney in place. Life changes quickly, and it's worth making sure everything still reflects your wishes.\n\nWe'd love to offer you a brief complimentary review. Would 20 minutes work sometime in the next few weeks?\n\nWarm regards,\nSutton Family Law", actions: true },
    approved: { head: "Draft 1 of 3 · Margaret Chen · approved", subj: "Reviewing your estate plan — it's been a while", body: "Hi Margaret,\n\nIt's been over two years since we helped you put your Will and Powers of Attorney in place. Life changes quickly, and it's worth making sure everything still reflects your wishes.\n\nWe'd love to offer you a brief complimentary review. Would 20 minutes work sometime in the next few weeks?\n\nWarm regards,\nSutton Family Law", wip: false },
  },
  athena: {
    name: "Athena — Pre-meeting brief", sub: "Fires on intake form submission · brief in 90 seconds",
    meta: ["James Okafor", "Form received 2 min ago", "Prior matter found"],
    steps: [
      { t: "Intake form received", d: "James Okafor · submitted 2 minutes ago" },
      { t: "Searching prior matters", d: "1 prior matter found — property purchase 2021" },
      { t: "Analysing intake answers", d: "Divorce flagged · no current Will · blended family" },
    ],
    draft: { head: "Brief ready · James Okafor · consultation 10am", subj: "Pre-meeting brief", body: "Background: Returning client. Property purchase 2021. Enquiring about estate planning post-divorce.\n\nRed flags: Recent divorce · No current Will confirmed · Blended family mentioned\n\nConversation steer: Prioritise EPOA and super nominations — existing ones may still name ex-spouse.", actions: false },
    approved: { head: "Pre-meeting brief · James Okafor · approved", subj: "Pre-meeting brief · James Okafor", body: "Background: Returning client. Property purchase 2021. Enquiring about estate planning post-divorce.\n\nRed flags: Recent divorce · No Will confirmed · Blended family\n\nSteer: Prioritise EPOA and super nominations.", wip: false },
  },
  hestia: {
    name: "Hestia — New client welcome", sub: "Fires when new client confirmed",
    meta: ["Sarah Williams", "Confirmed today", "Draft ready"],
    steps: [
      { t: "New client confirmed", d: "Sarah Williams · property settlement" },
      { t: "Pulling matter details", d: "Matter type, responsible lawyer, firm name" },
    ],
    draft: { head: "Draft ready · Sarah Williams", subj: "Welcome to Sutton Family Law, Sarah", body: "Hi Sarah,\n\nIt was great to meet you today. We're glad to be helping you with your property settlement and want to make this as straightforward as possible.\n\nWe'll be in touch shortly with your engagement letter. Don't hesitate to reach out in the meantime.\n\nWarm regards,\nSutton Family Law", actions: true },
    approved: { head: "Welcome draft · Sarah Williams · approved", subj: "Welcome to Sutton Family Law, Sarah", body: "Hi Sarah,\n\nIt was great to meet you today. We're glad to be helping you with your property settlement.\n\nWe'll be in touch shortly with your engagement letter.\n\nWarm regards,\nSutton Family Law", wip: false },
  },
  plutus: {
    name: "Plutus — Unbilled time chaser", sub: "Runs Monday 7am · internal only",
    meta: ["Last run: Monday", "3 matters found", "£3,520 surfaced"],
    steps: [
      { t: "Connected to billing data", d: "Pulling all open matters with time entries" },
      { t: "Finding unbilled WIP", d: "Entries older than 14 days · 3 matters found" },
    ],
    draft: { head: "WIP summary ready · fee earner only", subj: "wip", body: "", actions: false },
    approved: { head: "WIP summary · sent Monday · fee earner only", subj: "Your unbilled time this week", body: "wip", wip: true },
  },
  charis: {
    name: "Charis — Post-matter referral", sub: "Fires 7 days after matter closes",
    meta: ["2 matters closed", "This week", "2 drafts ready"],
    steps: [
      { t: "Matter closed detected", d: "David Okafor · estate planning · closed 7 days ago" },
      { t: "Checking excluded matter types", d: "Estate planning not excluded · proceeding" },
    ],
    draft: { head: "Draft ready · David Okafor", subj: "Thank you, David — it was a pleasure", body: "Hi David,\n\nNow that your matter is wrapped up, we just wanted to say thank you for trusting us with something this important. It was a genuine pleasure.\n\nIf you have a moment, a Google review would mean a lot to us. And if you know anyone who needs estate planning or family law advice, we'd love an introduction.\n\nWarmly,\nSutton Family Law", actions: true },
    approved: { head: "Draft 1 of 2 · David Okafor · approved", subj: "Thank you, David — it was a pleasure", body: "Hi David,\n\nNow that your matter is wrapped up, we just wanted to say thank you. A Google review would mean a lot. And if you know anyone who needs help, we'd love an introduction.\n\nWarmly, Sutton Family Law", wip: false },
  },
  apollo: {
    name: "Apollo — Cross-sell intelligence", sub: "Runs weekly · reads full matter history",
    meta: ["312 clients scanned", "3 gaps found", "Drafts ready"],
    steps: [
      { t: "Reading matter history", d: "312 clients · all matter types reviewed" },
      { t: "Matching against service matrix", d: "Comparing what each client has vs what they may need" },
      { t: "3 gaps identified", d: "Will without EPOA · property without estate plan · business without succession" },
    ],
    draft: { head: "Cross-sell opportunities ready · 3 found", subj: "3 clients who may need your help again", body: "Margaret Chen — Has Will (2022), no EPOA on file.\n\nRobert Okafor — Property purchase 2021, no estate planning on record.\n\nSarah Williams — Business structure 2020, no succession plan on file.", actions: true },
    approved: { head: "Cross-sell opportunities · this week · approved", subj: "3 clients who may need your help again", body: "Margaret Chen — Has Will (2022), no EPOA on file.\n\nRobert Okafor — Property purchase 2021, no estate planning.\n\nSarah Williams — Business structure 2020, no succession plan.", wip: false },
  },
};

function WipRows() {
  return (
    <div>
      <div className="flex justify-between py-2 border-b border-gray-100 text-[12.5px]"><span>Chen — Property Settlement (18d)</span><span className="font-semibold text-[#2C3EE8]">£1,840</span></div>
      <div className="flex justify-between py-2 border-b border-gray-100 text-[12.5px]"><span>Okafor — Estate Planning (22d)</span><span className="font-semibold text-[#2C3EE8]">£960</span></div>
      <div className="flex justify-between py-2 text-[12.5px]"><span>Williams — Family Law (14d)</span><span className="font-semibold text-[#2C3EE8]">£720</span></div>
      <div className="flex justify-between py-2 mt-1 bg-[#f0f2fd] rounded px-2 text-[12.5px] font-semibold"><span>Total surfaced</span><span className="text-[#2C3EE8]">£3,520</span></div>
    </div>
  );
}

function Console() {
  const [cur, setCur] = useState("hermes");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [steps, setSteps] = useState<number>(-1);
  const [draftVisible, setDraftVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [approved, setApproved] = useState(false);
  const [approvedBody, setApprovedBody] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const sidebarItems = [
    { key: "hermes", label: "Hermes", role: "Reactivation", dot: "#4ade80", badge: "3 ready", badgeClass: "bg-green-100 text-green-800" },
    { key: "athena", label: "Athena", role: "Pre-meeting brief", dot: "#2C3EE8", badge: "Running", badgeClass: "bg-blue-100 text-blue-800" },
    { key: "hestia", label: "Hestia", role: "Welcome email", dot: "#4ade80", badge: "1 ready", badgeClass: "bg-green-100 text-green-800" },
    { key: "plutus", label: "Plutus", role: "Unbilled time", dot: "#f59e0b", badge: "Monday", badgeClass: "bg-yellow-100 text-yellow-800" },
    { key: "charis", label: "Charis", role: "Referral & review", dot: "#4ade80", badge: "2 ready", badgeClass: "bg-green-100 text-green-800" },
    { key: "apollo", label: "Apollo", role: "Cross-sell", dot: "#2C3EE8", badge: "Running", badgeClass: "bg-blue-100 text-blue-800" },
  ];

  function pickAgent(key: string) {
    setCur(key);
    setOverlayOpen(false);
    setSteps(-1);
    setDraftVisible(false);
    setEditMode(false);
    setApproved(false);
    setApprovedBody("");
  }

  function startRun() {
    setOverlayOpen(true);
    setSteps(0);
    setDraftVisible(false);
    setEditMode(false);
    setApproved(false);
    setApprovedBody("");
    const a = agents[cur];
    a.steps.forEach((_: any, i: number) => {
      setTimeout(() => setSteps(i + 1), (i + 1) * 420);
    });
    setTimeout(() => setDraftVisible(true), (a.steps.length + 1) * 420);
  }

  function approveDraft() {
    const body = editMode ? editText : agents[cur].draft.body;
    setApprovedBody(body);
    setApproved(true);
    setOverlayOpen(false);
  }

  function closeOverlay() {
    setOverlayOpen(false);
  }

  const a = agents[cur];
  const isWip = a.draft.subj === "wip";

  return (
    <div className="rounded-xl overflow-hidden border border-black/10 shadow-lg">
      {/* topbar */}
      <div className="bg-[#0F1729] px-4 py-3 flex items-center gap-3">
        <div className="flex gap-[5px]">
          <span className="w-[9px] h-[9px] rounded-full bg-[#FF5F57]" />
          <span className="w-[9px] h-[9px] rounded-full bg-[#FEBC2E]" />
          <span className="w-[9px] h-[9px] rounded-full bg-[#28C840]" />
        </div>
        <span className="text-[11px] text-white/30 tracking-[0.05em] flex-1 text-center">j.ai · Agent Console · Sutton Family Law</span>
        <span className="text-[11px] text-[#4ade80] flex items-center gap-1">
          <span className="w-[6px] h-[6px] rounded-full bg-[#4ade80] animate-pulse" />
          6 agents live
        </span>
      </div>

      {/* body */}
      <div className="grid grid-cols-[200px_1fr] min-h-[500px]">
        {/* sidebar */}
        <div className="bg-[#0F1729] border-r border-white/[0.07]">
          <div className="px-[14px] py-[11px] text-[10px] tracking-[0.1em] uppercase text-white/[0.28] border-b border-white/[0.05]">Agents</div>
          {sidebarItems.map(item => (
            <button key={item.key} onClick={() => pickAgent(item.key)}
              className={`w-full px-[14px] py-[12px] text-left flex items-center gap-[9px] border-b border-white/[0.04] border-l-2 transition-colors ${cur === item.key ? "bg-[rgba(44,62,232,0.18)] border-l-[#2C3EE8]" : "border-l-transparent hover:bg-white/[0.04]"}`}>
              <span className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: item.dot }} />
              <div className="flex-1 min-w-0">
                <span className="block text-[12.5px] font-semibold text-white/[0.82]">{item.label}</span>
                <span className="block text-[10px] text-white/[0.32] mt-[1px]">{item.role}</span>
              </div>
              <span className={`text-[9.5px] px-[7px] py-[2px] rounded-full font-semibold flex-shrink-0 ${item.badgeClass}`}>{item.badge}</span>
            </button>
          ))}
        </div>

        {/* main */}
        <div className="flex flex-col relative bg-white">
          {/* header */}
          <div className="px-[18px] py-[14px] border-b border-black/[0.07] flex items-center justify-between">
            <div>
              <div className="text-[14px] font-semibold text-[#1A1A2E]">{a.name}</div>
              <div className="text-[11px] text-[#555566] mt-[2px]">{a.sub}</div>
            </div>
            <button onClick={startRun} className="text-[12px] px-[16px] py-[7px] rounded bg-[#2C3EE8] text-white font-semibold hover:opacity-88 transition-opacity">▶ See it run</button>
          </div>

          {/* output */}
          <div className="p-[16px] flex-1 overflow-y-auto transition-opacity duration-300">
            {approved ? (
              <div>
                <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[11px] font-semibold px-3 py-1 rounded-full mb-3">✓ Approved — ready to send</div>
                <div className="bg-white rounded-lg border border-black/[0.08] overflow-hidden">
                  <div className="px-[14px] py-[8px] border-b border-black/[0.06] flex justify-between text-[11px] text-[#555566]">
                    <span>{a.approved.head}</span>
                    <span className="text-[#4ade80]">● Approved</span>
                  </div>
                  {a.approved.wip || approvedBody === "wip" ? (
                    <div className="p-[14px]"><WipRows /></div>
                  ) : (
                    <div className="p-[14px] text-[13px] text-[#555566] leading-relaxed">
                      <p className="font-semibold text-[#1A1A2E] mb-1">{a.approved.subj}</p>
                      <p className="whitespace-pre-line">{approvedBody || a.approved.body}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {a.meta.map((m: string) => <span key={m} className="text-[11px] text-[#555566] bg-gray-100 px-3 py-1 rounded-full">{m}</span>)}
                </div>
                <div className="py-10 text-center text-[13px] text-[#888899]">
                  Click <strong className="text-[#1A1A2E] font-semibold">▶ See it run</strong> to watch this agent work<br />and see what it would send to your lawyer for approval.
                </div>
              </div>
            )}
          </div>

          {/* overlay */}
          {overlayOpen && (
            <div className="absolute inset-0 bg-white z-10 flex flex-col">
              <div className="px-[18px] py-[13px] border-b border-black/[0.07] flex justify-between items-center flex-shrink-0">
                <div className="text-[13px] font-semibold text-[#1A1A2E]">Watching {a.name.split(" — ")[0]} run</div>
                <button onClick={closeOverlay} className="text-[20px] text-[#888899] hover:text-[#1A1A2E] leading-none px-1">✕</button>
              </div>
              <div className="p-[16px] overflow-y-auto flex-1" ref={scrollRef}>
                {a.steps.map((s: any, i: number) => (
                  <div key={i} className={`flex gap-[10px] mb-[14px] transition-all duration-300 ${i < steps ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
                    <div className="flex flex-col items-center">
                      <div className="w-[26px] h-[26px] rounded-full bg-green-100 border border-green-200 text-green-800 flex items-center justify-center text-[11px] flex-shrink-0">✓</div>
                      {i < a.steps.length - 1 && <div className="w-px flex-1 min-h-[10px] bg-gray-200 my-[2px]" />}
                    </div>
                    <div className="pt-[2px] flex-1">
                      <div className="text-[12.5px] font-semibold text-[#1A1A2E]">{s.t}</div>
                      <div className="text-[11.5px] text-[#888899] mt-[2px]">{s.d}</div>
                    </div>
                  </div>
                ))}

                {draftVisible && (
                  <div className={`flex gap-[10px] mb-[14px] transition-all duration-300 opacity-100 translate-y-0`}>
                    <div className="w-[26px] h-[26px] rounded-full bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center text-[10px] font-semibold flex-shrink-0 mt-[1px]">AI</div>
                    <div className="flex-1 pt-[2px]">
                      <div className="text-[12.5px] font-semibold text-[#1A1A2E] mb-1">{a.draft.head}</div>
                      <div className="bg-[#f7f8ff] border border-[#c5cdf7] rounded-lg overflow-hidden">
                        {isWip ? (
                          <div className="p-[14px]"><WipRows /></div>
                        ) : editMode ? (
                          <textarea
                            className="w-full p-[14px] text-[13px] text-[#1A1A2E] leading-relaxed border-none bg-transparent resize-none outline-none min-h-[130px] font-sans"
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                          />
                        ) : (
                          <div className="p-[14px] text-[13px] text-[#555566] leading-relaxed">
                            <p className="font-semibold text-[#1A1A2E] mb-1">{a.draft.subj}</p>
                            <p className="whitespace-pre-line">{a.draft.body}</p>
                          </div>
                        )}
                        <div className="flex gap-[7px] p-[10px] border-t border-[#c5cdf7]">
                          {editMode ? (
                            <>
                              <button onClick={approveDraft} className="text-[11.5px] px-[14px] py-[5px] rounded bg-[#2C3EE8] text-white font-semibold">Save and approve</button>
                              <button onClick={() => setEditMode(false)} className="text-[11.5px] px-[14px] py-[5px] rounded bg-gray-100 text-[#555566] border border-gray-200 font-semibold">Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={approveDraft} className="text-[11.5px] px-[14px] py-[5px] rounded bg-[#2C3EE8] text-white font-semibold">Approve</button>
                              {!isWip && <button onClick={() => { setEditMode(true); setEditText(a.draft.body); }} className="text-[11.5px] px-[14px] py-[5px] rounded bg-gray-100 text-[#555566] border border-gray-200 font-semibold">Edit</button>}
                              {a.draft.actions && !isWip && <button onClick={closeOverlay} className="text-[11.5px] px-[14px] py-[5px] rounded bg-gray-100 text-[#555566] border border-gray-200 font-semibold">Skip</button>}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Legal() {
  useScrollReveal();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  useEffect(() => { initCalEmbed(); }, []);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans text-jai-dark-text bg-jai-off-white selection:bg-jai-cobalt selection:text-white">

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-jai-cobalt ${scrolled ? "border-b border-white/15" : "border-b border-transparent"}`}>
        <div className="max-w-[900px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <img src="/logo-white.png" alt="j.ai" className="h-7 w-auto" />
          <div className="flex items-center gap-6">
            <Link href="/" className="text-white/70 text-[14px] hover:text-white transition-colors">Home</Link>
            <a href="#cta" className="btn-active-scale border border-white text-white bg-transparent rounded-[4px] px-[20px] py-[8px] text-[14px] font-semibold transition-colors hover:bg-white/5">Book a Call</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative w-full bg-jai-cobalt pt-[64px] flex items-center min-h-[60vh]">
        <div className="max-w-[900px] mx-auto px-6 py-[80px] w-full reveal-container">
          <div className="inline-block border border-white text-jai-muted-white rounded-[20px] px-[16px] py-[10px] text-[11px] tracking-[0.08em] uppercase mb-8 reveal">For Law Firms</div>
          <h1 className="font-outfit font-extrabold text-white text-[36px] md:text-[52px] leading-[1.08] tracking-[-0.03em] max-w-[760px] reveal">
            Your past clients need legal help again.<br />They just haven't heard from you.
          </h1>
          <p className="font-sans text-jai-muted-white text-[18px] leading-[1.7] max-w-[580px] mt-6 reveal">
            Six AI agents that surface the revenue your firm already earned the right to, and land every output in your inbox for approval before anything sends.
          </p>
          <div className="flex flex-wrap gap-8 mt-10 reveal">
            <div><div className="font-outfit font-extrabold text-white text-[28px] tracking-tight">£230k</div><div className="text-[12px] text-jai-muted-white mt-1">average unbilled revenue<br />per attorney per year</div></div>
            <div><div className="font-outfit font-extrabold text-white text-[28px] tracking-tight">68%</div><div className="text-[12px] text-jai-muted-white mt-1">of past clients who need<br />legal help go to another firm</div></div>
            <div><div className="font-outfit font-extrabold text-white text-[28px] tracking-tight">30%</div><div className="text-[12px] text-jai-muted-white mt-1">higher conversion rate<br />for referred leads</div></div>
          </div>
          <div className="flex gap-3 mt-10 reveal">
            <a href="#console" className="btn-active-scale inline-block bg-white text-jai-cobalt font-semibold text-[15px] px-[32px] py-[14px] rounded-[4px] transition-opacity hover:opacity-90">See the agents run</a>
            <a href="#cta" className="btn-active-scale inline-block bg-jai-cobalt border-[2px] border-white/30 text-white font-semibold text-[15px] px-[28px] py-[13px] rounded-[4px] transition-colors hover:bg-white/5">Book a call</a>
          </div>
        </div>
      </section>

      {/* CONSOLE */}
      <section id="console" className="w-full bg-jai-off-white py-[80px]">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="text-[11px] tracking-[0.1em] uppercase text-jai-muted-text mb-3 reveal">Live demo</div>
          <h2 className="font-outfit font-extrabold text-jai-dark-text text-[36px] leading-[1.1] tracking-tight mb-3 reveal">Watch any agent run</h2>
          <p className="text-[16px] text-jai-muted-text leading-[1.7] max-w-[520px] mb-10 reveal">Select an agent, click Run, and see exactly what lands in the lawyer's inbox — then approve or edit it right here.</p>
          <div className="reveal">
            <Console />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full bg-jai-pure-white py-[80px]">
        <div className="max-w-[900px] mx-auto px-6 reveal-container">
          <div className="text-[11px] tracking-[0.1em] uppercase text-jai-muted-text mb-3 reveal">How it works</div>
          <h2 className="font-outfit font-extrabold text-jai-dark-text text-[36px] leading-[1.1] tracking-tight mb-12 reveal">Set up once. Runs forever.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { n: "1", t: "One onboarding call", d: "We connect to your Smokeball or Clio account, configure each agent to match your firm's practice areas and tone, and run the first test in draft mode together." },
              { n: "2", t: "Agents run in the background", d: "Each agent fires on its own trigger — daily, weekly, or on a specific event like a matter closing or an intake form arriving. No manual input needed." },
              { n: "3", t: "You approve, then send", d: "Every output lands in the lawyer's inbox as a draft. Approve in one click, edit if needed, or skip entirely. Nothing ever sends to a client without a human deciding." },
            ].map(item => (
              <div key={item.n} className="reveal">
                <div className="font-outfit font-extrabold text-[42px] text-jai-cobalt opacity-15 leading-none mb-3">{item.n}</div>
                <div className="font-outfit font-bold text-[17px] text-jai-dark-text mb-3">{item.t}</div>
                <div className="text-[14.5px] text-jai-muted-text leading-[1.7]">{item.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY BAR */}
      <div className="bg-jai-cobalt py-6">
        <div className="max-w-[900px] mx-auto px-6 flex flex-wrap gap-8 justify-center">
          {["Works with Smokeball and Clio", "Draft mode for the first 2–3 weeks", "Nothing sends without lawyer approval", "Set up in one 60-minute call"].map(item => (
            <div key={item} className="flex items-center gap-2 text-white text-[14px]">
              <span className="opacity-70">✓</span>{item}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section id="cta" className="w-full bg-jai-navy py-[100px]">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-12 reveal-container">
            <h2 className="font-outfit font-extrabold text-white text-[44px] leading-[1.1] tracking-[-0.02em] mx-auto max-w-[680px] reveal">
              Most firms find their first recovered matter within 60 days.
            </h2>
            <p className="text-jai-muted-white text-[18px] leading-[1.7] max-w-[560px] mx-auto mt-6 reveal">
              Pick a time below. We'll walk through your workflows and which agents make sense to start with.
            </p>
          </div>
          <div id="legal-cal-inline-discovery-call" style={{ width: "100%", height: 700, overflow: "scroll" }} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-jai-footer-bg py-[60px]">
        <div className="max-w-[900px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-0">
          <div className="text-center md:text-left flex flex-col items-center md:items-start gap-2">
            <img src="/logo-white.png" alt="j.ai" className="h-6 w-auto" />
            <span className="text-jai-muted-white text-[13px]">Revenue agents for small law firms</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3">
            <a href="mailto:admin@jaidotai.com" className="text-jai-muted-white text-[13px] hover:underline decoration-white/30 underline-offset-4 transition-all">admin@jaidotai.com</a>
            <a href="https://www.linkedin.com/in/jai-dhingra/" target="_blank" rel="noopener noreferrer" className="text-jai-muted-white hover:text-white transition-colors" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <span className="text-jai-muted-white text-[12px] mt-1">&copy; 2026 j.ai. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
