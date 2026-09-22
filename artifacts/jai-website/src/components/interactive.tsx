// Thin wiring between the site and the third-party components in
// components/amicro, components/smoothui and components/bencho.
// Those folders hold the libraries' own code; this file only feeds them props.
import React from "react";
import { ArrowRight, Link as LinkIcon, Send } from "lucide-react";
import { Link } from "wouter";
import { TextReveal } from "@/components/amicro/text-reveal";
import { AnimatedButton } from "@/components/amicro/animated-button";
import type { ButtonConfig } from "@/components/amicro/buttons-data";
import { EMAIL } from "@/components/shared";

const go = (href: string) => {
  if (typeof window !== "undefined") window.location.assign(href);
};

// Heading whose text rises into place (Amicro Text Reveal).
export function RevealHeading({ as: Tag = "h2", text, className }: { as?: "h1" | "h2"; text: string; className?: string }) {
  return (
    <Tag className={className}>
      <TextReveal text={text} className="amc-reveal" />
    </Tag>
  );
}

// Masthead links, plain as before.
export function NavLinks({ current }: { current: "/" | "/donna" | "/blogs" }) {
  const items = [
    { label: "Home", href: "/" },
    { label: "Legal", href: "/donna" },
    { label: "Blogs", href: "/blogs" },
  ] as const;
  return (
    <>
      {items.map(i => i.href === current
        ? <span key={i.href} className="live" aria-current="page">{i.label}</span>
        : <Link key={i.href} href={i.href}>{i.label}</Link>)}
    </>
  );
}

// "Contact us" uses the same Amicro Glare Shine button as "See donna".
const CONTACT: ButtonConfig = { id: "31", label: "Contact us", icon1: ArrowRight, interactionType: "glare" };
export function NavCta({ href = "/donna#contact" }: { href?: string }) {
  return (
    <AnimatedButton config={CONTACT} layoutMode="list" theme="dark" className="amc-solid amc-nav-cta" onClick={() => go(href)} />
  );
}

// Primary hero button with a light sweep on hover (Amicro Glare Shine).
const SEE_DONNA: ButtonConfig = { id: "31", label: "See donna", icon1: ArrowRight, interactionType: "glare" };
export function GlareCta({ href = "/donna", label = "See donna" }: { href?: string; label?: string }) {
  return (
    <AnimatedButton
      config={{ ...SEE_DONNA, label }}
      layoutMode="list"
      theme="dark"
      className="amc-solid"
      onClick={() => go(href)}
    />
  );
}

// Share the current page (Amicro Share morph).
const SHARE: ButtonConfig = { id: "6", label: "Share", icon1: LinkIcon, icon2: Send, interactionType: "morph" };
export function ShareButton({ title }: { title: string }) {
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else await navigator.clipboard.writeText(url);
    } catch { /* user dismissed the share sheet */ }
  };
  return <AnimatedButton config={SHARE} layoutMode="list" theme="light" className="amc-share" onClick={share} />;
}

// Footer email, plain as before.
export function FooterEmail() {
  return <a href={`mailto:${EMAIL}`}>{EMAIL}</a>;
}

