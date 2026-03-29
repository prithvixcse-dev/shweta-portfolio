"use client";

import { useState, useEffect, useRef } from "react";
import type { Project } from "@/src/lib/types";
import ProjectCard from "./ProjectCard";
import AnimateOnScroll from "./AnimateOnScroll";

interface ProjectGridProps {
  projects: Project[];
}

// localStorage key for tracking read message IDs (used from admin, persisted across sessions)
const READ_KEY = "admin_read_ids";

export function getReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(READ_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [animating, setAnimating] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(projects);
  const prevFilter = useRef("All");

  const categories = [
    "All",
    ...Array.from(
      new Set(projects.map((p) => p.category).filter(Boolean) as string[])
    ),
  ];

  // Animate out → update list → animate in on filter change
  const handleFilter = (cat: string) => {
    if (cat === activeFilter) return;
    setAnimating(true);
    prevFilter.current = activeFilter;

    setTimeout(() => {
      const filtered =
        cat === "All" ? projects : projects.filter((p) => p.category === cat);
      setVisibleProjects(filtered);
      setActiveFilter(cat);
      setAnimating(false);
    }, 250);
  };

  // Sync when projects prop changes
  useEffect(() => {
    const filtered =
      activeFilter === "All"
        ? projects
        : projects.filter((p) => p.category === activeFilter);
    setVisibleProjects(filtered);
  }, [projects, activeFilter]);

  return (
    <section id="work" className="py-24 md:py-32 px-6 md:px-12 bg-surface-container-low">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
          <AnimateOnScroll animation="fade-up">
            <div>
              <h2 className="font-headline font-bold text-4xl md:text-5xl text-on-surface mb-4">
                Selected Works
              </h2>
              <p className="text-on-surface-variant font-light text-lg">
                A curation of visual identities and motion narratives.
              </p>
            </div>
          </AnimateOnScroll>

          {/* Category Filters */}
          {categories.length > 1 && (
            <AnimateOnScroll animation="fade-in" delay={200}>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleFilter(cat)}
                    className={`px-5 py-2 text-xs font-label uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-2 ${
                      activeFilter === cat
                        ? "text-primary border border-outline-variant/30 bg-primary/5"
                        : "text-on-surface-variant/60 hover:text-primary"
                    }`}
                  >
                    {cat}
                    <span className={`text-[10px] ${
                      activeFilter === cat ? "text-primary/60" : "text-on-surface-variant/30"
                    }`}>
                      {cat === "All"
                        ? projects.length
                        : projects.filter((p) => p.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </AnimateOnScroll>
          )}
        </div>

        {/* Grid — animates opacity and translateY on filter change */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 transition-all duration-250"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(8px)" : "translateY(0)",
            transition: "opacity 250ms ease, transform 250ms ease",
          }}
        >
          {visibleProjects.length > 0 ? (
            visibleProjects.map((project, idx) => (
              <div
                key={project.id}
                className={idx === 1 && visibleProjects.length >= 3 ? "lg:mt-16" : ""}
                style={{
                  opacity: animating ? 0 : 1,
                  transitionDelay: animating ? "0ms" : `${idx * 60}ms`,
                  transition: "opacity 350ms ease",
                }}
              >
                <ProjectCard project={project} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-24">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-surface-container-high flex items-center justify-center">
                <svg className="w-8 h-8 text-on-surface-variant/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-on-surface-variant font-light text-lg">
                No projects in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
