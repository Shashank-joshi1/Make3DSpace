import { useState, useRef, useEffect } from "react";
import { Sun, Sunrise, Sunset, Moon, CloudSun, CloudMoon, Stars } from "lucide-react";
import { useTheme, THEMES, type Theme } from "./theme-provider";
import { motion, AnimatePresence } from "framer-motion";

const ICONS: Record<Theme, React.ComponentType<{ className?: string }>> = {
  "pre-dawn": CloudMoon,
  sunrise: Sunrise,
  daytime: Sun,
  dusk: CloudSun,
  sunset: Sunset,
  night: Moon,
  dark: Stars,
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const Icon = ICONS[theme];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change atmosphere"
        className="h-10 w-10 grid place-items-center rounded-full glass hover:scale-105 transition-transform"
      >
        <Icon className="h-4 w-4 text-foreground" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-48 rounded-2xl glass p-2 z-50 shadow-2xl"
          >
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 pt-1 pb-2">Atmosphere</p>
            {THEMES.map((t) => {
              const I = ICONS[t.value];
              const active = theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => { setTheme(t.value); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${active ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"}`}
                >
                  <I className="h-4 w-4" />
                  <span>{t.label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-glow animate-pulse-glow" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}