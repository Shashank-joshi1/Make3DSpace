import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, X, Activity, Building2, Box } from "lucide-react";
import {
  envSmartCity, envCampus, envHospital, envMall, envLogistics, envStadium, envHome, envIndustrial, envRetail,
} from "@/assets";

type Env = {
  id: string;
  title: string;
  category: string;
  image: string;
  stats: { label: string; value: string }[];
  copy: string;
};

const ENVS: Env[] = [
  { id: "smart-city", title: "Smart City", category: "Urban", image: envSmartCity, copy: "City-scale twin streaming traffic, energy, and air quality across every district.", stats: [{ label: "Nodes", value: "184K" }, { label: "Districts", value: "42" }, { label: "Latency", value: "38ms" }] },
  { id: "campus", title: "Campus", category: "Education", image: envCampus, copy: "Operate the whole campus — buildings, paths, occupancy — from a single twin.", stats: [{ label: "Buildings", value: "27" }, { label: "Footfall", value: "9.2K/d" }, { label: "Energy", value: "−14%" }] },
  { id: "hospital", title: "Hospital", category: "Healthcare", image: envHospital, copy: "Wayfinding, asset tracking, and capacity simulation grounded in real geometry.", stats: [{ label: "Beds", value: "612" }, { label: "Assets", value: "11K" }, { label: "Uptime", value: "99.98%" }] },
  { id: "mall", title: "Mall", category: "Retail", image: envMall, copy: "Heatmaps, dwell time, and tenant analytics overlaid on a faithful twin.", stats: [{ label: "Stores", value: "240" }, { label: "Visitors", value: "38K/d" }, { label: "Dwell", value: "47m" }] },
  { id: "logistics", title: "Logistics", category: "Supply chain", image: envLogistics, copy: "Throughput simulation, robotics planning, and live fleet visibility.", stats: [{ label: "SKUs", value: "1.2M" }, { label: "Bots", value: "318" }, { label: "Picks/h", value: "5.4K" }] },
  { id: "stadium", title: "Stadium", category: "Venues", image: envStadium, copy: "Crowd flow, sightlines, and event ops — modelled before opening night.", stats: [{ label: "Capacity", value: "62K" }, { label: "Gates", value: "48" }, { label: "Evac", value: "7m 20s" }] },
  { id: "smart-home", title: "Smart Home", category: "Residential", image: envHome, copy: "A photoreal twin of the home — automate, design, and operate it from one place.", stats: [{ label: "Rooms", value: "12" }, { label: "Devices", value: "84" }, { label: "Scenes", value: "26" }] },
  { id: "industrial", title: "Industrial Plant", category: "Manufacturing", image: envIndustrial, copy: "Process digital twin with OT data streaming directly into the geometry.", stats: [{ label: "Lines", value: "9" }, { label: "OEE", value: "87%" }, { label: "Sensors", value: "21K" }] },
  { id: "retail", title: "Retail", category: "Commerce", image: envRetail, copy: "Flagship layout planning, planogram fidelity, and live store telemetry.", stats: [{ label: "Stores", value: "118" }, { label: "Conv.", value: "+9.4%" }, { label: "AOV", value: "$184" }] },
];

const TRACK = [...ENVS, ...ENVS];

export function EnvironmentsMarquee() {
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState<Env | null>(null);

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Environments</p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-[-0.02em]">
              Every kind of space, <span className="text-gradient">already modeled.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">Hover to pause. Click any environment to open a live twin preview, telemetry tiles, and a download-ready spec sheet.</p>
        </div>
      </div>

      <div
        className="relative mt-14"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div
          className="flex gap-6 will-change-transform"
          style={{
            animation: `marquee 60s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
            width: "max-content",
          }}
        >
          {TRACK.map((env, i) => (
            <button
              key={`${env.id}-${i}`}
              onClick={() => setOpen(env)}
              className="group relative w-[420px] sm:w-[520px] h-[340px] sm:h-[400px] rounded-3xl overflow-hidden text-left transition-transform duration-500 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow"
            >
              <img src={env.image} alt={env.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/80 glass px-2.5 py-1 rounded-full">{env.category}</span>
                <span className="h-9 w-9 grid place-items-center rounded-full glass text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">{env.title}</h3>
                <p className="mt-1.5 text-sm text-white/80 line-clamp-2">{env.copy}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <AnimatePresence>
        {open && <EnvDetail env={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}

function EnvDetail({ env, onClose }: { env: Env; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[90] grid place-items-center p-4 sm:p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-2xl" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.94, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-5xl rounded-3xl glass overflow-hidden border border-border/60 shadow-2xl"
      >
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-10 h-9 w-9 grid place-items-center rounded-full glass hover:bg-foreground/10">
          <X className="h-4 w-4" />
        </button>
        <div className="grid lg:grid-cols-5">
          <div className="lg:col-span-3 relative h-[280px] sm:h-[420px] lg:h-auto">
            <img src={env.image} alt={env.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/30" />
          </div>
          <div className="lg:col-span-2 p-7 sm:p-9 flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{env.category}</span>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight">{env.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{env.copy}</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {env.stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-border/60 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-lg font-semibold tracking-tight">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
              <Feat icon={Building2} label="Live geometry" />
              <Feat icon={Activity} label="Telemetry streams" />
              <Feat icon={Box} label="Editable mesh" />
              <Feat icon={Activity} label="AI agents" />
            </div>
            <div className="mt-auto pt-7 flex flex-wrap gap-2">
              <a href="/builder" className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90">
                Open in Builder <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <button className="rounded-full glass px-4 py-2 text-sm">Download spec</button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Feat({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );
}
