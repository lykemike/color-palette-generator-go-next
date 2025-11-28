export default function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-sm text-slate-600">
            Built by Mekk.hl with <span className="text-red-500">♥</span> using
            Next.js and Go
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <a
              href="https://github.com/yourusername/color-palette-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-600 hover:text-violet-600 transition-colors"
            >
              GitHub
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="/privacy"
              className="text-sm text-slate-600 hover:text-violet-600 transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
