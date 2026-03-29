import { supabaseServer } from "@/src/lib/supabase-server";
import type { Project } from "@/src/lib/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProjectDetailClient from "./ProjectDetailClient";
import RelatedProjects from "@/src/components/RelatedProjects";
import ShareButton from "@/src/components/ShareButton";

export const revalidate = 10;

// Dynamic OG meta per project
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return {};
  return {
    title: `${project.title} — Shweta Sharma`,
    description: project.description ?? "Project by Shweta Sharma",
    openGraph: {
      title: `${project.title} — Shweta Sharma`,
      description: project.description ?? "Project by Shweta Sharma",
      images: project.cover_url ? [{ url: project.cover_url }] : [],
    },
  };
}

async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabaseServer
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

async function getAllProjects(): Promise<Project[]> {
  const { data } = await supabaseServer
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const allProjects = await getAllProjects();
  const currentIdx = allProjects.findIndex((p) => p.id === id);
  const nextProject = allProjects[currentIdx + 1] ?? allProjects[0];
  const prevProject =
    currentIdx > 0
      ? allProjects[currentIdx - 1]
      : allProjects[allProjects.length - 1];

  // Related: same category first, then others — exclude current, max 3
  const sameCategory = allProjects.filter(
    (p) => p.id !== id && project.category && p.category === project.category
  );
  const others = allProjects.filter(
    (p) => p.id !== id && p.category !== project.category
  );
  const related = [...sameCategory, ...others].slice(0, 3);

  return (
    <>
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-surface-container/70 backdrop-blur-2xl">
        <div className="flex justify-between items-center px-6 md:px-12 py-5 max-w-screen-2xl mx-auto">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tighter text-primary font-headline"
          >
            SHWETA
          </Link>
          <Link
            href="/#work"
            className="font-headline font-light tracking-wide uppercase text-sm text-on-surface/60 hover:text-primary transition-colors duration-300 flex items-center gap-2"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            All Work
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        {/* Hero */}
        <div className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-12">
          <div className="max-w-3xl">
            {project.category && (
              <span className="font-label text-primary tracking-[0.3em] uppercase text-xs block mb-4">
                {project.category}
              </span>
            )}
            <h1 className="font-headline font-extrabold text-5xl md:text-7xl text-on-surface tracking-tighter mb-6">
              {project.title}
            </h1>
            {project.description && (
              <p className="font-body font-light text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-xl">
                {project.description}
              </p>
            )}
            {/* Share */}
            <div className="mt-6">
              <ShareButton title={project.title} />
            </div>
          </div>
        </div>

        {/* Cover */}
        {project.cover_url && (
          <div className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-12">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-surface-container-high">
              <Image
                src={project.cover_url}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Video + Gallery — Client Component */}
        <ProjectDetailClient project={project} />

        {/* Related Projects */}
        <RelatedProjects projects={related} />

        {/* Project navigation */}
        <div className="px-6 md:px-12 max-w-screen-2xl mx-auto mt-8">
          <div className="border-t border-outline-variant/20 pt-12 grid grid-cols-2 gap-8">
            {prevProject && prevProject.id !== project.id && (
              <Link href={`/project/${prevProject.id}`} className="group">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40 block mb-2">
                  ← Previous
                </span>
                <span className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                  {prevProject.title}
                </span>
              </Link>
            )}
            {nextProject && nextProject.id !== project.id && (
              <Link
                href={`/project/${nextProject.id}`}
                className="group text-right col-start-2"
              >
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40 block mb-2">
                  Next →
                </span>
                <span className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                  {nextProject.title}
                </span>
              </Link>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
