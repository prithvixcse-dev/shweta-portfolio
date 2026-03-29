"use client";

import { useEffect, useState } from "react";

interface VideoModalProps {
  videoUrl: string;
  title: string;
  description?: string | null;
  shareUrl?: string;
  onClose: () => void;
}

function getEmbedUrl(url: string): string | null {
  try {
    const ytShort = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    const ytFull = url.match(/youtube\.com\/(?:watch\?v=|shorts\/)([a-zA-Z0-9_-]+)/);
    const ytId = ytShort?.[1] ?? ytFull?.[1] ?? null;
    if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;

    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo?.[1]) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;

    if (url.includes("youtube.com/embed") || url.includes("player.vimeo.com")) return url;

    return null;
  } catch {
    return null;
  }
}

function isDirectVideo(url: string): boolean {
  // Strip query params before checking extension — robust for Supabase URLs with cache busters
  const path = url.split("?")[0];
  return /\.(mp4|webm|mov|ogg|avi)$/i.test(path);
}

export default function VideoModal({ videoUrl, title, description, shareUrl, onClose }: VideoModalProps) {
  const embedUrl = getEmbedUrl(videoUrl);
  const isDirect = isDirectVideo(videoUrl);
  const [copied, setCopied] = useState(false);

  // Use the clean share URL for copy/open, fallback to videoUrl for YouTube/Vimeo
  const isSupabaseUrl = videoUrl.includes("supabase.co/storage");
  const displayUrl = shareUrl ?? videoUrl;
  // Safe hostname extraction — new URL() throws on relative paths
  let displayLabel = "Uploaded Video";
  if (!isSupabaseUrl) {
    try {
      displayLabel = new URL(videoUrl).hostname;
    } catch {
      displayLabel = videoUrl.length > 40 ? videoUrl.slice(0, 40) + "…" : videoUrl;
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-surface/92 backdrop-blur-md" />

      {/* Modal panel */}
      <div
        className="relative w-full max-w-3xl z-10 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Video Player ── */}
        <div className="relative w-full aspect-video bg-surface-container-lowest rounded-xl overflow-hidden shadow-2xl">
          {isDirect ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-contain bg-black"
            />
          ) : embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <svg className="w-12 h-12 text-on-surface-variant/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
              <p className="text-on-surface-variant font-light text-sm">Cannot embed this URL.</p>
              <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                Open in new tab →
              </a>
            </div>
          )}
        </div>

        {/* ── Info Card below video ── */}
        <div className="glass-card rounded-xl p-6 border border-outline-variant/20">
          <h2 className="font-headline font-bold text-xl md:text-2xl text-on-surface mb-2">
            {title}
          </h2>

          {description && (
            <p className="font-body font-light text-on-surface-variant leading-relaxed mb-5">
              {description}
            </p>
          )}

          {/* Video link row */}
          <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/20">
            <div className="flex-1 min-w-0">
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/50 mb-1">
                Video Link
              </p>
              <p className="text-on-surface-variant text-sm font-light truncate">
                {displayLabel}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-full text-xs font-label uppercase tracking-widest transition-all duration-200 ${
                  copied
                    ? "bg-primary/20 text-primary"
                    : "bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-bright"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <a
                href={displayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-xs font-label uppercase tracking-widest bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-bright transition-all duration-200"
              >
                Open ↗
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-on-surface-variant/30 text-xs font-label tracking-widest uppercase">
          Press Esc or click outside to close
        </p>
      </div>
    </div>
  );
}
