import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Color Palette Generator - Extract Colors from Images",
  description: "Free online color palette generator. Upload any image and instantly extract dominant colors with hex codes and RGB values. Perfect for designers and developers.",
  keywords: ["color palette generator", "extract colors", "image color picker", "hex color", "design tools"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Color Palette Generator - Extract Colors from Images",
    description: "Upload any image and extract beautiful color palettes instantly. Get hex codes and RGB values.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Palette Generator",
    description: "Extract color palettes from images instantly",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}