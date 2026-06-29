"use client";
import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

const delayMap: Record<number, string> = { 1: "0.08s", 2: "0.16s", 3: "0.24s", 4: "0.32s", 5: "0.40s" };

export function Reveal({ children, delay, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("!opacity-100", "!translate-y-0");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-6 transition-[opacity,transform] duration-700 ease-out ${className}`}
      style={delay ? { transitionDelay: delayMap[delay] } : undefined}
    >
      {children}
    </div>
  );
}
