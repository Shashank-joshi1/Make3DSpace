import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ThemeSwitcher } from "./theme-switcher";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/environments", label: "Environments" },
  { to: "/industries", label: "Industries" },
  { to: "/builder", label: "Builder" },
  { to: "/analytics", label: "Analytics" },
  { to: "/ai-tools", label: "AI Tools" },
  { to: "/docs", label: "Docs" },
  { to: "/pricing", label: "Pricing" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav className={`flex items-center gap-2 rounded-2xl px-3 sm:px-4 py-2 transition-all duration-500 ${scrolled ? "glass shadow-lg shadow-black/5" : "bg-transparent"}`}>
          <Link to="/" className="flex items-center gap-2 pl-1 pr-3">
            <span className="relative h-7 w-7 grid place-items-center rounded-lg bg-gradient-to-br from-primary to-accent-glow shadow-lg shadow-primary/30">
              <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-accent-glow blur-md opacity-60 -z-10" />
              <span className="h-2 w-2 rounded-sm bg-background/90 rotate-45" />
            </span>
            <span className="font-semibold tracking-tight text-foreground">
              Make<span className="text-gradient">3D</span>Space
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-1 ml-2">
            {NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="relative group px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    activeProps={{ className: "text-foreground" }}
                    activeOptions={{ exact: true }}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-foreground/5"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="absolute left-3 right-3 -bottom-0.5 h-px scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 bg-gradient-to-r from-primary to-accent-glow" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/builder"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-all hover:gap-2"
            >
              Start Building
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <ThemeSwitcher />
            <button
              className="lg:hidden h-10 w-10 grid place-items-center rounded-full glass"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              <div className="flex flex-col gap-1">
                <span className={`h-px w-4 bg-foreground transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
                <span className={`h-px w-4 bg-foreground transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
              </div>
            </button>
          </div>
        </nav>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden mt-2 rounded-2xl glass p-3 grid gap-1"
          >
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-foreground/80 hover:bg-foreground/5"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </header>
  );
}