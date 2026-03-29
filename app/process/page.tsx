import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

export const metadata: Metadata = {
  title: "My Design Process — Shweta Sharma",
  description:
    "A look at how Shweta Sharma takes every project from a first brief to a polished, professional final delivery. Clear communication, structured workflow, Adobe Creative Suite.",
};

const steps = [
  {
    number: "01",
    title: "Discovery",
    subtitle: "Understanding Your World",
    description:
      "Every great design begins with a conversation. I start by learning about your brand, audience, goals, and references. We align on the problem we're solving before a single pixel is drawn.",
    details: [
      "Brand questionnaire & mood board collection",
      "Competitor analysis and market positioning",
      "Defining deliverables and timeline",
      "Clear brief so there are no surprises later",
    ],
    tools: ["Notion", "Google Meet", "Pinterest"],
    bg: "bg-surface",
  },
  {
    number: "02",
    title: "Concept",
    subtitle: "Translating Ideas into Direction",
    description:
      "With a clear brief in hand, I develop 2–3 distinct creative directions. This is the exploratory phase — rough shapes, colour swatches, and typographic explorations that capture the spirit of your brand.",
    details: [
      "Multiple concept directions presented",
      "Colour palette and typography exploration",
      "Rough sketches or initial compositions",
      "You pick a direction to move forward",
    ],
    tools: ["Adobe Illustrator", "Adobe Photoshop"],
    bg: "bg-surface-container-low",
  },
  {
    number: "03",
    title: "Design",
    subtitle: "Crafting the Final Vision",
    description:
      "The chosen direction is polished to a professional finish. This is where the magic happens — fine-tuned layouts, precise typography, and refined colour work that makes your brand or video look world-class.",
    details: [
      "Full execution of the approved concept",
      "High-resolution asset creation",
      "Motion graphics or video editing (if applicable)",
      "Attention to every pixel and frame",
    ],
    tools: ["Adobe Photoshop", "Adobe Illustrator", "Adobe Premiere Pro", "Adobe Audition"],
    bg: "bg-surface",
  },
  {
    number: "04",
    title: "Revision",
    subtitle: "Your Feedback, Perfected",
    description:
      "I present the design and gather your feedback. Two rounds of revisions are included in every project. I don't close a project until you're genuinely happy with the result.",
    details: [
      "Structured feedback collection",
      "Two revision rounds included",
      "Clear communication at every step",
      "Quick turnaround on change requests",
    ],
    tools: ["Loom", "Google Drive", "Email"],
    bg: "bg-surface-container-low",
  },
  {
    number: "05",
    title: "Delivery",
    subtitle: "Ready to Use, Every Format",
    description:
      "Final files are delivered in all formats you need — print-ready, web-optimised, and editable source files. For video projects, you receive exports optimised for each platform (YouTube, Instagram, etc.).",
    details: [
      "All source files (AI, PSD, PRPROJ) included",
      "Export packs for every use case",
      "Platform-specific video exports",
      "Post-delivery support for 7 days",
    ],
    tools: ["Google Drive", "WeTransfer", "Adobe Export"],
    bg: "bg-surface",
  },
];

export default function ProcessPage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        {/* ── Hero ── */}
        <section className="relative min-h-[60vh] flex items-center px-6 md:px-12 overflow-hidden bg-surface">
          <div className="max-w-screen-2xl mx-auto w-full">
            <span className="font-label text-primary tracking-[0.3em] uppercase text-sm block mb-6 animate-fade-in-up">
              How I Work
            </span>
            <h1 className="font-headline font-extrabold text-6xl sm:text-7xl md:text-[7rem] lg:text-[9rem] leading-[0.9] tracking-tighter text-on-surface mb-8 animate-fade-in-up delay-100">
              MY
              <br />
              <span className="text-primary italic">PROCESS</span>
            </h1>
            <p className="font-body font-light text-lg md:text-xl text-on-surface-variant max-w-lg leading-relaxed animate-fade-in-up delay-200">
              From the first &ldquo;hello&rdquo; to the final file hand-off — a
              structured, transparent workflow that delivers exceptional results
              every time.
            </p>
          </div>

          {/* Ambient blobs */}
          <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        </section>

        {/* ── Steps ── */}
        {steps.map((step, idx) => (
          <section
            key={step.number}
            className={`${step.bg} py-20 md:py-28 px-6 md:px-12`}
          >
            {/* Top separator */}
            {idx === 0 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
            )}

            <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Step number — always on left */}
              <div className="lg:col-span-3 flex items-start gap-6">
                <span className="font-headline font-black text-8xl md:text-[9rem] leading-none text-primary/10 select-none">
                  {step.number}
                </span>
              </div>

              {/* Content — offset to right on even steps */}
              <div
                className={`lg:col-span-9 ${
                  idx % 2 === 1 ? "lg:pl-12" : ""
                }`}
              >
                <span className="font-label text-primary tracking-[0.3em] uppercase text-xs block mb-3">
                  {step.subtitle}
                </span>
                <h2 className="font-headline font-bold text-4xl md:text-5xl text-on-surface mb-6">
                  {step.title}
                </h2>
                <p className="font-body font-light text-lg text-on-surface-variant leading-relaxed max-w-2xl mb-10">
                  {step.description}
                </p>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                  {step.details.map((detail) => (
                    <div
                      key={detail}
                      className="flex items-start gap-3 group"
                    >
                      <span className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <svg
                          className="w-2.5 h-2.5 text-primary"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      </span>
                      <span className="font-body font-light text-sm text-on-surface-variant leading-relaxed">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tools */}
                <div className="flex flex-wrap gap-2">
                  {step.tools.map((tool) => (
                    <span
                      key={tool}
                      className="glass-card px-4 py-1.5 rounded-full border border-outline-variant/20 font-label text-[11px] uppercase tracking-widest text-on-surface-variant/70"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* ── CTA ── */}
        <section className="py-32 md:py-40 px-6 md:px-12 bg-surface relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <span className="font-label text-primary tracking-[0.3em] uppercase text-xs block mb-6">
              Ready to Start?
            </span>
            <h2 className="font-headline font-black text-5xl sm:text-6xl md:text-7xl text-on-surface mb-8 tracking-tighter">
              LET&apos;S BUILD
              <br />
              <span className="text-primary italic">TOGETHER.</span>
            </h2>
            <p className="font-body font-light text-on-surface-variant text-lg max-w-md mx-auto mb-12 leading-relaxed">
              Now you know how I work. Let&apos;s get your project moving — reach
              out and I&apos;ll respond within 24 hours.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-3 gold-gradient text-on-primary px-10 py-5 rounded-md font-headline font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-all shadow-xl shadow-primary/10"
            >
              Start a Project
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
            </Link>
          </div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        </section>
      </main>

      <Footer />
    </>
  );
}
