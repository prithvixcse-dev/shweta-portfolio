"use client";

import Link from "next/link";
import type { Project } from "@/src/lib/types";
import AnimateOnScroll from "./AnimateOnScroll";

interface RelatedProjectsProps {
  projects: Project[];
}

export default function RelatedProjects({ projects }: RelatedProjectsProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mt-24 mb-16">
      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent mb-20" />

      {/* Header */}
      <AnimateOnScroll animation="fade-up">
        <div className="mb-12">
          <span className="font-label text-primary tracking-[0.3em] uppercase text-xs block mb-3">
            You Might Also Like
          </span>
          <h2 className="font-headline font-bold text-3xl md:text-4xl text-on-surface">
            More Work
          </h2>
        </div>
      </AnimateOnScroll>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, idx) => (
          <AnimateOnScroll key={project.id} animation="fade-up" delay={idx * 100}>
            <Link
              href={`/project/${project.id}`}
              className="group relative block aspect-[3/4] overflow-hidden bg-surface-container-highest rounded-lg transition-all duration-500 hover:-translate-y-2"
            >
              {/* Cover image */}
              {project.cover_url ? (
                <img
                  src={project.cover_url}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-surface-container-high to-surface-container-lowest flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full gold-gradient opacity-20 blur-xl" />
                </div>
              )}

              {/* Bottom info overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="glass-card p-5 rounded-lg border border-outline-variant/20">
                  {project.category && (
                    <span className="font-label text-[10px] tracking-[0.2em] uppercase text-primary block mb-1">
                      {project.category}
                    </span>
                  )}
                  <h3 className="font-headline font-bold text-lg text-on-surface">
                    {project.title}
                  </h3>
                </div>
              </div>

              {/* Hover CTA */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="bg-primary text-on-primary px-6 py-2.5 font-label font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">
                  View Project
                </span>
              </div>
            </Link>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}
