"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-surface-container/70 backdrop-blur-2xl shadow-2xl shadow-on-surface/5"
          : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center px-6 md:px-12 py-5 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tighter text-primary font-headline"
        >
          SHWETA
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-10 items-center">
          <a
            href="/#work"
            className="font-headline font-light tracking-wide uppercase text-sm text-on-surface/60 hover:text-primary transition-colors duration-300"
          >
            Work
          </a>
          <a
            href="/#about"
            className="font-headline font-light tracking-wide uppercase text-sm text-on-surface/60 hover:text-primary transition-colors duration-300"
          >
            About
          </a>
          <Link
            href="/process"
            className="font-headline font-light tracking-wide uppercase text-sm text-on-surface/60 hover:text-primary transition-colors duration-300"
          >
            Process
          </Link>
          <a
            href="/#contact"
            className="font-headline font-light tracking-wide uppercase text-sm text-on-surface/60 hover:text-primary transition-colors duration-300"
          >
            Contact
          </a>
        </div>

        {/* Desktop right: availability + admin + CTA */}
        <div className="hidden md:flex items-center gap-5">
          {/* Availability badge */}
          <div className="flex items-center gap-2">
            <span className="relative w-2 h-2 flex-shrink-0 availability-pulse">
              <span className="block w-2 h-2 rounded-full bg-green-500" />
            </span>
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
              Available
            </span>
          </div>

          {/* Admin Panel link */}
          <Link
            href="/admin"
            className="group relative w-9 h-9 rounded-full flex items-center justify-center text-on-surface/30 hover:text-primary hover:bg-surface-container-high/50 transition-all duration-300"
            title="Admin Panel"
            aria-label="Admin Panel"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>

          <a
            href="/#contact"
            className="inline-flex gold-gradient text-on-primary px-6 py-2.5 rounded font-headline font-semibold text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 bg-on-surface transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-on-surface transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-on-surface transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-6 px-6 pb-8 bg-surface-container/90 backdrop-blur-xl">
          <a
            href="/#work"
            onClick={() => setMenuOpen(false)}
            className="font-headline font-light tracking-wide uppercase text-sm text-on-surface/60 hover:text-primary transition-colors"
          >
            Work
          </a>
          <a
            href="/#about"
            onClick={() => setMenuOpen(false)}
            className="font-headline font-light tracking-wide uppercase text-sm text-on-surface/60 hover:text-primary transition-colors"
          >
            About
          </a>
          <Link
            href="/process"
            onClick={() => setMenuOpen(false)}
            className="font-headline font-light tracking-wide uppercase text-sm text-on-surface/60 hover:text-primary transition-colors"
          >
            Process
          </Link>
          <a
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className="font-headline font-light tracking-wide uppercase text-sm text-on-surface/60 hover:text-primary transition-colors"
          >
            Contact
          </a>

          {/* Availability indicator */}
          <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/10">
            <span className="relative w-2 h-2 flex-shrink-0 availability-pulse">
              <span className="block w-2 h-2 rounded-full bg-green-500" />
            </span>
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
              Available for freelance
            </span>
          </div>

          <a
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className="gold-gradient text-on-primary px-6 py-2.5 rounded font-headline font-semibold text-xs uppercase tracking-widest text-center hover:opacity-90 transition-all"
          >
            Hire Me
          </a>

          {/* Admin Panel link */}
          <Link
            href="/admin"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 pt-2 border-t border-outline-variant/10 font-headline font-light tracking-wide uppercase text-[11px] text-on-surface/25 hover:text-primary transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Admin Panel
          </Link>
        </div>
      </div>
    </nav>
  );
}
