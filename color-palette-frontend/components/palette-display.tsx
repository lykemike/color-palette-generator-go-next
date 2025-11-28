"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { Button } from "./ui/button";

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  count: number;
}

interface PaletteDisplayProps {
  colors: Color[];
}

export function PaletteDisplay({ colors }: PaletteDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [exportFormat, setExportFormat] = useState<"css" | "json" | "tailwind">(
    "css"
  );

  // Calculate total count for percentage
  const totalCount = colors.reduce((sum, color) => sum + color.count, 0);

  // Helper function to convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): string => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
      l * 100
    )}%)`;
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const generateExport = () => {
    let content = "";
    let filename = "palette";

    if (exportFormat === "css") {
      content =
        ":root {\n" +
        colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join("\n") +
        "\n}";
      filename = "palette.css";
    } else if (exportFormat === "json") {
      content = JSON.stringify(
        colors.map((c, i) => ({
          name: `color-${i + 1}`,
          hex: c.hex,
          rgb: `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
          hsl: rgbToHsl(c.rgb.r, c.rgb.g, c.rgb.b),
          percentage: Math.round((c.count / totalCount) * 100),
        })),
        null,
        2
      );
      filename = "palette.json";
    } else if (exportFormat === "tailwind") {
      content =
        `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n` +
        colors
          .map((c, i) => `        'palette-${i + 1}': '${c.hex}',`)
          .join("\n") +
        `\n      },\n    },\n  },\n}`;
      filename = "tailwind.config.js";
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (colors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Extracted Palette</h2>
        <span className="text-sm text-slate-500">{colors.length} colors</span>
      </div>

      {/* Color Swatches */}
      <div className="grid grid-cols-1 gap-3">
        {colors.map((color, index) => {
          const percentage = (color.count / totalCount) * 100;
          const rgbString = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
          const hslString = rgbToHsl(color.rgb.r, color.rgb.g, color.rgb.b);

          return (
            <div
              key={index}
              className="group rounded-xl overflow-hidden border border-slate-200"
            >
              <div className="flex items-center gap-4 p-4 bg-white">
                {/* Color Swatch */}
                <div
                  className="w-20 h-20 rounded-lg border-2 border-slate-200 flex-shrink-0 "
                  style={{ backgroundColor: color.hex }}
                />

                {/* Color Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-xl font-bold text-slate-900 font-mono mb-2">
                    {color.hex.toUpperCase()}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-slate-600 font-medium">RGB:</span>
                      <span className="text-slate-900 font-mono">
                        {rgbString}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-slate-600 font-medium">HSL:</span>
                      <span className="text-slate-900 font-mono">
                        {hslString}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Frequency & Copy */}
                <div className="flex flex-col items-end gap-3">
                  {/* Percentage Bar */}
                  <div className="text-right">
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden w-16 mb-1.5">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-700">
                      {Math.round(percentage)}%
                    </span>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(color.hex, index)}
                    className={`
                      p-2.5 rounded-lg transition-all duration-200 cursor-pointer
                      ${
                        copiedIndex === index
                          ? "bg-green-100 text-green-600 scale-110"
                          : "bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-600 hover:scale-110"
                      }
                    `}
                    title="Copy hex code"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Export Section */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Export Palette</h3>

        {/* Format Selection */}
        <div className="flex gap-2">
          {(["css", "json", "tailwind"] as const).map((format) => (
            <Button
              key={format}
              onClick={() => setExportFormat(format)}
              className={`
                flex-1 px-4 py-2.5 rounded text-sm font-semibold transition-all duration-200
                ${
                  exportFormat === format
                    ? " text-white shadow-md scale-105"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }
              `}
            >
              {format.toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Download Button */}
        <Button
          onClick={generateExport}
          className="w-full px-6 py-3 text-white font-semibold rounded transition-all duration-200 shadow-lg cursor-pointer hover:scale-105 flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download {exportFormat.toUpperCase()}
        </Button>
      </div>
    </div>
  );
}
