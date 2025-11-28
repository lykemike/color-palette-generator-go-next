"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onColorsExtracted: (
    colors: Array<{
      hex: string;
      rgb: { r: number; g: number; b: number };
      count: number;
    }>
  ) => void;
  preview?: string | null;
  onPreviewChange?: (preview: string | null) => void;
}

export function ImageUpload({
  onColorsExtracted,
  preview: externalPreview,
  onPreviewChange,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalPreview, setInternalPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Use external preview if provided, otherwise use internal
  const preview =
    externalPreview !== undefined ? externalPreview : internalPreview;
  const setPreview = onPreviewChange || setInternalPreview;

  const handleImageUpload = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (PNG, JPG, JPEG)");
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be smaller than 10MB");
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to API
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

        const response = await fetch(`${API_BASE}/api/extract`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to extract colors");
        }

        const data = await response.json();
        onColorsExtracted(data.colors);
      } catch (err) {
        setError("Failed to extract colors. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [onColorsExtracted]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const clearPreview = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Upload Area */}
      <div
        className={`
          relative rounded-2xl border-2 border-dashed transition-all duration-200
          ${
            isDragging
              ? "border-violet-500 bg-violet-50"
              : "border-slate-300 hover:border-violet-400"
          }
          ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !loading && fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center p-12">
          {/* Icon */}
          <div className="w-16 h-16 mb-4 flex items-center justify-center">
            <Upload className="w-8 h-8" />
          </div>

          {/* Text */}
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {loading ? "Extracting colors..." : "Drop your image here"}
          </h3>
          <p className="text-slate-600 text-center mb-4 text-sm max-w-xs">
            {loading
              ? "Please wait while we analyze your image"
              : "or click to browse from your computer"}
          </p>

          {/* Button */}
          {!loading && (
            <Button
              type="button"
              className="px-6 py-2.5 text-white font-medium rounded transition-all shadow-md hover:shadow-lg"
            >
              Select Image
            </Button>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="inline-flex items-center gap-2 px-6 py-2.5">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-violet-600"></div>
              <span className="text-violet-600 font-medium">Processing...</span>
            </div>
          )}

          {/* File size hint */}
          <p className="text-xs text-slate-400 mt-3">PNG, JPG up to 10MB</p>
        </div>

        {/* Hidden Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Preview Area */}
      {preview && (
        <div className="rounded-2xl overflow-hidden ">
          <div className="">
            <Image
              src={preview}
              alt="Preview"
              width={500}
              height={500}
              className="w-full h-auto object-cover aspect-square"
            />
            {/* {!loading && (
              <button
                onClick={clearPreview}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-all backdrop-blur-sm"
                aria-label="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            )} */}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
