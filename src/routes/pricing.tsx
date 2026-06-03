import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Make3DSpace" },
      { name: "description", content: "Simple, transparent pricing for the Make3DSpace digital twin platform — from startups to global enterprises." },
      { property: "og:title", content: "Pricing — Make3DSpace" },
      { property: "og:description", content: "Simple pricing for spatial software." },
    ],
  }),
  component: PricingPage,
});

const TIERS = [
  { name: "Starter", price: "Free", period: "for makers", features: ["1 active twin", "Up to 5k sqft", "Image-to-3D AI", "Community support"], cta: "Start free", highlight: false },
  { name: "Studio", price: "$249", period: "/month", features: ["10 active twins", "Up to 250k sqft", "Live telemetry", "Multiplayer review", "Email support"], cta: "Start Studio", highlight: true },
  { name: "Enterprise", price: "Custom", period: "for orgs", features: ["Unlimited twins", "SSO + SCIM + audit", "On-prem / VPC", "Dedicated SRE", "99.99% SLA"], cta: "Talk to sales", highlight: false },
];

function PricingPage() {
  return (
    <PageShell
      eyebrow="Pricing"
      title={<>Simple pricing. <span className="text-gradient" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}>Real scale.</span></>}
      subtitle="Start free, upgrade when your twin needs to power decisions across the org. Enterprise plans include dedicated deployment."
    >
      <div className="grid lg:grid-cols-3 gap-4">
        {TIERS.map((t) => (
          <div key={t.name} className={`relative rounded-2xl p-7 ${t.highlight ? "bg-foreground text-background" : "glass"}`}>
            {t.highlight && <span className="absolute -top-3 left-7 px-2.5 py-1 rounded-full bg-gradient-to-r from-primary to-accent-glow text-primary-foreground text-[10px] font-medium uppercase tracking-widest">Most popular</span>}
            <p className={`text-sm font-medium ${t.highlight ? "text-background/70" : "text-muted-foreground"}`}>{t.name}</p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">{t.price}</span>
              <span className={`text-sm ${t.highlight ? "text-background/60" : "text-muted-foreground"}`}>{t.period}</span>
            </div>
            <ul className="mt-6 space-y-2.5 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className={`h-4 w-4 ${t.highlight ? "text-background" : "text-emerald-500"}`} /> {f}
                </li>
              ))}
            </ul>
            <Link to="/builder" className={`mt-7 inline-flex w-full justify-center rounded-full px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90 ${t.highlight ? "bg-background text-foreground" : "bg-foreground text-background"}`}>
              {t.cta}
            </Link>
          </div>
        ))}
      </div>
    </PageShell>
  );
}