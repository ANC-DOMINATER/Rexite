"use client";

import Features from "@/components/Home/features";
import IndustryInsights from "@/components/Home/industryInsights";
import HowITWorks from "@/components/Home/works";
import FaQ from "@/components/Home/Faq";
import SpaceHeroSection from "@/components/Home/HeroSection";


export default function Home() {
  return (
    <main >

      <SpaceHeroSection />
      <Features />
      <IndustryInsights />
      <HowITWorks />
      <FaQ />

    </main>
  );
}
