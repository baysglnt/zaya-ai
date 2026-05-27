"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/features/HeroSection";
import { ViralFeatures } from "@/components/features/ViralFeatures";
import { DailyFeed } from "@/components/features/DailyFeed";
import { TestimonialSection } from "@/components/features/TestimonialSection";
import { PricingSection } from "@/components/features/PricingSection";
import { ZodiacQuickCheck } from "@/components/features/ZodiacQuickCheck";
import { FloatingCTA } from "@/components/ui/FloatingCTA";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Hero - main viral hook */}
      <HeroSection />
      
      {/* Quick zodiac checker - immediate engagement */}
      <ZodiacQuickCheck />
      
      {/* Viral mini-features */}
      <ViralFeatures />
      
      {/* Daily content feed */}
      <DailyFeed />
      
      {/* Social proof */}
      <TestimonialSection />
      
      {/* Pricing */}
      <PricingSection />
      
      {/* Floating action button */}
      <FloatingCTA />
    </div>
  );
}
