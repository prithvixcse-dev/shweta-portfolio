import ContactForm from "./ContactForm";

export default function CTASection() {
  return (
    <section
      id="contact"
      className="py-32 md:py-40 px-6 md:px-12 bg-surface overflow-hidden relative"
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-headline font-black text-5xl sm:text-6xl md:text-8xl text-on-surface mb-8 tracking-tighter">
            LET&apos;S CREATE
            <br />
            <span className="text-primary italic">MAGIC.</span>
          </h2>
          <p className="font-body font-light text-on-surface-variant text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            Open to freelance projects &amp; collaborations. I focus on quality,
            timely delivery, and clear communication.
          </p>
        </div>

        <ContactForm />
      </div>

      {/* Ambient glow */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
