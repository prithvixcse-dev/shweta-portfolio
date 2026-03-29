"use client";

import AnimateOnScroll from "./AnimateOnScroll";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Shweta completely transformed our brand identity. The logo she designed is clean, modern, and perfectly captures our vision. Clients keep complimenting it. Highly recommend her!",
    name: "Rohan Mehta",
    role: "Founder, Mehta Ventures",
    initials: "RM",
  },
  {
    quote:
      "She edited our product launch video and it looked absolutely stunning. The pacing, colour grading, and music sync were spot-on. She delivered ahead of schedule too!",
    name: "Priya Kapoor",
    role: "Marketing Manager, StyleCraft",
    initials: "PK",
  },
  {
    quote:
      "Working with Shweta was a seamless experience. She understood the brief immediately and her social media creatives increased our engagement by over 60%. Will definitely work again.",
    name: "Aarav Singh",
    role: "Co-founder, GreenLeaf Studio",
    initials: "AS",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-surface-container-low relative overflow-hidden">
      {/* Top edge line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />

      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-16 md:mb-24">
            <span className="font-label text-primary tracking-[0.3em] uppercase text-xs block mb-4">
              What Clients Say
            </span>
            <h2 className="font-headline font-bold text-4xl md:text-5xl text-on-surface">
              Kind Words
            </h2>
          </div>
        </AnimateOnScroll>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, idx) => (
            <AnimateOnScroll
              key={t.name}
              animation="fade-up"
              delay={idx * 150}
            >
              <div
                className={`group relative glass-card rounded-2xl p-8 md:p-10 border border-outline-variant/20 hover:border-outline-variant/40 transition-all duration-500 h-full flex flex-col justify-between ${
                  idx === 1 ? "md:mt-10" : ""
                }`}
              >
                {/* Large decorative quote mark */}
                <span className="absolute top-6 right-8 font-headline font-black text-8xl text-primary/10 leading-none select-none pointer-events-none">
                  &ldquo;
                </span>

                {/* Quote text */}
                <blockquote className="font-body font-light text-on-surface-variant leading-relaxed text-base md:text-[1.05rem] mb-8 relative z-10">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {/* Avatar circle */}
                  <div className="w-11 h-11 rounded-full gold-gradient flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                    <span className="font-headline font-black text-xs text-on-primary">
                      {t.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-sm text-on-surface">
                      {t.name}
                    </p>
                    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/50 mt-0.5">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>

      {/* Ambient glow */}
      <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
