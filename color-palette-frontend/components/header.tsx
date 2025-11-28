import { Palette } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-slate-200 sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer"
          >
            <div className="p-2.5 bg-black rounded">
              <Palette className="w-8 h-8 text-white" />
            </div>
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Color Palette Generator
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Extract beautiful color palettes from your images
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
