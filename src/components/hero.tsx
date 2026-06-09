import { motion } from "framer-motion";
import { ArrowRight, Play, Upload, Box } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { heroMainVideo, monitorOnly } from "@/assets";
import { useEffect, useState } from "react";
import { DemoModal } from "./demo-modal";

const STATS = [
  { label: "Spaces digitized", value: "12,480+", trend: "+24%" },
  { label: "AI reconstructions / day", value: "3.2M", trend: "+18%" },
  { label: "Avg. twin generation", value: "3m 41s", trend: "−12%" },
];

const TRUSTED = ["AECOM", "SIEMENS", "AUTODESK", "BENTLEY", "JLL", "ARUP"];

export function Hero() {
  const [y, setY] = useState(0);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      {/* Cinematic ocean video — bright, alive, not blurred out */}
      <div className="absolute inset-0 -z-10">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay muted loop playsInline preload="metadata"
          style={{
            transform: `translateY(${y * 0.2}px) scale(1.06)`,
            filter: "saturate(1.08) contrast(1.05) brightness(0.92)",
          }}
        >
          <source src={heroMainVideo} type="video/mp4" />
        </video>
        {/* Tame the bright beach band at the top; keep the wave line vivid */}
        <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-black/70 via-black/35 to-transparent" />
        {/* Bottom fade for content readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs shadow-lg shadow-black/10">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-accent-glow animate-pulse-glow" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-accent-glow" />
            </span>
            <span className="text-foreground">AI-powered digital twin platform</span>
          </div>

          <h1 className="mt-7 text-[2.75rem] sm:text-6xl lg:text-[5.25rem] font-semibold tracking-[-0.035em] leading-[0.98] text-foreground drop-shadow-[0_2px_24px_rgba(0,0,0,0.25)]">
            Turn any space
            <br />
            into{" "}
            <span className="text-gradient" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}>
              interactive 3D.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-foreground/85 max-w-2xl leading-relaxed">
            Make3DSpace reconstructs campuses, malls, hospitals, smart buildings, and interiors from photos, video, and floor plans — a living, operable twin of the real world.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/builder" className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all">
              Start Building
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button
              onClick={() => setDemoOpen(true)}
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground hover:bg-foreground/10 transition-colors"
            >
              <Play className="h-3.5 w-3.5" />
              Watch AI Demo
            </button>
            <Link to="/builder" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground hover:bg-foreground/10 transition-colors">
              <Upload className="h-3.5 w-3.5" />
              Upload Space
            </Link>
            <Link to="/builder" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground hover:bg-foreground/10 transition-colors">
              <Box className="h-3.5 w-3.5" />
              Create 3D Twin
            </Link>
          </div>
        </motion.div>

        {/* Floating monitor — no card, no desk. Just a screen sitting in the scene. */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-20 lg:mt-28"
          style={{ transform: `translateY(${y * -0.06}px)` }}
        >
          <div className="relative mx-auto max-w-5xl">
            {/* environmental color spill from the screen */}
            <div
              className="absolute -inset-16 rounded-[40%] pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, color-mix(in oklch, var(--accent-glow) 35%, transparent), transparent 65%)",
                filter: "blur(60px)",
                opacity: 0.7,
              }}
            />
            {/* contact shadow on the water */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[2%] w-[70%] h-20 rounded-[50%] pointer-events-none"
              style={{
                background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)",
                filter: "blur(32px)",
              }}
            />
            <img
              src={monitorOnly}
              alt="Make3DSpace digital twin running on a monitor"
              loading="eager"
              decoding="async"
              className="relative w-full select-none animate-float-slow"
              style={{
                filter:
                  "drop-shadow(0 80px 60px rgba(0,0,0,0.55)) drop-shadow(0 30px 30px rgba(0,0,0,0.35)) drop-shadow(0 0 90px color-mix(in oklch, var(--accent-glow) 30%, transparent))",
              }}
            />
            {/* reflection underneath */}
            <div
              aria-hidden
              className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-[80%] h-32 pointer-events-none overflow-hidden opacity-25"
              style={{ maskImage: "linear-gradient(to bottom, black, transparent)" }}
            >
              <img src={monitorOnly} alt="" className="w-full -scale-y-100 blur-[2px]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl glass p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-semibold tracking-tight text-foreground">{s.value}</p>
                <span className="text-xs text-emerald-500">{s.trend}</span>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="mt-16">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground text-center">Trusted by innovators</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-70">
            {TRUSTED.map((b) => (
              <span key={b} className="text-sm font-semibold tracking-[0.2em] text-foreground/80 hover:text-foreground transition-colors">{b}</span>
            ))}
          </div>
        </div>
      </div>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}
