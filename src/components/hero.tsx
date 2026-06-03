import { motion } from "framer-motion";
import { ArrowRight, Play, Upload, Sparkles, Box } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { oceanVideo, desktopScene } from "@/assets";
import { useEffect, useState } from "react";

const STATS = [
  { label: "Spaces digitized", value: "12,480+", trend: "+24%" },
  { label: "AI reconstructions / day", value: "3.2M", trend: "+18%" },
  { label: "Avg. twin generation", value: "3m 41s", trend: "−12%" },
];

const TRUSTED = ["AECOM", "SIEMENS", "AUTODESK", "BENTLEY", "JLL", "ARUP"];

export function Hero() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 -z-10">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={desktopScene}
          style={{
            transform: `translateY(${y * 0.25}px) scale(1.08)`,
            filter: "blur(2px) brightness(0.55) saturate(0.95)",
          }}
        >
          <source src={oceanVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 hero-vignette" />
        <div
          className="absolute inset-0 opacity-60 mix-blend-soft-light"
          style={{
            background:
              "radial-gradient(ellipse at 20% 20%, var(--atmos-1), transparent 55%), radial-gradient(ellipse at 80% 70%, var(--atmos-2), transparent 60%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-36 pb-20 lg:pt-44">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-accent-glow animate-pulse-glow" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-accent-glow" />
            </span>
            <span className="text-foreground/85">AI-powered digital twin platform</span>
          </div>

          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.02em] leading-[1.02] text-foreground">
            Turn Any Space Into
            <br />
            <span className="text-gradient" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}>
              Interactive 3D.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-foreground/75 max-w-2xl leading-relaxed">
            AI-powered digital twin platform for campuses, malls, hospitals, smart buildings, interiors, and real-world environments — built for the spatial era.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/builder"
              className="group relative inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium shadow-xl shadow-black/20 hover:shadow-2xl transition-all"
            >
              <span>Start Building</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/environments"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors"
            >
              <Play className="h-3.5 w-3.5" />
              Explore Platform
            </Link>
            <Link
              to="/builder"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload Space
            </Link>
            <Link
              to="/builder"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors"
            >
              <Box className="h-3.5 w-3.5" />
              Create 3D Twin
            </Link>
            <Link
              to="/ai-tools"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Watch Demo
            </Link>
          </div>
        </motion.div>

        {/* Desktop scene — naturally placed, no card boundary */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16 lg:mt-24"
          style={{ transform: `translateY(${y * -0.05}px)` }}
        >
          <div className="relative mx-auto max-w-5xl">
            {/* soft ground shadow */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[-6%] w-[78%] h-24 rounded-[50%] pointer-events-none"
              style={{
                background: "radial-gradient(ellipse, color-mix(in oklch, var(--foreground) 35%, transparent), transparent 70%)",
                filter: "blur(28px)",
                opacity: 0.55,
              }}
            />
            {/* color spill */}
            <div
              className="absolute inset-0 -m-12 rounded-[40%] pointer-events-none opacity-60"
              style={{
                background: "radial-gradient(ellipse at center top, color-mix(in oklch, var(--accent-glow) 25%, transparent), transparent 65%)",
                filter: "blur(40px)",
              }}
            />
            <img
              src={desktopScene}
              alt="Make3DSpace running on a desktop showing an AI-generated 3D digital twin of a smart campus"
              loading="eager"
              decoding="async"
              className="relative w-full select-none"
              style={{
                filter: "drop-shadow(0 60px 80px rgba(0,0,0,0.45)) drop-shadow(0 20px 30px rgba(0,0,0,0.25))",
                mixBlendMode: "normal",
              }}
            />
            {/* floating stats badges */}
            <FloatingStat className="hidden md:flex absolute top-[18%] left-[6%] animate-float-slow" label="Render FPS" value="120" trend="+8%" />
            <FloatingStat className="hidden md:flex absolute top-[10%] right-[6%] animate-float-slow" label="Active nodes" value="2,418" trend="+12%" style={{ animationDelay: "0.6s" }} />
            <FloatingStat className="hidden md:flex absolute bottom-[18%] right-[10%] animate-float-slow" label="Twin accuracy" value="98.7%" trend="+0.4%" style={{ animationDelay: "1.2s" }} />
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4"
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

        {/* Trusted by */}
        <div className="mt-16">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground text-center">Trusted by innovators</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-70">
            {TRUSTED.map((b) => (
              <span key={b} className="text-sm font-semibold tracking-[0.2em] text-foreground/70 hover:text-foreground transition-colors">{b}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingStat({ label, value, trend, className = "", style }: { label: string; value: string; trend: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`glass rounded-xl px-3.5 py-2.5 shadow-xl shadow-black/20 ${className}`} style={style}>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-sm font-semibold text-foreground">{value}</p>
        <span className="text-[10px] text-emerald-500">{trend}</span>
      </div>
    </div>
  );
}