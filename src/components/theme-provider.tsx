import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme =
  | "pre-dawn"
  | "sunrise"
  | "daytime"
  | "dusk"
  | "sunset"
  | "night"
  | "dark";

export const THEMES: { value: Theme; label: string }[] = [
  { value: "pre-dawn", label: "Pre-dawn" },
  { value: "sunrise", label: "Sunrise" },
  { value: "daytime", label: "Daytime" },
  { value: "dusk", label: "Dusk" },
  { value: "sunset", label: "Sunset" },
  { value: "night", label: "Night" },
  { value: "dark", label: "Dark Mode" },
];

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx>({ theme: "night", setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("night");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("m3s-theme")) as Theme | null;
    if (saved) setThemeState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try { localStorage.setItem("m3s-theme", t); } catch {}
  };

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);