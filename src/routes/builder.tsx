import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Upload, Image as ImageIcon, Video, Building2, Box, Sparkles, CheckCircle2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "AI Builder — Make3DSpace" },
      { name: "description", content: "Upload a room image, floor plan, or short video and generate an editable 3D digital twin with AI." },
      { property: "og:title", content: "AI Builder — Make3DSpace" },
      { property: "og:description", content: "Image-to-3D AI reconstruction in minutes." },
    ],
  }),
  component: BuilderPage,
});

type Stage = "idle" | "scanning" | "reconstructing" | "texturing" | "ready";

const PIPELINE: { id: Stage; label: string }[] = [
  { id: "scanning", label: "Parsing geometry" },
  { id: "reconstructing", label: "Reconstructing 3D mesh" },
  { id: "texturing", label: "Synthesizing materials & lighting" },
  { id: "ready", label: "Twin ready" },
];

const PRESETS = [
  { icon: ImageIcon, label: "Room photo" },
  { icon: Building2, label: "Floor plan" },
  { icon: Video, label: "Walkthrough video" },
  { icon: Box, label: "Mall / campus" },
];

function BuilderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const start = (f: File) => {
    setFile(f);
    setStage("scanning");
    setTimeout(() => setStage("reconstructing"), 1300);
    setTimeout(() => setStage("texturing"), 2900);
    setTimeout(() => setStage("ready"), 4500);
  };

  const onPick = () => inputRef.current?.click();

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) start(f);
  };

  const reset = () => { setFile(null); setStage("idle"); };

  return (
    <PageShell
      eyebrow="AI Builder"
      title={<>From image, to <span className="text-gradient" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}>living twin.</span></>}
      subtitle="Upload a single photo, a floor plan, or a short walkthrough video. Our spatial models reconstruct a fully editable 3D environment in minutes."
    >
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div
            onClick={onPick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="group relative rounded-2xl border-2 border-dashed border-border hover:border-accent-glow/60 bg-surface p-8 cursor-pointer transition-colors"
          >
            <input
              ref={inputRef} type="file" hidden
              accept="image/*,video/*,.pdf"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) start(f); }}
            />
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 grid place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent-glow text-primary-foreground shadow-lg shadow-primary/30">
                <Upload className="h-5 w-5" />
              </div>
              <p className="mt-4 font-medium">Drop a space here</p>
              <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, MP4, PDF · up to 2GB</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button key={p.label} onClick={onPick} className="rounded-xl glass p-3 text-left hover:bg-foreground/5 transition-colors">
                <p.icon className="h-4 w-4 text-foreground/70" />
                <p className="mt-3 text-sm font-medium">{p.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="relative rounded-2xl glass overflow-hidden min-h-[420px]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-accent-glow" />
                <p className="text-sm font-medium">AI reconstruction</p>
              </div>
              {stage !== "idle" && (
                <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground">Reset</button>
              )}
            </div>

            <div className="relative h-[420px] grid place-items-center overflow-hidden">
              {/* grid backdrop */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }} />
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, color-mix(in oklch, var(--accent-glow) 18%, transparent), transparent 60%)" }} />

              <AnimatePresence mode="wait">
                {stage === "idle" && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative text-center px-8">
                    <div className="mx-auto h-20 w-20 rounded-2xl bg-foreground/5 border border-border grid place-items-center animate-float-slow">
                      <Box className="h-8 w-8 text-foreground/40" />
                    </div>
                    <p className="mt-5 text-sm text-muted-foreground max-w-sm mx-auto">Drop a file or pick a preset. Your generated twin will materialize here.</p>
                  </motion.div>
                )}
                {stage !== "idle" && stage !== "ready" && (
                  <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full px-8">
                    <Wireframe pulse />
                    <div className="mt-8 max-w-md mx-auto space-y-2">
                      {PIPELINE.map((step) => {
                        const done = PIPELINE.findIndex((s) => s.id === step.id) < PIPELINE.findIndex((s) => s.id === stage);
                        const active = step.id === stage;
                        return (
                          <div key={step.id} className="flex items-center gap-3 text-sm">
                            {done ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : active ? <Loader2 className="h-4 w-4 animate-spin text-accent-glow" /> : <span className="h-4 w-4 rounded-full border border-border" />}
                            <span className={active ? "text-foreground" : done ? "text-muted-foreground line-through" : "text-muted-foreground"}>{step.label}</span>
                            {active && <span className="flex-1 h-px animate-shimmer rounded" />}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
                {stage === "ready" && (
                  <motion.div key="ready" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative text-center w-full px-8">
                    <Wireframe />
                    <p className="mt-6 inline-flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Twin generated from <span className="text-foreground font-medium">{file?.name ?? "your file"}</span>
                    </p>
                    <div className="mt-4 flex justify-center gap-2">
                      <button className="rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium">Open in editor</button>
                      <button className="rounded-full glass px-5 py-2 text-sm">Download .glb</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Wireframe({ pulse = false }: { pulse?: boolean }) {
  return (
    <svg viewBox="0 0 400 200" className="mx-auto w-full max-w-md">
      <defs>
        <linearGradient id="wf" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--accent-glow)" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#wf)" strokeWidth="0.8" opacity="0.9" className={pulse ? "animate-pulse-glow" : ""}>
        {/* base grid */}
        <polygon points="80,160 200,200 320,160 200,120" />
        <polygon points="80,160 200,200 200,120" opacity="0.5" />
        {/* buildings */}
        <polygon points="140,140 180,150 180,90 140,80" />
        <polygon points="180,150 220,140 220,80 180,90" opacity="0.85" />
        <polygon points="140,80 180,90 220,80 180,70" />
        <polygon points="220,140 260,130 260,70 220,80" />
        <polygon points="220,80 260,70 240,60 200,70" opacity="0.8" />
      </g>
      <g fill="var(--accent-glow)">
        <circle cx="80" cy="160" r="2" />
        <circle cx="200" cy="200" r="2" />
        <circle cx="320" cy="160" r="2" />
        <circle cx="200" cy="120" r="2" />
      </g>
    </svg>
  );
}