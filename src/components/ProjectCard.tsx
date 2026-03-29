"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Project } from "@/src/lib/types";
import VideoModal from "./VideoModal";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [videoOpen, setVideoOpen] = useState(false);
  const hasVideo = !!project.video_url;
  const router = useRouter();

  const handleClick = () => {
    if (hasVideo) {
      setVideoOpen(true);
    } else {
      router.push(`/project/${project.id}`);
    }
  };

  return (
    <>
      <div
        className="group relative aspect-[3/4] overflow-hidden bg-surface-container-highest rounded-lg transition-all duration-500 hover:-translate-y-2 cursor-pointer"
        onClick={handleClick}
      >
        {/* Cover image */}
        {project.cover_url ? (
          <div className="absolute inset-0">
            <Image
              src={project.cover_url}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-container-high to-surface-container-lowest flex items-center justify-center">
            <div className="w-20 h-20 rounded-full gold-gradient opacity-20 blur-xl" />
          </div>
        )}

        {/* Bottom info overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="glass-card p-5 md:p-6 rounded-lg border border-outline-variant/20">
            <div className="flex items-center justify-between gap-2 mb-1">
              {project.category && (
                <span className="font-label text-[10px] tracking-[0.2em] uppercase text-primary block">
                  {project.category}
                </span>
              )}
              {hasVideo && (
                <span className="flex items-center gap-1 text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Video
                </span>
              )}
            </div>
            <h3 className="font-headline font-bold text-xl md:text-2xl text-on-surface">
              {project.title}
            </h3>
            {project.description && (
              <p className="font-body font-light text-sm text-on-surface-variant mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Hover CTA */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {hasVideo ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/30">
                <svg className="w-7 h-7 text-on-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="font-label font-bold text-xs uppercase tracking-widest text-on-surface bg-surface-container/80 backdrop-blur-sm px-4 py-1.5 rounded-full">
                Play Video
              </span>
            </div>
          ) : (
            <span className="bg-primary text-on-primary px-8 py-3 font-label font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">
              View Project
            </span>
          )}
        </div>
      </div>

      {/* Video modal */}
      {videoOpen && project.video_url && (
        <VideoModal
          videoUrl={project.video_url}
          title={project.title}
          description={project.description}
          shareUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/project/${project.id}`}
          onClose={() => setVideoOpen(false)}
        />
      )}
    </>
  );
}
