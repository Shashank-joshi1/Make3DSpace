import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Wand2, Box, PlayCircle } from "lucide-react";
import { useEffect } from "react";
import { demoPoster } from "@/assets";

export function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center p-4 sm:p-8"
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
            <div className="relative aspect-video bg-black">
              <img src={demoPoster} alt="Make3DSpace AI demo" className="absolute inset-0 h-full w-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <button
                aria-label="Play demo"
                className="absolute inset-0 grid place-items-center group"
                onClick={() => alert("Cinematic walkthrough plays in production builds.")}
              >
                <span className="relative">
                  <span className="absolute inset-0 rounded-full bg-accent-glow/40 blur-2xl group-hover:bg-accent-glow/60 transition-all" />
                  <PlayCircle className="relative h-20 w-20 text-white drop-shadow-2xl group-hover:scale-110 transition-transform" strokeWidth={1.2} />
                </span>
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs uppercase tracking-[0.25em] text-white/70">Make3DSpace · live walkthrough</p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-semibold text-white tracking-tight">Watch a real space become an interactive twin</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-px bg-border/60">
              {[
                { icon: Upload, label: "Upload", body: "Photos, video, plans" },
                { icon: Wand2, label: "Reconstruct", body: "AI builds the mesh" },
                { icon: Box, label: "Edit", body: "Tweak, light, decorate" },
                { icon: PlayCircle, label: "Operate", body: "Stream live data" },
              ].map((s) => (
                <div key={s.label} className="bg-background p-5">
                  <s.icon className="h-4 w-4 text-accent-glow" />
                  <p className="mt-3 text-sm font-medium">{s.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
