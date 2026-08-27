import React, { useEffect, useRef } from "react";

const CSS = `
#donna-app {
  position: relative;
  font-family: 'Inter', sans-serif;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 60px rgba(30,18,9,0.14);
}
#donna-app *, #donna-app *::before, #donna-app *::after { box-sizing: border-box; }
#donna-app button { cursor: pointer; font-family: inherit; border: none; background: none; }
#donna-app input, #donna-app textarea, #donna-app select { font-family: inherit; }

#donna-app #app { display: flex; height: 720px; overflow: hidden; border-radius: 16px; border: 1px solid #d9d0b8; box-shadow: 0 8px 40px rgba(30,18,9,0.12); background: #f0ead8; }

#donna-app #sidebar {
  width: 200px; flex-shrink: 0; display: flex; flex-direction: column;
  border-right: 1px solid #d9d0b8; background: #ede6d2;
}
#donna-app .sidebar-logo { padding: 0 16px; height: 80px; display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
#donna-app .sidebar-logo span { font-family: 'Fraunces', serif; font-size: 2.2rem; color: #7a2e3b; font-weight: 600; letter-spacing: -0.03em; text-align: center; }
#donna-app .sidebar-nav { flex: 1; padding: 12px 10px; display: flex; flex-direction: column; gap: 2px; }
#donna-app .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; font-size: 0.82rem; font-weight: 500; color: #5c4d3a; transition: all 0.15s; text-align: left; width: 100%; }
#donna-app .nav-item:hover { background: #d9d0b8; color: #1e1209; }
#donna-app .nav-item.active { background: #7a2e3b; color: #f0ead8; }
#donna-app .nav-item svg { opacity: 0.6; flex-shrink: 0; }
#donna-app .nav-item.active svg { opacity: 1; }
#donna-app .sidebar-footer { padding: 12px 10px 20px; }
#donna-app .signout-btn { display: flex; align-items: center; gap: 9px; padding: 9px 12px; border-radius: 8px; font-size: 0.8rem; color: #9a8a75; width: 100%; transition: 0.15s; }
#donna-app .signout-btn:hover { color: #7a2e3b; background: rgba(122,46,59,0.07); }

#donna-app #main { flex: 1; overflow: hidden; display: flex; flex-direction: column; background: #f0ead8; }
#donna-app .page { flex: 1; display: none; flex-direction: column; overflow: hidden; }
#donna-app .page.active { display: flex; }

#donna-app .page-header { display: flex; align-items: center; justify-content: flex-end; padding: 20px 32px 0; flex-shrink: 0; }
#donna-app .tabs { display: flex; gap: 6px; align-items: center; }
#donna-app .tab-btn { display: flex; align-items: center; gap: 7px; padding: 6px 16px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; transition: all 0.15s; }
#donna-app .tab-btn.active { background: #7a2e3b; color: #f0ead8; border: 1px solid transparent; }
#donna-app .tab-btn:not(.active) { border: 1px solid #d9d0b8; color: #9a8a75; }
#donna-app .tab-btn:not(.active):hover { background: #d9d0b8; color: #1e1209; }
#donna-app .tab-num { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 600; }
#donna-app .tab-btn.active .tab-num { background: rgba(240,234,216,0.25); color: #f0ead8; }
#donna-app .tab-btn:not(.active) .tab-num { background: #d9d0b8; color: #5c4d3a; }

#donna-app .scroll-content { flex: 1; overflow-y: auto; padding: 28px 32px; }
#donna-app .scroll-content::-webkit-scrollbar { width: 5px; }
#donna-app .scroll-content::-webkit-scrollbar-thumb { background: #d9d0b8; border-radius: 3px; }

#donna-app .card { background: #e8e0cc; border: 1px solid #d9d0b8; border-radius: 16px; padding: 22px 24px; }
#donna-app .card-title { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #9a8a75; margin-bottom: 16px; }

#donna-app .settings-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #d9d0b8; }
#donna-app .settings-row:last-child { border-bottom: none; }
#donna-app .settings-label { font-size: 0.82rem; color: #9a8a75; }
#donna-app .settings-value { font-size: 0.82rem; font-weight: 600; color: #1e1209; }

#donna-app .btn-primary { background: #7a2e3b; color: #f0ead8; border-radius: 10px; padding: 8px 18px; font-size: 0.82rem; font-weight: 600; transition: background 0.15s; }
#donna-app .btn-primary:hover { background: #5e2230; }
#donna-app .btn-outline { border: 1px solid #d9d0b8; color: #5c4d3a; border-radius: 10px; padding: 7px 16px; font-size: 0.82rem; font-weight: 500; transition: all 0.15s; background: transparent; }
#donna-app .btn-outline:hover { background: #d9d0b8; }
#donna-app .btn-danger { border: 1px solid #e0b0b0; color: #a0384a; border-radius: 10px; padding: 7px 16px; font-size: 0.82rem; font-weight: 500; transition: all 0.15s; background: transparent; }
#donna-app .btn-danger:hover { background: #f5e8e8; }
#donna-app .btn-sm { padding: 5px 12px; font-size: 0.75rem; border-radius: 8px; }

#donna-app .badge { font-size: 0.68rem; padding: 2px 9px; border-radius: 20px; font-weight: 600; }
#donna-app .badge-starter { background: #f5ede4; color: #7a2e3b; border: 1px solid #e0c8bf; }
#donna-app .badge-complete { background: #e4f0ea; color: #2a7a4f; border: 1px solid #b0d9c0; }
#donna-app .badge-progress { background: #f0e8e0; color: #7a4e2e; border: 1px solid #d9c0a8; }

#donna-app .status-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }

#donna-app .data-table { border: 1px solid #d9d0b8; border-radius: 14px; overflow: hidden; }
#donna-app .table-row { display: grid; padding: 13px 22px; border-bottom: 1px solid #d9d0b8; transition: background 0.12s; }
#donna-app .table-row:last-child { border-bottom: none; }
#donna-app .table-row:hover { background: #e2d9c4; }
#donna-app .table-head { padding: 10px 22px; display: grid; background: transparent; }
#donna-app .table-head span { font-size: 0.66rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #9a8a75; }

#donna-app .modal-overlay { position: absolute; inset: 0; background: rgba(30,18,9,0.35); display: none; z-index: 100; align-items: center; justify-content: center; }
#donna-app .modal-overlay.open { display: flex; }
#donna-app .modal { background: #ede6d2; border: 1px solid #d9d0b8; border-radius: 20px; padding: 32px; min-width: 380px; max-width: 500px; width: 100%; position: relative; }
#donna-app .modal-title { font-size: 1.05rem; font-weight: 700; color: #1e1209; margin-bottom: 10px; }
#donna-app .modal-desc { font-size: 0.83rem; color: #9a8a75; margin-bottom: 24px; line-height: 1.5; }
#donna-app .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
#donna-app .modal-close { position: absolute; top: 16px; right: 18px; font-size: 1.3rem; color: #9a8a75; }
#donna-app .modal-close:hover { color: #1e1209; }

#donna-app .form-group { margin-bottom: 16px; }
#donna-app .form-label { font-size: 0.75rem; font-weight: 600; color: #9a8a75; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; display: block; }
#donna-app .form-input { width: 100%; padding: 9px 13px; border: 1px solid #d9d0b8; border-radius: 9px; background: #f0ead8; color: #1e1209; font-size: 0.85rem; outline: none; transition: border-color 0.15s; }
#donna-app .form-input:focus { border-color: #7a2e3b; }
#donna-app .form-select { width: 100%; padding: 9px 13px; border: 1px solid #d9d0b8; border-radius: 9px; background: #f0ead8; color: #1e1209; font-size: 0.85rem; outline: none; appearance: none; }
#donna-app .color-swatch { width: 16px; height: 16px; border-radius: 4px; display: inline-block; border: 1px solid rgba(0,0,0,0.1); }

#donna-app .form-pages-list { border: 1px solid #d9d0b8; border-radius: 14px; overflow: hidden; }
#donna-app .form-page-item { display: flex; align-items: center; gap: 16px; padding: 14px 22px; border-bottom: 1px solid #d9d0b8; cursor: pointer; transition: background 0.12s; }
#donna-app .form-page-item:last-child { border-bottom: none; }
#donna-app .form-page-item:hover, #donna-app .form-page-item.open { background: #e2d9c4; }
#donna-app .form-page-num { font-size: 0.7rem; font-family: monospace; color: #c4b8a4; width: 22px; flex-shrink: 0; }
#donna-app .form-page-chevron { margin-left: auto; color: #c4b8a4; transition: transform 0.2s; }
#donna-app .form-page-chevron.rotated { transform: rotate(90deg); }
#donna-app .form-page-fields { padding: 0 22px 14px 22px; background: rgba(0,0,0,0.02); border-bottom: 1px solid #d9d0b8; }
#donna-app .field-item { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-bottom: 1px solid rgba(0,0,0,0.05); font-size: 0.8rem; color: #5c4d3a; }
#donna-app .field-item:last-child { border-bottom: none; }
#donna-app .field-icon { width: 22px; height: 22px; border-radius: 5px; background: #d9d0b8; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

#donna-app .template-item { display: flex; align-items: center; gap: 14px; padding: 16px 22px; border-bottom: 1px solid #d9d0b8; transition: background 0.12s; }
#donna-app .template-item:last-child { border-bottom: none; }
#donna-app .template-item:hover { background: rgba(0,0,0,0.02); }
#donna-app .template-actions { display: flex; gap: 7px; flex-shrink: 0; }

#donna-app .mcp-page { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
#donna-app .chat-area { flex: 1; overflow-y: auto; padding: 24px 32px; display: flex; flex-direction: column; gap: 14px; }
#donna-app .chat-area::-webkit-scrollbar { width: 5px; }
#donna-app .chat-area::-webkit-scrollbar-thumb { background: #d9d0b8; border-radius: 3px; }
#donna-app .chat-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
#donna-app .chat-empty-logo { font-family: 'Fraunces', serif; font-size: 3.5rem; color: #7a2e3b; font-weight: 600; }
#donna-app .chat-empty-sub { font-size: 0.85rem; color: #9a8a75; }
#donna-app .chat-suggestions { display: flex; gap: 8px; padding: 10px 32px 12px; flex-wrap: wrap; justify-content: center; }
#donna-app .suggestion-chip { border: 1px solid #d9d0b8; color: #5c4d3a; border-radius: 20px; padding: 7px 16px; font-size: 0.8rem; transition: all 0.15s; background: transparent; text-align: left; }
#donna-app .suggestion-chip:hover { background: #d9d0b8; color: #1e1209; }
#donna-app .chat-input-wrap { padding: 8px 32px 24px; }
#donna-app .chat-input-box { display: flex; align-items: center; gap: 10px; border-radius: 16px; padding: 11px 14px; background: #e8e0cc; border: 1px solid #d9d0b8; }
#donna-app .chat-input { flex: 1; background: transparent; outline: none; font-size: 0.85rem; color: #1e1209; border: none; }
#donna-app .chat-input::placeholder { color: #c4b8a4; }
#donna-app .chat-bubble { max-width: 68%; padding: 11px 15px; border-radius: 18px; font-size: 0.85rem; line-height: 1.45; }
#donna-app .bubble-user { background: #7a2e3b; color: #f0ead8; border-radius: 18px 18px 4px 18px; align-self: flex-end; }
#donna-app .bubble-donna { background: #e8e0cc; color: #1e1209; border-radius: 18px 18px 18px 4px; align-self: flex-start; }

#donna-app .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
#donna-app .radio-circle { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #d9d0b8; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: border-color 0.15s; }
#donna-app .radio-circle.selected { border-color: #7a2e3b; }
#donna-app .radio-dot { width: 7px; height: 7px; border-radius: 50%; background: #7a2e3b; }
#donna-app .divider { border: none; border-top: 1px solid #d9d0b8; margin: 14px 0; }
#donna-app .section-sub { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase; color: #9a8a75; margin-bottom: 10px; }
#donna-app .api-key-row { display: flex; gap: 8px; align-items: center; }
#donna-app .api-key-input { flex: 1; }

#donna-app .submissions-layout { display: flex; height: 100%; overflow: hidden; }
#donna-app .submissions-main { flex: 1; overflow-y: auto; padding: 24px 28px; }
#donna-app .sub-detail-panel { width: 300px; flex-shrink: 0; border-left: 1px solid #d9d0b8; background: #ede6d2; display: flex; flex-direction: column; overflow: hidden; }
#donna-app .sub-detail-header { padding: 18px 20px 14px; border-bottom: 1px solid #d9d0b8; display: flex; align-items: center; justify-content: space-between; }
#donna-app .sub-detail-body { flex: 1; overflow-y: auto; padding: 18px 20px; }
#donna-app .detail-field { margin-bottom: 14px; }
#donna-app .detail-field-label { font-size: 0.66rem; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase; color: #9a8a75; margin-bottom: 4px; }
#donna-app .detail-field-value { font-size: 0.85rem; color: #1e1209; font-weight: 500; }

#donna-app .edit-form-page { position: absolute; inset: 0; background: #f0ead8; z-index: 200; display: none; flex-direction: column; overflow: hidden; }
#donna-app .edit-form-page.open { display: flex; }
#donna-app .edit-form-header { display: flex; align-items: center; gap: 16px; padding: 16px 28px; border-bottom: 1px solid #d9d0b8; }
#donna-app .edit-form-back { display: flex; align-items: center; gap: 7px; font-size: 0.82rem; color: #9a8a75; transition: color 0.15s; }
#donna-app .edit-form-back:hover { color: #7a2e3b; }
#donna-app .edit-form-content { flex: 1; overflow-y: auto; padding: 28px 32px; display: flex; gap: 24px; }
#donna-app .edit-pages-sidebar { width: 230px; flex-shrink: 0; }
#donna-app .edit-questions-main { flex: 1; }
#donna-app .page-nav-item { padding: 10px 14px; border-radius: 10px; cursor: pointer; transition: all 0.12s; font-size: 0.82rem; color: #5c4d3a; font-weight: 500; display: flex; align-items: center; gap: 9px; }
#donna-app .page-nav-item.active { background: #7a2e3b; color: #f0ead8; }
#donna-app .page-nav-item:not(.active):hover { background: #d9d0b8; }
#donna-app .question-card { background: #e8e0cc; border: 1px solid #d9d0b8; border-radius: 12px; padding: 16px 18px; margin-bottom: 10px; }
#donna-app .question-label { font-size: 0.85rem; font-weight: 600; color: #1e1209; margin-bottom: 4px; }
#donna-app .question-meta { font-size: 0.73rem; color: #9a8a75; display: flex; gap: 10px; align-items: center; }
#donna-app .question-actions { display: flex; gap: 6px; margin-top: 10px; }
#donna-app .q-action-btn { font-size: 0.72rem; padding: 4px 10px; border-radius: 6px; border: 1px solid #d9d0b8; color: #9a8a75; background: transparent; cursor: pointer; transition: all 0.12s; }
#donna-app .q-action-btn:hover { background: #d9d0b8; color: #1e1209; }
#donna-app .q-action-btn.required-active { border-color: #7a2e3b; color: #7a2e3b; background: rgba(122,46,59,0.06); }
#donna-app .add-question-btn { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border: 1.5px dashed #d9d0b8; border-radius: 12px; width: 100%; font-size: 0.82rem; color: #9a8a75; transition: all 0.15s; background: transparent; cursor: pointer; margin-top: 4px; }
#donna-app .add-question-btn:hover { border-color: #7a2e3b; color: #7a2e3b; }
#donna-app .add-q-opt { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; cursor: pointer; font-size: 0.82rem; color: #5c4d3a; transition: all 0.12s; }
#donna-app .add-q-opt:hover { background: #d9d0b8; }
#donna-app .confirm-icon { width: 48px; height: 48px; border-radius: 50%; background: #fbe8e8; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }

#donna-app .toast { position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); background: #1e1209; color: #f0ead8; padding: 10px 20px; border-radius: 10px; font-size: 0.82rem; z-index: 999; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
#donna-app .toast.show { opacity: 1; }

#donna-app .preview-page { position: absolute; inset: 0; background: #f5f5f5; z-index: 300; display: none; flex-direction: column; overflow: hidden; }
#donna-app .preview-page.open { display: flex; }
#donna-app .preview-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; background: white; border-bottom: 1px solid #e0e0e0; }
#donna-app .preview-badge { background: #e8f4fe; color: #1a6bb5; border-radius: 6px; padding: 4px 10px; font-size: 0.72rem; font-weight: 600; }
#donna-app .preview-body { flex: 1; overflow-y: auto; display: flex; justify-content: center; padding: 32px 20px; }
#donna-app .preview-form { background: white; border-radius: 16px; padding: 36px 40px; max-width: 560px; width: 100%; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
#donna-app .preview-progress-bar { height: 4px; background: #e8e0d0; border-radius: 2px; margin-bottom: 28px; }
#donna-app .preview-progress-fill { height: 100%; background: #7a2e3b; border-radius: 2px; width: 20%; }
#donna-app .preview-form-title { font-size: 1.3rem; font-weight: 700; color: #1e1209; margin-bottom: 6px; font-family: 'Fraunces', serif; }
#donna-app .preview-form-sub { font-size: 0.83rem; color: #888; margin-bottom: 24px; }
#donna-app .preview-field { margin-bottom: 16px; }
#donna-app .preview-field label { display: block; font-size: 0.78rem; font-weight: 600; color: #555; margin-bottom: 5px; }
#donna-app .preview-field label .req { color: #7a2e3b; margin-left: 3px; }
#donna-app .preview-field input { width: 100%; padding: 10px 13px; border: 1.5px solid #e0e0e0; border-radius: 9px; font-size: 0.85rem; outline: none; }
#donna-app .preview-field input:focus { border-color: #7a2e3b; }
#donna-app .preview-next-btn { width: 100%; padding: 12px; background: #7a2e3b; color: white; border-radius: 10px; font-size: 0.9rem; font-weight: 600; margin-top: 8px; }
#donna-app .preview-next-btn:hover { background: #5e2230; }
`;

const HTML = `
<div id="app">
  <aside id="sidebar">
    <div class="sidebar-logo"><span>donna</span></div>
    <nav class="sidebar-nav">
      <button class="nav-item active" onclick="donnaShowPage('intake')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
        Intake
      </button>
      <button class="nav-item" onclick="donnaShowPage('mcp')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z"/></svg>
        Donna MCP
      </button>
      <button class="nav-item" onclick="donnaShowPage('settings')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        Settings
      </button>
    </nav>
    <div class="sidebar-footer">
      <button class="signout-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Sign out
      </button>
    </div>
  </aside>
  <main id="main">
    <div id="page-intake" class="page active">
      <div class="page-header">
        <div class="tabs">
          <button class="tab-btn active" onclick="donnaShowTab('overview')" id="tab-overview"><span class="tab-num">1</span> Overview</button>
          <button class="tab-btn" onclick="donnaShowTab('build')" id="tab-build"><span class="tab-num">2</span> Build</button>
          <button class="tab-btn" onclick="donnaShowTab('submissions')" id="tab-submissions"><span class="tab-num">3</span> Submissions <span style="font-size:0.72rem;opacity:0.6;margin-left:2px">(274)</span></button>
        </div>
      </div>
      <div id="tab-content-overview" class="scroll-content" style="display:block">
        <div style="max-width:700px;margin:0 auto">
          <div style="margin-bottom:20px">
            <p style="font-size:0.78rem;color:#9a8a75;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px">Select intake form</p>
            <select class="form-select" style="max-width:320px" onchange="donnaUpdateOverview(this.value)">
              <option>Estate Planning Questionnaire</option>
              <option>Family Law Questionnaire</option>
            </select>
          </div>
          <div style="margin-bottom:8px">
            <p style="font-size:0.72rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#9a8a75">Form Pages <span style="font-size:0.72rem;font-weight:400;color:#c4b8a4;text-transform:none;letter-spacing:0">— click any page to see its fields</span></p>
          </div>
          <div class="form-pages-list">
            <div class="form-page-item" onclick="donnaTogglePage(this,0)"><span class="form-page-num">01</span><div style="flex:1"><div style="font-size:0.85rem;font-weight:600;color:#1e1209">Contact Info</div><div style="font-size:0.75rem;color:#9a8a75;margin-top:2px">2 fields · required</div></div><svg class="form-page-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
            <div class="form-page-fields" id="d-fields-0" style="display:none"><div class="field-item"><div class="field-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div> Name <span style="color:#7a2e3b;margin-left:4px;font-size:0.72rem">Required</span></div><div class="field-item"><div class="field-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div> Email <span style="color:#7a2e3b;margin-left:4px;font-size:0.72rem">Required</span></div></div>
            <div class="form-page-item" onclick="donnaTogglePage(this,1)"><span class="form-page-num">02</span><div style="flex:1"><div style="font-size:0.85rem;font-weight:600;color:#1e1209">Personal Information</div><div style="font-size:0.75rem;color:#9a8a75;margin-top:2px">14 fields</div></div><svg class="form-page-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
            <div class="form-page-fields" id="d-fields-1" style="display:none"><div class="field-item"><div class="field-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg></div> Date of Birth</div><div class="field-item"><div class="field-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="12" x2="21" y2="12"/></svg></div> Phone Number</div><div class="field-item"><div class="field-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="12" x2="21" y2="12"/></svg></div> Address</div><div style="font-size:0.72rem;color:#c4b8a4;padding-top:4px">+11 more fields</div></div>
            <div class="form-page-item" onclick="donnaTogglePage(this,2)"><span class="form-page-num">03</span><div style="flex:1"><div style="font-size:0.85rem;font-weight:600;color:#1e1209">Matter Details</div><div style="font-size:0.75rem;color:#9a8a75;margin-top:2px">13 fields</div></div><svg class="form-page-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
            <div class="form-page-fields" id="d-fields-2" style="display:none"><div class="field-item"><div class="field-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></div> Matter Type</div><div class="field-item"><div class="field-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></div> Description of Issue</div><div style="font-size:0.72rem;color:#c4b8a4;padding-top:4px">+11 more fields</div></div>
            <div class="form-page-item" onclick="donnaTogglePage(this,3)"><span class="form-page-num">04</span><div style="flex:1"><div style="font-size:0.85rem;font-weight:600;color:#1e1209">Financial Information</div><div style="font-size:0.75rem;color:#9a8a75;margin-top:2px">5 fields</div></div><svg class="form-page-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
            <div class="form-page-fields" id="d-fields-3" style="display:none"><div class="field-item"><div class="field-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="12" x2="21" y2="12"/></svg></div> Annual Income Range</div><div class="field-item"><div class="field-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="12" x2="21" y2="12"/></svg></div> Employment Status</div><div style="font-size:0.72rem;color:#c4b8a4;padding-top:4px">+3 more fields</div></div>
            <div class="form-page-item" onclick="donnaTogglePage(this,4)"><span class="form-page-num">05</span><div style="flex:1"><div style="font-size:0.85rem;font-weight:600;color:#1e1209">Referral &amp; Additional Info</div><div style="font-size:0.75rem;color:#9a8a75;margin-top:2px">6 fields</div></div><svg class="form-page-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
            <div class="form-page-fields" id="d-fields-4" style="display:none"><div class="field-item"><div class="field-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="12" x2="21" y2="12"/></svg></div> How did you hear about us?</div><div class="field-item"><div class="field-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></div> Additional Comments</div><div style="font-size:0.72rem;color:#c4b8a4;padding-top:4px">+4 more fields</div></div>
            <div class="form-page-item" onclick="donnaTogglePage(this,5)"><span class="form-page-num">06</span><div style="flex:1"><div style="font-size:0.85rem;font-weight:600;color:#1e1209">Consent &amp; Signature</div><div style="font-size:0.75rem;color:#9a8a75;margin-top:2px">4 fields</div></div><svg class="form-page-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
            <div class="form-page-fields" id="d-fields-5" style="display:none"><div class="field-item"><div class="field-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div> Privacy Policy Agreement <span style="color:#7a2e3b;margin-left:4px;font-size:0.72rem">Required</span></div><div class="field-item"><div class="field-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"/><path d="M16.5 3.5l4 4L7 21l-4 1 1-4z"/></svg></div> Signature</div></div>
          </div>
        </div>
      </div>
      <div id="tab-content-build" class="scroll-content" style="display:none">
        <div style="max-width:700px;margin:0 auto">
          <p style="font-size:0.72rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#9a8a75;margin-bottom:16px">Your Forms</p>
          <div class="data-table">
            <div class="template-item"><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:8px;margin-bottom:3px"><span style="font-size:0.87rem;font-weight:600;color:#1e1209">Estate Planning Questionnaire</span><span class="badge badge-starter">Starter</span></div><div style="font-size:0.76rem;color:#9a8a75">Wills, EPA/guardianship, funeral wishes, family and financial disclosure.</div></div><div class="template-actions"><button class="btn-outline btn-sm" onclick="donnaOpenEditForm('Estate Planning Questionnaire')">Edit</button><button class="btn-outline btn-sm" onclick="donnaCopyLink()">Copy link</button><button class="btn-outline btn-sm" onclick="donnaOpenPreview()">Preview</button></div></div>
            <div class="template-item"><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:8px;margin-bottom:3px"><span style="font-size:0.87rem;font-weight:600;color:#1e1209">Family Law Questionnaire</span><span class="badge badge-starter">Starter</span></div><div style="font-size:0.76rem;color:#9a8a75">Separation, parenting, property and safety. Mapped to Clio and Smokeball.</div></div><div class="template-actions"><button class="btn-outline btn-sm" onclick="donnaOpenEditForm('Family Law Questionnaire')">Edit</button><button class="btn-outline btn-sm" onclick="donnaCopyLink()">Copy link</button><button class="btn-outline btn-sm" onclick="donnaOpenPreview()">Preview</button></div></div>
          </div>
          <p style="font-size:0.75rem;color:#c4b8a4;margin-top:12px;text-align:center">Starter templates cannot be deleted. Your firm's customisations are saved separately.</p>
        </div>
      </div>
      <div id="tab-content-submissions" style="display:none;flex:1;overflow:hidden">
        <div class="submissions-layout">
          <div class="submissions-main">
            <div style="max-width:750px">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
                <select class="form-select" style="max-width:220px;font-size:0.8rem;padding:6px 10px"><option>Estate Planning Questionnaire</option><option>Family Law Questionnaire</option></select>
                <input class="form-input" style="max-width:220px;font-size:0.8rem;padding:6px 10px" placeholder="Search email or date…"/>
              </div>
              <div class="table-head" style="grid-template-columns:1.6fr 2fr 1.4fr auto"><span>Date</span><span>Email</span><span>Status</span><span>Actions</span></div>
              <div class="data-table" id="d-submissions-table"></div>
            </div>
          </div>
          <div class="sub-detail-panel" id="d-sub-detail-panel" style="display:none">
            <div class="sub-detail-header"><span style="font-size:0.85rem;font-weight:700;color:#1e1209" id="d-sub-detail-email">—</span><button onclick="donnaCloseSubDetail()" style="color:#9a8a75;font-size:1.2rem;line-height:1">×</button></div>
            <div class="sub-detail-body">
              <div class="detail-field"><div class="detail-field-label">Submitted</div><div class="detail-field-value" id="d-sub-detail-date">—</div></div>
              <div class="detail-field"><div class="detail-field-label">Status</div><div id="d-sub-detail-status">—</div></div>
              <div class="detail-field"><div class="detail-field-label">Form</div><div class="detail-field-value">Estate Planning Questionnaire</div></div>
              <div class="detail-field"><div class="detail-field-label">Name</div><div class="detail-field-value" id="d-sub-detail-name">—</div></div>
              <hr class="divider"/><p style="font-size:0.75rem;color:#9a8a75;line-height:1.5">Once complete, contact and matter are created automatically in your PMS.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="page-mcp" class="page">
      <div class="mcp-page">
        <div class="chat-area" id="d-chat-area">
          <div class="chat-empty" id="d-chat-empty"><div class="chat-empty-logo">donna</div><p class="chat-empty-sub">Ask me anything in Smokeball.</p></div>
        </div>
        <div class="chat-suggestions" id="d-chat-suggestions">
          <button class="suggestion-chip" onclick="donnaSendSuggestion(this)">What's the update on the Johnson matter?</button>
          <button class="suggestion-chip" onclick="donnaSendSuggestion(this)">What are my deadlines this week?</button>
          <button class="suggestion-chip" onclick="donnaSendSuggestion(this)">Did NewFirmABC fill out their intake form?</button>
          <button class="suggestion-chip" onclick="donnaSendSuggestion(this)">Pull all documents on the Smith estate.</button>
          <button class="suggestion-chip" onclick="donnaSendSuggestion(this)">What's the deadline on the Robertson matter?</button>
        </div>
        <div class="chat-input-wrap">
          <div class="chat-input-box">
            <input class="chat-input" id="d-chat-input" placeholder="Ask me anything in Smokeball…" onkeydown="if(event.key==='Enter')donnaSendChat()"/>
            <button class="btn-primary btn-sm" onclick="donnaSendChat()">Send</button>
          </div>
        </div>
      </div>
    </div>
    <div id="page-settings" class="page">
      <div class="scroll-content">
        <div style="max-width:780px;margin:0 auto">
          <div class="settings-grid">
            <div class="card">
              <div class="card-title">Firm</div>
              <div class="settings-row"><span class="settings-label">Firm name</span><div style="display:flex;align-items:center;gap:8px"><span class="settings-value" id="d-firm-name-display">Nautilus Legal</span><button class="btn-outline btn-sm" onclick="donnaOpenModal('edit-firm-name')">Edit</button></div></div>
              <div class="settings-row"><span class="settings-label">Brand colour</span><div style="display:flex;align-items:center;gap:8px"><span class="color-swatch" id="d-brand-swatch" style="background:#7a2e3b"></span><span class="settings-value" id="d-brand-color-display">#7a2e3b</span><button class="btn-outline btn-sm" onclick="donnaOpenModal('edit-brand-color')">Edit</button></div></div>
              <div class="settings-row"><span class="settings-label">Practice management</span><div style="display:flex;align-items:center;gap:8px"><span class="settings-value" id="d-pms-display">Smokeball</span><button class="btn-outline btn-sm" onclick="donnaOpenModal('edit-pms')">Change</button></div></div>
            </div>
            <div class="card">
              <div class="card-title">AI Provider</div>
              <div class="settings-row"><span class="settings-label">Provider</span><span class="settings-value" id="d-ai-provider-display">Anthropic</span></div>
              <div class="settings-row"><span class="settings-label">Model</span><span class="settings-value" id="d-ai-model-display">claude-sonnet-4-6</span></div>
              <div class="settings-row"><span class="settings-label">Status</span><span style="display:flex;align-items:center;gap:6px;font-size:0.82rem;font-weight:600;color:#2a7a4f"><span class="status-dot" style="background:#4a9b6f"></span> Active</span></div>
              <hr class="divider"/>
              <div class="section-sub">Change provider</div>
              <div class="form-group"><label class="form-label">API Key</label><div class="api-key-row"><input class="form-input api-key-input" id="d-api-key-input" type="password" placeholder="sk-ant-… / sk-… / eyJ…" oninput="donnaDetectProvider(this.value)"/><button class="btn-outline btn-sm" onclick="donnaToggleApiKey()">Show</button><button class="btn-primary btn-sm" onclick="donnaTestApiKey()">Test</button></div><p style="font-size:0.73rem;color:#9a8a75;margin-top:6px" id="d-provider-hint">Provider detected automatically from your key.</p></div>
              <div class="form-group"><label class="form-label">Model</label><select class="form-select" id="d-model-select" onchange="document.getElementById('d-ai-model-display').textContent=this.value"><option>claude-sonnet-4-6</option><option>claude-opus-4-6</option><option>claude-haiku-4-5-20251001</option></select></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<div class="modal-overlay" id="d-modal-edit-firm-name"><div class="modal"><button class="modal-close" onclick="donnaCloseModal('edit-firm-name')">×</button><div class="modal-title">Edit firm name</div><div class="modal-desc">This is the display name shown across the platform.</div><div class="form-group"><label class="form-label">Firm Name</label><input class="form-input" id="d-firm-name-input" value="Nautilus Legal"/></div><div class="modal-actions"><button class="btn-outline" onclick="donnaCloseModal('edit-firm-name')">Cancel</button><button class="btn-primary" onclick="donnaSaveFirmName()">Save</button></div></div></div>
<div class="modal-overlay" id="d-modal-edit-brand-color"><div class="modal"><button class="modal-close" onclick="donnaCloseModal('edit-brand-color')">×</button><div class="modal-title">Brand colour</div><div class="modal-desc">Set your firm's primary colour.</div><div class="form-group"><label class="form-label">Hex Colour</label><div style="display:flex;align-items:center;gap:10px"><input type="color" id="d-brand-color-picker" value="#7a2e3b" style="width:44px;height:36px;border:1px solid #d9d0b8;border-radius:7px;cursor:pointer;padding:2px;background:#f0ead8"/><input class="form-input" id="d-brand-color-hex" value="#7a2e3b" style="flex:1"/></div></div><div class="modal-actions"><button class="btn-outline" onclick="donnaCloseModal('edit-brand-color')">Cancel</button><button class="btn-primary" onclick="donnaSaveBrandColor()">Save</button></div></div></div>
<div class="modal-overlay" id="d-modal-edit-pms"><div class="modal"><button class="modal-close" onclick="donnaCloseModal('edit-pms')">×</button><div class="modal-title">Practice management</div><div class="modal-desc">Select the PMS your firm uses.</div><div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px"><label style="display:flex;align-items:center;gap:12px;padding:14px;border:1.5px solid #d9d0b8;border-radius:10px;cursor:pointer" onclick="donnaSelectPMS('Smokeball',this)"><div class="radio-circle selected" id="d-pms-radio-smokeball"><div class="radio-dot"></div></div><div><div style="font-size:0.87rem;font-weight:600;color:#1e1209">Smokeball</div><div style="font-size:0.75rem;color:#9a8a75">Australian &amp; US practice management</div></div></label><label style="display:flex;align-items:center;gap:12px;padding:14px;border:1.5px solid #d9d0b8;border-radius:10px;cursor:pointer" onclick="donnaSelectPMS('Clio',this)"><div class="radio-circle" id="d-pms-radio-clio"></div><div><div style="font-size:0.87rem;font-weight:600;color:#1e1209">Clio</div><div style="font-size:0.75rem;color:#9a8a75">Cloud-based legal practice management</div></div></label></div><div class="modal-actions"><button class="btn-outline" onclick="donnaCloseModal('edit-pms')">Cancel</button><button class="btn-primary" onclick="donnaSavePMS()">Save</button></div></div></div>
<div class="modal-overlay" id="d-modal-add-question"><div class="modal" style="max-width:420px"><button class="modal-close" onclick="donnaCloseModal('add-question')">×</button><div class="modal-title">Add a question</div><div class="modal-desc">Choose the type of question to add.</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px"><button class="add-q-opt" style="flex-direction:column;align-items:flex-start;border:1px solid #d9d0b8;border-radius:10px;padding:14px;gap:6px" onclick="donnaCloseModal('add-question')"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg><div style="font-size:0.83rem;font-weight:600;color:#1e1209">Document upload</div></button><button class="add-q-opt" style="flex-direction:column;align-items:flex-start;border:1px solid #d9d0b8;border-radius:10px;padding:14px;gap:6px" onclick="donnaCloseModal('add-question')"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/></svg><div style="font-size:0.83rem;font-weight:600;color:#1e1209">Long text</div></button><button class="add-q-opt" style="flex-direction:column;align-items:flex-start;border:1px solid #d9d0b8;border-radius:10px;padding:14px;gap:6px" onclick="donnaCloseModal('add-question')"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/></svg><div style="font-size:0.83rem;font-weight:600;color:#1e1209">Short text</div></button><button class="add-q-opt" style="flex-direction:column;align-items:flex-start;border:1px solid #d9d0b8;border-radius:10px;padding:14px;gap:6px" onclick="donnaCloseModal('add-question')"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg><div style="font-size:0.83rem;font-weight:600;color:#1e1209">Dropdown</div></button></div></div></div>

<div class="edit-form-page" id="d-edit-form-page">
  <div class="edit-form-header"><button class="edit-form-back" onclick="donnaCloseEditForm()"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>Back</button><span style="font-size:0.95rem;font-weight:700;color:#1e1209;margin:0 auto" id="d-edit-form-title">Edit Form</span><button class="btn-primary btn-sm">Save changes</button></div>
  <div class="edit-form-content">
    <div class="edit-pages-sidebar">
      <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.13em;color:#9a8a75;margin-bottom:10px">Form Pages</div>
      <div id="d-edit-page-nav">
        <div class="page-nav-item active" onclick="donnaSelectEditPage(this,0)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Contact Info</div>
        <div class="page-nav-item" onclick="donnaSelectEditPage(this,1)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>Personal Information</div>
        <div class="page-nav-item" onclick="donnaSelectEditPage(this,2)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>Matter Details</div>
        <div class="page-nav-item" onclick="donnaSelectEditPage(this,3)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Financial Information</div>
        <div class="page-nav-item" onclick="donnaSelectEditPage(this,4)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>Referral &amp; Additional</div>
        <div class="page-nav-item" onclick="donnaSelectEditPage(this,5)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Consent &amp; Signature</div>
      </div>
    </div>
    <div class="edit-questions-main" id="d-edit-questions-panel">
      <div id="d-edit-page-0"><div style="margin-bottom:16px"><h3 style="font-size:1rem;font-weight:700;color:#1e1209">Contact Info</h3><p style="font-size:0.78rem;color:#9a8a75;margin-top:3px">This is always the first page.</p></div><div class="question-card"><div class="question-label">Name <span style="color:#7a2e3b">*</span></div><div class="question-meta"><span>Short text</span></div><div class="question-actions"><button class="q-action-btn">Edit</button><button class="q-action-btn required-active">Required ✓</button><button class="q-action-btn" style="color:#a0384a;border-color:#e0b0b0">Delete</button></div></div><div class="question-card"><div class="question-label">Email <span style="color:#7a2e3b">*</span></div><div class="question-meta"><span>Short text</span></div><div class="question-actions"><button class="q-action-btn">Edit</button><button class="q-action-btn required-active">Required ✓</button><button class="q-action-btn" style="color:#a0384a;border-color:#e0b0b0">Delete</button></div></div><button class="add-question-btn" onclick="donnaOpenModal('add-question')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add question</button></div>
      <div id="d-edit-page-1" style="display:none"><div style="margin-bottom:16px"><h3 style="font-size:1rem;font-weight:700;color:#1e1209">Personal Information</h3></div><div class="question-card"><div class="question-label">Date of Birth</div><div class="question-meta"><span>Short text</span></div><div class="question-actions"><button class="q-action-btn">Edit</button><button class="q-action-btn">Make required</button><button class="q-action-btn" style="color:#a0384a;border-color:#e0b0b0">Delete</button></div></div><div class="question-card"><div class="question-label">Phone Number</div><div class="question-meta"><span>Short text</span></div><div class="question-actions"><button class="q-action-btn">Edit</button><button class="q-action-btn">Make required</button><button class="q-action-btn" style="color:#a0384a;border-color:#e0b0b0">Delete</button></div></div><div class="question-card"><div class="question-label">Address</div><div class="question-meta"><span>Long text</span></div><div class="question-actions"><button class="q-action-btn">Edit</button><button class="q-action-btn">Make required</button><button class="q-action-btn" style="color:#a0384a;border-color:#e0b0b0">Delete</button></div></div><button class="add-question-btn" onclick="donnaOpenModal('add-question')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add question</button></div>
      <div id="d-edit-page-2" style="display:none"><div style="margin-bottom:16px"><h3 style="font-size:1rem;font-weight:700;color:#1e1209">Matter Details</h3></div><div class="question-card"><div class="question-label">Matter Type</div><div class="question-meta"><span>Dropdown</span></div><div class="question-actions"><button class="q-action-btn">Edit</button><button class="q-action-btn">Make required</button><button class="q-action-btn" style="color:#a0384a;border-color:#e0b0b0">Delete</button></div></div><div class="question-card"><div class="question-label">Description of issue</div><div class="question-meta"><span>Long text</span></div><div class="question-actions"><button class="q-action-btn">Edit</button><button class="q-action-btn">Make required</button><button class="q-action-btn" style="color:#a0384a;border-color:#e0b0b0">Delete</button></div></div><button class="add-question-btn" onclick="donnaOpenModal('add-question')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add question</button></div>
      <div id="d-edit-page-3" style="display:none"><div style="margin-bottom:16px"><h3 style="font-size:1rem;font-weight:700;color:#1e1209">Financial Information</h3></div><div class="question-card"><div class="question-label">Annual Income Range</div><div class="question-meta"><span>Dropdown</span></div><div class="question-actions"><button class="q-action-btn">Edit</button><button class="q-action-btn">Make required</button><button class="q-action-btn" style="color:#a0384a;border-color:#e0b0b0">Delete</button></div></div><button class="add-question-btn" onclick="donnaOpenModal('add-question')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add question</button></div>
      <div id="d-edit-page-4" style="display:none"><div style="margin-bottom:16px"><h3 style="font-size:1rem;font-weight:700;color:#1e1209">Referral &amp; Additional Info</h3></div><div class="question-card"><div class="question-label">How did you hear about us?</div><div class="question-meta"><span>Dropdown</span></div><div class="question-actions"><button class="q-action-btn">Edit</button><button class="q-action-btn">Make required</button><button class="q-action-btn" style="color:#a0384a;border-color:#e0b0b0">Delete</button></div></div><button class="add-question-btn" onclick="donnaOpenModal('add-question')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add question</button></div>
      <div id="d-edit-page-5" style="display:none"><div style="margin-bottom:16px"><h3 style="font-size:1rem;font-weight:700;color:#1e1209">Consent &amp; Signature</h3></div><div class="question-card"><div class="question-label">Privacy Policy Agreement <span style="color:#7a2e3b">*</span></div><div class="question-meta"><span>Checkbox</span></div><div class="question-actions"><button class="q-action-btn">Edit</button><button class="q-action-btn required-active">Required ✓</button><button class="q-action-btn" style="color:#a0384a;border-color:#e0b0b0">Delete</button></div></div><button class="add-question-btn" onclick="donnaOpenModal('add-question')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add question</button></div>
    </div>
  </div>
</div>

<div class="preview-page" id="d-preview-page">
  <div class="preview-header"><span style="font-weight:700;color:#1e1209;font-size:0.9rem" id="d-preview-form-name">Estate Planning Questionnaire</span><span class="preview-badge">Preview mode</span><button class="btn-outline btn-sm" onclick="donnaClosePreview()">Close preview</button></div>
  <div class="preview-body"><div class="preview-form"><div class="preview-progress-bar"><div class="preview-progress-fill"></div></div><div class="preview-form-title">Estate Planning Questionnaire</div><div class="preview-form-sub">Nautilus Legal · Page 1 of 6</div><div class="preview-field"><label>Name <span class="req">*</span></label><input type="text" placeholder="Your full name"/></div><div class="preview-field"><label>Email <span class="req">*</span></label><input type="email" placeholder="you@example.com"/></div><button class="preview-next-btn" onclick="donnaClosePreview()">Continue →</button></div></div>
</div>

<div class="toast" id="d-toast">Link copied to clipboard</div>
`;

const JS = `
(function() {
  function donnaShowPage(page) {
    document.querySelectorAll('#donna-app .page').forEach(function(p) { p.classList.remove('active'); });
    document.getElementById('page-' + page).classList.add('active');
    document.querySelectorAll('#donna-app .nav-item').forEach(function(n) { n.classList.remove('active'); });
    var map = { intake: 0, mcp: 1, settings: 2 };
    document.querySelectorAll('#donna-app .nav-item')[map[page]].classList.add('active');
  }
  window.donnaShowPage = donnaShowPage;

  function donnaShowTab(tab) {
    ['overview','build','submissions'].forEach(function(t) {
      var el = document.getElementById('tab-content-' + t);
      if (el) el.style.display = 'none';
      var btn = document.getElementById('tab-' + t);
      if (btn) btn.classList.remove('active');
    });
    var el = document.getElementById('tab-content-' + tab);
    if (el) {
      el.style.display = 'block';
      if (tab === 'submissions') { el.style.flex = '1'; el.style.overflow = 'hidden'; }
    }
    var btn = document.getElementById('tab-' + tab);
    if (btn) btn.classList.add('active');
  }
  window.donnaShowTab = donnaShowTab;

  function donnaTogglePage(el, idx) {
    var fields = document.getElementById('d-fields-' + idx);
    var chevron = el.querySelector('.form-page-chevron');
    var isOpen = fields.style.display !== 'none';
    fields.style.display = isOpen ? 'none' : 'block';
    chevron.classList.toggle('rotated', !isOpen);
    el.classList.toggle('open', !isOpen);
  }
  window.donnaTogglePage = donnaTogglePage;
  window.donnaUpdateOverview = function() {};

  function donnaOpenModal(id) { document.getElementById('d-modal-' + id).classList.add('open'); }
  function donnaCloseModal(id) { document.getElementById('d-modal-' + id).classList.remove('open'); }
  window.donnaOpenModal = donnaOpenModal;
  window.donnaCloseModal = donnaCloseModal;

  document.querySelectorAll('#donna-app .modal-overlay').forEach(function(o) {
    o.addEventListener('click', function(e) { if (e.target === o) o.classList.remove('open'); });
  });

  window.donnaSaveFirmName = function() {
    var v = document.getElementById('d-firm-name-input').value;
    document.getElementById('d-firm-name-display').textContent = v;
    donnaCloseModal('edit-firm-name');
  };
  window.donnaSaveBrandColor = function() {
    var v = document.getElementById('d-brand-color-hex').value;
    document.getElementById('d-brand-color-display').textContent = v;
    document.getElementById('d-brand-swatch').style.background = v;
    donnaCloseModal('edit-brand-color');
  };
  var picker = document.getElementById('d-brand-color-picker');
  if (picker) picker.addEventListener('input', function() { document.getElementById('d-brand-color-hex').value = this.value; });

  var selectedPMS = 'Smokeball';
  window.donnaSelectPMS = function(pms) {
    selectedPMS = pms;
    var sb = document.getElementById('d-pms-radio-smokeball');
    var cl = document.getElementById('d-pms-radio-clio');
    sb.className = pms === 'Smokeball' ? 'radio-circle selected' : 'radio-circle';
    sb.innerHTML = pms === 'Smokeball' ? '<div class="radio-dot"></div>' : '';
    cl.className = pms === 'Clio' ? 'radio-circle selected' : 'radio-circle';
    cl.innerHTML = pms === 'Clio' ? '<div class="radio-dot"></div>' : '';
  };
  window.donnaSavePMS = function() {
    document.getElementById('d-pms-display').textContent = selectedPMS;
    donnaCloseModal('edit-pms');
    document.getElementById('d-chat-input').placeholder = 'Ask me anything in ' + selectedPMS + '…';
    document.querySelector('#donna-app .chat-empty-sub').textContent = 'Ask me anything in ' + selectedPMS + '.';
  };

  window.donnaDetectProvider = function(val) {
    var provider = '', models = [], hint = '';
    if (val.startsWith('sk-ant-')) { provider = 'Anthropic'; models = ['claude-sonnet-4-6','claude-opus-4-6','claude-haiku-4-5-20251001']; hint = '✓ Anthropic key detected.'; }
    else if (val.startsWith('sk-')) { provider = 'OpenAI'; models = ['gpt-4o','gpt-4o-mini']; hint = '✓ OpenAI key detected.'; }
    else if (val.length > 10) { provider = 'Kimi'; models = ['kimi-k2.0']; hint = '✓ Kimi key detected.'; }
    else { hint = 'Provider detected automatically from your key.'; }
    document.getElementById('d-provider-hint').textContent = hint;
    if (provider) {
      document.getElementById('d-ai-provider-display').textContent = provider;
      var sel = document.getElementById('d-model-select');
      sel.innerHTML = models.map(function(m) { return '<option value="' + m + '">' + m + '</option>'; }).join('');
      document.getElementById('d-ai-model-display').textContent = models[0];
    }
  };
  window.donnaToggleApiKey = function() {
    var inp = document.getElementById('d-api-key-input');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  };
  window.donnaTestApiKey = function() {
    var btn = event.target; btn.textContent = 'Testing…'; btn.disabled = true;
    setTimeout(function() {
      btn.textContent = '✓ Connected'; btn.style.background = '#2a7a4f';
      setTimeout(function() { btn.textContent = 'Test'; btn.disabled = false; btn.style.background = ''; }, 2200);
    }, 1400);
  };

  window.donnaSendChat = function() {
    var inp = document.getElementById('d-chat-input');
    var text = inp.value.trim();
    if (!text) return;
    donnaAddMessage('user', text);
    inp.value = '';
    document.getElementById('d-chat-suggestions').style.display = 'none';
    var pms = document.getElementById('d-pms-display').textContent;
    setTimeout(function() { donnaAddMessage('donna', 'Looking that up in ' + pms + ' for you…'); }, 700);
  };
  window.donnaSendSuggestion = function(btn) {
    donnaAddMessage('user', btn.textContent);
    document.getElementById('d-chat-suggestions').style.display = 'none';
    var pms = document.getElementById('d-pms-display').textContent;
    setTimeout(function() { donnaAddMessage('donna', 'I found the relevant information in ' + pms + '. Here’s a summary for you…'); }, 750);
  };
  function donnaAddMessage(role, text) {
    document.getElementById('d-chat-empty').style.display = 'none';
    var area = document.getElementById('d-chat-area');
    var div = document.createElement('div');
    div.style.display = 'flex';
    div.style.justifyContent = role === 'user' ? 'flex-end' : 'flex-start';
    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + (role === 'user' ? 'bubble-user' : 'bubble-donna');
    bubble.textContent = text;
    div.appendChild(bubble);
    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
  }

  var submissionData = [
    { date: '25 Aug 2026, 9:14 AM', email: 'sarah.johnson@gmail.com', name: 'Sarah Johnson', status: 'complete', page: '' },
    { date: '24 Aug 2026, 4:32 PM', email: 'michael.chen@outlook.com', name: 'Michael Chen', status: 'in-progress', page: 'Page 3 of 6' },
    { date: '24 Aug 2026, 11:05 AM', email: 'emma.davis@icloud.com', name: 'Emma Davis', status: 'complete', page: '' },
    { date: '23 Aug 2026, 2:47 PM', email: 'james.wilson@gmail.com', name: 'James Wilson', status: 'in-progress', page: 'Page 4 of 6' },
    { date: '22 Aug 2026, 1:08 PM', email: 'ava.martinez@gmail.com', name: 'Ava Martinez', status: 'complete', page: '' },
    { date: '21 Aug 2026, 10:44 AM', email: 'noah.anderson@live.com', name: 'Noah Anderson', status: 'complete', page: '' },
  ];
  function donnaBuildSubmissionsTable() {
    var table = document.getElementById('d-submissions-table');
    if (!table) return;
    table.innerHTML = submissionData.map(function(s, i) {
      var statusHtml = s.status === 'complete'
        ? '<span class="badge badge-complete">Complete</span>'
        : '<span class="badge badge-progress">In progress · ' + s.page + '</span>';
      return '<div class="table-row" style="grid-template-columns:1.6fr 2fr 1.4fr auto;align-items:center;cursor:pointer" onclick="donnaOpenSubDetail(' + i + ')">'
        + '<span style="font-size:0.8rem;color:#5c4d3a">' + s.date + '</span>'
        + '<span style="font-size:0.82rem;font-weight:600;color:#1e1209">' + s.email + '</span>'
        + statusHtml
        + '<button class="btn-outline btn-sm" onclick="event.stopPropagation();donnaOpenSubDetail(' + i + ')">View</button>'
        + '</div>';
    }).join('');
  }
  donnaBuildSubmissionsTable();

  window.donnaOpenSubDetail = function(idx) {
    var s = submissionData[idx];
    document.getElementById('d-sub-detail-email').textContent = s.email;
    document.getElementById('d-sub-detail-name').textContent = s.name;
    document.getElementById('d-sub-detail-date').textContent = s.date;
    document.getElementById('d-sub-detail-status').innerHTML = s.status === 'complete'
      ? '<span class="badge badge-complete">Complete</span>'
      : '<span class="badge badge-progress">In progress</span>';
    var panel = document.getElementById('d-sub-detail-panel');
    panel.style.display = 'flex'; panel.style.flexDirection = 'column';
  };
  window.donnaCloseSubDetail = function() { document.getElementById('d-sub-detail-panel').style.display = 'none'; };

  window.donnaOpenEditForm = function(name) {
    document.getElementById('d-edit-form-title').textContent = name;
    document.getElementById('d-edit-form-page').classList.add('open');
    donnaSelectEditPage(document.querySelector('#d-edit-page-nav .page-nav-item'), 0);
  };
  window.donnaCloseEditForm = function() { document.getElementById('d-edit-form-page').classList.remove('open'); };
  window.donnaSelectEditPage = function(el, idx) {
    document.querySelectorAll('#d-edit-page-nav .page-nav-item').forEach(function(n) { n.classList.remove('active'); });
    el.classList.add('active');
    for (var i = 0; i < 6; i++) {
      var p = document.getElementById('d-edit-page-' + i);
      if (p) p.style.display = i === idx ? 'block' : 'none';
    }
  };

  window.donnaOpenPreview = function() { document.getElementById('d-preview-page').classList.add('open'); };
  window.donnaClosePreview = function() { document.getElementById('d-preview-page').classList.remove('open'); };

  window.donnaCopyLink = function() {
    var toast = document.getElementById('d-toast');
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 2200);
  };
})();
`;

export default function DonnaConsole() {
  const ref = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

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
