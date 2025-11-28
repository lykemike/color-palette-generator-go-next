"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50">
      <Header />
      <HeroSection />
      <Footer />
    </div>
  );
}
