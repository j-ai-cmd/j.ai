import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

const WEBHOOK_URL = "https://hook.eu1.make.com/waciaz78ykdmfaxh4glg6vdhjjqi4jh5";
const BLUE = "#2C3EE8";
const NAVY = "#0F1729";

const ANIM_CSS = `
  .rl-word{display:inline-block;margin-right:0.28em;opacity:0;transform:translateY(16px);transition:opacity 0.45s ease,transform 0.45s ease}
  .rl-word.vis{opacity:1;transform:translateY(0)}
  .rev-el{opacity:0;transform:translateY(18px);transition:opacity 0.5s ease,transform 0.5s ease}
  .rev-el.vis{opacity:1;transform:translateY(0)}
  .stag-item{opacity:0;transform:translateY(20px);transition:opacity 0.45s ease,transform 0.45s ease}
  .stag-item.vis{opacity:1;transform:translateY(0)}
  .slide-l{opacity:0;transform:translateX(-36px);transition:opacity 0.5s ease,transform 0.5s ease}
  .slide-r{opacity:0;transform:translateX(36px);transition:opacity 0.5s ease,transform 0.5s ease}
  .slide-l.vis,.slide-r.vis{opacity:1;transform:translateX(0)}
  .dot-grid-bg{background-image:radial-gradient(circle,#c5caff 1px,transparent 1px);background-size:28px 28px}
  .grad-card{position:relative;border-radius:16px}
  .grad-card::before{content:"";position:absolute;inset:0;border-radius:16px;padding:1px;background:linear-gradient(135deg,rgba(120,140,255,0.7),rgba(44,62,232,0.2));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
  .grad-card:hover::before{background:linear-gradient(135deg,rgba(160,175,255,0.9),rgba(44,62,232,0.5))}
  .agent-flip-card{perspective:1000px}
  .agent-flip-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 0.5s cubic-bezier(.4,.2,.2,1)}
  .agent-flip-card.flipped .agent-flip-inner{transform:rotateY(180deg)}
  .agent-flip-face{position:absolute;inset:0;backface-visibility:hidden;display:flex;flex-direction:column;border-radius:12px;padding:22px}
  .agent-flip-back{transform:rotateY(180deg);background:#2C3EE8}
  .faq-item{border-bottom:1px solid rgba(255,255,255,0.12)}
  .faq-answer{max-height:0;overflow:hidden;transition:max-height 0.35s ease,padding 0.35s ease}
  .faq-answer.open{max-height:200px}
`;

function WordReveal({ text, color = "#fff", style = {} }: { text: string; color?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={style}>
      {text.split(" ").map((w, i) => (
        <span key={i} className={"rl-word" + (triggered ? " vis" : "")}
          style={{ color, transitionDelay: triggered ? i * 68 + "ms" : "0ms" }}>{w}</span>
      ))}
    </div>
  );
}

function RevEl({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => el.classList.add("vis"), delay); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="rev-el" style={style}>{children}</div>;
}

function StagGrid({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        Array.from(el.children).forEach((c, i) => setTimeout(() => (c as HTMLElement).classList.add("vis"), i * 80));
        obs.disconnect();
      }
    }, { threshold: 0.05 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return <div ref={ref} style={style}>{children}</div>;
}

const agentData = [
  { key:"hermes", name:"Hermes", role:"Past client reactivation", dot:"#4ade80", desc:"Scans closed matters and drafts re-engagement emails for clients who have not been contacted in over 12 months.", meta:["Connected to Smokeball","847 matters scanned","3 drafts ready"], steps:[{t:"Connected to Smokeball",d:"Authenticated · api.smokeball.com.au · token valid"},{t:"Scanning 847 closed matters",d:"Filtering: closed more than 12 months ago"},{t:"3 clients qualify",d:"Margaret Chen · Robert Okafor · Susan Park"},{t:"Fetching contact details",d:"Names and emails pulled from contacts API"},{t:"Checking contact log",d:"None contacted in last 6 months · all clear"}], draft:{head:"Draft ready · Margaret Chen · Wills and Trusts",subj:"Reviewing your estate plan",body:"Hi Margaret,\n\nIt has been over two years since we helped you put your Will and Powers of Attorney in place.\n\nWe would love to offer you a brief complimentary review. Would 20 minutes work?\n\nWarm regards,\nSutton Family Law",actions:true,wip:false}, approved:{head:"Draft 1 of 3 · Margaret Chen · approved",subj:"Reviewing your estate plan",body:"Hi Margaret, it has been over two years. We would love to offer a brief review. Would 20 minutes work?\n\nWarm regards, Sutton Family Law",wip:false} },
  { key:"athena", name:"Athena", role:"Pre-meeting brief", dot:"#2C3EE8", desc:"Reads the intake form the moment it is submitted and delivers a structured brief before the meeting starts.", meta:["James Okafor","Form received 2 min ago","Prior matter found"], steps:[{t:"Intake form received",d:"James Okafor · submitted 2 minutes ago"},{t:"Searching prior matters",d:"1 prior matter found · property purchase 2021"},{t:"Pulling meeting notes",d:"2 file notes found from prior consultation"},{t:"Analysing intake answers",d:"Divorce flagged · no current Will · blended family"}], draft:{head:"Brief ready · James Okafor · 10am",subj:"Pre-meeting brief",body:"Background: Returning client. Post-divorce estate planning.\n\nRed flags: Recent divorce · No Will · Blended family\n\nSteer: Prioritise EPOA and super nominations.",actions:false,wip:false}, approved:{head:"Brief · James Okafor · approved",subj:"Pre-meeting brief",body:"Background: Post-divorce. Red flags: No Will · Blended family. Steer: EPOA first.",wip:false} },
  { key:"hestia", name:"Hestia", role:"New client welcome", dot:"#4ade80", desc:"Drafts a warm, personalised welcome email the moment a new client is confirmed.", meta:["Sarah Williams","Confirmed today","Draft ready"], steps:[{t:"New client confirmed",d:"Sarah Williams · property settlement"},{t:"Pulling matter details",d:"Matter type, responsible lawyer, firm name"},{t:"Draft ready",d:"Personalised welcome email queued for approval"}], draft:{head:"Draft ready · Sarah Williams",subj:"Welcome to Sutton Family Law, Sarah",body:"Hi Sarah,\n\nIt was great to meet you today. We are glad to be helping you with your property settlement.\n\nWarm regards,\nSutton Family Law",actions:true,wip:false}, approved:{head:"Welcome · Sarah Williams · approved",subj:"Welcome to Sutton Family Law, Sarah",body:"Hi Sarah, it was great to meet you. We will be in touch shortly.\n\nWarm regards, Sutton Family Law",wip:false} },
  { key:"plutus", name:"Plutus", role:"Unbilled time chaser", dot:"#f59e0b", desc:"Surfaces unbilled WIP every Monday so it does not get written off. Goes to the fee earner only, never clients.", meta:["Last run: Monday","3 matters found","£3,520 surfaced"], steps:[{t:"Connected to billing data",d:"Pulling all open matters with time entries"},{t:"Finding unbilled WIP",d:"Entries older than 14 days · 3 matters found"},{t:"WIP summary ready",d:"Fee earner nudge queued · internal only"}], draft:{head:"WIP summary ready · fee earner only",subj:"wip",body:"",actions:false,wip:true}, approved:{head:"WIP summary · sent Monday",subj:"Your unbilled time this week",body:"wip",wip:true} },
  { key:"charis", name:"Charis", role:"Post-matter referral", dot:"#4ade80", desc:"Drafts a thank-you with a soft review ask and referral line 7 days after a matter closes.", meta:["2 matters closed","This week","2 drafts ready"], steps:[{t:"Matter closed detected",d:"David Okafor · estate planning · closed 7 days ago"},{t:"Checking excluded matter types",d:"Estate planning not excluded · proceeding"},{t:"Draft ready",d:"Thank-you + review ask + referral line"}], draft:{head:"Draft ready · David Okafor",subj:"Thank you, David",body:"Hi David,\n\nNow that your matter is wrapped up, we wanted to say thank you. It was a genuine pleasure.\n\nA Google review would mean a lot. And if you know anyone who needs estate planning help, we would love an introduction.\n\nWarmly,\nSutton Family Law",actions:true,wip:false}, approved:{head:"Draft 1 of 2 · David Okafor · approved",subj:"Thank you, David",body:"Hi David, thank you. A Google review would mean a lot. If you know anyone who needs help, we would love an introduction.\n\nWarmly, Sutton Family Law",wip:false} },
  { key:"apollo", name:"Apollo", role:"Cross-sell intelligence", dot:"#2C3EE8", desc:"Reads client matter history against your service matrix and flags cross-sell gaps weekly.", meta:["312 clients scanned","3 gaps found","Drafts ready"], steps:[{t:"Reading matter history",d:"312 clients · all matter types reviewed"},{t:"Matching against service matrix",d:"Comparing what each client has vs what they may need"},{t:"3 gaps identified",d:"Will without EPOA · property without estate plan · business without succession"}], draft:{head:"Cross-sell opportunities · 3 found",subj:"3 clients who may need your help",body:"Margaret Chen · Has Will (2022), no EPOA on file.\n\nRobert Okafor · Property purchase 2021, no estate planning on record.\n\nSarah Williams · Business structure 2020, no succession plan on file.",actions:true,wip:false}, approved:{head:"Cross-sell · approved",subj:"3 clients who may need your help",body:"Margaret · no EPOA.\nRobert · no estate planning.\nSarah · no succession plan.",wip:false} },
  { key:"kronos", name:"Kronos", role:"Client intelligence layer", dot:"#a78bfa", desc:"Connects all agents into one client intelligence layer. Tracks every touchpoint, passes context between agents, and decides when the right action is due.", meta:["All agents connected","6 clients tracked","Context updated"], steps:[{t:"Reading client timeline",d:"James Okafor · 3 agents have run · context current"},{t:"Athena flagged: no Will, blended family",d:"Passing context to Charis for post-matter referral"},{t:"Apollo cross-sell queued",d:"EPOA gap flagged · outreach due in 14 days"}], draft:{head:"Intelligence update · James Okafor",subj:"Client context updated",body:"Athena flagged: post-divorce, no Will, blended family.\n\nHestia sent welcome: confirmed.\n\nCharis referral: pending 7-day delay.\n\nApollo: EPOA gap queued.",actions:false,wip:false}, approved:{head:"Client context · updated",subj:"Intelligence layer updated",body:"All agent context updated for James Okafor. Next action: Charis in 4 days.",wip:false} },
  { key:"iris", name:"Iris", role:"Client health monitor", dot:"#fb7185", desc:"Continuously scores every active client relationship. Surfaces at-risk clients before they leave quietly. Feeds health scores to Kronos.", meta:["47 active clients","3 at risk","Scores updated"], steps:[{t:"Scoring client relationships",d:"47 active clients · engagement, recency, value"},{t:"3 clients flagged as at-risk",d:"Score below 40 · more than 6 months since contact"},{t:"Alerting Kronos",d:"Hermes reactivation triggered for at-risk clients"}], draft:{head:"At-risk clients · 3 flagged",subj:"Client health update",body:"Margaret Chen · Score: 32 · Last contact: 8 months ago\n\nRobert Okafor · Score: 28 · Last contact: 11 months ago\n\nSusan Park · Score: 38 · Last contact: 7 months ago",actions:false,wip:false}, approved:{head:"Health scores updated",subj:"3 at-risk clients flagged",body:"3 clients flagged. Hermes reactivation queued for all three.",wip:false} },
];


function WipRows() {
  return (
    <div style={{ padding:"0 14px 8px" }}>
      {[["Chen · Property Settlement (18d)","£1,840"],["Okafor · Estate Planning (22d)","£960"],["Williams · Family Law (14d)","£720"]].map(([m,a]) => (
        <div key={m} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.1)",fontSize:12.5,color:"rgba(255,255,255,0.8)" }}>
          <span>{m}</span><span style={{ fontWeight:600,color:"#2C3EE8" }}>{a}</span>
        </div>
      ))}
      <div style={{ display:"flex",justifyContent:"space-between",marginTop:8,background:"rgba(44,62,232,0.3)",borderRadius:4,padding:"8px",fontSize:12.5,fontWeight:600,color:"#fff" }}>
        <span>Total surfaced</span><span>£3,520</span>
      </div>
    </div>
  );
}

function AgentFlipCard({ agent, onSelect }: { agent: any; onSelect:(k:string)=>void }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`agent-flip-card stag-item${flipped?" flipped":""}`}
      style={{ height:200,cursor:"pointer",background:"rgba(0,0,0,0.04)",border:"1px solid rgba(0,0,0,0.1)",borderRadius:12 }}
      onClick={() => setFlipped(f => !f)}>
      <div className="agent-flip-inner">
        <div className="agent-flip-face" style={{ background:"#fff",justifyContent:"flex-start" }}>
          <span style={{ width:8,height:8,borderRadius:"50%",background:agent.dot,display:"block",marginBottom:16 }} />
          <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:17,color:NAVY,marginBottom:4 }}>{agent.name}</div>
          <div style={{ fontSize:12,color:"#888899",marginBottom:"auto" }}>{agent.role}</div>
          <div style={{ fontSize:11,color:BLUE,marginTop:12 }}>Click to see what it handles</div>
        </div>
        <div className="agent-flip-face agent-flip-back" style={{ justifyContent:"flex-start",padding:22 }}>
          <p style={{ fontSize:13,color:"#e4e6ff",lineHeight:1.65,marginBottom:16,marginTop:0 }}>{agent.desc}</p>
          <button onClick={e=>{e.stopPropagation();onSelect(agent.key);}}
            style={{ fontSize:12,fontWeight:600,color:"#fff",border:"1px solid rgba(255,255,255,0.4)",background:"transparent",borderRadius:4,padding:"6px 14px",cursor:"pointer",alignSelf:"flex-start" }}>
            See it run →
          </button>
        </div>
      </div>
    </div>
  );
}

function Console({ initialAgent }: { initialAgent:string }) {
  const [cur, setCur] = useState(initialAgent);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [steps, setSteps] = useState(0);
  const [draftVisible, setDraftVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [approved, setApproved] = useState(false);
  const [approvedBody, setApprovedBody] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{setCur(initialAgent);},[initialAgent]);

  function pick(key:string){setCur(key);setOverlayOpen(false);setSteps(0);setDraftVisible(false);setEditMode(false);setApproved(false);setApprovedBody("");}
  function run(){
    setOverlayOpen(true);setSteps(0);setDraftVisible(false);setEditMode(false);setApproved(false);setApprovedBody("");
    const a=agentData.find(x=>x.key===cur)!;
    a.steps.forEach((_,i)=>setTimeout(()=>setSteps(i+1),(i+1)*420));
    setTimeout(()=>{setDraftVisible(true);setTimeout(()=>{if(scrollRef.current)scrollRef.current.scrollTop=scrollRef.current.scrollHeight;},100);},(a.steps.length+1)*420);
  }
  function approve(){const a=agentData.find(x=>x.key===cur)!;setApprovedBody(editMode?editText:a.draft.body);setApproved(true);setOverlayOpen(false);}
  const a=agentData.find(x=>x.key===cur)!;
  const isWip=a.draft.wip;

  return (
    <div style={{ borderRadius:12,overflow:"hidden",border:"1px solid rgba(0,0,0,0.1)",boxShadow:"0 4px 32px rgba(0,0,0,0.12)" }}>
      <div style={{ background:NAVY,padding:"12px 16px",display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ display:"flex",gap:5 }}>
          {["#FF5F57","#FEBC2E","#28C840"].map(c=><span key={c} style={{ width:9,height:9,borderRadius:"50%",background:c,display:"block" }} />)}
        </div>
        <span style={{ fontSize:11,color:"rgba(255,255,255,0.5)",flex:1,textAlign:"center" }}>j.ai · Agent Console · Sutton Family Law</span>
        <span style={{ fontSize:11,color:"#4ade80",display:"flex",alignItems:"center",gap:5 }}>
          <span style={{ width:6,height:6,borderRadius:"50%",background:"#4ade80",display:"inline-block" }} />6 agents live
        </span>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"220px 1fr",minHeight:650 }}>
        {/* Sidebar — white */}
        <div style={{ background:"#fff",borderRight:"1px solid rgba(0,0,0,0.07)" }}>
          <div style={{ padding:"11px 14px",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"#888899",borderBottom:"1px solid rgba(0,0,0,0.07)" }}>Agents</div>
          {agentData.map(ag=>(
            <button key={ag.key} onClick={()=>pick(ag.key)}
              style={{ width:"100%",padding:"12px 14px",background:cur===ag.key?"rgba(44,62,232,0.07)":"transparent",border:"none",borderLeft:`2px solid ${cur===ag.key?BLUE:"transparent"}`,borderBottom:"1px solid rgba(0,0,0,0.05)",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:9 }}>
              <span style={{ width:6,height:6,borderRadius:"50%",background:ag.dot,display:"block",flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13,fontWeight:600,color:"#1A1A2E" }}>{ag.name}</div>
                <div style={{ fontSize:10,color:"#888899",marginTop:1 }}>{ag.role}</div>
              </div>
            </button>
          ))}
        </div>
        {/* Main panel — navy */}
        <div style={{ display:"flex",flexDirection:"column",position:"relative",background:NAVY }}>
          <div style={{ padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:15,fontWeight:600,color:"#fff" }}>{a.name} · {a.role}</div>
              <div style={{ fontSize:11.5,color:"rgba(255,255,255,0.5)",marginTop:2 }}>{a.meta.join(" · ")}</div>
            </div>
            <button onClick={run} style={{ fontSize:12.5,padding:"8px 18px",background:BLUE,color:"#fff",border:"none",borderRadius:4,cursor:"pointer",fontWeight:600 }}>▶ See it run</button>
          </div>
          <div style={{ padding:20,flex:1,overflowY:"auto" }}>
            {approved?(
              <div>
                <div style={{ display:"inline-flex",alignItems:"center",gap:4,background:"rgba(74,222,128,0.15)",color:"#4ade80",fontSize:11,fontWeight:600,padding:"3px 12px",borderRadius:10,marginBottom:16 }}>✓ Approved</div>
                <div style={{ background:"rgba(255,255,255,0.08)",borderRadius:8,border:"1px solid rgba(255,255,255,0.15)",overflow:"hidden" }}>
                  <div style={{ padding:"8px 14px",borderBottom:"1px solid rgba(255,255,255,0.1)",display:"flex",justifyContent:"space-between",fontSize:11,color:"rgba(255,255,255,0.5)" }}>
                    <span>{a.approved.head}</span><span style={{ color:"#4ade80" }}>● Approved</span>
                  </div>
                  {a.approved.wip?<WipRows/>:<div style={{ padding:14,fontSize:13,color:"rgba(255,255,255,0.7)",lineHeight:1.6 }}><p style={{ fontWeight:600,color:"#fff",marginBottom:8,marginTop:0 }}>{a.approved.subj}</p><p style={{ whiteSpace:"pre-line",margin:0 }}>{approvedBody||a.approved.body}</p></div>}
                </div>
              </div>
            ):(
              <div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:16 }}>
                  {a.meta.map((m:string)=><span key={m} style={{ fontSize:11,color:"rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.1)",padding:"3px 12px",borderRadius:10 }}>{m}</span>)}
                </div>
                <div style={{ padding:"48px 0",textAlign:"center",fontSize:13.5,color:"rgba(255,255,255,0.4)",lineHeight:1.7 }}>
                  Click <strong style={{ color:"#fff" }}>▶ See it run</strong> to watch this agent work and see what it does.
                </div>
              </div>
            )}
          </div>
          {overlayOpen&&(
            <div style={{ position:"absolute",inset:0,background:NAVY,zIndex:10,display:"flex",flexDirection:"column" }}>
              <div style={{ padding:"14px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0 }}>
                <div style={{ fontSize:14,fontWeight:600,color:"#fff" }}>Watching {a.name} run</div>
                <button onClick={()=>setOverlayOpen(false)} style={{ background:"none",border:"none",fontSize:20,color:"rgba(255,255,255,0.5)",cursor:"pointer" }}>✕</button>
              </div>
              <div style={{ padding:20,overflowY:"auto",flex:1 }} ref={scrollRef}>
                {a.steps.map((s:any,i:number)=>(
                  <div key={i} style={{ display:"flex",gap:11,marginBottom:16,opacity:i<steps?1:0,transform:i<steps?"none":"translateY(5px)",transition:"opacity 0.3s,transform 0.3s" }}>
                    <div style={{ display:"flex",flexDirection:"column",alignItems:"center" }}>
                      <div style={{ width:26,height:26,borderRadius:"50%",background:"rgba(74,222,128,0.15)",border:"1px solid rgba(74,222,128,0.3)",color:"#4ade80",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0 }}>✓</div>
                      {i<a.steps.length-1&&<div style={{ width:1,flex:1,minHeight:10,background:"rgba(255,255,255,0.15)",margin:"2px 0" }} />}
                    </div>
                    <div style={{ paddingTop:2,flex:1 }}>
                      <div style={{ fontSize:13,fontWeight:600,color:"#fff" }}>{s.t}</div>
                      <div style={{ fontSize:11.5,color:"rgba(255,255,255,0.5)",marginTop:2 }}>{s.d}</div>
                    </div>
                  </div>
                ))}
                {draftVisible&&(
                  <div style={{ display:"flex",gap:11,marginBottom:16 }}>
                    <div style={{ width:26,height:26,borderRadius:"50%",background:"rgba(44,62,232,0.3)",border:"1px solid rgba(44,62,232,0.5)",color:"#a5b4fc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,flexShrink:0,marginTop:1 }}>AI</div>
                    <div style={{ flex:1,paddingTop:2 }}>
                      <div style={{ fontSize:13,fontWeight:600,color:"#fff",marginBottom:8 }}>{a.draft.head}</div>
                      <div style={{ background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,overflow:"hidden" }}>
                        {isWip?<WipRows/>:editMode?(
                          <textarea style={{ width:"100%",padding:14,fontSize:13,color:"#fff",lineHeight:1.6,border:"none",background:"transparent",resize:"none",outline:"none",minHeight:140,fontFamily:"inherit",boxSizing:"border-box" }} value={editText} onChange={e=>setEditText(e.target.value)} />
                        ):(
                          <div style={{ padding:14,fontSize:13,color:"rgba(255,255,255,0.7)",lineHeight:1.6 }}>
                            <p style={{ fontWeight:600,color:"#fff",marginBottom:8,marginTop:0 }}>{a.draft.subj}</p>
                            <p style={{ whiteSpace:"pre-line",margin:0 }}>{a.draft.body}</p>
                          </div>
                        )}
                        <div style={{ display:"flex",gap:7,padding:10,borderTop:"1px solid rgba(255,255,255,0.12)" }}>
                          {editMode?(<>
                            <button onClick={approve} style={{ fontSize:11.5,padding:"5px 14px",background:BLUE,color:"#fff",border:"none",borderRadius:4,cursor:"pointer",fontWeight:600 }}>Save and approve</button>
                            <button onClick={()=>setEditMode(false)} style={{ fontSize:11.5,padding:"5px 14px",background:"rgba(255,255,255,0.1)",color:"#fff",border:"1px solid rgba(255,255,255,0.2)",borderRadius:4,cursor:"pointer",fontWeight:600 }}>Cancel</button>
                          </>):(<>
                            <button onClick={approve} style={{ fontSize:11.5,padding:"5px 14px",background:BLUE,color:"#fff",border:"none",borderRadius:4,cursor:"pointer",fontWeight:600 }}>Approve</button>
                            {!isWip&&<button onClick={()=>{setEditMode(true);setEditText(a.draft.body);}} style={{ fontSize:11.5,padding:"5px 14px",background:"rgba(255,255,255,0.1)",color:"#fff",border:"1px solid rgba(255,255,255,0.2)",borderRadius:4,cursor:"pointer",fontWeight:600 }}>Edit</button>}
                            {a.draft.actions&&!isWip&&<button onClick={()=>setOverlayOpen(false)} style={{ fontSize:11.5,padding:"5px 14px",background:"rgba(255,255,255,0.1)",color:"#fff",border:"1px solid rgba(255,255,255,0.2)",borderRadius:4,cursor:"pointer",fontWeight:600 }}>Skip</button>}
                          </>)}
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
  const items = [
    { quote:"We had 400 closed matters sitting untouched. Within the first month, Hermes surfaced three clients who came back for new work. One of them turned into a $6,000 estate planning matter.", name:"Managing Partner", firm:"Estate Planning Firm, Sydney AU" },
    { quote:"The pre-meeting brief alone is worth it. I walk into every consultation knowing exactly who I am meeting and what to watch out for. It used to take me 20 minutes. Now it is there before I have finished my coffee.", name:"Principal Solicitor", firm:"Family Law Practice, London UK" },
    { quote:"We were writing off around £2,000 a week in unbilled time without realising it. Plutus surfaced it every Monday. We have recovered most of it just by having someone look at the list.", name:"Senior Associate", firm:"Conveyancing Practice, Melbourne AU" },
    { quote:"Charis sent a thank-you email to a client we had not thought about in months. She replied the same day asking about updating her EPOA. That is a matter we would never have found otherwise.", name:"Principal", firm:"Boutique Practice, London UK" },
  ];
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left"|"right">("right");
  const [displayed, setDisplayed] = useState(0);

  function goTo(i:number,dir:"left"|"right"){
    if(animating||i===active)return;
    setDirection(dir);setAnimating(true);
    setTimeout(()=>{setDisplayed(i);setActive(i);setAnimating(false);},300);
  }

  const t=items[displayed];
  return (
    <div>
      <div style={{ display:"flex",alignItems:"stretch",gap:16 }}>
        <button onClick={()=>goTo(Math.max(0,active-1),"left")} disabled={active===0} aria-label="Previous"
          style={{ width:44,flexShrink:0,borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",background:"transparent",color:NAVY,cursor:active===0?"default":"pointer",opacity:active===0?0.25:1,fontSize:20,transition:"opacity 0.2s",alignSelf:"center",height:44,display:"flex",alignItems:"center",justifyContent:"center" }}>←</button>
        <div style={{ flex:1,overflow:"hidden",borderRadius:16 }}>
          <div style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.08)",borderRadius:16,padding:"40px 48px",minHeight:220,display:"flex",flexDirection:"column",justifyContent:"space-between",
            opacity:animating?0:1,transform:animating?`translateX(${direction==="right"?"-30px":"30px"})`:"translateX(0)",transition:"opacity 0.28s ease,transform 0.28s ease" }}>
            <p style={{ color:"#333",fontSize:17,lineHeight:1.85,marginBottom:32,marginTop:0,fontStyle:"italic" }}>"{t.quote}"</p>
            <div>
              <div style={{ color:NAVY,fontWeight:600,fontSize:14 }}>{t.name}</div>
              <div style={{ color:"#888899",fontSize:12,marginTop:4 }}>{t.firm}</div>
              <div style={{ color:"#ccc",fontSize:10,marginTop:4,textTransform:"uppercase",letterSpacing:"0.05em" }}>Placeholder · to be replaced</div>
            </div>
          </div>
        </div>
        <button onClick={()=>goTo(Math.min(items.length-1,active+1),"right")} disabled={active===items.length-1} aria-label="Next"
          style={{ width:44,flexShrink:0,borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",background:"transparent",color:NAVY,cursor:active===items.length-1?"default":"pointer",opacity:active===items.length-1?0.25:1,fontSize:20,transition:"opacity 0.2s",alignSelf:"center",height:44,display:"flex",alignItems:"center",justifyContent:"center" }}>→</button>
      </div>
      <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:20 }}>
        {items.map((_,i)=>(
          <button key={i} onClick={()=>goTo(i,i>active?"right":"left")}
            style={{ height:3,width:i===active?32:12,borderRadius:2,background:i===active?NAVY:"rgba(0,0,0,0.2)",border:"none",cursor:"pointer",padding:0,transition:"width 0.3s,background 0.3s" }} />
        ))}
      </div>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number|null>(null);
  const items = [
    { q:"What practice management systems do you connect to?", a:"Smokeball, LEAP, Clio, and Actionstep." },
    { q:"Do my clients ever receive anything automatically?", a:"No. Every agent output lands in your j.ai dashboard first. You review it, approve it, edit it, or skip it. Nothing reaches a client without a human deciding." },
    { q:"How long does it take to get set up?", a:"One onboarding call. We collect your credentials, configure each agent for your firm, and you are live." },
    { q:"Do I need to be technical to use this?", a:"No. Everything runs through your j.ai dashboard. You approve, edit, or skip. We handle everything else." },
    { q:"What if I want something built that is not in the standard library?", a:"That is what the custom build form on this page is for. Tell us the workflow or the problem. We scope it, price it, and build it connected to your existing systems." },
  ];
  return (
    <div style={{ maxWidth:760,margin:"0 auto" }}>
      {items.map((item,i)=>(
        <div key={i} className="faq-item">
          <button onClick={()=>setOpen(open===i?null:i)}
            style={{ width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"22px 0",background:"none",border:"none",cursor:"pointer",textAlign:"left" }}>
            <span style={{ fontSize:17,fontWeight:600,color:"#fff",lineHeight:1.4,paddingRight:24 }}>{item.q}</span>
            <span style={{ fontSize:22,color:"rgba(255,255,255,0.6)",flexShrink:0,transform:open===i?"rotate(45deg)":"none",transition:"transform 0.25s" }}>+</span>
          </button>
          <div className={"faq-answer"+(open===i?" open":"")} style={{ paddingBottom:open===i?"20px":0 }}>
            <p style={{ color:"rgba(255,255,255,0.75)",fontSize:16,lineHeight:1.75,margin:0 }}>{item.a}</p>
          </div>
        </div>
      ))}
      <div style={{ marginTop:40,textAlign:"center" }}>
        <a href="#custom" style={{ display:"inline-block",border:"1px solid rgba(255,255,255,0.35)",color:"#fff",background:"transparent",borderRadius:6,padding:"12px 28px",fontSize:14,fontWeight:600,textDecoration:"none",transition:"background 0.15s" }}
          onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.1)")}
          onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
          Have a different question? Get in touch →
        </a>
      </div>
    </div>
  );
}

function ContactForm() {
  const [fd,setFd]=useState({name:"",email:"",firmName:"",firmSize:"",pms:"",agents:[] as string[],message:""});
  const [submitted,setSubmitted]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [error,setError]=useState("");
  const agentOpts=["Hermes","Athena","Hestia","Plutus","Charis","Apollo","Kronos","Iris","Custom build"];
  function toggle(a:string){setFd(p=>({...p,agents:p.agents.includes(a)?p.agents.filter(x=>x!==a):[...p.agents,a]}))}
  async function submit(e:React.FormEvent){
    e.preventDefault();setSubmitting(true);setError("");
    try{
      await fetch(WEBHOOK_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:fd.name,email:fd.email,firm_name:fd.firmName,firm_size:fd.firmSize,pms:fd.pms,agents_of_interest:fd.agents.join(", "),message:fd.message,submitted_at:new Date().toISOString(),source:"jdotai.com/legal"})});
      setSubmitted(true);
    }catch{setError("Something went wrong. Please email admin@jdotai.com directly.")}
    setSubmitting(false);
  }
  if(submitted)return(
    <div style={{ background:"rgba(255,255,255,0.08)",borderRadius:16,padding:48,textAlign:"center" }}>
      <div style={{ fontSize:48,marginBottom:16,color:"#4ade80" }}>✓</div>
      <h3 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,color:"#fff",fontSize:28,margin:"0 0 12px" }}>Got it.</h3>
      <p style={{ color:"rgba(255,255,255,0.7)",fontSize:16,margin:0 }}>We will be in touch within 24 hours.</p>
    </div>
  );
  const inp:React.CSSProperties={width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#fff",padding:"8px 12px",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
  const lbl:React.CSSProperties={display:"block",fontSize:12,fontWeight:600,color:"#fff",marginBottom:6};
  return(
    <form onSubmit={submit} style={{ background:"rgba(255,255,255,0.06)",borderRadius:16,padding:32,border:"1px solid rgba(255,255,255,0.1)" }}>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
        <div><label style={lbl}>Full name</label><input required style={inp} type="text" placeholder="Jane Smith" value={fd.name} onChange={e=>setFd(p=>({...p,name:e.target.value}))} /></div>
        <div><label style={lbl}>Email</label><input required style={inp} type="email" placeholder="jane@smithlaw.com" value={fd.email} onChange={e=>setFd(p=>({...p,email:e.target.value}))} /></div>
        <div><label style={lbl}>Firm name</label><input required style={inp} type="text" placeholder="Smith Family Law" value={fd.firmName} onChange={e=>setFd(p=>({...p,firmName:e.target.value}))} /></div>
        <div><label style={lbl}>Firm size</label>
          <select required style={{...inp,cursor:"pointer"}} value={fd.firmSize} onChange={e=>setFd(p=>({...p,firmSize:e.target.value}))}>
            <option value="" disabled>Select staff count</option>
            <option>1 to 5</option><option>6 to 10</option><option>11 to 15</option><option>15 or more</option>
          </select>
        </div>
      </div>
      <div style={{ marginBottom:12 }}><label style={lbl}>Practice management system</label>
        <select required style={{...inp,cursor:"pointer"}} value={fd.pms} onChange={e=>setFd(p=>({...p,pms:e.target.value}))}>
          <option value="" disabled>Select your PMS</option>
          <option>Smokeball</option><option>Clio</option><option>LEAP</option><option>Actionstep</option><option>Other</option>
        </select>
      </div>
      <div style={{ marginBottom:12 }}><label style={lbl}>Which agents interest you?</label>
        <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
          {agentOpts.map(a=>(
            <button key={a} type="button" onClick={()=>toggle(a)}
              style={{ fontSize:11.5,padding:"4px 10px",borderRadius:20,border:"1px solid",borderColor:fd.agents.includes(a)?BLUE:"rgba(255,255,255,0.2)",background:fd.agents.includes(a)?BLUE:"transparent",color:"#fff",cursor:"pointer" }}>{a}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom:20 }}><label style={lbl}>What do you want to automate?</label>
        <textarea required style={{...inp,resize:"none",minHeight:90}} placeholder="Describe the tasks taking up your team's time, or the specific workflow you have in mind..." value={fd.message} onChange={e=>setFd(p=>({...p,message:e.target.value}))} />
      </div>
      {error&&<p style={{ color:"#f87171",fontSize:13,marginBottom:12 }}>{error}</p>}
      <button type="submit" disabled={submitting} style={{ width:"100%",background:BLUE,color:"#fff",fontWeight:600,fontSize:14,padding:"12px",borderRadius:8,border:"none",cursor:"pointer",opacity:submitting?0.5:1 }}>
        {submitting?"Sending...":"Send enquiry"}
      </button>
    </form>
  );
}

export default function Legal() {
  const [navCompressed, setNavCompressed] = useState(false);
  const [activeAgent, setActiveAgent] = useState("hermes");
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const h = () => setNavCompressed(window.scrollY > 80);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  function selectAgent(key: string) {
    setActiveAgent(key);
    setTimeout(() => consoleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  const navH = navCompressed ? 48 : 68;

  return (
    <div style={{ minHeight: "100dvh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{ANIM_CSS}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: BLUE }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", height: navH, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "height 0.3s" }}>
          <Link href="/"><img src="/logo-white.png" alt="j.ai" style={{ height: navCompressed ? 32 : 48, width: "auto", cursor: "pointer", transition: "height 0.3s", borderRadius: "18%" }} /></Link>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Link href="/" style={{ color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Home</Link>
            <a href="#cta" style={{ border: "1px solid #fff", color: "#fff", background: "transparent", borderRadius: 4, padding: "8px 20px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Book a Call</a>
          </div>
        </div>
      </nav>

      {/* 1 — HERO — blue */}
      <section style={{ background: BLUE, minHeight: "100dvh", display: "flex", alignItems: "center", paddingTop: navH }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <WordReveal text="If a task does not need your judgement, it should not need your time."
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(36px,5vw,58px)", lineHeight: 1.08, letterSpacing: "-0.03em", maxWidth: 820, marginBottom: 24 }} />
          <RevEl delay={600} style={{ marginBottom: 40 }}>
            <p style={{ color: "#fff", fontSize: 18, lineHeight: 1.7, maxWidth: 600, margin: 0 }}>
              Our dashboard connects to Smokeball, Clio, LEAP, Actionstep and more. We map every repeatable task in your firm and build agents that handle it.
            </p>
          </RevEl>
          <RevEl delay={750}>
            <div style={{ display: "flex", gap: 16 }}>
              <a href="#console" style={{ display: "inline-block", background: "#fff", color: BLUE, fontWeight: 600, fontSize: 15, padding: "14px 32px", borderRadius: 6, textDecoration: "none" }}>See the agents run</a>
              <a href="#cta" style={{ display: "inline-block", background: "transparent", border: "2px solid rgba(255,255,255,0.4)", color: "#fff", fontWeight: 600, fontSize: 15, padding: "13px 28px", borderRadius: 6, textDecoration: "none" }}>Book a call</a>
            </div>
          </RevEl>
        </div>
      </section>

      {/* 2 — AGENT CARDS — white */}
      <section style={{ background: "#fff", minHeight: "100dvh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <WordReveal text="Custom Agents. One Dashboard."
            color={NAVY}
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,36px)", marginBottom: 8 }} />
          <RevEl delay={300}>
            <p style={{ color: "#555566", fontSize: 15, margin: "0 0 40px" }}>Click any card to flip it. Hit "See it run" to watch the agent live.</p>
          </RevEl>
          <StagGrid style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {agentData.map(ag => (
              <AgentFlipCard key={ag.key} agent={ag} onSelect={selectAgent} />
            ))}
          </StagGrid>
        </div>
      </section>

      {/* 3 — CONSOLE — navy */}
      <section id="console" ref={consoleRef} style={{ background: NAVY, minHeight: "100dvh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <WordReveal text="Watch any agent run"
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,40px)", marginBottom: 8, textAlign: "center" } as React.CSSProperties} />
          <RevEl delay={300}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, margin: "0 0 40px", textAlign: "center" }}>Select an agent, click Run, and see exactly what it does.</p>
          </RevEl>
          <Console initialAgent={activeAgent} />
        </div>
      </section>

      {/* 4 — CASE STUDIES — blue */}
      <section style={{ background: BLUE, minHeight: "100dvh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <RevEl>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>Client outcomes</div>
          </RevEl>
          <WordReveal text="Real firms. Real results."
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,40px)", marginBottom: 8 }} />
          <RevEl delay={200}>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, margin: "0 0 48px" }}>Names withheld. Numbers real.</p>
          </RevEl>

          {/* Case study 1 — Hermes */}
          <RevEl delay={300}>
            <div style={{ borderRadius: 16, overflow: "hidden", display: "flex", marginBottom: 24, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ background: NAVY, width: "34%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 56, fontWeight: 800, color: "#fff", lineHeight: 1 }}>3</div>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", marginTop: 8, textAlign: "center" }}>new matters<br/>in 30 days</div>
                <div style={{ margin: "20px 0", width: 32, height: 1, background: "rgba(255,255,255,0.15)" }} />
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 48, fontWeight: 800, color: "#fff", lineHeight: 1 }}>$6k</div>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", marginTop: 8, textAlign: "center" }}>value of first<br/>returned matter</div>
              </div>
              <div style={{ background: "#fff", flex: 1, padding: "36px 40px" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: BLUE, fontWeight: 600, marginBottom: 14 }}>Hermes · Estate Planning · Sydney AU</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 22, color: NAVY, marginBottom: 16, lineHeight: 1.25 }}>From 400 closed matters to 3 new clients in 30 days.</div>
                <p style={{ color: "#555566", fontSize: 15, lineHeight: 1.75, margin: 0 }}>
                  A boutique estate planning practice had 400+ closed matters sitting untouched. No system to identify which past clients might need new work. Hermes connected directly to their Smokeball account, scanned every closed matter from the past 18 months, identified clients whose Will or EPOA was over 2 years old, and drafted a personalised re-engagement email for each — queued for the partner to review each morning. In the first 30 days: three clients responded. One became a $6,000 estate planning matter. The partner approved 8 emails and spent 12 minutes total.
                </p>
              </div>
            </div>
          </RevEl>

          {/* Case study 2 — Plutus */}
          <RevEl delay={400}>
            <div style={{ borderRadius: 16, overflow: "hidden", display: "flex", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ background: NAVY, width: "34%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 56, fontWeight: 800, color: "#fff", lineHeight: 1 }}>£2k</div>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", marginTop: 8, textAlign: "center" }}>recovered<br/>per week</div>
                <div style={{ margin: "20px 0", width: 32, height: 1, background: "rgba(255,255,255,0.15)" }} />
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 48, fontWeight: 800, color: "#fff", lineHeight: 1 }}>4wk</div>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", marginTop: 8, textAlign: "center" }}>to full<br/>recovery</div>
              </div>
              <div style={{ background: "#fff", flex: 1, padding: "36px 40px" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: BLUE, fontWeight: 600, marginBottom: 14 }}>Plutus · Family Law · London UK</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 22, color: NAVY, marginBottom: 16, lineHeight: 1.25 }}>£2,000 a week in unbilled time — recovered within a month.</div>
                <p style={{ color: "#555566", fontSize: 15, lineHeight: 1.75, margin: 0 }}>
                  A family law practice was writing off around £2,000 a week in unbilled time entries without realising it. No one had time to audit it. Plutus surfaced it every Monday morning — a clean list of open matters with unbilled entries older than 14 days, sent directly to the fee earner. No clients were contacted. No automation was required beyond reviewing the list. Within four weeks, recovery was consistent and write-offs had dropped significantly.
                </p>
              </div>
            </div>
          </RevEl>
        </div>
      </section>

      {/* 5 — TESTIMONIALS — white */}
      <section style={{ background: "#fff", minHeight: "100dvh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <WordReveal text="What firms are saying."
            color={NAVY}
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,40px)", marginBottom: 40 }} />
          <TestimonialCarousel />
        </div>
      </section>

      {/* 6 — CUSTOM BUILDS + FORM — navy */}
      <section id="custom" style={{ background: NAVY, minHeight: "100dvh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48, alignItems: "start" }}>
            <div>
              <WordReveal text="Need something built specifically for your firm?"
                style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(26px,3vw,36px)", lineHeight: 1.1, marginBottom: 20 }} />
              <RevEl delay={400}>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.75, margin: "0 0 16px" }}>Not every firm runs the same way. If you have a workflow, a process, or a problem that does not fit a standard agent, we will scope and build it from scratch.</p>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.75, margin: 0 }}>Connected to your existing systems. Designed around how you actually work. Delivered as an agent that runs itself.</p>
              </RevEl>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* 7 — FAQ — blue */}
      <section style={{ background: BLUE, minHeight: "100dvh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <WordReveal text="Frequently asked questions."
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,40px)", marginBottom: 8, textAlign: "center" } as React.CSSProperties} />
          <RevEl delay={200}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, textAlign: "center", margin: "0 0 56px" }}>Everything you need to know before getting started.</p>
          </RevEl>
          <FAQ />
        </div>
      </section>

      {/* 8 — CTA — white */}
      <section id="cta" style={{ background: "#fff", minHeight: "100dvh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <WordReveal text="Ready to stop doing work that should not need you?"
            color={NAVY}
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(30px,4vw,44px)", lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: 720, margin: "0 auto 24px", textAlign: "center" } as React.CSSProperties} />
          <RevEl delay={400}>
            <p style={{ color: "#555566", fontSize: 18, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 48px", textAlign: "center" }}>
              Pick a time below and we will map out what is worth automating in your firm.
            </p>
          </RevEl>
          <iframe src="https://cal.com/jai.ai/discovery-call?embed=true&layout=month_view" style={{ width: "100%", height: 700, border: "none", borderRadius: 12 }} />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0a0a0a", padding: "60px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Link href="/"><img src="/logo-blue.png" alt="j.ai" style={{ height: 28, width: "auto", cursor: "pointer", borderRadius: "18%" }} /></Link>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Revenue agents for small law firms</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
            <a href="mailto:admin@jdotai.com" style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, textDecoration: "none" }}>admin@jdotai.com</a>
            <a href="https://www.linkedin.com/in/jai-dhingra/" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.45)" }} aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>© 2026 j.ai. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
