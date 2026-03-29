"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 15, suffix: "+", label: "Projects Completed" },
  { value: 1,  suffix: "+", label: "Year Experience" },
  { value: 4,  suffix: "",  label: "Adobe Tools Mastered" },
  { value: 100, suffix: "%", label: "Client Satisfaction" },
];

function useCountUp(target: number, duration = 1800, isVisible: boolean) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!isVisible || started.current) return;
    started.current = true;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return count;
}

function StatItem({ stat, isVisible, index }: { stat: Stat; isVisible: boolean; index: number }) {
  const count = useCountUp(stat.value, 1800, isVisible);

  return (
    <div
      className="flex flex-col items-center text-center transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <span className="font-headline font-black text-5xl md:text-6xl text-primary leading-none mb-2">
        {count}
        <span className="text-primary">{stat.suffix}</span>
      </span>
      <span className="font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant/60">
        {stat.label}
      </span>
    </div>
  );
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  return (
    <div ref={ref} className="my-20">
      {/* Divider line top */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent mb-16" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
        {stats.map((stat, idx) => (
          <div key={stat.label} className="relative">
            <StatItem stat={stat} isVisible={isVisible} index={idx} />
            {/* Vertical separator (hidden on last column) */}
            {idx < stats.length - 1 && (
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-outline-variant/20" />
            )}
          </div>
        ))}
      </div>

      {/* Divider line bottom */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent mt-16" />
    </div>
  );
}
