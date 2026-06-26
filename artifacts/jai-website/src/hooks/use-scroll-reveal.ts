import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const containers = document.querySelectorAll(".reveal-container");
    containers.forEach((container) => {
      const elements = container.querySelectorAll(".reveal");
      elements.forEach((el, index) => {
        (el as HTMLElement).style.transitionDelay = `${index * 100}ms`;
        observer.observe(el);
      });
    });
    
    // Also observe standalone reveals
    const standaloneElements = document.querySelectorAll(".reveal:not(.reveal-container .reveal)");
    standaloneElements.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}
