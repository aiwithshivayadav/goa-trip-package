"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

export function AnimatedCounter({ value, className = "" }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            observer.unobserve(el);

            const duration = 2000;
            const steps = 60;
            let step = 0;

            const timer = setInterval(() => {
              step++;
              const t = step / steps;
              const eased = 1 - Math.pow(1 - t, 3);
              const current = target * eased;

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
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
