import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { AnalyticsPreview } from "@/components/home-sections";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, Zap, Users, Cpu, TrendingUp, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Make3DSpace" },
      { name: "description", content: "Stripe-style live analytics for digital twins: occupancy, energy, system health, and real-time anomaly detection." },
      { property: "og:title", content: "Analytics — Make3DSpace" },
      { property: "og:description", content: "Live, spatial analytics for digital twins." },
    ],
  }),
  component: AnalyticsPage,
});

function useTicker(seed: number, range = 0.04) {
  const [v, setV] = useState(seed);
  useEffect(() => {
    const id = setInterval(() => setV((p) => Math.max(0, p * (1 + (Math.random() - 0.5) * range))), 1600);
    return () => clearInterval(id);
  }, [range]);
  return v;
}

function AnalyticsPage() {
  const occ = useTicker(0.82);
  const energy = useTicker(412);
  const users = useTicker(2418);
  const cpu = useTicker(46);

  const tiles = [
    { label: "Occupancy", value: `${Math.round(occ * 100)}%`, icon: Activity, trend: "+2.1%", up: true },
    { label: "Energy", value: `${Math.round(energy)} kW`, icon: Zap, trend: "−4.3%", up: false },
    { label: "Active users", value: Math.round(users).toLocaleString(), icon: Users, trend: "+12%", up: true },
    { label: "System load", value: `${Math.round(cpu)}%`, icon: Cpu, trend: "+0.4%", up: true },
  ];

  const statuses = [
    { name: "Reconstruction service", status: "Operational", dot: "bg-emerald-500" },
    { name: "Telemetry stream", status: "Operational", dot: "bg-emerald-500" },
    { name: "Render pipeline", status: "Degraded", dot: "bg-amber-500" },
    { name: "API gateway", status: "Operational", dot: "bg-emerald-500" },
    { name: "Multiplayer sync", status: "Operational", dot: "bg-emerald-500" },
  ];

  return (
    <PageShell
      eyebrow="Analytics"
      title={<>Every node, <span className="text-gradient" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}>in real time.</span></>}
      subtitle="A unified cockpit for the operational signals living inside every twin — composed as live nodes, flows, and anomaly graphs."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tiles.map((t, i) => (
          <motion.div key={t.label}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="rounded-2xl glass p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[10px] uppercase tracking-widest">{t.label}</span>
              <t.icon className="h-3.5 w-3.5" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-3xl font-semibold tracking-tight tabular-nums">{t.value}</p>
              <span className={`text-xs inline-flex items-center gap-0.5 ${t.up ? "text-emerald-500" : "text-rose-500"}`}>
                {t.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{t.trend}
              </span>
            </div>
            <div className="mt-3 h-1 rounded-full bg-foreground/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent-glow animate-shimmer" style={{ width: `${30 + (i * 17) % 60}%` }} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AnalyticsPreview />
        </div>
        <div className="rounded-2xl glass p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">System status</p>
          <ul className="mt-4 space-y-3 text-sm">
            {statuses.map((s) => (
              <li key={s.name} className="flex items-center justify-between">
                <span className="text-foreground/85">{s.name}</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot} animate-pulse-glow`} />
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}