import React, { useEffect, useRef } from "react";
import posthog, { isPostHogEnabled } from "@/lib/posthog";

const CSS = `
#donna-app*,#donna-app*::before,#donna-app*::after{box-sizing:border-box;margin:0;padding:0;}
#donna-app button{cursor:pointer;font-family:inherit;border:none;background:none;}
#donna-app input,#donna-app textarea,#donna-app select{font-family:inherit;}
#donna-app{
  --cream:#f0ead8;--cream-mid:#ede6d2;--cream-dark:#e8e0cc;--cream-border:#d9d0b8;
  --cream-hover:#e2d9c4;--burgundy:#7a2e3b;--burgundy-dark:#5e2230;
  --text-dark:#1e1209;--text-mid:#5c4d3a;--text-muted:#9a8a75;--text-faint:#c4b8a4;
}
#donna-app{position:relative;font-family:'Source Sans 3',sans-serif;border-radius:16px;overflow:hidden;box-shadow:0 4px 60px rgba(30,18,9,0.15);width:100%;}
#donna-app #app{display:flex;height:720px;overflow:hidden;border-radius:16px;border:1px solid var(--cream-border);}

/* SIDEBAR */
#donna-app #sidebar{width:200px;flex-shrink:0;display:flex;flex-direction:column;border-right:1px solid var(--cream-border);background:var(--cream-mid);}
#donna-app .sidebar-logo{padding:0 16px;height:80px;display:flex;justify-content:center;align-items:center;flex-shrink:0;cursor:pointer;transition:opacity 0.15s;}
#donna-app .sidebar-logo:hover{opacity:0.75;}
#donna-app .sidebar-logo span{font-family:'Fraunces',serif;font-size:2.2rem;color:var(--burgundy);font-weight:400;letter-spacing:-0.01em;}
#donna-app .sidebar-nav{flex:1;padding:12px 10px;display:flex;flex-direction:column;gap:2px;}
#donna-app .nav-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;font-size:0.82rem;font-weight:500;color:var(--text-mid);transition:all 0.15s;text-align:left;width:100%;}
#donna-app .nav-item:hover{background:var(--cream-border);color:var(--text-dark);}
#donna-app .nav-item.active{background:var(--burgundy);color:var(--cream);}
#donna-app .nav-item svg{opacity:0.6;flex-shrink:0;}
#donna-app .nav-item.active svg{opacity:1;}
#donna-app .sidebar-footer{padding:12px 10px 20px;}
#donna-app .signout-btn{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:8px;font-size:0.8rem;color:var(--text-muted);width:100%;transition:0.15s;}
#donna-app .signout-btn:hover{color:var(--burgundy);background:rgba(122,46,59,0.07);}

/* MAIN */
#donna-app #main{flex:1;overflow:hidden;display:flex;flex-direction:column;background:var(--cream);}
#donna-app .page{flex:1;display:none;flex-direction:column;overflow:hidden;}
#donna-app .page.active{display:flex;}
#donna-app .page-header{display:flex;align-items:center;justify-content:flex-end;padding:20px 32px 0;flex-shrink:0;}
#donna-app .tabs{display:flex;gap:6px;}
#donna-app .tab-btn{display:flex;align-items:center;gap:7px;padding:6px 16px;border-radius:20px;font-size:0.8rem;font-weight:500;transition:all 0.15s;}
#donna-app .tab-btn.active{background:var(--burgundy);color:var(--cream);border:1px solid transparent;}
#donna-app .tab-btn:not(.active){border:1px solid var(--cream-border);color:var(--text-muted);}
#donna-app .tab-btn:not(.active):hover{background:var(--burgundy);color:var(--cream);border-color:var(--burgundy);}
#donna-app .tab-num{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:600;}
#donna-app .tab-btn.active .tab-num{background:rgba(240,234,216,0.25);color:var(--cream);}
#donna-app .tab-btn:not(.active) .tab-num{background:var(--cream-border);color:var(--text-mid);}
#donna-app .scroll-content{flex:1;overflow-y:auto;padding:28px 32px;}
#donna-app .scroll-content::-webkit-scrollbar{width:5px;}
#donna-app .scroll-content::-webkit-scrollbar-thumb{background:var(--cream-border);border-radius:3px;}

/* CARDS & BUTTONS */
#donna-app .btn-primary{background:var(--burgundy);color:var(--cream);border-radius:10px;padding:8px 18px;font-size:0.82rem;font-weight:600;transition:background 0.15s;}
#donna-app .btn-primary:hover{background:var(--burgundy-dark);}
#donna-app .btn-outline{border:1px solid var(--cream-border);color:var(--text-mid);border-radius:10px;padding:7px 16px;font-size:0.82rem;font-weight:500;transition:all 0.15s;background:transparent;}
#donna-app .btn-outline:hover{background:var(--burgundy);color:var(--cream);border-color:var(--burgundy);}
#donna-app .btn-sm{padding:5px 12px;font-size:0.75rem;border-radius:8px;}
#donna-app .badge{font-size:0.68rem;padding:2px 9px;border-radius:20px;font-weight:600;}
#donna-app .badge-complete{background:#e4f0ea;color:#2a7a4f;border:1px solid #b0d9c0;}
#donna-app .badge-progress{background:#f0e8e0;color:#7a4e2e;border:1px solid #d9c0a8;}

/* TABLE */
#donna-app .data-table{border:1px solid var(--cream-border);border-radius:14px;overflow:hidden;}
#donna-app .table-row{display:grid;grid-template-columns:148px 1fr 130px 68px;padding:11px 20px;border-bottom:1px solid var(--cream-border);transition:background 0.12s;align-items:center;gap:8px;}
#donna-app .table-row:last-child{border-bottom:none;}
#donna-app .table-row:hover{background:var(--cream-hover);}
#donna-app .table-row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
#donna-app .table-head{padding:8px 20px;display:grid;grid-template-columns:148px 1fr 130px 68px;gap:8px;background:var(--cream-mid);}
#donna-app .table-head span{font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-muted);}

/* TEMPLATE ITEMS */
#donna-app .template-item{display:flex;align-items:center;gap:14px;padding:18px 22px;border-bottom:1px solid var(--cream-border);transition:background 0.12s;}
#donna-app .template-item:last-child{border-bottom:none;}
#donna-app .template-item:hover{background:rgba(0,0,0,0.015);}
#donna-app .template-actions{display:flex;gap:7px;flex-shrink:0;}

/* FORM INPUTS */
#donna-app .form-input{width:100%;padding:9px 13px;border:1px solid var(--cream-border);border-radius:9px;background:var(--cream);color:var(--text-dark);font-size:0.85rem;outline:none;transition:border-color 0.15s;}
#donna-app .form-input:focus{border-color:var(--burgundy);}
#donna-app .form-select{width:100%;padding:9px 13px;border:1px solid var(--cream-border);border-radius:9px;background:var(--cream);color:var(--text-dark);font-size:0.85rem;outline:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239a8a75' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px;}

/* SUBMISSIONS */
#donna-app #tab-content-submissions{flex-direction:column;}
#donna-app .submissions-layout{flex:1;min-width:0;min-height:0;display:flex;overflow:hidden;}
#donna-app .submissions-main{flex:1;min-width:0;overflow-y:auto;padding:24px 28px;}
#donna-app .sub-detail-panel{flex:0 0 38%;min-width:260px;max-width:480px;border-left:1px solid var(--cream-border);background:var(--cream-mid);display:none;flex-direction:column;overflow:hidden;box-shadow:-4px 0 20px rgba(30,18,9,0.08);}
#donna-app .sub-detail-header{padding:18px 20px 14px;border-bottom:1px solid var(--cream-border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
#donna-app .sub-detail-body{flex:1;overflow-y:auto;padding:18px 20px;}
#donna-app .sub-detail-footer{padding:14px 20px 20px;border-top:1px solid var(--cream-border);flex-shrink:0;}
#donna-app .detail-field{margin-bottom:14px;}
#donna-app .detail-field-label{font-size:0.66rem;font-weight:700;letter-spacing:0.13em;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px;}
#donna-app .detail-field-value{font-size:0.85rem;color:var(--text-dark);font-weight:500;}
#donna-app .divider{border:none;border-top:1px solid var(--cream-border);margin:14px 0;}

/* CHAT */
#donna-app .mcp-page{flex:1;display:flex;flex-direction:column;overflow:hidden;}
#donna-app .chat-area{flex:1;overflow-y:auto;padding:24px 32px;display:flex;flex-direction:column;gap:14px;}
#donna-app .chat-area::-webkit-scrollbar{width:5px;}
#donna-app .chat-area::-webkit-scrollbar-thumb{background:var(--cream-border);border-radius:3px;}
#donna-app .chat-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;}
#donna-app .chat-empty-logo{font-family:'Fraunces',serif;font-size:3.5rem;color:var(--burgundy);}
#donna-app .chat-empty-sub{font-size:0.85rem;color:var(--text-muted);}
#donna-app .chat-suggestions{display:flex;gap:8px;padding:10px 32px 12px;flex-wrap:wrap;justify-content:center;}
#donna-app .suggestion-chip{border:1px solid var(--cream-border);color:var(--text-mid);border-radius:20px;padding:7px 16px;font-size:0.8rem;transition:all 0.15s;background:transparent;}
#donna-app .suggestion-chip:hover{background:var(--burgundy);color:var(--cream);border-color:var(--burgundy);}
#donna-app .chat-input-wrap{padding:8px 32px 24px;}
#donna-app .chat-input-box{display:flex;align-items:center;gap:10px;border-radius:16px;padding:11px 14px;background:var(--cream-dark);border:1px solid var(--cream-border);}
#donna-app .chat-input{flex:1;background:transparent;outline:none;font-size:0.85rem;color:var(--text-dark);border:none;}
#donna-app .chat-input::placeholder{color:var(--text-faint);}
#donna-app .chat-bubble{max-width:72%;padding:11px 15px;border-radius:18px;font-size:0.85rem;line-height:1.5;}
#donna-app .bubble-user{background:var(--burgundy);color:var(--cream);border-radius:18px 18px 4px 18px;align-self:flex-end;}
#donna-app .bubble-donna{background:var(--cream-dark);color:var(--text-dark);border-radius:18px 18px 18px 4px;align-self:flex-start;white-space:pre-wrap;}

/* THINKING DOTS */
@keyframes dotPulse{0%,80%,100%{opacity:0.25;transform:scale(0.7);}40%{opacity:1;transform:scale(1);}}
#donna-app .thinking-dots{display:flex;gap:5px;align-items:center;padding:2px 0;}
#donna-app .thinking-dots span{width:7px;height:7px;border-radius:50%;background:var(--text-muted);animation:dotPulse 1.4s ease-in-out infinite;}
#donna-app .thinking-dots span:nth-child(2){animation-delay:0.2s;}
#donna-app .thinking-dots span:nth-child(3){animation-delay:0.4s;}

/* EDIT FORM OVERLAY */
#donna-app .edit-form-page{position:absolute;inset:0;background:var(--cream);z-index:200;display:none;flex-direction:column;overflow:hidden;}
#donna-app .edit-form-page.open{display:flex;}
#donna-app .edit-form-header{display:flex;align-items:center;gap:16px;padding:16px 28px;border-bottom:1px solid var(--cream-border);flex-shrink:0;}
#donna-app .edit-form-back{display:flex;align-items:center;gap:7px;font-size:0.82rem;color:var(--text-muted);transition:color 0.15s;}
#donna-app .edit-form-back:hover{color:var(--burgundy);}
#donna-app .edit-form-content{flex:1;overflow:hidden;display:flex;}
#donna-app .edit-pages-sidebar{width:210px;flex-shrink:0;border-right:1px solid var(--cream-border);padding:20px 12px;overflow-y:auto;background:var(--cream-mid);}
#donna-app .edit-questions-main{flex:1;overflow-y:auto;padding:24px 28px;}
#donna-app .page-nav-item{padding:10px 14px;border-radius:10px;cursor:pointer;transition:all 0.12s;font-size:0.82rem;color:var(--text-mid);font-weight:500;margin-bottom:2px;}
#donna-app .page-nav-item.active{background:var(--burgundy);color:var(--cream);}
#donna-app .page-nav-item:not(.active):hover{background:var(--cream-border);}
#donna-app .question-card{background:var(--cream-dark);border:1px solid var(--cream-border);border-radius:12px;padding:16px 18px;margin-bottom:10px;}
#donna-app .question-label{font-size:0.85rem;font-weight:600;color:var(--text-dark);margin-bottom:3px;}
#donna-app .question-meta{font-size:0.73rem;color:var(--text-muted);margin-bottom:10px;}
#donna-app .question-actions{display:flex;gap:6px;}
#donna-app .q-action-btn{font-size:0.72rem;padding:4px 10px;border-radius:6px;border:1px solid var(--cream-border);color:var(--text-muted);background:transparent;cursor:pointer;transition:all 0.12s;}
#donna-app .q-action-btn:hover{background:var(--cream-border);color:var(--text-dark);}
#donna-app .q-action-btn.required-active{border-color:var(--burgundy);color:var(--burgundy);background:rgba(122,46,59,0.06);}

/* TOAST */
#donna-app .toast{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);background:var(--text-dark);color:var(--cream);padding:10px 20px;border-radius:10px;font-size:0.82rem;z-index:999;opacity:0;transition:opacity 0.3s;pointer-events:none;white-space:nowrap;}
#donna-app .toast.show{opacity:1;}

/* MOBILE */
@media(max-width:640px){
  #donna-app #app{flex-direction:column;height:auto;min-height:560px;border-radius:12px;}
  #donna-app #sidebar{width:100%;flex-direction:row;border-right:none;border-bottom:1px solid var(--cream-border);height:auto;}
  #donna-app .sidebar-logo{height:48px;width:auto;padding:0 14px;border-right:1px solid var(--cream-border);flex-shrink:0;justify-content:flex-start;}
  #donna-app .sidebar-logo span{font-size:1.5rem;}
  #donna-app .sidebar-nav{flex-direction:row;padding:6px 8px;gap:4px;overflow-x:auto;flex:1;align-items:center;}
  #donna-app .nav-item{flex-direction:row;padding:7px 12px;font-size:0.78rem;min-width:auto;gap:6px;white-space:nowrap;}
  #donna-app .sidebar-footer{display:none;}
  #donna-app #main{min-height:480px;}
  #donna-app .page-header{padding:12px 16px 0;}
  #donna-app .scroll-content{padding:14px 16px;}
  #donna-app .data-table{overflow-x:auto;}
  #donna-app .table-row,#donna-app .table-head{min-width:380px;}
  #donna-app .submissions-main{padding:14px 16px;}
  #donna-app .submissions-layout{flex-direction:column;}
  #donna-app .sub-detail-panel{flex:0 0 auto!important;max-width:100%!important;min-width:0!important;border-left:none!important;border-top:1px solid var(--cream-border);}
  #donna-app .chat-area{padding:14px 16px;}
  #donna-app .chat-suggestions{padding:6px 12px 10px;}
  #donna-app .chat-input-wrap{padding:6px 12px 16px;}
  #donna-app .chat-bubble{max-width:90%;}
  #donna-app .edit-form-header{padding:12px 16px;}
  #donna-app .edit-form-content{flex-direction:column;}
  #donna-app .edit-pages-sidebar{width:100%;border-right:none;border-bottom:1px solid var(--cream-border);padding:10px 12px;display:flex;flex-direction:row;gap:6px;overflow-x:auto;min-height:auto;}
  #donna-app .edit-pages-sidebar .page-nav-item{white-space:nowrap;margin-bottom:0;}
  #donna-app .edit-questions-main{padding:14px 16px;}
  #donna-app .template-actions{flex-wrap:wrap;gap:5px;}
  #donna-app .tab-btn{font-size:0.75rem;padding:5px 12px;}
}
`;

const HTML = `
<div id="app">

<!-- SIDEBAR -->
<aside id="sidebar">
  <div class="sidebar-logo" onclick="resetConsole()"><span>donna</span></div>
  <nav class="sidebar-nav">
    <button class="nav-item active" onclick="showPage('intake')">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
      Intake
    </button>
    <button class="nav-item" onclick="showPage('mcp')">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z"/></svg>
      Donna MCP
    </button>
  </nav>
  <div class="sidebar-footer">
    <button class="signout-btn">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      Sign out
    </button>
  </div>
</aside>

<!-- MAIN -->
<main id="main">

  <!-- INTAKE PAGE -->
  <div id="page-intake" class="page active">
    <div class="page-header">
      <div class="tabs">
        <button class="tab-btn active" onclick="showTab('build')" id="tab-build"><span class="tab-num">1</span> Build</button>
        <button class="tab-btn" onclick="showTab('submissions')" id="tab-submissions"><span class="tab-num">2</span> Submissions <span id="sub-count-label" style="font-size:0.72rem;opacity:0.6;margin-left:2px">(274)</span></button>
      </div>
    </div>

    <!-- BUILD TAB -->
    <div id="tab-content-build" class="scroll-content">
      <div style="max-width:680px;margin:0 auto">
        <p style="font-size:0.72rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-muted);margin-bottom:16px">Your Forms</p>
        <div class="data-table">
          <div class="template-item">
            <div style="flex:1;min-width:0">
              <div style="font-size:0.9rem;font-weight:700;color:var(--text-dark);margin-bottom:4px">Estate Planning</div>
              <div style="font-size:0.76rem;color:var(--text-muted)">Wills, EPA/guardianship, funeral wishes, family and financial disclosure.</div>
            </div>
            <div class="template-actions">
              <button class="btn-outline btn-sm" onclick="openEditForm('Estate Planning')">Edit</button>
              <button class="btn-outline btn-sm" onclick="copyLink('Estate Planning')">Copy link</button>
              <button class="btn-outline btn-sm" onclick="window.open('https://demo-form.jdotai.com/','_blank')">Preview</button>
            </div>
          </div>
          <div class="template-item">
            <div style="flex:1;min-width:0">
              <div style="font-size:0.9rem;font-weight:700;color:var(--text-dark);margin-bottom:4px">Family Law</div>
              <div style="font-size:0.76rem;color:var(--text-muted)">Separation, parenting, property and safety.</div>
            </div>
            <div class="template-actions">
              <button class="btn-outline btn-sm" onclick="openEditForm('Family Law')">Edit</button>
              <button class="btn-outline btn-sm" onclick="copyLink('Family Law')">Copy link</button>
              <button class="btn-outline btn-sm" onclick="window.open('https://demo-form.jdotai.com/','_blank')">Preview</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SUBMISSIONS TAB -->
    <div id="tab-content-submissions" style="display:none;flex:1;overflow:hidden">
      <div class="submissions-layout">
        <div class="submissions-main">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
              <select id="filter-form" class="form-select" style="max-width:190px;font-size:0.8rem;padding:6px 10px" onchange="filterSubmissions()">
                <option value="">All forms</option>
                <option value="Estate Planning">Estate Planning</option>
                <option value="Family Law">Family Law</option>
              </select>
              <input id="filter-search" class="form-input" style="max-width:210px;font-size:0.8rem;padding:6px 10px" placeholder="Search email…" oninput="filterSubmissions()"/>
            </div>
            <div class="table-head"><span>Date</span><span>Email</span><span>Status</span><span>Actions</span></div>
            <div class="data-table" id="submissions-table"></div>
        </div>
        <div class="sub-detail-panel" id="sub-detail-panel" style="display:none">
          <div class="sub-detail-header">
            <span style="font-size:0.85rem;font-weight:700;color:var(--text-dark);overflow:hidden;text-overflow:ellipsis;white-space:nowrap" id="sub-detail-email">—</span>
            <button onclick="closeSubDetail()" style="color:var(--text-muted);font-size:1.3rem;line-height:1;cursor:pointer;background:none;border:none;flex-shrink:0;margin-left:8px">×</button>
          </div>
          <div class="sub-detail-body">
            <div class="detail-field"><div class="detail-field-label">Name</div><div class="detail-field-value" id="sub-detail-name">—</div></div>
            <div class="detail-field"><div class="detail-field-label">Submitted</div><div class="detail-field-value" id="sub-detail-date">—</div></div>
            <div class="detail-field"><div class="detail-field-label">Status</div><div id="sub-detail-status">—</div></div>
            <div class="detail-field"><div class="detail-field-label">Form</div><div class="detail-field-value" id="sub-detail-form">—</div></div>
            <hr class="divider"/>
            <p style="font-size:0.75rem;color:var(--text-muted);line-height:1.6">Once complete, contact and matter are created automatically in your practice management system.</p>
          </div>
          <div class="sub-detail-footer">
            <button class="btn-outline btn-sm" style="width:100%;justify-content:center;display:flex;gap:6px;align-items:center;opacity:0.55;cursor:default" disabled>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Open in Clio
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- MCP PAGE -->
  <div id="page-mcp" class="page">
    <div class="mcp-page">
      <div class="chat-area" id="chat-area">
        <div class="chat-empty" id="chat-empty">
          <div class="chat-empty-logo">donna</div>
          <p class="chat-empty-sub">Ask me anything about your matters.</p>
        </div>
      </div>
      <div class="chat-suggestions" id="chat-suggestions">
        <button class="suggestion-chip" onclick="sendSuggestion(this)">What's the update on the Johnson matter?</button>
        <button class="suggestion-chip" onclick="sendSuggestion(this)">What are my deadlines this week?</button>
        <button class="suggestion-chip" onclick="sendSuggestion(this)">Did NewFirmABC fill out their intake form?</button>
        <button class="suggestion-chip" onclick="sendSuggestion(this)">Pull all documents on the Smith estate.</button>
        <button class="suggestion-chip" onclick="sendSuggestion(this)">What's the deadline on the Robertson matter?</button>
      </div>
      <div class="chat-input-wrap">
        <div class="chat-input-box">
          <input class="chat-input" id="chat-input" placeholder="Ask me anything about your matters." onkeydown="if(event.key==='Enter')sendChat()"/>
          <button class="btn-primary btn-sm" onclick="sendChat()">Send</button>
        </div>
      </div>
    </div>
  </div>

</main>
</div>

<!-- EDIT FORM OVERLAY -->
<div class="edit-form-page" id="edit-form-page">
  <div class="edit-form-header">
    <button class="edit-form-back" onclick="closeEditForm()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back
    </button>
    <span style="font-size:0.95rem;font-weight:700;color:var(--text-dark);margin:0 auto" id="edit-form-title">Edit Form</span>
    <button class="btn-primary btn-sm" onclick="saveFormChanges()">Save changes</button>
  </div>
  <div class="edit-form-content">
    <div class="edit-pages-sidebar">
      <div style="font-size:0.66rem;font-weight:700;text-transform:uppercase;letter-spacing:0.13em;color:var(--text-muted);margin-bottom:10px">Pages</div>
      <div id="edit-page-nav"></div>
    </div>
    <div class="edit-questions-main" id="edit-pages-content"></div>
  </div>
</div>

<div class="toast" id="toast">Link copied to clipboard</div>
`;

const JS = `
(function() {

var formState = {
  'Estate Planning': {
    pages: [
      { title: 'Let\\'s get started', sub: 'Please provide your contact details so we can get started.', sections: [
        { heading: 'Name & Contact', grid: 2, fields: [
          { label: 'First Name', type: 'text', required: false },
          { label: 'Last Name', type: 'text', required: false },
          { label: 'Email Address', type: 'email', required: false, alwaysRequired: true, full: true },
          { label: 'Mobile Number', type: 'tel', required: false },
          { label: 'Home Phone', type: 'tel', required: false }
        ]}
      ]},
      { title: 'Welcome', sub: 'Tell us about the nature of this matter.', sections: [
        { heading: 'Engagement', grid: 2, fields: [
          { label: 'Who is this matter for?', type: 'select', required: false, full: true, options: ['', 'Single Client', 'Couple (Joint Matter)', 'Couple (Separate Matters)'] },
          { label: 'State / Territory', type: 'select', required: false, options: ['', 'ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'] },
          { label: 'Preferred Contact Method', type: 'select', required: false, options: ['', 'Email', 'Phone', 'Either'] },
          { label: 'Is this matter urgent?', type: 'yesno', required: false, full: true },
          { label: 'How did you hear about us?', type: 'select', required: false, full: true, options: ['', 'Google', 'Referral from friend / colleague', 'Social media', 'Existing client', 'Other'] }
        ]}
      ]},
      { title: 'C1 — Personal Details', sub: 'Please provide your personal information as accurately as possible.', sections: [
        { heading: 'Name', grid: 4, fields: [
          { label: 'Title', type: 'select', required: false, options: ['', 'Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof'] },
          { label: 'First Name', type: 'text', required: false },
          { label: 'Middle Name', type: 'text', required: false },
          { label: 'Last Name', type: 'text', required: false },
          { label: 'Preferred Name / Nickname', type: 'text', required: false, full: true }
        ]},
        { heading: 'Identity', grid: 2, fields: [
          { label: 'Date of Birth', type: 'text', required: false },
          { label: 'Place of Birth', type: 'text', required: false },
          { label: 'Gender', type: 'select', required: false, options: ['', 'Male', 'Female', 'Non-binary', 'Prefer not to say'] },
          { label: 'Citizenship', type: 'text', required: false },
          { label: 'Permanent Resident of Australia?', type: 'yesno', required: false, full: true }
        ]},
        { heading: 'Contact & Address', grid: 1, fields: [
          { label: 'Residential Address', type: 'text', required: false, full: true },
          { label: 'Occupation', type: 'text', required: false, full: true },
          { label: 'Relationship Status', type: 'select', required: false, full: true, options: ['', 'Single', 'Married', 'De facto', 'Separated', 'Divorced', 'Widowed'] }
        ]}
      ]},
      { title: 'Children', sub: 'Tell us about any children or dependants.', sections: [
        { heading: 'Children & Dependants', grid: 1, fields: [
          { label: 'Do you have children?', type: 'yesno', required: false, full: true },
          { label: 'Do you have grandchildren?', type: 'yesno', required: false, full: true },
          { label: 'Do you have other dependants?', type: 'yesno', required: false, full: true },
          { label: 'Any family provision risk?', type: 'select', required: false, full: true, options: ['', 'Yes', 'No', 'Not sure'] }
        ]}
      ]},
      { title: 'Disclosure Preference', sub: 'Let us know how you\\'d like to disclose your financial position.', sections: [
        { heading: 'Financial Disclosure', grid: 1, fields: [
          { label: 'How would you like to disclose your financial position?', type: 'select', required: false, full: true, options: ['', 'Full Disclosure', 'Summary Only', 'Prefer to Discuss'] },
          { label: 'Do you own real property?', type: 'yesno', required: false, full: true },
          { label: 'Do you have superannuation?', type: 'yesno', required: false, full: true },
          { label: 'Do you have a mortgage or loans?', type: 'yesno', required: false, full: true }
        ]}
      ]},
      { title: 'Business & Insurance', sub: 'Tell us about any business interests and insurance policies.', sections: [
        { heading: 'Business', grid: 1, fields: [
          { label: 'Are you a director of any company?', type: 'yesno', required: false, full: true },
          { label: 'Do you have any business interests?', type: 'yesno', required: false, full: true },
          { label: 'Are you involved in any trusts?', type: 'yesno', required: false, full: true }
        ]},
        { heading: 'Insurance', grid: 1, fields: [
          { label: 'Do you have life or TPD insurance?', type: 'yesno', required: false, full: true },
          { label: 'Financial Advisor Name', type: 'text', required: false, full: true },
          { label: 'Supporting documents', type: 'upload', required: false, full: true }
        ]}
      ]},
      { title: 'Wills & Executors', sub: 'Tell us about your will structure and who you\\'d like to appoint.', sections: [
        { heading: 'Existing Will', grid: 1, fields: [
          { label: 'Do you have an existing will?', type: 'yesno', required: false, full: true }
        ]},
        { heading: 'Executors', grid: 2, fields: [
          { label: 'Primary Executor — Full Name', type: 'text', required: false, full: true },
          { label: 'Alternate Executor — Full Name', type: 'text', required: false, full: true }
        ]},
        { heading: 'Beneficiaries', grid: 2, fields: [
          { label: 'Residuary Beneficiary — Full Name', type: 'text', required: false },
          { label: 'Relationship to You', type: 'select', required: false, options: ['', 'Spouse / Partner', 'Child', 'Sibling', 'Parent', 'Friend', 'Charity', 'Other'] }
        ]}
      ]},
      { title: 'EPA & Medical', sub: 'Tell us about your wishes for health and financial decision-making.', sections: [
        { heading: 'Health Decisions', grid: 1, fields: [
          { label: 'Do you want an Enduring Power of Attorney for health?', type: 'yesno', required: false, full: true },
          { label: 'Do you have an Advance Health Directive?', type: 'yesno', required: false, full: true },
          { label: 'Organ donation preference', type: 'select', required: false, full: true, options: ['', 'Yes — all organs', 'Yes — specific organs only', 'No'] }
        ]},
        { heading: 'Financial & Funeral', grid: 1, fields: [
          { label: 'Do you want an EPA for financial decisions?', type: 'yesno', required: false, full: true },
          { label: 'Burial preference', type: 'select', required: false, full: true, options: ['', 'Burial', 'Cremation', 'No preference'] }
        ]}
      ]},
      { title: 'Declaration', sub: 'Please review and confirm the accuracy of your answers.', sections: [
        { heading: 'Additional Information', grid: 1, fields: [
          { label: 'Additional information for your lawyer', type: 'textarea', required: false, full: true }
        ]},
        { heading: 'Confirmation', grid: 1, fields: [
          { label: 'I confirm the information provided is true and correct', type: 'checkbox', required: false, full: true },
          { label: 'Signature (type your full name)', type: 'text', required: false, full: true }
        ]}
      ]}
    ]
  },
  'Family Law': {
    pages: [
      { title: 'Contact Info', sections: [{ fields: [
        { label: 'Full name', type: 'text', required: false },
        { label: 'Email address', type: 'email', required: false, alwaysRequired: true }
      ]}]},
      { title: 'Personal Information', sections: [{ fields: [
        { label: 'Date of birth', type: 'text', required: false },
        { label: 'Phone number', type: 'tel', required: false },
        { label: 'Residential address', type: 'textarea', required: false },
        { label: 'Suburb / City', type: 'text', required: false }
      ]}]},
      { title: 'Separation Details', sections: [{ fields: [
        { label: 'Date of separation', type: 'text', required: false },
        { label: 'Length of relationship', type: 'text', required: false },
        { label: 'Are children involved?', type: 'select', required: false, options: ['', 'Yes', 'No'] },
        { label: 'Current living arrangement', type: 'select', required: false, options: ['', 'Still living together', 'Living separately', 'Other'] }
      ]}]},
      { title: 'Parenting & Property', sections: [{ fields: [
        { label: "Children's details (names and ages)", type: 'textarea', required: false },
        { label: 'Jointly owned property?', type: 'select', required: false, options: ['', 'Yes', 'No'] },
        { label: 'Outstanding mortgages?', type: 'select', required: false, options: ['', 'Yes', 'No', 'Not applicable'] },
        { label: 'Brief description of assets', type: 'textarea', required: false }
      ]}]},
      { title: 'Referral & Additional Info', sections: [{ fields: [
        { label: 'How did you hear about us?', type: 'select', required: false, options: ['', 'Google', 'Referral from friend or colleague', 'Social media', 'Other'] },
        { label: 'Additional comments', type: 'textarea', required: false },
        { label: 'Supporting documents', type: 'upload', required: false }
      ]}]},
      { title: 'Consent & Signature', sections: [{ fields: [
        { label: 'I have read and agree to the Privacy Policy', type: 'checkbox', required: false },
        { label: 'Signature (type your full name)', type: 'text', required: false }
      ]}]}
    ]
  }
};

var submissions = [
  { date: '25 Aug 2026, 9:14 AM', email: 'sarah.johnson@gmail.com', name: 'Sarah Johnson', form: 'Estate Planning', status: 'complete', page: '' },
  { date: '24 Aug 2026, 4:32 PM', email: 'michael.chen@outlook.com', name: 'Michael Chen', form: 'Estate Planning', status: 'in-progress', page: 'Page 3 of 6' },
  { date: '24 Aug 2026, 11:05 AM', email: 'emma.davis@icloud.com', name: 'Emma Davis', form: 'Family Law', status: 'complete', page: '' },
  { date: '23 Aug 2026, 2:47 PM', email: 'james.wilson@gmail.com', name: 'James Wilson', form: 'Estate Planning', status: 'in-progress', page: 'Page 4 of 6' },
  { date: '23 Aug 2026, 8:20 AM', email: 'olivia.brown@yahoo.com', name: 'Olivia Brown', form: 'Family Law', status: 'complete', page: '' },
  { date: '22 Aug 2026, 5:15 PM', email: 'liam.taylor@gmail.com', name: 'Liam Taylor', form: 'Estate Planning', status: 'in-progress', page: 'Page 2 of 6' },
  { date: '22 Aug 2026, 1:08 PM', email: 'ava.martinez@gmail.com', name: 'Ava Martinez', form: 'Family Law', status: 'complete', page: '' },
  { date: '21 Aug 2026, 10:44 AM', email: 'noah.anderson@live.com', name: 'Noah Anderson', form: 'Estate Planning', status: 'complete', page: '' }
];
var extraSubmissions = 266;

function showPage(page) {
  document.querySelectorAll('#donna-app .page').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('#donna-app .nav-item').forEach(function(n) { n.classList.remove('active'); });
  var map = { intake: 0, mcp: 1 };
  document.querySelectorAll('#donna-app .nav-item')[map[page]].classList.add('active');
}
window.showPage = showPage;

function showTab(tab) {
  ['build', 'submissions'].forEach(function(t) {
    var el = document.getElementById('tab-content-' + t);
    if (el) { el.style.display = 'none'; el.style.flex = ''; el.style.overflow = ''; }
    var btn = document.getElementById('tab-' + t);
    if (btn) btn.classList.remove('active');
  });
  var active = document.getElementById('tab-content-' + tab);
  if (active) {
    if (tab === 'submissions') { active.style.display = 'flex'; active.style.flex = '1'; active.style.overflow = 'hidden'; }
    else { active.style.display = 'block'; }
  }
  var btn = document.getElementById('tab-' + tab);
  if (btn) btn.classList.add('active');
}
window.showTab = showTab;

var currentFormName = '';
var currentEditPage = 0;

window.openEditForm = function(formName) {
  window.dispatchEvent(new CustomEvent('donna_demo_event', { detail: { event: 'demo_form_edit_opened', properties: { form_template: formName } } }));
  currentFormName = formName;
  currentEditPage = 0;
  document.getElementById('edit-form-title').textContent = 'Edit — ' + formName;
  renderEditSidebar();
  renderEditPage(0);
  document.getElementById('edit-form-page').classList.add('open');
};
window.closeEditForm = function() { document.getElementById('edit-form-page').classList.remove('open'); };
window.saveFormChanges = function() {
  window.dispatchEvent(new CustomEvent('donna_demo_event', { detail: { event: 'demo_form_changes_saved', properties: { form_template: currentFormName } } }));
  closeEditForm(); showToast('Changes saved');
};

function renderEditSidebar() {
  var nav = document.getElementById('edit-page-nav');
  nav.innerHTML = '';
  formState[currentFormName].pages.forEach(function(page, i) {
    var el = document.createElement('div');
    el.className = 'page-nav-item' + (i === currentEditPage ? ' active' : '');
    el.textContent = page.title;
    el.onclick = (function(idx) { return function() { currentEditPage = idx; renderEditSidebar(); renderEditPage(idx); }; })(i);
    nav.appendChild(el);
  });
}

function renderEditPage(idx) {
  var content = document.getElementById('edit-pages-content');
  content.innerHTML = '';
  var page = formState[currentFormName].pages[idx];
  var h = document.createElement('h3');
  h.style.cssText = 'font-size:1rem;font-weight:700;color:var(--text-dark);margin-bottom:18px';
  h.textContent = page.title;
  content.appendChild(h);
  var allFields = [];
  if (page.sections) { page.sections.forEach(function(s) { (s.fields || []).forEach(function(f) { allFields.push(f); }); }); }
  else { allFields = page.fields || []; }
  allFields.forEach(function(field) {
    var card = document.createElement('div');
    card.className = 'question-card';
    var labelEl = document.createElement('div');
    labelEl.className = 'question-label';
    labelEl.textContent = field.label;
    card.appendChild(labelEl);
    var metaEl = document.createElement('div');
    metaEl.className = 'question-meta';
    var typeMap = { text: 'Short text', email: 'Short text', tel: 'Short text', textarea: 'Long text', select: 'Dropdown', upload: 'Document upload', checkbox: 'Checkbox', yesno: 'Yes / No' };
    metaEl.textContent = typeMap[field.type] || field.type;
    card.appendChild(metaEl);
    var actionsEl = document.createElement('div');
    actionsEl.className = 'question-actions';
    if (field.alwaysRequired) {
      var lockSpan = document.createElement('span');
      lockSpan.style.cssText = 'font-size:0.72rem;color:var(--burgundy);opacity:0.65;padding:4px 0';
      lockSpan.textContent = 'Always required';
      actionsEl.appendChild(lockSpan);
    } else {
      var reqBtn = document.createElement('button');
      reqBtn.className = 'q-action-btn' + (field.required ? ' required-active' : '');
      reqBtn.textContent = field.required ? 'Required ✓' : 'Make required';
      reqBtn.onclick = (function(fRef) {
        return function() { fRef.required = !fRef.required; renderEditPage(currentEditPage); };
      })(field);
      actionsEl.appendChild(reqBtn);
    }
    card.appendChild(actionsEl);
    content.appendChild(card);
  });
}

function buildSubmissionsTable(filtered) {
  var table = document.getElementById('submissions-table');
  if (!table) return;
  var rows = filtered !== undefined ? filtered : submissions.map(function(s, i) { return { s: s, i: i }; });
  if (rows.length === 0) {
    table.innerHTML = '<div style="padding:28px;text-align:center;font-size:0.82rem;color:var(--text-faint)">No submissions found.</div>';
    return;
  }
  table.innerHTML = rows.map(function(item) {
    var s = item.s; var i = item.i;
    var badge = s.status === 'complete'
      ? '<span class="badge badge-complete">Complete</span>'
      : '<span class="badge badge-progress">In progress \xb7 ' + s.page + '</span>';
    return '<div class="table-row" style="cursor:pointer" onclick="openSubDetail(' + i + ')">'
      + '<span style="font-size:0.78rem;color:var(--text-mid)">' + s.date + '</span>'
      + '<span style="font-size:0.81rem;font-weight:600;color:var(--text-dark)">' + s.email + '</span>'
      + '<span>' + badge + '</span>'
      + '<button class="btn-outline btn-sm" onclick="event.stopPropagation();openSubDetail(' + i + ')">View</button>'
      + '</div>';
  }).join('');
}
buildSubmissionsTable();

function filterSubmissions() {
  var formFilter = (document.getElementById('filter-form') || {}).value || '';
  var search = ((document.getElementById('filter-search') || {}).value || '').toLowerCase().trim();
  var filtered = submissions.map(function(s, i) { return { s: s, i: i }; }).filter(function(item) {
    var matchForm = !formFilter || item.s.form === formFilter;
    var matchSearch = !search || item.s.email.toLowerCase().indexOf(search) !== -1 || (item.s.name || '').toLowerCase().indexOf(search) !== -1;
    return matchForm && matchSearch;
  });
  buildSubmissionsTable(filtered);
}
window.filterSubmissions = filterSubmissions;

window.openSubDetail = function(idx) {
  var s = submissions[idx];
  window.dispatchEvent(new CustomEvent('donna_demo_event', { detail: { event: 'demo_submission_viewed', properties: { form_template: s.form, submission_status: s.status } } }));
  document.getElementById('sub-detail-email').textContent = s.email;
  document.getElementById('sub-detail-name').textContent = s.name;
  document.getElementById('sub-detail-date').textContent = s.date;
  document.getElementById('sub-detail-form').textContent = s.form;
  document.getElementById('sub-detail-status').innerHTML = s.status === 'complete'
    ? '<span class="badge badge-complete">Complete</span>'
    : '<span class="badge badge-progress">In progress \xb7 ' + s.page + '</span>';
  var panel = document.getElementById('sub-detail-panel');
  panel.style.display = 'flex'; panel.style.flexDirection = 'column';
};
window.closeSubDetail = function() { document.getElementById('sub-detail-panel').style.display = 'none'; };

var suggestionAnswers = {
  "What's the update on the Johnson matter?": "The Johnson matter is in the discovery phase. Opposing counsel's document response is due 2 September. The next hearing — a case management conference — is listed for 10 September at 10:00 AM.\\n\\nOutstanding task: review client affidavit before filing. No overdue items.",
  "What are my deadlines this week?": "You have 3 deadlines this week:\\n\\n• Robertson v Robertson — Affidavit filing due Thursday 28 August\\n• Chen matter — Response to discovery request due Friday 29 August\\n• Davis — Cost agreement outstanding, flagged urgent\\n\\nNo items are currently overdue.",
  "Did NewFirmABC fill out their intake form?": "Yes — Marcus Webb from NewFirmABC submitted the Estate Planning intake form on 22 August. All 6 pages are complete. The submission is ready to be converted to a matter. Would you like me to open it?",
  "Pull all documents on the Smith estate.": "I found 14 documents on the Smith Estate matter:\\n• Signed will (14 June 2024)\\n• 3 EPA documents\\n• Property disclosure statement\\n• 6 letters of correspondence\\n• 3 draft codicils\\n\\nThe most recent document was added 19 August. Which one would you like to open?",
  "What's the deadline on the Robertson matter?": "The Robertson matter has one upcoming deadline: an affidavit must be filed by Thursday 28 August 2026.\\n\\nThere's also a mediation session booked for 10 September. No items are overdue on this matter."
};

function addThinkingBubble() {
  var empty = document.getElementById('chat-empty');
  if (empty) empty.style.display = 'none';
  var area = document.getElementById('chat-area');
  var wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;justify-content:flex-start';
  wrap.id = 'thinking-bubble';
  var bubble = document.createElement('div');
  bubble.className = 'chat-bubble bubble-donna';
  bubble.innerHTML = '<div class="thinking-dots"><span></span><span></span><span></span></div>';
  wrap.appendChild(bubble); area.appendChild(wrap); area.scrollTop = area.scrollHeight;
}

function resolveThinkingBubble(text) {
  var wrap = document.getElementById('thinking-bubble');
  if (wrap) { var bubble = wrap.querySelector('.chat-bubble'); bubble.innerHTML = ''; bubble.textContent = text; wrap.removeAttribute('id'); }
  document.getElementById('chat-area').scrollTop = 9999;
}

function addUserBubble(text) {
  var empty = document.getElementById('chat-empty');
  if (empty) empty.style.display = 'none';
  var area = document.getElementById('chat-area');
  var wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;justify-content:flex-end';
  var bubble = document.createElement('div');
  bubble.className = 'chat-bubble bubble-user';
  bubble.textContent = text;
  wrap.appendChild(bubble); area.appendChild(wrap); area.scrollTop = area.scrollHeight;
}

window.sendChat = function() {
  var inp = document.getElementById('chat-input');
  var text = inp.value.trim();
  if (!text) return;
  window.dispatchEvent(new CustomEvent('donna_demo_event', { detail: { event: 'demo_mcp_question_sent', properties: { input_method: 'typed' } } }));
  addUserBubble(text); inp.value = '';
  hideSuggestions(); addThinkingBubble();
  setTimeout(function() { resolveThinkingBubble('Please connect your PMS to donna first to ask custom questions.'); }, 1500);
};

window.sendSuggestion = function(btn) {
  var text = btn.textContent.trim();
  window.dispatchEvent(new CustomEvent('donna_demo_event', { detail: { event: 'demo_mcp_question_sent', properties: { input_method: 'suggestion' } } }));
  addUserBubble(text); hideSuggestions(); addThinkingBubble();
  var answer = suggestionAnswers[text] || 'Here\\'s what I found…';
  setTimeout(function() { resolveThinkingBubble(answer); }, 1600);
};

function hideSuggestions() {
  var s = document.getElementById('chat-suggestions');
  if (s) s.style.display = 'none';
}

window.resetConsole = function() {
  showPage('mcp');
  var area = document.getElementById('chat-area');
  var empty = document.getElementById('chat-empty');
  var kids = Array.prototype.slice.call(area.children);
  kids.forEach(function(c) { if (c !== empty) area.removeChild(c); });
  if (empty) empty.style.display = '';
  var sugg = document.getElementById('chat-suggestions');
  if (sugg) sugg.style.display = '';
};

function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg || 'Done'; t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2200);
}
window.showToast = showToast;
window.copyLink = function(formName) {
  window.dispatchEvent(new CustomEvent('donna_demo_event', { detail: { event: 'demo_intake_link_copied', properties: { form_template: formName } } }));
  var url = 'https://demo-form.jdotai.com/';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).catch(function() {});
  } else {
    var ta = document.createElement('textarea');
    ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
  }
  showToast('Link copied to clipboard');
};

})();
`;

export default function DonnaConsole() {
  const ref = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    const captureDemoEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ event: string; properties: Record<string, string> }>).detail;
      if (isPostHogEnabled && detail) {
        posthog.capture(detail.event, detail.properties);
      }
    };
    window.addEventListener("donna_demo_event", captureDemoEvent);
    return () => window.removeEventListener("donna_demo_event", captureDemoEvent);
  }, []);

  useEffect(() => {
    if (!ref.current || scriptRef.current) return;
    const script = document.createElement("script");
    script.textContent = JS;
    document.body.appendChild(script);
    scriptRef.current = script;
    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div
        id="donna-app"
        ref={ref}
        dangerouslySetInnerHTML={{ __html: HTML }}
      />
    </>
  );
}
