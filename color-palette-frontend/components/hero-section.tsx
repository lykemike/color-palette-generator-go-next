"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";
import { PaletteDisplay } from "@/components/palette-display";

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  count: number;
}

export default function HeroSection() {
  const [colors, setColors] = useState<Color[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {colors.length === 0 ? (
        // Welcome State - Show before upload
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-700">
                Free AI-Powered Color Extraction
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Transform Images into
              <span className="bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Color Palettes
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Upload any image and instantly extract its dominant colors with
              precise hex codes, RGB values, and color percentages. Perfect for
              designers and developers.
            </p>
          </div>

          {/* Upload Component */}
          <ImageUpload
            onColorsExtracted={setColors}
            preview={imagePreview}
            onPreviewChange={setImagePreview}
          />

          {/* Features */}
          <div className="mt-16 grid sm:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-white border border-slate-200">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-violet-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-sm text-slate-600">
                Extract colors in seconds with our optimized algorithm
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white border border-slate-200">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-violet-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Export Ready
              </h3>
              <p className="text-sm text-slate-600">
                Download palettes as CSS, JSON, or Tailwind config
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white border border-slate-200">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-violet-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                100% Private
              </h3>
              <p className="text-sm text-slate-600">
                Your images are processed securely and never stored
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Results State - Show after upload
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Your Image</h2>
              <button
                onClick={() => {
                  setColors([]);
                  setImagePreview(null);
                }}
                className="text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                Upload New Image
              </button>
            </div>
            <ImageUpload
              onColorsExtracted={setColors}
              preview={imagePreview}
              onPreviewChange={setImagePreview}
            />
          </div>

          {/* Right Column - Palette */}
          <div>
            <PaletteDisplay colors={colors} />
          </div>
        </div>
      )}
    </main>
  );
}
