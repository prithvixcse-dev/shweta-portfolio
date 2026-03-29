"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only show on devices with a pointer (no touch)
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (!visible) setVisible(true);
    };

    const enter = () => setVisible(true);
    const leave = () => setVisible(false);

    // Track hoverable elements
    const addHoverListeners = () => {
      const targets = document.querySelectorAll("a, button, [role='button'], input, label, .cursor-pointer");
      targets.forEach((el) => {
        el.addEventListener("mouseenter", () => setHovering(true));
        el.addEventListener("mouseleave", () => setHovering(false));
      });
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseenter", enter);
    document.addEventListener("mouseleave", leave);

    addHoverListeners();

    // MutationObserver to catch dynamically added elements
    const mo = new MutationObserver(addHoverListeners);
    mo.observe(document.body, { childList: true, subtree: true });

    // Smooth ring follow
    let raf: number;
    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, [visible]);

  // Don't render on touch devices
  if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) {
    return null;
  }

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 z-[9998] pointer-events-none transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ willChange: "transform" }}
      >
        <div
          className={`rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
            hovering
              ? "w-3 h-3 bg-primary/80"
              : "w-1.5 h-1.5 bg-primary"
          }`}
        />
      </div>
      {/* Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 z-[9997] pointer-events-none transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ willChange: "transform" }}
      >
        <div
          className={`rounded-full -translate-x-1/2 -translate-y-1/2 border transition-all duration-300 ${
            hovering
              ? "w-10 h-10 border-primary/40 bg-primary/5"
              : "w-7 h-7 border-primary/20"
          }`}
        />
      </div>
    </>
  );
}

