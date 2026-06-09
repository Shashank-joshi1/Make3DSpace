import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageShell({ eyebrow, title, subtitle, children }: { eyebrow: string; title: ReactNode; subtitle?: string; children: ReactNode }) {
  return (
    <div className="relative pt-32 pb-24">
      <div className="absolute inset-x-0 top-0 h-[60vh] -z-10 opacity-70 pointer-events-none" style={{
        background: "radial-gradient(ellipse at top, color-mix(in oklch, var(--atmos-2) 35%, transparent), transparent 60%)",
      }} />
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{eyebrow}</p>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] leading-[1.05]">{title}</h1>
          {subtitle && <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">{subtitle}</p>}
        </motion.div>
        <div className="mt-14">{children}</div>
      </div>
    </div>
  );
}