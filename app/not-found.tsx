import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-surface relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center relative z-10 max-w-lg">
        {/* Big 404 */}
        <h1 className="font-headline font-black text-[10rem] md:text-[14rem] leading-none text-primary/10 select-none mb-[-2rem] md:mb-[-3rem]">
          404
        </h1>

        <h2 className="font-headline font-bold text-3xl md:text-4xl text-on-surface mb-4">
          Page Not Found
        </h2>
        <p className="font-body font-light text-on-surface-variant text-lg mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let&apos;s get you back to something beautiful.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="gold-gradient text-on-primary px-8 py-4 rounded-md font-headline font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-all shadow-xl shadow-primary/10"
          >
            Back to Home
          </Link>
          <Link
            href="/#work"
            className="border border-outline-variant/30 text-on-surface/60 px-8 py-4 rounded-md font-headline font-semibold text-sm uppercase tracking-wider hover:text-primary hover:border-primary/30 transition-all"
          >
            View Work
          </Link>
        </div>
      </div>
    </div>
  );
}
