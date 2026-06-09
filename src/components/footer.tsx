import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin, Youtube, ArrowUpRight } from "lucide-react";

const COLS = [
  {
    title: "Platform",
    links: [
      { label: "Environments", to: "/environments" },
      { label: "Builder", to: "/builder" },
      { label: "Analytics", to: "/analytics" },
      { label: "AI Tools", to: "/ai-tools" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Smart Cities", to: "/industries" },
      { label: "Healthcare", to: "/industries" },
      { label: "Logistics", to: "/industries" },
      { label: "Retail", to: "/industries" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", to: "/docs" },
      { label: "Pricing", to: "/pricing" },
      { label: "Changelog", to: "/docs" },
      { label: "API Reference", to: "/docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/" },
      { label: "Contact", to: "/" },
      { label: "Terms", to: "/" },
      { label: "Privacy", to: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border/60">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent-glow/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2">
              <span className="relative h-7 w-7 grid place-items-center rounded-lg bg-gradient-to-br from-primary to-accent-glow">
                <span className="h-2 w-2 rounded-sm bg-background/90 rotate-45" />
              </span>
              <span className="font-semibold tracking-tight">Make<span className="text-gradient">3D</span>Space</span>
            </div>
            <p className="mt-5 text-sm text-muted-foreground max-w-sm leading-relaxed">
              The AI-powered digital twin platform for turning any space into a living, interactive 3D environment.
            </p>
            <form className="mt-6 flex gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Get product updates"
                className="flex-1 px-4 py-2.5 rounded-full bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              <button className="px-4 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </form>
            <div className="mt-6 flex items-center gap-2">
              {[Twitter, Github, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="h-9 w-9 grid place-items-center rounded-full border border-border hover:border-accent-glow/60 hover:text-foreground text-muted-foreground transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground/80 mb-4">{c.title}</p>
                <ul className="space-y-3">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {l.label}
                        <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Make3DSpace. Built for the spatial era.</p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-glow" />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}