import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Upload, Image as ImageIcon, Video, Map as MapIcon, Plane, Layers as LayersIcon,
  Building2, Home, Briefcase, ShoppingBag, GraduationCap, Stethoscope, Warehouse, Sparkles,
  CheckCircle2, Loader2, RotateCcw, Download, Play, Pause, ArrowUpRight, FileText, X,
} from "lucide-react";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "AI Builder — Make3DSpace" },
      { name: "description", content: "Pick a category, upload photos, video, plans or drone footage — Make3DSpace fuses them into an interactive 3D twin." },
      { property: "og:title", content: "AI Builder — Make3DSpace" },
      { property: "og:description", content: "Multi-source image, video, and floor plan-to-3D reconstruction." },
    ],
  }),
  component: BuilderPage,
});

type Stage = "idle" | "ingesting" | "fusing" | "reconstructing" | "texturing" | "ready";

const PIPELINE: { id: Exclude<Stage, "idle">; label: string }[] = [
  { id: "ingesting", label: "Ingesting media" },
  { id: "fusing", label: "Fusing photos, video & plans" },
  { id: "reconstructing", label: "Reconstructing 3D mesh" },
  { id: "texturing", label: "Synthesizing materials & lighting" },
  { id: "ready", label: "Twin ready" },
];

type CatId = "home" | "room" | "office" | "mall" | "campus" | "hospital" | "warehouse" | "custom";

const CATEGORIES: { id: CatId; label: string; icon: React.ComponentType<{ className?: string }>; hint: string }[] = [
  { id: "home", label: "Home", icon: Home, hint: "Multi-room residential" },
  { id: "room", label: "Room", icon: LayersIcon, hint: "Single interior space" },
  { id: "office", label: "Office", icon: Briefcase, hint: "Workspaces & floors" },
  { id: "mall", label: "Mall", icon: ShoppingBag, hint: "Retail floors & atrium" },
  { id: "campus", label: "Campus", icon: GraduationCap, hint: "Buildings + grounds" },
  { id: "hospital", label: "Hospital", icon: Stethoscope, hint: "Wards & wayfinding" },
  { id: "warehouse", label: "Warehouse", icon: Warehouse, hint: "Aisles & racking" },
  { id: "custom", label: "Custom", icon: Sparkles, hint: "Anything else" },
];

const UPLOAD_TYPES = [
  { id: "photo", label: "Photos", icon: ImageIcon, accept: "image/*", multi: true },
  { id: "video", label: "Video walkthrough", icon: Video, accept: "video/*", multi: false },
  { id: "plan", label: "Floor plan", icon: MapIcon, accept: "image/*,.pdf", multi: false },
  { id: "drone", label: "Drone footage", icon: Plane, accept: "video/*", multi: false },
] as const;

type UploadKind = typeof UPLOAD_TYPES[number]["id"];
type Uploaded = { kind: UploadKind; name: string; size: number };

function BuilderPage() {
  const [category, setCategory] = useState<CatId>("campus");
  const [files, setFiles] = useState<Uploaded[]>([]);
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const timers = useRef<number[]>([]);
  const fileInputs = useRef<Record<UploadKind, HTMLInputElement | null>>({ photo: null, video: null, plan: null, drone: null });
  const dropInput = useRef<HTMLInputElement | null>(null);

  const onPick = (kind: UploadKind) => fileInputs.current[kind]?.click();

  const addFiles = (kind: UploadKind, list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).map((f) => ({ kind, name: f.name, size: f.size }));
    setFiles((prev) => [...prev, ...next]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const list = e.dataTransfer.files;
    if (!list || !list.length) return;
    const next = Array.from(list).map((f) => ({
      kind: (f.type.startsWith("video/") ? "video" : "photo") as UploadKind,
      name: f.name,
      size: f.size,
    }));
    setFiles((prev) => [...prev, ...next]);
  };

  const reset = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setFiles([]); setStage("idle"); setProgress(0);
  };

  const start = () => {
    if (files.length === 0) return;
    setStage("ingesting"); setProgress(0);
    const steps: Stage[] = ["fusing", "reconstructing", "texturing", "ready"];
    const t0 = window.setInterval(() => setProgress((p) => Math.min(99, p + Math.random() * 4 + 1)), 80);
    timers.current.push(t0);
    steps.forEach((s, i) => {
      const id = window.setTimeout(() => { setStage(s); if (s === "ready") { window.clearInterval(t0); setProgress(100); } }, 1400 * (i + 1));
      timers.current.push(id);
    });
  };

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const seed = useMemo(() => hash(category + files.map((f) => f.name + f.size).join("|")), [category, files]);

  return (
    <PageShell
      eyebrow="AI Builder"
      title={<>From your media, to a <span className="text-gradient" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}>living twin.</span></>}
      subtitle="Pick a category, drop in photos, walkthrough video, drone footage or a floor plan. Make3DSpace fuses every signal into a fully interactive 3D environment."
    >
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left rail */}
        <div className="lg:col-span-2 space-y-6">
          <Panel title="1 · Category">
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => {
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`group relative text-left rounded-xl p-3 border transition-all ${
                      active ? "border-accent-glow/70 bg-foreground/[0.04] shadow-lg shadow-primary/10" : "border-border/60 hover:border-foreground/30 hover:bg-foreground/[0.02]"
                    }`}
                  >
                    <c.icon className={`h-4 w-4 ${active ? "text-accent-glow" : "text-foreground/60"}`} />
                    <p className="mt-2.5 text-sm font-medium">{c.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{c.hint}</p>
                    {active && <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-accent-glow animate-pulse-glow" />}
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel title="2 · Add media">
            <div className="grid grid-cols-2 gap-2">
              {UPLOAD_TYPES.map((u) => (
                <div key={u.id}>
                  <input
                    ref={(el) => { fileInputs.current[u.id] = el; }}
                    type="file" hidden accept={u.accept} multiple={u.multi}
                    onChange={(e) => addFiles(u.id, e.target.files)}
                  />
                  <button onClick={() => onPick(u.id)} className="w-full rounded-xl border border-dashed border-border/70 hover:border-accent-glow/60 hover:bg-foreground/[0.02] p-3 text-left transition-colors">
                    <u.icon className="h-4 w-4 text-foreground/70" />
                    <p className="mt-2.5 text-sm font-medium">{u.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{u.multi ? "Multiple files OK" : "Single file"}</p>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1.5 max-h-44 overflow-auto pr-1">
              {files.length === 0 && <p className="text-xs text-muted-foreground">No media yet. Mix photos, video, plans or drone footage — AI fuses all of it.</p>}
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-foreground/[0.04] px-2.5 py-1.5 text-xs">
                  <FileText className="h-3.5 w-3.5 text-foreground/60" />
                  <span className="truncate flex-1">{f.name}</span>
                  <span className="text-muted-foreground tabular-nums">{(f.size / 1024).toFixed(0)} KB</span>
                  <button onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                </div>
              ))}
            </div>

            <button
              disabled={!files.length || (stage !== "idle" && stage !== "ready")}
              onClick={stage === "ready" ? reset : start}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {stage === "ready" ? <><RotateCcw className="h-3.5 w-3.5" /> Start over</> : <><Sparkles className="h-3.5 w-3.5" /> Generate 3D Twin</>}
            </button>
          </Panel>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-3">
          <div className="relative rounded-2xl glass overflow-hidden min-h-[560px] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-accent-glow" />
                <p className="text-sm font-medium">AI reconstruction · <span className="text-muted-foreground capitalize">{category}</span></p>
              </div>
              {stage !== "idle" && stage !== "ready" && (
                <span className="text-xs text-muted-foreground tabular-nums">{Math.round(progress)}%</span>
              )}
              {stage === "ready" && <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-glow" /> live</span>}
            </div>

            <div className="relative flex-1 grid place-items-center overflow-hidden">
              <SceneBackdrop />
              <input
                ref={dropInput}
                type="file" hidden accept="image/*,video/*" multiple
                onChange={(e) => addFiles("photo", e.target.files)}
              />
              <AnimatePresence mode="wait">
                {stage === "idle" && <IdleHint key="idle" onPick={() => dropInput.current?.click()} onDrop={onDrop} />}
                {stage !== "idle" && stage !== "ready" && (
                  <ProcessingView key="proc" stage={stage} progress={progress} seed={seed} category={category} />
                )}
                {stage === "ready" && (
                  <ReadyView key="ready" seed={seed} category={category} files={files} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl glass p-5">
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function SceneBackdrop() {
  return (
    <>
      <div className="absolute inset-0 opacity-25" style={{
        backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, color-mix(in oklch, var(--accent-glow) 14%, transparent), transparent 65%)" }} />
    </>
  );
}

function IdleHint({ onPick, onDrop }: { onPick: () => void; onDrop: (e: React.DragEvent) => void }) {
  const [over, setOver] = useState(false);
  return (
    <motion.button
      type="button"
      onClick={onPick}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { setOver(false); onDrop(e); }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className={`relative text-center px-10 py-10 rounded-2xl border border-dashed transition-all ${
        over ? "border-accent-glow/80 bg-foreground/[0.06] scale-[1.02]" : "border-border/70 hover:border-accent-glow/60 hover:bg-foreground/[0.03]"
      }`}
    >
      <div className="mx-auto h-20 w-20 rounded-2xl bg-foreground/5 border border-border grid place-items-center animate-float-slow">
        <Upload className="h-8 w-8 text-foreground/60" />
      </div>
      <p className="mt-5 text-sm text-foreground font-medium">Click to upload, or drop media here</p>
      <p className="mt-1.5 text-xs text-muted-foreground max-w-sm mx-auto">Photos, walkthrough video, drone footage or floor plans — fused into one twin.</p>
    </motion.button>
  );
}

function ProcessingView({ stage, progress, seed, category }: { stage: Stage; progress: number; seed: number; category: CatId }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full px-8">
      <Scene3D seed={seed} category={category} pulse />
      <div className="mt-6 max-w-md mx-auto space-y-2">
        {PIPELINE.map((step) => {
          const idx = PIPELINE.findIndex((s) => s.id === step.id);
          const cur = PIPELINE.findIndex((s) => s.id === stage);
          const done = idx < cur; const active = step.id === stage;
          return (
            <div key={step.id} className="flex items-center gap-3 text-sm">
              {done ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : active ? <Loader2 className="h-4 w-4 animate-spin text-accent-glow" /> : <span className="h-4 w-4 rounded-full border border-border" />}
              <span className={active ? "text-foreground" : done ? "text-muted-foreground" : "text-muted-foreground"}>{step.label}</span>
              {active && (
                <div className="flex-1 h-1 rounded-full bg-foreground/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent-glow transition-[width]" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function ReadyView({ seed, category, files }: { seed: number; category: CatId; files: Uploaded[] }) {
  const [autoRotate, setAutoRotate] = useState(true);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full h-full px-6 py-5 flex flex-col">
      <Scene3D seed={seed} category={category} interactive autoRotate={autoRotate} />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          Twin generated from <span className="text-foreground font-medium">{files.length} source{files.length === 1 ? "" : "s"}</span>
          <span>· drag to orbit · scroll to zoom</span>
        </div>
        <button onClick={() => setAutoRotate((a) => !a)} className="inline-flex items-center gap-1.5 text-xs rounded-full glass px-3 py-1.5 hover:bg-foreground/10">
          {autoRotate ? <><Pause className="h-3 w-3" /> Pause</> : <><Play className="h-3 w-3" /> Auto-rotate</>}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90">
          Open in Editor <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
        <DownloadBtn label="Download .glb" filename={`${category}-${seed.toString(16)}.glb`} />
        <DownloadBtn label="Download .obj" filename={`${category}-${seed.toString(16)}.obj`} />
        <DownloadBtn label="Walkthrough .mp4" filename={`${category}-${seed.toString(16)}.mp4`} icon={<Video className="h-3.5 w-3.5" />} />
      </div>
    </motion.div>
  );
}

function DownloadBtn({ label, filename, icon }: { label: string; filename: string; icon?: React.ReactNode }) {
  const onClick = () => {
    const blob = new Blob([`Make3DSpace export · ${filename}\nGenerated ${new Date().toISOString()}\n`], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-sm hover:bg-foreground/10">
      {icon ?? <Download className="h-3.5 w-3.5" />} {label}
    </button>
  );
}

/* ------------------ Procedural 3D scene (drag-to-orbit, varies per category & seed) ------------------ */

function Scene3D({ seed, category, pulse, interactive, autoRotate = false }: {
  seed: number; category: CatId; pulse?: boolean; interactive?: boolean; autoRotate?: boolean;
}) {
  const blocks = useMemo(() => buildBlocks(seed, category), [seed, category]);
  const [yaw, setYaw] = useState(-28);
  const [pitch, setPitch] = useState(-22);
  const [zoom, setZoom] = useState(1);
  const dragging = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!autoRotate) return;
    let raf = 0; let last = performance.now();
    const tick = (t: number) => { const dt = t - last; last = t; setYaw((y) => y - dt * 0.012); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoRotate]);

  return (
    <div
      className={`relative mx-auto w-full max-w-2xl aspect-[4/3] ${interactive ? "cursor-grab active:cursor-grabbing" : ""}`}
      onPointerDown={(e) => { if (!interactive) return; dragging.current = { x: e.clientX, y: e.clientY }; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); }}
      onPointerMove={(e) => {
        if (!interactive || !dragging.current) return;
        const dx = e.clientX - dragging.current.x; const dy = e.clientY - dragging.current.y;
        dragging.current = { x: e.clientX, y: e.clientY };
        setYaw((v) => v + dx * 0.4); setPitch((v) => Math.max(-65, Math.min(-5, v - dy * 0.3)));
      }}
      onPointerUp={() => { dragging.current = null; }}
      onWheel={(e) => { if (!interactive) return; e.preventDefault(); setZoom((z) => Math.max(0.6, Math.min(1.8, z - e.deltaY * 0.001))); }}
      style={{ perspective: 1200 }}
    >
      <div
        className="absolute inset-0 grid place-items-center"
        style={{ transformStyle: "preserve-3d", transform: `scale(${zoom}) rotateX(${pitch}deg) rotateY(${yaw}deg)`, transition: dragging.current ? "none" : "transform 120ms linear" }}
      >
        {/* ground plate */}
        <div
          className={pulse ? "animate-pulse-glow" : ""}
          style={{
            position: "absolute", width: 420, height: 420, transform: "rotateX(90deg) translateZ(0)", transformStyle: "preserve-3d",
            background:
              "linear-gradient(color-mix(in oklch, var(--accent-glow) 18%, transparent), transparent), repeating-linear-gradient(0deg, color-mix(in oklch, var(--border) 80%, transparent) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, color-mix(in oklch, var(--border) 80%, transparent) 0 1px, transparent 1px 32px)",
            borderRadius: 6,
            boxShadow: "0 0 80px color-mix(in oklch, var(--accent-glow) 25%, transparent)",
          }}
        />
        {blocks.map((b, i) => (
          <Cube key={i} {...b} pulse={pulse} />
        ))}
      </div>
    </div>
  );
}

type Block = { x: number; z: number; w: number; d: number; h: number; hue: number };

function Cube({ x, z, w, d, h, hue, pulse }: Block & { pulse?: boolean }) {
  const c = `oklch(0.6 0.16 ${hue})`;
  const cTop = `oklch(0.75 0.18 ${hue})`;
  const cDark = `oklch(0.42 0.14 ${hue})`;
  const half = { w: w / 2, d: d / 2 };
  return (
    <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: `translate3d(${x}px, ${-h / 2}px, ${z}px)` }}>
      {/* faces */}
      <Face style={{ width: w, height: h, background: c, transform: `translate3d(${-half.w}px, ${-h / 2}px, ${half.d}px)`, boxShadow: pulse ? `0 0 20px ${c}` : undefined }} />
      <Face style={{ width: w, height: h, background: cDark, transform: `translate3d(${-half.w}px, ${-h / 2}px, ${-half.d}px) rotateY(180deg)` }} />
      <Face style={{ width: d, height: h, background: cDark, transform: `translate3d(${-half.w}px, ${-h / 2}px, 0) rotateY(-90deg) translateZ(${half.d}px)` }} />
      <Face style={{ width: d, height: h, background: c, transform: `translate3d(${half.w}px, ${-h / 2}px, 0) rotateY(90deg) translateZ(${half.d}px)` }} />
      <Face style={{ width: w, height: d, background: cTop, transform: `translate3d(${-half.w}px, ${-h}px, ${-half.d}px) rotateX(-90deg) translateZ(${-d}px)` }} />
    </div>
  );
}

function Face({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", border: "1px solid color-mix(in oklch, black 30%, transparent)", ...style }} />;
}

function buildBlocks(seed: number, category: CatId): Block[] {
  const rng = mulberry32(seed);
  const blocks: Block[] = [];
  const cfg = CAT_CONFIG[category];
  const cells = cfg.cells;
  const cell = 40;
  for (let i = 0; i < cells; i++) {
    const gx = Math.floor(rng() * cfg.grid) - Math.floor(cfg.grid / 2);
    const gz = Math.floor(rng() * cfg.grid) - Math.floor(cfg.grid / 2);
    const w = cfg.w[0] + Math.floor(rng() * (cfg.w[1] - cfg.w[0] + 1));
    const d = cfg.w[0] + Math.floor(rng() * (cfg.w[1] - cfg.w[0] + 1));
    const h = cfg.h[0] + Math.floor(rng() * (cfg.h[1] - cfg.h[0] + 1));
    const hue = cfg.hue + (rng() * cfg.hueSpread - cfg.hueSpread / 2);
    blocks.push({ x: gx * cell, z: gz * cell, w: w * cell * 0.8, d: d * cell * 0.8, h: h * 14, hue });
  }
  return blocks;
}

const CAT_CONFIG: Record<CatId, { cells: number; grid: number; w: [number, number]; h: [number, number]; hue: number; hueSpread: number }> = {
  home:      { cells: 6,  grid: 4, w: [1, 2], h: [2, 4], hue: 60,  hueSpread: 20 },
  room:      { cells: 4,  grid: 3, w: [1, 2], h: [2, 3], hue: 30,  hueSpread: 14 },
  office:    { cells: 9,  grid: 5, w: [1, 2], h: [3, 8], hue: 230, hueSpread: 25 },
  mall:      { cells: 7,  grid: 5, w: [2, 3], h: [2, 5], hue: 320, hueSpread: 30 },
  campus:    { cells: 12, grid: 6, w: [1, 3], h: [2, 6], hue: 150, hueSpread: 60 },
  hospital:  { cells: 8,  grid: 5, w: [2, 3], h: [3, 7], hue: 200, hueSpread: 18 },
  warehouse: { cells: 10, grid: 4, w: [2, 4], h: [2, 3], hue: 20,  hueSpread: 12 },
  custom:    { cells: 10, grid: 6, w: [1, 3], h: [2, 8], hue: 280, hueSpread: 90 },
};

function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0 || 1;
}
