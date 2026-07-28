import React, { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Reveal, Wordmark, MobileSheet, CAL_URL, CAL_EMBED, WEBHOOK_URL, LINKEDIN, EMAIL } from "@/components/shared";

const DOTS: Record<string,string> = { a:"var(--dot-a)", b:"var(--dot-b)", c:"var(--dot-c)", d:"var(--dot-d)", e:"var(--dot-e)" };

const agentData = [
  { key:"hermes", name:"Hermes", role:"Reactivation", dot:"a", span:"wide", desc:"Finds closed matters no one has touched in over a year and drafts a personal re-engagement email for each.", meta:["connected to smokeball","847 matters scanned","3 drafts ready"], steps:[{t:"Connected to practice system",d:"authenticated · token valid"},{t:"Scanned closed matters",d:"filter · closed > 12 months, no contact in 6"},{t:"Candidates identified",d:"qualifying past clients pulled from contacts"},{t:"Draft ready for review",d:"queued in your dashboard · not sent"}], draft:{head:"Example draft · re-engagement",subj:"Reviewing your estate plan",body:"Hi Margaret,\n\nIt has been a while since we last helped you. We'd like to offer a short complimentary review of your plan. Would 20 minutes suit?\n\nKind regards,\nSutton Family Law",actions:true,wip:false}, approved:{head:"Draft approved · re-engagement",subj:"Reviewing your estate plan",body:"Hi Margaret,\n\nIt has been a while since we last helped you. We'd like to offer a short complimentary review. Would 20 minutes suit?\n\nKind regards,\nSutton Family Law",wip:false} },
  { key:"athena", name:"Athena", role:"Pre-meeting", dot:"d", span:"narrow", desc:"Reads the intake form the moment it lands and hands you a structured brief before the meeting starts.", meta:["intake received","prior matter found","brief ready"], steps:[{t:"Intake form received",d:"new enquiry · submitted moments ago"},{t:"Searched prior matters",d:"1 prior matter found in practice system"},{t:"Pulled file notes",d:"notes from prior consultation retrieved"},{t:"Brief ready for review",d:"structured summary queued · not sent"}], draft:{head:"Example brief · pre-meeting",subj:"Pre-meeting brief",body:"Background: Returning client. Enquiring about estate planning.\n\nWatch for: no current Will on file · prior matter unresolved.\n\nSteer: prioritise the documents that protect them first.",actions:false,wip:false}, approved:{head:"Brief approved · pre-meeting",subj:"Pre-meeting brief",body:"Background: Returning client. Estate planning enquiry.\n\nWatch for: no current Will · prior matter unresolved.\n\nSteer: protective documents first.",wip:false} },
  { key:"hestia", name:"Hestia", role:"Welcome", dot:"b", span:"narrow", desc:"Drafts a warm, personal welcome the moment a new client is confirmed.", meta:["new client confirmed","draft ready"], steps:[{t:"New client confirmed",d:"matter opened in practice system"},{t:"Matter details pulled",d:"matter type · responsible lawyer · firm name"},{t:"Welcome draft ready",d:"queued in your dashboard · not sent"}], draft:{head:"Example draft · welcome",subj:"Welcome to Sutton Family Law",body:"Hi Margaret,\n\nIt was great to meet you today. We're glad to be helping you, and we'll be in touch shortly with next steps.\n\nWarm regards,\nSutton Family Law",actions:true,wip:false}, approved:{head:"Draft approved · welcome",subj:"Welcome to Sutton Family Law",body:"Hi Margaret,\n\nIt was great to meet you today. We'll be in touch shortly with next steps.\n\nWarm regards,\nSutton Family Law",wip:false} },
  { key:"plutus", name:"Plutus", role:"Unbilled time", dot:"c", span:"wide", desc:"Surfaces unbilled WIP every week so it doesn't get written off. Goes to the fee earner, never the client.", meta:["last run: Monday","3 matters found","internal only"], steps:[{t:"Connected to billing data",d:"pulling open matters with time entries"},{t:"Found unbilled WIP",d:"entries older than 14 days · 3 matters"},{t:"Summary ready",d:"fee earner nudge queued · never the client"}], draft:{head:"Example summary · fee earner only",subj:"wip",body:"",actions:false,wip:true}, approved:{head:"Summary sent · fee earner only",subj:"wip",body:"",wip:true} },
  { key:"charis", name:"Charis", role:"Referral", dot:"b", span:"", desc:"Sends a thank-you with a soft review ask and referral line after a matter closes.", meta:["matter closed","draft ready"], steps:[{t:"Matter closed detected",d:"closed 7 days ago · not excluded"},{t:"Checked matter type",d:"eligible for thank-you · proceeding"},{t:"Draft ready for review",d:"thank-you + review ask + referral line"}], draft:{head:"Example draft · thank-you",subj:"Thank you",body:"Hi Margaret,\n\nNow that everything is wrapped up, we wanted to say thank you for trusting us.\n\nIf you have a moment, a short review would mean a lot. And if you know anyone who could use our help, we'd be glad of an introduction.\n\nWarmly,\nSutton Family Law",actions:true,wip:false}, approved:{head:"Draft approved · thank-you",subj:"Thank you",body:"Hi Margaret,\n\nThank you for trusting us. A short review would mean a lot, and we'd be glad of any introduction.\n\nWarmly,\nSutton Family Law",wip:false} },
  { key:"apollo", name:"Apollo", role:"Cross-sell", dot:"a", span:"", desc:"Reads matter history against your service matrix and flags gaps worth a conversation.", meta:["clients scanned","gaps found","drafts ready"], steps:[{t:"Read matter history",d:"all matter types reviewed per client"},{t:"Matched service matrix",d:"comparing what each client has vs may need"},{t:"Gaps identified",d:"opportunities flagged for your review"}], draft:{head:"Example flags · cross-sell",subj:"Clients who may need more",body:"Margaret Chen · has a Will on file, no EPOA.\n\nRobert Okafor · property matter only, no estate plan.\n\nSarah Williams · business set up, no succession plan.",actions:true,wip:false}, approved:{head:"Flags approved · cross-sell",subj:"Clients who may need more",body:"Margaret Chen · Will, no EPOA.\n\nRobert Okafor · property, no estate plan.\n\nSarah Williams · business, no succession plan.",wip:false} },
  { key:"kronos", name:"Kronos", role:"Intelligence layer", dot:"d", span:"wide", desc:"Connects every agent into one view of each client, passes context between them, and decides when the next action is due.", meta:["all agents connected","clients tracked","context current"], steps:[{t:"Reading client timeline",d:"every agent touch on one client, in order"},{t:"Passing context forward",d:"a flag from one agent becomes context for the next"},{t:"Next action decided",d:"queued for the right agent at the right time"}], draft:{head:"Example update · client context",subj:"Client context updated",body:"Intake flagged a gap → passed to referral agent.\n\nWelcome sent → confirmed.\n\nCross-sell opportunity → queued for next weekly run.",actions:false,wip:false}, approved:{head:"Context approved",subj:"Client context updated",body:"All agent context updated. Next action queued.",wip:false} },
  { key:"iris", name:"Iris", role:"Health monitor", dot:"e", span:"narrow", desc:"Scores every active relationship and surfaces clients going quiet before they leave.", meta:["active clients","at risk","scores updated"], steps:[{t:"Scoring relationships",d:"engagement · recency · value per client"},{t:"At-risk clients flagged",d:"score below threshold · going quiet"},{t:"Handed to Kronos",d:"reactivation queued for the right agent"}], draft:{head:"Example flags · at-risk",subj:"Clients going quiet",body:"Margaret Chen · low engagement · no contact in months.\n\nRobert Okafor · slipping · reactivation suggested.\n\nSusan Park · quiet · worth a check-in.",actions:false,wip:false}, approved:{head:"Flags approved · at-risk",subj:"Clients going quiet",body:"3 clients flagged as at-risk. Reactivation queued.",wip:false} },
];

function WipRows() {
  const rows = [["Matter A · unbilled 18d","—"],["Matter B · unbilled 22d","—"],["Matter C · unbilled 14d","—"]];
  return (
    <div style={{ padding:"4px 0" }}>
      {rows.map(([m,a]) => (
        <div key={m} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--line-dark)",fontSize:13,color:"var(--muted-on-dark)" }}>
          <span>{m}</span><span style={{ color:"var(--dot-c)" }}>{a}</span>
        </div>
      ))}
      <div style={{ fontFamily:"var(--fm)",fontSize:11,color:"var(--faint-on-dark)",marginTop:10 }}>fee earner only · never the client</div>
    </div>
  );
}

function Console() {
  const [cur, setCur] = useState("hermes");
  const [steps, setSteps] = useState(0);
  const [draftVisible, setDraftVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [approved, setApproved] = useState(false);
  const [approvedBody, setApprovedBody] = useState("");
  const [running, setRunning] = useState(false);

  function pick(key:string){ setCur(key); setSteps(0); setDraftVisible(false); setEditMode(false); setApproved(false); setApprovedBody(""); setRunning(false); }
  function run(){
    setSteps(0); setDraftVisible(false); setEditMode(false); setApproved(false); setApprovedBody(""); setRunning(true);
    const a = agentData.find(x=>x.key===cur)!;
    a.steps.forEach((_,i)=>setTimeout(()=>setSteps(i+1),(i+1)*480));
    setTimeout(()=>setDraftVisible(true),(a.steps.length+1)*480);
  }
  function approve(){ const a=agentData.find(x=>x.key===cur)!; setApprovedBody(editMode?editText:a.draft.body); setApproved(true); }

  const a = agentData.find(x=>x.key===cur)!;
  const isWip = a.draft.wip;
  const showStatic = !running;

  return (
    <div className="panel">
      <div className="bar">
        <div className="wm">j<i>.</i>ai · Agent Console</div>
        <div className="live"><i></i> {agentData.length} agents live</div>
      </div>
      <div className="pgrid">
        <div className="side">
          <div className="lbl">Agents</div>
          {agentData.map(ag=>(
            <button key={ag.key} className={"it"+(cur===ag.key?" on":"")} onClick={()=>pick(ag.key)}>
              <span className="d" style={{ background:DOTS[ag.dot] }} /> {ag.name}
            </button>
          ))}
        </div>
        <div className="main">
          <div className="hd">
            <div>
              <div className="t">{a.name} · {a.role}</div>
              <div className="m">{a.meta.join(" · ")}</div>
            </div>
            <button className="run" onClick={run}>▶ Run</button>
          </div>

          {showStatic && !approved && (
            <div style={{ padding:"40px 0",textAlign:"center",color:"var(--faint-on-dark)",fontFamily:"var(--fm)",fontSize:13 }}>
              Press <span style={{ color:"var(--accent)" }}>Run</span> to watch {a.name} work.
            </div>
          )}

          {running && a.steps.map((s:any,i:number)=>(
            <div key={i} className="stp" style={{ opacity:i<steps?1:0,transform:i<steps?"none":"translateY(6px)",transition:"opacity .35s,transform .35s" }}>
              <div className="ck">✓</div>
              <div><div className="st">{s.t}</div><div className="sd">{s.d}</div></div>
            </div>
          ))}

          {running && draftVisible && !approved && (
            <div className="draft">
              <div className="dh"><span>{a.draft.head}</span><span className="aw">● awaiting your approval</span></div>
              <div className="db">
                {isWip ? <WipRows/> : editMode ? (
                  <textarea value={editText} onChange={e=>setEditText(e.target.value)} />
                ) : (<>
                  <div className="sj">{a.draft.subj}</div>
                  <div className="bd">{a.draft.body}</div>
                </>)}
              </div>
              {!isWip && (
                <div className="df">
                  {editMode ? (<>
                    <button className="pri" onClick={approve}>Save &amp; approve</button>
                    <button onClick={()=>setEditMode(false)}>Cancel</button>
                  </>) : (<>
                    <button className="pri" onClick={approve}>Approve</button>
                    <button onClick={()=>{setEditMode(true);setEditText(a.draft.body);}}>Edit</button>
                    <button onClick={()=>{setDraftVisible(false);setRunning(false);setSteps(0);}}>Skip</button>
                  </>)}
                </div>
              )}
              {isWip && (
                <div className="df"><button className="pri" onClick={approve}>Mark reviewed</button></div>
              )}
            </div>
          )}

          {approved && (
            <div style={{ marginTop:22 }}>
              <div className="approved-badge">✓ Approved</div>
              <div className="draft" style={{ marginTop:0 }}>
                <div className="dh"><span>{a.approved.head}</span><span style={{ color:"var(--dot-b)" }}>● approved</span></div>
                <div className="db">
                  {a.approved.wip ? <WipRows/> : (<>
                    <div className="sj">{a.approved.subj}</div>
                    <div className="bd">{approvedBody || a.approved.body}</div>
                  </>)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CustomForm() {
  const [fd, setFd] = useState({ name:"", email:"", firmName:"", firmSize:"", pms:"", agents:[] as string[], message:"" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const agentOpts = ["Hermes","Athena","Hestia","Plutus","Charis","Apollo","Kronos","Iris","Custom build"];
  function toggle(a:string){ setFd(p=>({...p,agents:p.agents.includes(a)?p.agents.filter(x=>x!==a):[...p.agents,a]})); }
  async function submit(e:React.FormEvent){
    e.preventDefault(); setSubmitting(true); setError("");
    try {
      await fetch(WEBHOOK_URL, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ name:fd.name, email:fd.email, firm_name:fd.firmName, firm_size:fd.firmSize, pms:fd.pms, agents_of_interest:fd.agents.join(", "), message:fd.message, submitted_at:new Date().toISOString(), source:"jdotai.com/legal" }) });
      setSubmitted(true);
    } catch { setError("Something went wrong. Please email " + EMAIL + " directly."); }
    setSubmitting(false);
  }
  if (submitted) return (
    <div className="form-done">
      <div className="tick">✓</div>
      <h3>Submitted.</h3>
      <p>We will be in touch within 24 hours.</p>
    </div>
  );
  return (
    <form className="form" onSubmit={submit}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
        <div>
          <label className="fl">Full name</label>
          <input className="fi" required type="text" placeholder="Jane Smith" value={fd.name} onChange={e=>setFd(p=>({...p,name:e.target.value}))} />
        </div>
        <div>
          <label className="fl">Email</label>
          <input className="fi" required type="email" placeholder="jane@smithlaw.com" value={fd.email} onChange={e=>setFd(p=>({...p,email:e.target.value}))} />
        </div>
        <div>
          <label className="fl">Firm name</label>
          <input className="fi" required type="text" placeholder="Smith Family Law" value={fd.firmName} onChange={e=>setFd(p=>({...p,firmName:e.target.value}))} />
        </div>
        <div>
          <label className="fl">Firm size</label>
          <select className="fi" required value={fd.firmSize} onChange={e=>setFd(p=>({...p,firmSize:e.target.value}))}>
            <option value="" disabled>Select staff count</option>
            <option>1 to 5</option><option>6 to 10</option><option>11 to 15</option><option>15 or more</option>
          </select>
        </div>
      </div>
      <label className="fl">Practice management system</label>
      <select className="fi" required value={fd.pms} onChange={e=>setFd(p=>({...p,pms:e.target.value}))}>
        <option value="" disabled>Select your PMS</option>
        <option>Smokeball</option><option>Clio</option><option>LEAP</option><option>Actionstep</option><option>Other</option>
      </select>
      <label className="fl">Which agents interest you?</label>
      <div className="chips">
        {agentOpts.map(a=>(
          <button key={a} type="button" className={fd.agents.includes(a)?"on":""} onClick={()=>toggle(a)}>{a}</button>
        ))}
      </div>
      <label className="fl">What do you want to automate?</label>
      <textarea className="fi" required placeholder="Describe the tasks taking up your team's time, or the specific workflow you have in mind..." value={fd.message} onChange={e=>setFd(p=>({...p,message:e.target.value}))} />
      {error && <p style={{ color:"var(--accent)", fontSize:13, marginBottom:12 }}>{error}</p>}
      <button className="sub" type="submit" disabled={submitting}>{submitting?"Sending...":"Send enquiry"}</button>
    </form>
  );
}

const FAQS = [
  { q:"What practice management systems do you connect to?", a:"Smokeball, LEAP, Clio, and Actionstep." },
  { q:"Do my clients ever receive anything automatically?", a:"No. Every agent output lands in your j.ai dashboard first. You review it, approve it, edit it, or skip it. Nothing reaches a client without a human deciding." },
  { q:"How long does it take to get set up?", a:"One onboarding call. We collect your credentials, request access, and configure each agent for your firm, you are live in less than 1 week." },
  { q:"Do I need to be technical to use this?", a:"No. Everything runs through your j.ai dashboard. You approve, edit, or skip. We handle the rest." },
  { q:"What if I want something built that isn't in the standard library?", a:"That is what the custom build request is for. Tell us the workflow or the problem. We scope it, price it, and build it connected to your existing systems." },
];

export default function Legal() {
  const [menu, setMenu] = useState(false);
  useEffect(() => { window.scrollTo(0,0); }, []);
  return (
    <div className="legal-root">
      {/* MASTHEAD */}
      <div className="l-mast">
        <div className="in">
          <Wordmark />
          <div className="nav">
            <Link href="/">Work</Link>
            <a className="live">Legal</a>
            <a href="#book">Book a call</a>
          </div>
          <button className="hamb" onClick={()=>setMenu(true)} aria-label="Open menu" style={{ color:"var(--paper)" }}><span/><span/><span/></button>
        </div>
      </div>
      <MobileSheet open={menu} onClose={()=>setMenu(false)} dark links={[
        { label:"Work", href:"/" },
        { label:"Legal", href:"/legal" },
        { label:"Book a call", href:"/legal#book", solid:true },
      ]} />

      {/* HERO */}
      <section className="l-hero">
        <div className="wrap">
          <Reveal className="eyebrow">j.ai · for legal firms</Reveal>
          <Reveal as="h1">If a task doesn't need your judgement, it shouldn't need your time.</Reveal>
          <Reveal as="p" className="lede">j.ai connects to Smokeball, Clio, LEAP and Actionstep, maps the repeatable work in your firm, and runs it as agents. You approve every output.</Reveal>
          <Reveal className="go">
            <a href="#library" className="btn btn-solid">See the library</a>
            <a href="#book" className="btn btn-line">Book a call</a>
          </Reveal>
          <Reveal className="connects"><span>Smokeball</span><span>Clio</span><span>LEAP</span><span>Actionstep</span></Reveal>
        </div>
      </section>

      {/* AGENT LIBRARY */}
      <section className="l-lib" id="library">
        <div className="wrap">
          <Reveal className="sec-head">
            <h2>The agent library.</h2>
            <div className="note">Eight agents, Each owns one task. All talking to each other.</div>
          </Reveal>
          <Reveal className="bento">
            {agentData.map(ag=>(
              <div key={ag.key} className={"cell"+(ag.span?" "+ag.span:"")}>
                <div className="top">
                  <span className="dot" style={{ background:DOTS[ag.dot] }} />
                  <span className="name">{ag.name}</span>
                  <span className="role">{ag.role}</span>
                </div>
                <p>{ag.desc}</p>
              </div>
            ))}
          </Reveal>
          <div className="more-line">and more…</div>
        </div>
      </section>

      {/* WORKBENCH */}
      <section className="l-run">
        <div className="wrap">
          <Reveal className="sec-head">
            <h2>Built for your firm</h2>
            <div className="note">Agents do the work. You bring the judgment. Edit, approve or skip.</div>
          </Reveal>
          <Reveal><Console /></Reveal>
        </div>
      </section>

      {/* CONNECTED LAYER */}
      <section className="l-layer">
        <div className="wrap">
          <div className="grid">
            <div>
              <Reveal as="h2">Not eight tools. One connected layer.</Reveal>
              <Reveal as="p">A flag from one agent becomes context for the next. The firm gets a memory, not a pile of disconnected scripts.</Reveal>
            </div>
            <div className="two">
              <Reveal className="c"><div className="n"><span className="dot" style={{ background:"var(--dot-d)" }} />Kronos · Intelligence layer</div><p>Connects every agent into one view of each client, passes context between them, and decides when the next action is due.</p></Reveal>
              <Reveal className="c"><div className="n"><span className="dot" style={{ background:"var(--dot-e)" }} />Iris · Health monitor</div><p>Scores every active relationship and surfaces clients going quiet before they leave.</p></Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM BUILDS */}
      <section className="l-custom" id="custom">
        <div className="wrap">
          <div className="grid">
            <Reveal>
              <h2>Need something built for how your firm runs?</h2>
              <p className="p">Not every firm works the same way. If you have a process or a problem no standard agent covers, we scope it and build it, connected to the systems you already use.</p>
              <p className="p">Connected to your existing tools. Shaped around how you actually work. Delivered as an agent that runs itself.</p>
            </Reveal>
            <Reveal><CustomForm /></Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="l-faq">
        <div className="wrap">
          <Reveal as="h2">Frequently asked questions.</Reveal>
          <Reveal className="faq">
            {FAQS.map((f,i)=>(
              <details key={i}>
                <summary>{f.q}<span className="pl">+</span></summary>
                <div className="a">{f.a}</div>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* BOOKING — embedded Cal.com */}
      <section className="l-book" id="book">
        <div className="wrap">
          <Reveal className="sec-head">
            <h2>Book a call.</h2>
            
          </Reveal>
          <Reveal>
            <iframe src={CAL_EMBED} style={{ width:"100%", height:680, border:"1px solid var(--line-dark)", borderRadius:8, background:"var(--deep-2)" }} title="Book a call" />
          </Reveal>
        </div>
      </section>

      {/* CLOSE CTA */}
      <section className="l-close">
        <div className="wrap">
          <Reveal as="h2">Stop doing work that shouldn't need you.</Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="in">
          <div>
            <Wordmark className="mk" />
            <div className="tag">AI agents for legal firms</div>
          </div>
          <div className="r">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="li-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
            <span className="cp">© 2026 j.ai</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
