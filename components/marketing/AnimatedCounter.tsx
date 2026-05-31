"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

/**
 * AnimatedCounter — counts up to the target number when scrolled into view
 * Handles formats: "10,000+", "4.8", "50+", "9 Years"
 */
export function AnimatedCounter({ value, className = "" }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Extract numeric part
    const numMatch = value.match(/[\d,.]+/);
    if (!numMatch) return;

    const numStr = numMatch[0] ?? "";
    const target = parseFloat(numStr.replace(/,/g, ""));
    if (isNaN(target)) return;

    const prefix = value.slice(0, value.indexOf(numStr));
    const suffix = value.slice(value.indexOf(numStr) + numStr.length);
    const hasDecimal = numStr.includes(".");
    const hasComma = numStr.includes(",");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            observer.unobserve(el);

            const duration = 1500;
            const steps = 40;
            const increment = target / steps;
            let current = 0;
            let step = 0;

            const timer = setInterval(() => {
              step++;
              current = Math.min(current + increment, target);

              let formatted: string;
              if (hasDecimal) {
                formatted = current.toFixed(1);
              } else if (hasComma) {
                formatted = Math.round(current).toLocaleString("en-IN");
              } else {
                formatted = String(Math.round(current));
              }

              setDisplay(`${prefix}${formatted}${suffix}`);

              if (step >= steps) {
                clearInterval(timer);
                setDisplay(value);
              }
            }, duration / steps);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
