import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

export const WEBHOOK_URL = "https://hook.eu1.make.com/waciaz78ykdmfaxh4glg6vdhjjqi4jh5";
export const LINKEDIN = "https://www.linkedin.com/in/jai-dhingra/";
export const EMAIL = "jai@jdotai.com";

// Scroll-reveal wrapper
export function Reveal({ children, className = "", as: Tag = "div", ...rest }: any) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("vis"); return; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`rise ${className}`} {...rest}>{children}</Tag>;
}

// Wordmark → links home
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`wm ${className}`}>j<i>.</i>ai</Link>
  );
}

// Mobile menu sheet
export function MobileSheet({ open, onClose, dark, links }: { open: boolean; onClose: () => void; dark?: boolean; links: { label: string; href?: string; onClick?: () => void; solid?: boolean }[] }) {
  return (
    <div className={`msheet ${open ? "open" : ""}`}>
      <button className="close" onClick={onClose} aria-label="Close menu">✕</button>
      {links.map((l, i) =>
        l.href
          ? <Link key={i} href={l.href} onClick={onClose} className={l.solid ? "ms-solid" : ""}>{l.label}</Link>
          : <button key={i} onClick={() => { l.onClick?.(); onClose(); }} className={l.solid ? "ms-solid" : ""}>{l.label}</button>
      )}
    </div>
  );
}
