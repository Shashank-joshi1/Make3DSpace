import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { motion } from "framer-motion";
import { Wand2, Eye, Workflow, ImagePlus, Bot, MicVocal, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/ai-tools")({
  head: () => ({
    meta: [
      { title: "AI Tools — Make3DSpace" },
      { name: "description", content: "Spatial AI tools: image-to-3D, scene understanding, agent workflows, generative materials, and voice copilots." },
      { property: "og:title", content: "AI Tools — Make3DSpace" },
      { property: "og:description", content: "Spatial AI tools for the digital twin era." },
    ],
  }),
  component: AIToolsPage,
});

const TOOLS = [
  { icon: ImagePlus, title: "Image → 3D", body: "Diffusion + Gaussian splatting that reconstructs editable geometry from a single photo." },
  { icon: Eye, title: "Scene understanding", body: "Auto-detect doors, equipment, signage, and zones with grounded vision models." },
  { icon: Workflow, title: "Agent workflows", body: "Compose copilots that reason over routing, capacity, safety, and energy." },
  { icon: Wand2, title: "Generative materials", body: "Synthesize realistic PBR materials and lighting variants in seconds." },
  { icon: Bot, title: "Spatial copilots", body: "In-twin assistants answering grounded questions about your real space." },
  { icon: MicVocal, title: "Voice walkthroughs", body: "Narrate, navigate, and annotate any environment hands-free." },
];

function AIToolsPage() {
  return (
    <PageShell
      eyebrow="AI Tools"
      title={<>Spatial AI, <span className="text-gradient" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}>composable.</span></>}
      subtitle="A toolkit of models and agents purpose-built for real-world environments — not generic chatbots."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((t, i) => (
          <motion.div key={t.title}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="group relative rounded-2xl glass p-6 overflow-hidden hover:bg-foreground/5 transition-colors">
            <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-primary/30 to-accent-glow/30 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="h-10 w-10 grid place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent-glow/20 border border-border">
                <t.icon className="h-4 w-4" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t.body}</p>
              <Link to="/builder" className="mt-5 inline-flex items-center gap-1 text-sm text-foreground hover:gap-2 transition-all">
                Try it <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}