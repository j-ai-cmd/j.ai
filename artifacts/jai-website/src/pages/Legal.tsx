import React, { useEffect, useState, useRef } from "react";
import { Link } from "wouter";

const WEBHOOK_URL = "https://hook.eu1.make.com/waciaz78ykdmfaxh4glg6vdhjjqi4jh5";

const CAL_EMBED = `
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", "discovery-call", {origin:"https://app.cal.com"});
Cal.config = Cal.config || {};
Cal.config.forwardQueryParams = true;
Cal.ns["discovery-call"]("inline", {
  elementOrSelector:"#legal-cal-inline",
  config: {"layout":"month_view","useSlotsViewOnSmallScreen":"true"},
  calLink: "jai.ai/discovery-call",
});
Cal.ns["discovery-call"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
`;

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const agentData = [
  { key: "hermes", name: "Hermes", role: "Past client reactivation", dot: "#4ade80", badge: "3 ready", badgeClass: "bg-green-100 text-green-800", desc: "Scans closed matters and drafts re-engagement emails for clients who haven't been contacted in over 12 months.", meta: ["Connected to Smokeball", "847 matters scanned", "3 drafts ready"], steps: [{ t: "Connected to Smokeball", d: "Authenticated · api.smokeball.com.au · token valid" }, { t: "Scanning 847 closed matters", d: "Filtering: closed more than 12 months ago" }, { t: "3 clients qualify", d: "Margaret Chen · Robert Okafor · Susan Park" }, { t: "Fetching contact details", d: "Names and emails pulled from contacts API" }, { t: "Checking contact log", d: "None contacted in last 6 months · all clear" }], draft: { head: "Draft ready · Margaret Chen · Wills and Trusts", subj: "Reviewing your estate plan", body: "Hi Margaret,\n\nIt has been over two years since we helped you put your Will and Powers of Attorney in place. Life changes quickly, and it is worth making sure everything still reflects your wishes.\n\nWe would love to offer you a brief complimentary review. Would 20 minutes work sometime in the next few weeks?\n\nWarm regards,\nSutton Family Law", actions: true, wip: false }, approved: { head: "Draft 1 of 3 · Margaret Chen · approved", subj: "Reviewing your estate plan", body: "Hi Margaret,\n\nIt has been over two years since we helped you put your Will and Powers of Attorney in place. Life changes quickly, and it is worth making sure everything still reflects your wishes.\n\nWe would love to offer you a brief complimentary review. Would 20 minutes work sometime in the next few weeks?\n\nWarm regards,\nSutton Family Law", wip: false } },
  { key: "athena", name: "Athena", role: "Pre-meeting brief", dot: "#2C3EE8", badge: "Running", badgeClass: "bg-blue-100 text-blue-800", desc: "Reads the intake form the moment it's submitted and delivers a structured brief before the meeting starts.", meta: ["James Okafor", "Form received 2 min ago", "Prior matter found"], steps: [{ t: "Intake form received", d: "James Okafor · submitted 2 minutes ago" }, { t: "Searching prior matters", d: "1 prior matter found · property purchase 2021" }, { t: "Pulling meeting notes", d: "2 file notes found from prior consultation" }, { t: "Analysing intake answers", d: "Divorce flagged · no current Will · blended family" }], draft: { head: "Brief ready · James Okafor · consultation 10am", subj: "Pre-meeting brief", body: "Background: Returning client. Property purchase 2021. Enquiring about estate planning post-divorce.\n\nMeeting notes: Client mentioned intention to update estate plan after property settled.\n\nRed flags: Recent divorce · No current Will confirmed · Blended family mentioned\n\nConversation steer: Prioritise EPOA and super nominations. Existing ones may still name ex-spouse.", actions: false, wip: false }, approved: { head: "Pre-meeting brief · James Okafor · approved", subj: "Pre-meeting brief", body: "Background: Returning client. Enquiring about estate planning post-divorce.\n\nRed flags: Recent divorce · No Will confirmed · Blended family\n\nSteer: Prioritise EPOA and super nominations.", wip: false } },
  { key: "hestia", name: "Hestia", role: "New client welcome", dot: "#4ade80", badge: "1 ready", badgeClass: "bg-green-100 text-green-800", desc: "Drafts a warm, personalised welcome email the moment a new client is confirmed.", meta: ["Sarah Williams", "Confirmed today", "Draft ready"], steps: [{ t: "New client confirmed", d: "Sarah Williams · property settlement" }, { t: "Pulling matter details", d: "Matter type, responsible lawyer, firm name" }], draft: { head: "Draft ready · Sarah Williams", subj: "Welcome to Sutton Family Law, Sarah", body: "Hi Sarah,\n\nIt was great to meet you today. We are glad to be helping you with your property settlement and want to make this as straightforward as possible.\n\nWe will be in touch shortly with your engagement letter.\n\nWarm regards,\nSutton Family Law", actions: true, wip: false }, approved: { head: "Welcome draft · Sarah Williams · approved", subj: "Welcome to Sutton Family Law, Sarah", body: "Hi Sarah,\n\nIt was great to meet you today. We will be in touch shortly with your engagement letter.\n\nWarm regards,\nSutton Family Law", wip: false } },
  { key: "plutus", name: "Plutus", role: "Unbilled time chaser", dot: "#f59e0b", badge: "Monday", badgeClass: "bg-yellow-100 text-yellow-800", desc: "Surfaces unbilled WIP every Monday so it doesn't get written off. Goes to the fee earner only, never clients.", meta: ["Last run: Monday", "3 matters found", "3,520 surfaced"], steps: [{ t: "Connected to billing data", d: "Pulling all open matters with time entries" }, { t: "Finding unbilled WIP", d: "Entries older than 14 days · 3 matters found" }], draft: { head: "WIP summary ready · fee earner only", subj: "wip", body: "", actions: false, wip: true }, approved: { head: "WIP summary · sent Monday", subj: "Your unbilled time this week", body: "wip", wip: true } },
  { key: "charis", name: "Charis", role: "Post-matter referral", dot: "#4ade80", badge: "2 ready", badgeClass: "bg-green-100 text-green-800", desc: "Drafts a thank-you with a soft review ask and referral line 7 days after a matter closes.", meta: ["2 matters closed", "This week", "2 drafts ready"], steps: [{ t: "Matter closed detected", d: "David Okafor · estate planning · closed 7 days ago" }, { t: "Checking excluded matter types", d: "Estate planning not excluded · proceeding" }], draft: { head: "Draft ready · David Okafor", subj: "Thank you, David", body: "Hi David,\n\nNow that your matter is wrapped up, we just wanted to say thank you for trusting us. It was a genuine pleasure.\n\nIf you have a moment, a Google review would mean a lot to us. And if you know anyone who needs estate planning or family law advice, we would love an introduction.\n\nWarmly,\nSutton Family Law", actions: true, wip: false }, approved: { head: "Draft 1 of 2 · David Okafor · approved", subj: "Thank you, David", body: "Hi David,\n\nThank you for trusting us. A Google review would mean a lot. And if you know anyone who needs help, we would love an introduction.\n\nWarmly, Sutton Family Law", wip: false } },
  { key: "apollo", name: "Apollo", role: "Cross-sell intelligence", dot: "#2C3EE8", badge: "Running", badgeClass: "bg-blue-100 text-blue-800", desc: "Reads client matter history against your service matrix and flags cross-sell gaps weekly.", meta: ["312 clients scanned", "3 gaps found", "Drafts ready"], steps: [{ t: "Reading matter history", d: "312 clients · all matter types reviewed" }, { t: "Matching against service matrix", d: "Comparing what each client has vs what they may need" }, { t: "3 gaps identified", d: "Will without EPOA · property without estate plan · business without succession" }], draft: { head: "Cross-sell opportunities ready · 3 found", subj: "3 clients who may need your help again", body: "Margaret Chen · Has Will (2022), no EPOA on file.\n\nRobert Okafor · Property purchase 2021, no estate planning on record.\n\nSarah Williams · Business structure 2020, no succession plan on file.", actions: true, wip: false }, approved: { head: "Cross-sell opportunities · this week · approved", subj: "3 clients who may need your help again", body: "Margaret Chen · Has Will (2022), no EPOA on file.\n\nRobert Okafor · Property purchase 2021, no estate planning.\n\nSarah Williams · Business structure 2020, no succession plan.", wip: false } },
];

function WipRows() {
  return (
    <div className="px-[14px] pb-2">
      <div className="flex justify-between py-2 border-b border-gray-100 text-[12.5px]"><span>Chen · Property Settlement (18d)</span><span className="font-semibold text-[#2C3EE8]">1,840</span></div>
      <div className="flex justify-between py-2 border-b border-gray-100 text-[12.5px]"><span>Okafor · Estate Planning (22d)</span><span className="font-semibold text-[#2C3EE8]">960</span></div>
      <div className="flex justify-between py-2 text-[12.5px]"><span>Williams · Family Law (14d)</span><span className="font-semibold text-[#2C3EE8]">720</span></div>
      <div className="flex justify-between mt-2 bg-[#f0f2fd] rounded px-2 py-2 text-[12.5px] font-semibold"><span>Total surfaced</span><span className="text-[#2C3EE8]">3,520</span></div>
    </div>
  );
}

function Console({ initialAgent }: { initialAgent: string }) {
  const [cur, setCur] = useState(initialAgent);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [steps, setSteps] = useState(0);
  const [draftVisible, setDraftVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [approved, setApproved] = useState(false);
  const [approvedBody, setApprovedBody] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setCur(initialAgent); }, [initialAgent]);

  function pickAgent(key: string) {
    setCur(key); setOverlayOpen(false); setSteps(0);
    setDraftVisible(false); setEditMode(false);
    setApproved(false); setApprovedBody("");
  }

  function startRun() {
    setOverlayOpen(true); setSteps(0);
    setDraftVisible(false); setEditMode(false);
    setApproved(false); setApprovedBody("");
    const a = agentData.find(x => x.key === cur)!;
    a.steps.forEach((_, i) => setTimeout(() => setSteps(i + 1), (i + 1) * 420));
    setTimeout(() => {
      setDraftVisible(true);
      setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 100);
    }, (a.steps.length + 1) * 420);
  }

  function approveDraft() {
    const a = agentData.find(x => x.key === cur)!;
    const body = editMode ? editText : a.draft.body;
    setApprovedBody(body); setApproved(true); setOverlayOpen(false);
  }

  const a = agentData.find(x => x.key === cur)!;
  const isWip = a.draft.wip;

  return (
    <div className="rounded-xl overflow-hidden border border-black/10 shadow-xl">
      <div className="bg-[#0F1729] px-4 py-3 flex items-center gap-3">
        <div className="flex gap-[5px]">
          <span className="w-[9px] h-[9px] rounded-full bg-[#FF5F57]" />
          <span className="w-[9px] h-[9px] rounded-full bg-[#FEBC2E]" />
          <span className="w-[9px] h-[9px] rounded-full bg-[#28C840]" />
        </div>
        <span className="text-[11px] text-white/50 tracking-[0.05em] flex-1 text-center">j.ai · Agent Console · Sutton Family Law</span>
        <span className="text-[11px] text-[#4ade80] flex items-center gap-[5px]">
          <span className="w-[6px] h-[6px] rounded-full bg-[#4ade80] animate-pulse inline-block" />6 agents live
        </span>
      </div>
      <div className="grid grid-cols-[220px_1fr] min-h-[600px]">
        <div className="bg-[#0F1729] border-r border-white/[0.1]">
          <div className="px-[14px] py-[11px] text-[10px] tracking-[0.1em] uppercase text-white border-b border-white/[0.1]">Agents</div>
          {agentData.map(ag => (
            <button key={ag.key} onClick={() => pickAgent(ag.key)}
              className={`w-full px-[14px] py-[13px] text-left flex items-center gap-[9px] border-b border-white/[0.07] border-l-2 transition-colors ${cur === ag.key ? "bg-[rgba(44,62,232,0.25)] border-l-[#2C3EE8]" : "border-l-transparent hover:bg-white/[0.06]"}`}>
              <span className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: ag.dot }} />
              <div className="flex-1 min-w-0">
                <span className="block text-[13px] font-semibold text-white">{ag.name}</span>
                <span className="block text-[10px] text-white/70 mt-[1px]">{ag.role}</span>
              </div>
              <span className={`text-[9.5px] px-[7px] py-[2px] rounded-full font-semibold flex-shrink-0 ${ag.badgeClass}`}>{ag.badge}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-col relative bg-white">
          <div className="px-[20px] py-[16px] border-b border-black/[0.07] flex items-center justify-between">
            <div>
              <div className="text-[15px] font-semibold text-[#1A1A2E]">{a.name} · {a.role}</div>
              <div className="text-[11.5px] text-[#555566] mt-[2px]">{a.sub}</div>
            </div>
            <button onClick={startRun} className="text-[12.5px] px-[18px] py-[8px] rounded bg-[#2C3EE8] text-white font-semibold hover:opacity-90 transition-opacity">&#9654; See it run</button>
          </div>
          <div className="p-[20px] flex-1 overflow-y-auto">
            {approved ? (
              <div>
                <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[11px] font-semibold px-3 py-1 rounded-full mb-4">&#10003; Approved</div>
                <div className="bg-white rounded-lg border border-black/[0.08] overflow-hidden">
                  <div className="px-[14px] py-[9px] border-b border-black/[0.06] flex justify-between text-[11px] text-[#555566]">
                    <span>{a.approved.head}</span><span className="text-[#4ade80]">&#9679; Approved</span>
                  </div>
                  {a.approved.wip || approvedBody === "wip" ? <WipRows /> : (
                    <div className="p-[14px] text-[13px] text-[#555566] leading-relaxed">
                      <p className="font-semibold text-[#1A1A2E] mb-2">{a.approved.subj}</p>
                      <p className="whitespace-pre-line">{approvedBody || a.approved.body}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap gap-2 mb-4">{a.meta.map((m: string) => <span key={m} className="text-[11px] text-[#555566] bg-gray-100 px-3 py-1 rounded-full">{m}</span>)}</div>
                <div className="py-12 text-center text-[13.5px] text-[#888899] leading-relaxed">
                  Click <strong className="text-[#1A1A2E] font-semibold">&#9654; See it run</strong> to watch this agent work and see what it does.
                </div>
              </div>
            )}
          </div>
          {overlayOpen && (
            <div className="absolute inset-0 bg-white z-10 flex flex-col">
              <div className="px-[20px] py-[14px] border-b border-black/[0.07] flex justify-between items-center flex-shrink-0">
                <div className="text-[14px] font-semibold text-[#1A1A2E]">Watching {a.name} run</div>
                <button onClick={() => setOverlayOpen(false)} className="text-[20px] text-[#888899] hover:text-[#1A1A2E] leading-none">&#10005;</button>
              </div>
              <div className="p-[20px] overflow-y-auto flex-1" ref={scrollRef}>
                {a.steps.map((s: any, i: number) => (
                  <div key={i} className={`flex gap-[11px] mb-[16px] transition-all duration-300 ${i < steps ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
                    <div className="flex flex-col items-center">
                      <div className="w-[26px] h-[26px] rounded-full bg-green-100 border border-green-200 text-green-800 flex items-center justify-center text-[11px] flex-shrink-0">&#10003;</div>
                      {i < a.steps.length - 1 && <div className="w-px flex-1 min-h-[10px] bg-gray-200 my-[2px]" />}
                    </div>
                    <div className="pt-[2px] flex-1">
                      <div className="text-[13px] font-semibold text-[#1A1A2E]">{s.t}</div>
                      <div className="text-[11.5px] text-[#888899] mt-[2px]">{s.d}</div>
                    </div>
                  </div>
                ))}
                {draftVisible && (
                  <div className="flex gap-[11px] mb-[16px]">
                    <div className="w-[26px] h-[26px] rounded-full bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center text-[10px] font-semibold flex-shrink-0 mt-[1px]">AI</div>
                    <div className="flex-1 pt-[2px]">
                      <div className="text-[13px] font-semibold text-[#1A1A2E] mb-2">{a.draft.head}</div>
                      <div className="bg-[#f7f8ff] border border-[#c5cdf7] rounded-lg overflow-hidden">
                        {isWip ? <WipRows /> : editMode ? (
                          <textarea className="w-full p-[14px] text-[13px] text-[#1A1A2E] leading-relaxed border-none bg-transparent resize-none outline-none min-h-[140px] font-sans" value={editText} onChange={e => setEditText(e.target.value)} />
                        ) : (
                          <div className="p-[14px] text-[13px] text-[#555566] leading-relaxed">
                            <p className="font-semibold text-[#1A1A2E] mb-2">{a.draft.subj}</p>
                            <p className="whitespace-pre-line">{a.draft.body}</p>
                          </div>
                        )}
                        <div className="flex gap-[7px] p-[10px] border-t border-[#c5cdf7]">
                          {editMode ? (
                            <><button onClick={approveDraft} className="text-[11.5px] px-[14px] py-[5px] rounded bg-[#2C3EE8] text-white font-semibold">Save and approve</button><button onClick={() => setEditMode(false)} className="text-[11.5px] px-[14px] py-[5px] rounded bg-gray-100 text-[#555566] border border-gray-200 font-semibold">Cancel</button></>
                          ) : (
                            <><button onClick={approveDraft} className="text-[11.5px] px-[14px] py-[5px] rounded bg-[#2C3EE8] text-white font-semibold">Approve</button>{!isWip && <button onClick={() => { setEditMode(true); setEditText(a.draft.body); }} className="text-[11.5px] px-[14px] py-[5px] rounded bg-gray-100 text-[#555566] border border-gray-200 font-semibold">Edit</button>}{a.draft.actions && !isWip && <button onClick={() => setOverlayOpen(false)} className="text-[11.5px] px-[14px] py-[5px] rounded bg-gray-100 text-[#555566] border border-gray-200 font-semibold">Skip</button>}</>
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

function TestimonialCarousel() {
  const testimonials = [
    { quote: "We had 400 closed matters sitting untouched. Within the first month, Hermes surfaced three clients who came back for new work. One of them turned into a $6,000 estate planning matter.", name: "Managing Partner", firm: "Estate Planning Firm, Sydney AU" },
    { quote: "The pre-meeting brief alone is worth it. I walk into every consultation knowing exactly who I am meeting and what to watch out for. It used to take me 20 minutes. Now it is there before I have finished my coffee.", name: "Principal Solicitor", firm: "Family Law Practice, London UK" },
    { quote: "We were writing off around 2,000 a week in unbilled time without realising it. Plutus surfaced it every Monday. We have recovered most of it just by having someone look at the list.", name: "Senior Associate", firm: "Conveyancing Practice, Melbourne AU" },
    { quote: "Charis sent a thank-you email to a client we had not thought about in months. She replied the same day asking about updating her EPOA. That is a matter we would never have found otherwise.", name: "Principal, Family Law", firm: "Boutique Practice, London UK" },
  ];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollTo(i: number) {
    if (!scrollRef.current) return;
    const card = scrollRef.current.children[i] as HTMLElement;
    if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActiveIndex(i);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => setActiveIndex(Math.round(el.scrollLeft / (el.offsetWidth * 0.85)));
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  return (
    <div>
      <div ref={scrollRef} className="flex overflow-x-auto gap-5 pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {testimonials.map((t, i) => (
          <div key={i} className="flex-shrink-0 w-[85vw] md:w-[420px] snap-center bg-white/8 border border-white/15 rounded-2xl p-8 flex flex-col justify-between">
            <p className="text-white text-[16px] leading-[1.8] mb-8">{t.quote}</p>
            <div>
              <div className="text-white font-semibold text-[14px]">{t.name}</div>
              <div className="text-white/50 text-[12px] mt-1">{t.firm}</div>
              <div className="text-white/25 text-[10px] mt-1 uppercase tracking-wide">Placeholder · to be replaced</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button key={i} onClick={() => scrollTo(i)} className={`h-[3px] rounded-full transition-all duration-300 ${i === activeIndex ? "bg-white w-8" : "bg-white/30 w-3"}`} />
        ))}
      </div>
    </div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", firmName: "", firmSize: "", pms: "", agents: [] as string[], message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const agentOptions = ["Hermes", "Athena", "Hestia", "Plutus", "Charis", "Apollo", "Custom build"];

  function toggleAgent(agent: string) {
    setFormData(prev => ({ ...prev, agents: prev.agents.includes(agent) ? prev.agents.filter(a => a !== agent) : [...prev.agents, agent] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setError("");
    try {
      await fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: formData.name, email: formData.email, firm_name: formData.firmName, firm_size: formData.firmSize, pms: formData.pms, agents_of_interest: formData.agents.join(", "), message: formData.message, submitted_at: new Date().toISOString(), source: "jdotai.com/legal" }) });
      setSubmitted(true);
    } catch { setError("Something went wrong. Please email admin@jdotai.com directly."); }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="bg-[#0F1729] rounded-2xl p-12 text-center">
        <div className="text-[48px] mb-4 text-[#4ade80]">&#10003;</div>
        <h3 className="font-outfit font-extrabold text-white text-[28px] mb-3">Got it.</h3>
        <p className="text-white/70 text-[16px]">We will be in touch within 24 hours.</p>
      </div>
    );
  }

  const inputClass = "w-full bg-[#1a2540] border border-white/15 rounded-lg text-white placeholder-white/35 px-4 py-3 text-[14px] focus:outline-none focus:border-[#2C3EE8] transition-colors";
  const labelClass = "block text-[13px] font-semibold text-white mb-2";

  return (
    <form onSubmit={handleSubmit} className="bg-[#0F1729] rounded-2xl p-8">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div><label className={labelClass}>Full name</label><input required className={inputClass} type="text" placeholder="Jane Smith" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} /></div>
        <div><label className={labelClass}>Email</label><input required className={inputClass} type="email" placeholder="jane@smithlaw.com" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} /></div>
        <div><label className={labelClass}>Firm name</label><input required className={inputClass} type="text" placeholder="Smith Family Law" value={formData.firmName} onChange={e => setFormData(p => ({ ...p, firmName: e.target.value }))} /></div>
        <div><label className={labelClass}>Firm size</label><select required className={inputClass + " cursor-pointer"} value={formData.firmSize} onChange={e => setFormData(p => ({ ...p, firmSize: e.target.value }))}><option value="" disabled>Select staff count</option><option value="1-5">1 to 5</option><option value="6-10">6 to 10</option><option value="11-15">11 to 15</option><option value="15+">15 or more</option></select></div>
      </div>
      <div className="mb-4"><label className={labelClass}>Practice management system</label><select required className={inputClass + " cursor-pointer"} value={formData.pms} onChange={e => setFormData(p => ({ ...p, pms: e.target.value }))}><option value="" disabled>Select your PMS</option><option>Smokeball</option><option>Clio</option><option>LEAP</option><option>Actionstep</option><option>Other</option></select></div>
      <div className="mb-4"><label className={labelClass}>Which agents interest you?</label><div className="flex flex-wrap gap-2">{agentOptions.map(agent => (<button key={agent} type="button" onClick={() => toggleAgent(agent)} className={`text-[12.5px] px-3 py-[6px] rounded-full border transition-all ${formData.agents.includes(agent) ? "bg-[#2C3EE8] border-[#2C3EE8] text-white" : "border-white/20 text-white/60 hover:border-white/50 hover:text-white"}`}>{agent}</button>))}</div></div>
      <div className="mb-6"><label className={labelClass}>What do you want to automate?</label><textarea required className={inputClass + " resize-none min-h-[100px]"} placeholder="Describe the tasks taking up your team's time, or the specific workflow you have in mind..." value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} /></div>
      {error && <p className="text-red-400 text-[13px] mb-4">{error}</p>}
      <button type="submit" disabled={submitting} className="w-full bg-[#2C3EE8] hover:opacity-90 disabled:opacity-50 text-white font-semibold text-[15px] py-4 rounded-lg transition-opacity">{submitting ? "Sending..." : "Send enquiry"}</button>
    </form>
  );
}

export default function Legal() {
  useScrollReveal();
  const [navCompressed, setNavCompressed] = useState(false);
  const [activeAgent, setActiveAgent] = useState("hermes");
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setNavCompressed(window.scrollY > 80);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = CAL_EMBED;
    document.body.appendChild(script);
    return () => { try { document.body.removeChild(script); } catch {} };
  }, []);

  function selectAgent(key: string) {
    setActiveAgent(key);
    consoleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans text-[#1A1A2E] bg-[#F7F8FF]">

      {/* NAV — sticky + compresses */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2C3EE8]">
        <div className={`max-w-[960px] mx-auto px-6 flex items-center justify-between transition-all duration-300 ${navCompressed ? "h-[48px]" : "h-[68px]"}`}>
          <Link href="/"><img src="/logo-white.png" alt="j.ai" className={`w-auto cursor-pointer transition-all duration-300 ${navCompressed ? "h-8" : "h-12"}`} /></Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-white text-[14px] font-semibold hover:text-white/80 transition-colors">Home</Link>
            <a href="#cta" className="border border-white text-white bg-transparent rounded px-5 py-2 text-[14px] font-semibold hover:bg-white/5 transition-colors">Book a Call</a>
          </div>
        </div>
        <div className="border-b border-white/20" />
      </nav>

      {/* HERO — cobalt */}
      <section className="relative w-full bg-[#2C3EE8] pt-[68px] flex items-center min-h-[100dvh]">
        <div className="max-w-[960px] mx-auto px-6 py-[90px] w-full">
          <h1 className="font-outfit font-extrabold text-white text-[40px] md:text-[58px] leading-[1.08] tracking-[-0.03em] max-w-[820px] reveal">
            If a task does not need your judgement, it should not need your time.
          </h1>
          <p className="font-sans text-white text-[18px] leading-[1.7] max-w-[600px] mt-6 reveal">
            j.ai connects to Smokeball, Clio, LEAP, Actionstep and more. We map every repeatable task in your firm and build agents that handle it, so your time goes only to the work that actually needs a lawyer.
          </p>
          <div className="flex flex-wrap gap-4 mt-10 reveal">
            <a href="#console" className="inline-block bg-white text-[#2C3EE8] font-semibold text-[15px] px-[32px] py-[14px] rounded transition-all duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] active:translate-y-0 active:shadow-none">See the agents run</a>
            <a href="#cta" className="inline-block bg-transparent border-2 border-white/40 text-white font-semibold text-[15px] px-[28px] py-[13px] rounded hover:bg-white/5 transition-colors">Book a call</a>
          </div>
        </div>
      </section>

      {/* AGENT OVERVIEW GRID — white */}
      <section className="w-full bg-white py-[70px]">
        <div className="max-w-[960px] mx-auto px-6">
          <h2 className="font-outfit font-extrabold text-[#1A1A2E] text-[32px] leading-[1.1] tracking-tight mb-3 reveal">Six agents. One job.</h2>
          <p className="text-[15px] text-[#555566] mb-10 reveal">Click any agent to see it run.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 reveal">
            {agentData.map(ag => (
              <button key={ag.key} onClick={() => selectAgent(ag.key)}
                className="text-left bg-white border border-black/[0.08] rounded-xl p-5 transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(44,62,232,0.12)] hover:border-[#2C3EE8] group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: ag.dot }} />
                  <span className="font-outfit font-extrabold text-[15px] text-[#1A1A2E]">{ag.name}</span>
                </div>
                <div className="text-[11px] text-[#888899] mb-3">{ag.role}</div>
                <div className="text-[12.5px] text-[#555566] leading-[1.55]">{ag.desc}</div>
                <div className="mt-3 text-[11px] text-[#2C3EE8] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">See it run &#8594;</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONSOLE — light grey */}
      <section id="console" className="w-full bg-[#F7F8FF] py-[90px]" ref={consoleRef}>
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className="font-outfit font-extrabold text-[#1A1A2E] text-[40px] leading-[1.1] tracking-tight mb-3 reveal">Watch any agent run</h2>
          <p className="text-[16px] text-[#555566] leading-[1.7] max-w-[520px] mb-10 reveal">Select an agent, click Run, and see exactly what it does.</p>
          <div className="reveal"><Console initialAgent={activeAgent} /></div>
        </div>
      </section>

      {/* HOW IT WORKS — dark navy */}
      <section className="w-full bg-[#0F1729] py-[90px]">
        <div className="max-w-[960px] mx-auto px-6">
          <h2 className="font-outfit font-extrabold text-white text-[40px] leading-[1.1] tracking-tight mb-16 reveal">Built around one idea.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { n: "1", t: "We map what does not need you", d: "Your firm runs on a mix of work that needs a lawyer's brain and work that does not. We sit with you, go through how your firm actually operates, and identify every task that is repeatable, predictable, and eating time it should not." },
              { n: "2", t: "We build the agents that handle it", d: "Whether it is a pre-built agent from our library or something custom-built for how your firm specifically works, we configure it, connect it to your practice management system, and run it until the output is exactly right." },
              { n: "3", t: "Everything that needs you lands in your inbox. Nothing else does.", d: "Every agent output arrives for your review before anything happens. You approve, edit, or skip. The rest runs itself. Nothing ever reaches a client without a human deciding." },
            ].map(item => (
              <div key={item.n} className="reveal">
                <div className="font-outfit font-extrabold text-[48px] text-white opacity-15 leading-none mb-4">{item.n}</div>
                <div className="font-outfit font-bold text-[18px] text-white mb-3">{item.t}</div>
                <div className="text-[15px] text-white/60 leading-[1.75]">{item.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — light grey with dark card */}
      <section className="w-full bg-[#F7F8FF] py-[90px] overflow-hidden">
        <div className="max-w-[960px] mx-auto px-6 mb-10">
          <h2 className="font-outfit font-extrabold text-[#1A1A2E] text-[40px] leading-[1.1] tracking-tight reveal">What firms are saying.</h2>
        </div>
        <div className="pl-6 md:pl-[calc((100vw-960px)/2+24px)]">
          <div className="bg-[#0F1729] rounded-2xl p-8 md:p-12">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      {/* CUSTOM BUILDS + FORM — cobalt */}
      <section className="w-full bg-[#2C3EE8] py-[90px]">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="reveal">
              <h2 className="font-outfit font-extrabold text-white text-[36px] leading-[1.1] tracking-tight mb-5">Need something built specifically for your firm?</h2>
              <p className="text-[16px] text-white leading-[1.75] mb-4">Not every firm runs the same way. If you have a workflow, a process, or a problem that does not fit a standard agent, we will scope and build it from scratch.</p>
              <p className="text-[16px] text-white leading-[1.75]">Connected to your existing systems. Designed around how you actually work. Delivered as an agent that runs itself.</p>
            </div>
            <div className="reveal"><ContactForm /></div>
          </div>
        </div>
      </section>

      {/* CTA — dark navy */}
      <section id="cta" className="w-full bg-[#0F1729] py-[100px]">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <h2 className="font-outfit font-extrabold text-white text-[44px] leading-[1.1] tracking-[-0.02em] mx-auto max-w-[720px]">Ready to stop doing work that should not need you?</h2>
            <p className="text-white/70 text-[18px] leading-[1.7] max-w-[560px] mx-auto mt-6">Pick a time below and we will map out what is worth automating in your firm.</p>
          </div>
          <div id="legal-cal-inline" style={{ width: "100%", height: 700, overflow: "scroll" }} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#0A0A0A] py-[60px]">
        <div className="max-w-[960px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/"><img src="/logo-blue.png" alt="j.ai" className="h-7 w-auto cursor-pointer" /></Link>
            <span className="text-white/40 text-[13px]">Revenue agents for small law firms</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3">
            <a href="mailto:admin@jdotai.com" className="text-white/45 text-[13px] hover:text-white/70 transition-colors">admin@jdotai.com</a>
            <a href="https://www.linkedin.com/in/jai-dhingra/" target="_blank" rel="noopener noreferrer" className="text-white/45 hover:text-white/70 transition-colors" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <span className="text-white/25 text-[12px]">&#169; 2026 j.ai. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
