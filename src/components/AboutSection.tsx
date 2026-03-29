"use client";

import AnimateOnScroll from "./AnimateOnScroll";
import StatsCounter from "./StatsCounter";

export default function AboutSection() {
  const skills = [
    { name: "Adobe Photoshop", level: 90 },
    { name: "Adobe Illustrator", level: 85 },
    { name: "Adobe Premiere Pro", level: 88 },
    { name: "Adobe Audition", level: 75 },
  ];

  const services = [
    {
      title: "Logo Design & Branding",
      description: "Clean, eye-catching logos and brand identities that look professional.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      ),
    },
    {
      title: "Graphic Design",
      description: "Posters, banners, and social media creatives that engage your audience.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      ),
    },
    {
      title: "Video Editing",
      description: "Reels, YouTube videos, and promos crafted with dynamic storytelling.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-2.625 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-2.625 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
        </svg>
      ),
    },
    {
      title: "Image Retouching",
      description: "Professional image editing and retouching for flawless results.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-12 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />

      <div className="max-w-screen-2xl mx-auto">
        {/* Section header */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-16 md:mb-24">
            <span className="font-label text-primary tracking-[0.3em] uppercase text-xs block mb-4">
              About Me
            </span>
            <h2 className="font-headline font-bold text-4xl md:text-5xl text-on-surface mb-6">
              Hi, I&apos;m Shweta.
            </h2>
            <p className="font-body font-light text-on-surface-variant text-lg md:text-xl max-w-2xl leading-relaxed">
              A creative design student at Reliance Animation Academy, Ambarnath,
              passionate about graphic design, logo design, image editing, and video editing.
              I help individuals, startups, and small businesses create clean, eye-catching
              visuals that look professional and engaging.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {services.map((service, idx) => (
            <AnimateOnScroll key={service.title} animation="fade-up" delay={idx * 100}>
              <div className="group bg-surface-container-low rounded-xl p-6 md:p-8 hover:bg-surface-container transition-colors duration-500 h-full">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="font-headline font-bold text-lg text-on-surface mb-2">
                  {service.title}
                </h3>
                <p className="font-body font-light text-sm text-on-surface-variant leading-relaxed">
                  {service.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Stats Counter */}
        <StatsCounter />

        {/* Skills */}
        <AnimateOnScroll animation="fade-up">
          <div className="max-w-xl">
            <h3 className="font-headline font-bold text-2xl text-on-surface mb-8">
              Tools & Skills
            </h3>
            <div className="flex flex-col gap-6">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-label text-sm text-on-surface">{skill.name}</span>
                    <span className="font-label text-xs text-on-surface-variant/60">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full gold-gradient rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>

        {/* Education & Experience */}
        <div className="mt-16 flex flex-wrap gap-4">
          <AnimateOnScroll animation="fade-up" delay={0}>
            <div className="glass-card px-5 py-3 rounded-lg border border-outline-variant/20">
              <p className="font-label text-[10px] tracking-widest uppercase text-primary mb-1">Education</p>
              <p className="font-body text-sm text-on-surface">Master in VFX & Film Making</p>
              <p className="font-body text-xs text-on-surface-variant/60">Reliance Animation Academy, Ambarnath</p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={100}>
            <div className="glass-card px-5 py-3 rounded-lg border border-outline-variant/20">
              <p className="font-label text-[10px] tracking-widest uppercase text-primary mb-1">Experience</p>
              <p className="font-body text-sm text-on-surface">Freelance Graphic Designer</p>
              <p className="font-body text-xs text-on-surface-variant/60">June 2025 — Present</p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="glass-card px-5 py-3 rounded-lg border border-outline-variant/20">
              <p className="font-label text-[10px] tracking-widest uppercase text-primary mb-1">Location</p>
              <p className="font-body text-sm text-on-surface">Thane, Maharashtra</p>
              <p className="font-body text-xs text-on-surface-variant/60">Open to remote & freelance work</p>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
