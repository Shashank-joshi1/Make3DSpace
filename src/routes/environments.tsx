import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { motion, AnimatePresence } from "framer-motion";
import { useState, type MouseEvent } from "react";
import { ArrowUpRight, Building2, Hospital, Plane, ShoppingBag, Warehouse, Cpu, Briefcase, Trees, X } from "lucide-react";

export const Route = createFileRoute("/environments")({
  head: () => ({
    meta: [
      { title: "Environments — Make3DSpace" },
      { name: "description", content: "Interactive 3D environments for campuses, malls, hospitals, smart buildings, warehouses, airports, and entire smart cities." },
      { property: "og:title", content: "Environments — Make3DSpace" },
      { property: "og:description", content: "Interactive 3D environments built with AI." },
    ],
  }),
  component: EnvironmentsPage,
});

const ENVS = [
  { id: "campus", code: "EN-01", title: "Campus", icon: Trees, gradient: "from-emerald-500/30 to-cyan-500/20", body: "Unified twin of academic and corporate campuses with live wayfinding, occupancy and energy overlays." },
  { id: "mall", code: "EN-02", title: "Mall", icon: ShoppingBag, gradient: "from-fuchsia-500/30 to-amber-500/20", body: "Retail twins that track footfall heatmaps, tenant performance, and HVAC response in real time." },
  { id: "hospital", code: "EN-03", title: "Hospital", icon: Hospital, gradient: "from-sky-500/30 to-indigo-500/20", body: "Ward-by-ward operational visibility — patient flow, equipment status, sterilization, and capacity." },
  { id: "smart-building", code: "EN-04", title: "Smart Building", icon: Building2, gradient: "from-violet-500/30 to-pink-500/20", body: "BMS, IoT, and occupancy fused into one twin. Automate climate, lighting, and access from a single canvas." },
  { id: "warehouse", code: "EN-05", title: "Warehouse", icon: Warehouse, gradient: "from-orange-500/30 to-rose-500/20", body: "Robot routing, slot density, and live SKU tracking inside an ultra-accurate spatial twin." },
  { id: "airport", code: "EN-06", title: "Airport", icon: Plane, gradient: "from-cyan-500/30 to-blue-500/20", body: "Gate operations, baggage flow, security throughput and turnaround times in one spatial cockpit." },
  { id: "smart-city", code: "EN-07", title: "Smart City", icon: Cpu, gradient: "from-indigo-500/30 to-teal-500/20", body: "Multi-district twin of traffic, utilities, mobility and emissions for planners and operators." },
  { id: "office", code: "EN-08", title: "Office", icon: Briefcase, gradient: "from-amber-500/30 to-lime-500/20", body: "Desk booking, meeting room utilization, and air-quality overlays for the modern hybrid workplace." },
];

function EnvironmentsPage() {
  const [active, setActive] = useState<typeof ENVS[number] | null>(null);
  return (
    <PageShell
      eyebrow="Environments"
      title={<>Every kind of space. <span className="text-gradient" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}>One platform.</span></>}
      subtitle="From a single ward to an entire metropolitan district — build, simulate, and operate any environment as a live 3D twin."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ENVS.map((env, i) => (
          <EnvCard key={env.id} env={env} delay={i * 0.04} onOpen={() => setActive(env)} />
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-background/60 backdrop-blur-md p-6"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="relative w-full max-w-xl rounded-3xl glass p-8 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`absolute -top-32 -right-32 h-64 w-64 rounded-full bg-gradient-to-br ${active.gradient} blur-3xl opacity-70`} />
              <button onClick={() => setActive(null)} className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-full hover:bg-foreground/5"><X className="h-4 w-4" /></button>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{active.code}</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight">{active.title}</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">{active.body}</p>
              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                {["Telemetry", "AI agents", "Multiplayer"].map((f) => (
                  <div key={f} className="rounded-xl bg-foreground/5 px-3 py-2 text-xs text-foreground/80">{f}</div>
                ))}
              </div>
              <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium">
                Open template
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

function EnvCard({ env, delay, onOpen }: { env: typeof ENVS[number]; delay: number; onOpen: () => void }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: y * -6, y: x * 6 });
  };
  const Icon = env.icon;
  return (
    <motion.button
      onClick={onOpen}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      className="group relative text-left rounded-2xl border border-border/70 bg-surface p-5 overflow-hidden hover:border-foreground/30 transition-all"
    >
      <div className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${env.gradient} blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{
        background: "linear-gradient(135deg, transparent, color-mix(in oklch, var(--accent-glow) 12%, transparent), transparent)",
      }} />
      <div className="relative flex items-start justify-between">
        <div className="h-10 w-10 grid place-items-center rounded-xl bg-foreground/5 border border-border">
          <Icon className="h-4 w-4" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
      <p className="relative mt-6 text-[10px] uppercase tracking-widest text-muted-foreground">{env.code}</p>
      <h3 className="relative mt-1 text-xl font-semibold tracking-tight">{env.title}</h3>
      <p className="relative mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">{env.body}</p>
    </motion.button>
  );
}