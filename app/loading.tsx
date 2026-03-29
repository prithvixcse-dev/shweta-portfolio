import { ProjectGridSkeleton } from "@/src/components/ProjectCardSkeleton";

export default function Loading() {
  return (
    <>
      {/* Navbar skeleton */}
      <nav className="fixed top-0 w-full z-50 bg-transparent">
        <div className="flex justify-between items-center px-6 md:px-12 py-5 max-w-screen-2xl mx-auto">
          <div className="h-8 w-32 bg-surface-container-high rounded-full animate-pulse" />
          <div className="hidden md:flex gap-10">
            <div className="h-4 w-12 bg-surface-container-high/50 rounded-full animate-pulse" />
            <div className="h-4 w-12 bg-surface-container-high/50 rounded-full animate-pulse" />
            <div className="h-4 w-16 bg-surface-container-high/50 rounded-full animate-pulse" />
          </div>
        </div>
      </nav>

      {/* Hero skeleton */}
      <section className="relative min-h-screen flex items-center px-6 md:px-12 pt-20">
        <div className="max-w-screen-2xl mx-auto w-full">
          <div className="h-4 w-64 bg-surface-container-high rounded-full mb-6 animate-pulse" />
          <div className="h-20 w-96 bg-surface-container-high rounded-2xl mb-4 animate-pulse" />
          <div className="h-20 w-80 bg-surface-container-high rounded-2xl mb-8 animate-pulse" />
          <div className="h-5 w-72 bg-surface-container-high/50 rounded-full mb-4 animate-pulse" />
          <div className="h-5 w-56 bg-surface-container-high/50 rounded-full mb-12 animate-pulse" />
          <div className="h-14 w-48 bg-surface-container-high rounded-lg animate-pulse" />
        </div>
      </section>

      {/* Projects skeleton */}
      <ProjectGridSkeleton />
    </>
  );
}
