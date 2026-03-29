"use client";

import { useState } from "react";
import type { Project } from "@/src/lib/types";
import VideoModal from "@/src/components/VideoModal";

interface Props {
  project: Project;
}

export default function ProjectDetailClient({ project }: Props) {
  const [videoOpen, setVideoOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const hasVideo = !!project.video_url;
  const hasImages = project.images && project.images.length > 0;

  return (
    <>
      {/* Video section */}
      {hasVideo && (
        <div className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-12">
          <button
            onClick={() => setVideoOpen(true)}
            className="group relative w-full aspect-video rounded-xl overflow-hidden bg-surface-container-high"
          >
            {project.cover_url && (
              <img
                src={project.cover_url}
                alt="Play video"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-on-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="font-label font-bold text-sm uppercase tracking-widest text-on-surface bg-surface-container/80 backdrop-blur-sm px-6 py-2 rounded-full">
                Play Video
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Image gallery */}
      {hasImages && (
        <div className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-12">
          <h3 className="font-headline font-bold text-xl text-on-surface mb-6">
            Gallery
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {project.images!.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIdx(idx)}
                className="group relative aspect-square rounded-lg overflow-hidden bg-surface-container-high"
              >
                <img
                  src={img}
                  alt={`${project.title} — image ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-surface/0 group-hover:bg-surface/40 transition-colors duration-300 flex items-center justify-center">
                  <svg className="w-6 h-6 text-on-surface opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

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

      {/* Image lightbox */}
      {lightboxIdx !== null && project.images && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={() => setLightboxIdx(null)}
        >
          <div className="absolute inset-0 bg-surface/95 backdrop-blur-md" />
          <div
            className="relative z-10 max-w-5xl w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <div className="w-full flex justify-between items-center">
              <span className="font-label text-xs text-on-surface-variant/50 uppercase tracking-widest">
                {lightboxIdx + 1} / {project.images.length}
              </span>
              <button
                onClick={() => setLightboxIdx(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Image */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-container-lowest">
              <img
                src={project.images[lightboxIdx]}
                alt={`${project.title} — image ${lightboxIdx + 1}`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Nav arrows */}
            <div className="flex gap-4">
              <button
                onClick={() => setLightboxIdx((prev) => (prev! > 0 ? prev! - 1 : project.images!.length - 1))}
                className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                aria-label="Previous"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setLightboxIdx((prev) => (prev! < project.images!.length - 1 ? prev! + 1 : 0))}
                className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                aria-label="Next"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <p className="text-on-surface-variant/30 text-xs font-label tracking-widest uppercase">
              Press Esc or click outside to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}
