import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero";
import { FeatureGrid, LiveAnalyticsBlock, IndustriesStrip, CTABlock } from "@/components/home-sections";
import { EnvironmentsMarquee } from "@/components/environments-marquee";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Make3DSpace — Turn Any Space Into Interactive 3D" },
      { name: "description", content: "AI-powered digital twin platform for campuses, malls, hospitals, smart buildings, and interiors. Build, simulate, and operate real-world environments in 3D." },
      { property: "og:title", content: "Make3DSpace — Turn Any Space Into Interactive 3D" },
      { property: "og:description", content: "AI-powered digital twin platform for real-world environments." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <EnvironmentsMarquee />
      <FeatureGrid />
      <LiveAnalyticsBlock />
      <IndustriesStrip />
      <CTABlock />
    </>
  );
}
