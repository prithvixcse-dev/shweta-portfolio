export default function ProjectCardSkeleton() {
  return (
    <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-highest rounded-lg animate-pulse">
      {/* Cover placeholder */}
      <div className="w-full h-full bg-gradient-to-br from-surface-container-high to-surface-container-lowest" />

      {/* Bottom info shimmer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="glass-card p-5 md:p-6 rounded-lg border border-outline-variant/10">
          <div className="h-3 w-20 bg-surface-container-high rounded-full mb-3" />
          <div className="h-6 w-3/4 bg-surface-container-high rounded-full mb-2" />
          <div className="h-4 w-full bg-surface-container-high/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProjectGridSkeleton() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-surface-container-low">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-16 md:mb-24">
          <div className="h-10 w-64 bg-surface-container-high rounded-full mb-4 animate-pulse" />
          <div className="h-5 w-96 bg-surface-container-high/50 rounded-full animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={i === 1 ? "lg:mt-16" : ""}>
              <ProjectCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
