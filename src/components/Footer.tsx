export default function Footer() {
  return (
    <footer className="w-full py-16 md:py-20 px-6 md:px-12 bg-surface-container-low">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <span className="text-lg font-black text-primary font-headline">
            SHWETA SHARMA
          </span>
          <p className="font-label font-light text-on-surface/50 text-xs tracking-[0.05em] uppercase">
            © {new Date().getFullYear()} Shweta Sharma. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
