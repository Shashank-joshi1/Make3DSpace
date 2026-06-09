import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { motion } from "framer-motion";
import { ArrowUpRight, Building2, GraduationCap, HeartPulse, Landmark, ShoppingBag, Factory, Compass } from "lucide-react";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries — Make3DSpace" },
      { name: "description", content: "Digital twin solutions for logistics, education, healthcare, smart city, retail, manufacturing, and architecture." },
      { property: "og:title", content: "Industries — Make3DSpace" },
      { property: "og:description", content: "Cinematic digital twin solutions for every industry." },
    ],
  }),
  component: IndustriesPage,
});

const ROWS = [
  { icon: Building2, title: "Logistics", body: "Live fleet routing, slot density, and SKU traceability across distribution networks.", tag: "01" },
  { icon: GraduationCap, title: "Education", body: "Campus-scale twins for capacity planning, safety drills, and student flow.", tag: "02" },
  { icon: HeartPulse, title: "Healthcare", body: "Patient pathways, equipment uptime, and infection-control overlays for hospitals.", tag: "03" },
  { icon: Landmark, title: "Smart City", body: "District-level digital twin uniting mobility, utilities, and citizen services.", tag: "04" },
  { icon: ShoppingBag, title: "Retail", body: "Footfall heatmaps, conversion zones, and tenant performance for malls and stores.", tag: "05" },
  { icon: Factory, title: "Manufacturing", body: "Plant twins with line balance, OEE, and predictive maintenance built in.", tag: "06" },
  { icon: Compass, title: "Architecture", body: "Design review, daylight simulation, and stakeholder walkthroughs at 1:1 scale.", tag: "07" },
];

function IndustriesPage() {
  return (
    <PageShell
      eyebrow="Industries"
      title={<>Operators across every sector, <span className="text-gradient" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}>building spatial.</span></>}
      subtitle="Make3DSpace is deployed inside hospitals, factories, malls and municipal control rooms — wherever decisions happen in space."
    >
      <div className="grid lg:grid-cols-2 gap-4">
        {ROWS.map((r, i) => (
          <motion.a
            key={r.title}
            href="#"
            onClick={(e) => e.preventDefault()}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.04 }}
            className="group relative rounded-2xl overflow-hidden border border-border/70 bg-surface hover:border-foreground/30 transition-all"
          >
            <div className="relative p-7 flex items-start gap-5">
              <div className="h-14 w-14 shrink-0 rounded-2xl grid place-items-center bg-gradient-to-br from-primary/20 to-accent-glow/20 border border-border">
                <r.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>{r.tag}</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.body}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-glow/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>
        ))}
      </div>
    </PageShell>
  );
}