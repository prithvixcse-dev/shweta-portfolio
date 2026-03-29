import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center px-6 md:px-12 pt-20 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Text Content */}
        <div className="md:col-span-7 lg:col-span-8 z-10">
          <span className="font-label text-primary tracking-[0.3em] uppercase text-sm block mb-4 animate-fade-in-up">
            Graphic Designer · Video Editor · VFX Artist
          </span>
          <h1 className="font-headline font-extrabold text-6xl sm:text-7xl md:text-[6rem] lg:text-[8rem] leading-[0.9] tracking-tighter text-on-surface mb-8 animate-fade-in-up delay-100">
            SHWETA
            <br />
            SHARMA
          </h1>
          <p className="font-body font-light text-lg md:text-xl text-on-surface-variant max-w-md mb-12 leading-relaxed animate-fade-in-up delay-200">
            Helping brands look professional through design &amp; video.
            Logo, graphic &amp; video editing powered by Adobe Creative Suite.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
            <a
              href="#work"
              className="inline-flex items-center gap-3 gold-gradient text-on-primary px-8 md:px-10 py-4 md:py-5 rounded-md font-headline font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-all shadow-xl shadow-primary/10"
            >
              View My Work
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <Link
              href="/process"
              className="inline-flex items-center gap-2 border border-outline-variant/30 text-on-surface/60 px-8 py-4 rounded-md font-headline font-semibold text-sm uppercase tracking-wider hover:text-primary hover:border-primary/30 transition-all duration-300"
            >
              My Process
            </Link>
            <a
              href="/Profile.pdf"
              download
              className="inline-flex items-center gap-2 text-on-surface-variant/50 px-4 py-4 rounded-md font-headline font-medium text-sm uppercase tracking-wider hover:text-primary transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Resume
            </a>
          </div>
        </div>

        {/* Hero Photo */}
        <div className="hidden md:block md:col-span-5 lg:col-span-4 relative h-[500px] lg:h-[620px]">
          {/* Ambient gold glow behind image */}
          <div className="hero-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] rounded-full" />

          {/* Photo frame */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[360px] h-[430px] lg:h-[520px] rounded-2xl rotate-3 overflow-hidden shadow-2xl border border-outline-variant/10 animate-fade-in delay-300">
            <Image
              src="/trial.jpg"
              alt="Shweta Sharma — Graphic Designer, Video Editor & VFX Artist"
              fill
              priority
              className="object-cover object-top"
              sizes="(max-width: 1024px) 300px, 360px"
            />
            {/* Subtle gradient overlay at bottom for card depth */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-surface-container/60 to-transparent pointer-events-none" />
          </div>

          {/* Floating badge — "Open to work" */}
          <div className="absolute bottom-[10%] left-[0%] glass-card rounded-xl px-4 py-3 border border-outline-variant/20 shadow-xl animate-fade-in delay-500 z-10">
            <div className="flex items-center gap-2">
              <span className="relative w-2 h-2 flex-shrink-0 availability-pulse">
                <span className="block w-2 h-2 rounded-full bg-green-500" />
              </span>
              <div>
                <p className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant/50">Status</p>
                <p className="font-headline font-bold text-xs text-on-surface">Open to Freelance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-500">
        <span className="font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/40">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-on-surface-variant/40 to-transparent" />
      </div>
    </section>
  );
}
