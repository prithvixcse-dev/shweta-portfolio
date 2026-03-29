"use client";

import { useState, useEffect } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out after a brief brand reveal
    const fadeTimer = setTimeout(() => setFadeOut(true), 1200);
    // Remove from DOM after animation completes
    const removeTimer = setTimeout(() => setVisible(false), 1800);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-surface transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="text-center">
        <h1
          className="font-headline font-black text-5xl md:text-7xl tracking-tighter text-primary"
          style={{
            animation: "preloaderReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          SHWETA
        </h1>
        <div
          className="mt-4 h-[2px] mx-auto gold-gradient rounded-full"
          style={{
            animation: "preloaderLine 0.6s 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            width: 0,
          }}
        />
      </div>
    </div>
  );
}
