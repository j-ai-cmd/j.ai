// Thin wiring between the site and the third-party components in
// components/amicro, components/smoothui and components/bencho.
// Those folders hold the libraries' own code; this file only feeds them props.
import React from "react";
import { ArrowRight, Link as LinkIcon, Send } from "lucide-react";
import { FocusBlur } from "@/components/amicro/focus-blur";
import { MagneticButton } from "@/components/amicro/magnetic-button";
import { TextReveal } from "@/components/amicro/text-reveal";
import { AnimatedButton } from "@/components/amicro/animated-button";
import type { ButtonConfig } from "@/components/amicro/buttons-data";
import ButtonCopy from "@/components/smoothui/button-copy";
import { SlideConfirm } from "@/components/bencho/slide-confirm";
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

// Masthead links: hovering one blurs the rest (Amicro Focus Blur).
export function NavLinks({ current }: { current: "/" | "/donna" | "/blogs" }) {
  const items = [
    { label: "Home", href: "/" },
    { label: "Legal", href: "/donna" },
    { label: "Blogs", href: "/blogs" },
  ];
  return (
    <div className="amc-nav" data-current={current}>
      <FocusBlur items={items} showBrackets={false} blurAmount={2} opacityAmount={0.45} className="amc-nav-links" />
    </div>
  );
}

// "Contact us" pulls toward the cursor (Amicro Magnetic Button).
export function NavCta({ href = "/donna#contact" }: { href?: string }) {
  return (
    <MagneticButton className="nav-cta" range={70} strength={0.3} onClick={() => go(href)}>
      Contact us
    </MagneticButton>
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

// Footer email with a copy button (SmoothUI Button Copy).
export function FooterEmail() {
  return (
    <span className="amc-email">
      <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      <ButtonCopy className="amc-copy" onCopy={() => navigator.clipboard.writeText(EMAIL)} />
    </span>
  );
}

// Slide to open the contact form (Bencho Slide to confirm).
export function SlideToContact({ href = "/donna#contact" }: { href?: string }) {
  return (
    <div className="bch-slide">
      <SlideConfirm
        width={300}
        label="Slide to talk to us"
        onConfirm={() => window.setTimeout(() => go(href), 650)}
      />
    </div>
  );
}
