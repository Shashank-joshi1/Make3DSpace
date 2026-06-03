import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Activity, Boxes, Building2, Cpu, Layers, LineChart, Radio, ScanLine, ShieldCheck, Sparkles, Zap, ArrowRight } from "lucide-react";

export function FeatureGrid() {
  const items = [
    { icon: ScanLine, title: "Image-to-3D AI", body: "Upload a photo, floor plan, or short walkthrough video. Our diffusion + Gaussian splatting pipeline reconstructs an editable twin in minutes." },
    { icon: Layers, title: "Real-time telemetry", body: "Stream occupancy, energy, and IoT data straight into the twin. See the building breathe with glowing overlays and node graphs." },
    { icon: Cpu, title: "Spatial AI agents", body: "Deploy copilots that reason about routing, capacity, and safety inside your space — grounded in real geometry, not screenshots." },
    { icon: ShieldCheck, title: "Enterprise-grade", body: "SSO, audit logs, regional residency, and on-prem deployment. Built to ship in regulated industries from day one." },
    { icon: Radio, title: "Live collaboration", body: "Multiplayer cursors, annotations, and review sessions inside the twin. Your whole org explores the same space at the same time." },
    { icon: Boxes, title: "Modular SDK", body: "TypeScript, Python, and Unreal/Unity bridges. Embed any view, build custom panels, and pipe data wherever it needs to go." },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-32">
      <SectionHead eyebrow="Platform" title={<>Built like infrastructure. <span className="text-muted-foreground">Feels like magic.</span></>} />
      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 rounded-3xl overflow-hidden border border-border/60">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className="group bg-background p-7 hover:bg-surface transition-colors"
          >
            <div className="h-10 w-10 rounded-xl grid place-items-center bg-gradient-to-br from-primary/20 to-accent-glow/20 border border-border/80 text-foreground group-hover:from-primary/30 group-hover:to-accent-glow/30 transition-colors">
              <it.icon className="h-4.5 w-4.5" />
            </div>
            <h3 className="mt-5 text-base font-semibold tracking-tight">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function LiveAnalyticsBlock() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHead align="left" eyebrow="Analytics" title={<>One twin. <span className="text-gradient">Every signal.</span></>} />
          <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
            Energy, footfall, equipment health, dwell time — composed as live nodes and glowing graphs you can interrogate at any zoom level.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link to="/analytics" className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity">
              Open analytics
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Read the spec →</Link>
          </div>
        </div>
        <div className="relative">
          <AnalyticsPreview />
        </div>
      </div>
    </section>
  );
}

export function AnalyticsPreview() {
  return (
    <div className="relative rounded-3xl glass p-6 overflow-hidden">
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-primary/30 to-accent-glow/30 blur-3xl opacity-60" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LineChart className="h-4 w-4 text-foreground/70" />
          <p className="text-sm font-medium">Eastwood Campus · live</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-glow" /> streaming
        </span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { label: "Occupancy", value: "82%", icon: Activity },
          { label: "Energy", value: "412 kW", icon: Zap },
          { label: "Anomalies", value: "3", icon: Sparkles },
        ].map((m) => (
          <div key={m.label} className="rounded-xl bg-foreground/5 p-3 border border-border/50">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[10px] uppercase tracking-widest">{m.label}</span>
              <m.icon className="h-3 w-3" />
            </div>
            <p className="text-lg font-semibold mt-1">{m.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 h-44 relative">
        <Sparkline />
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => {
          const h = 30 + Math.round(Math.sin(i * 1.3) * 20 + 35);
          return (
            <div key={i} className="rounded-md bg-gradient-to-t from-primary/30 to-accent-glow/60" style={{ height: `${h}px` }} />
          );
        })}
      </div>
    </div>
  );
}

function Sparkline() {
  const points = Array.from({ length: 40 }, (_, i) => {
    const x = (i / 39) * 100;
    const y = 50 - Math.sin(i / 3) * 18 - Math.cos(i / 5) * 10;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 80" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--accent-glow)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--accent-glow)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`${points} 100,80 0,80`} fill="url(#g1)" />
      <polyline points={points} fill="none" stroke="var(--accent-glow)" strokeWidth="0.6" />
      {Array.from({ length: 8 }).map((_, i) => {
        const x = (i / 7) * 100;
        const y = 50 - Math.sin(i / 1.5) * 16;
        return <circle key={i} cx={x} cy={y} r="0.8" fill="var(--accent-glow)" />;
      })}
    </svg>
  );
}

export function IndustriesStrip() {
  const items = [
    "Smart Cities", "Healthcare", "Logistics", "Retail", "Education", "Manufacturing", "Architecture", "Hospitality",
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      <SectionHead eyebrow="Industries" title={<>Built for every operator. <span className="text-muted-foreground">From hospitals to ports.</span></>} />
      <div className="mt-10 flex flex-wrap gap-2 justify-center">
        {items.map((i) => (
          <Link key={i} to="/industries" className="px-4 py-2 rounded-full glass text-sm hover:bg-foreground/5 transition-colors">
            <Building2 className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5 text-muted-foreground" />
            {i}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CTABlock() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-32">
      <div className="relative rounded-[2rem] overflow-hidden border border-border/60 bg-gradient-to-br from-surface to-background p-12 lg:p-20 text-center">
        <div className="absolute inset-0 -z-10 opacity-70" style={{ background: "radial-gradient(ellipse at center, color-mix(in oklch, var(--accent-glow) 30%, transparent), transparent 65%)" }} />
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Start in minutes</p>
        <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
          Your space, <span className="text-gradient" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}>made spatial.</span>
        </h2>
        <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
          Upload a floor plan or short video. We'll return a fully editable, telemetry-ready 3D twin.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/builder" className="rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity">Start Building</Link>
          <Link to="/pricing" className="rounded-full glass px-6 py-3 text-sm font-medium hover:bg-foreground/5 transition-colors">See pricing</Link>
        </div>
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, align = "center" }: { eyebrow: string; title: React.ReactNode; align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{eyebrow}</p>
      <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground max-w-3xl mx-auto">
        {title}
      </h2>
    </div>
  );
}