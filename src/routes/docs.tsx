import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { BookOpen, Code2, Cpu, Rocket, Shield, Workflow } from "lucide-react";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Docs — Make3DSpace" },
      { name: "description", content: "Documentation, SDKs, and API reference for the Make3DSpace digital twin platform." },
      { property: "og:title", content: "Docs — Make3DSpace" },
      { property: "og:description", content: "Build with the Make3DSpace SDKs and APIs." },
    ],
  }),
  component: DocsPage,
});

const SECTIONS = [
  { icon: Rocket, title: "Quickstart", body: "Spin up your first twin in 5 minutes — from upload to interactive scene." },
  { icon: Code2, title: "SDKs", body: "TypeScript, Python, Unreal and Unity bridges with first-class typings." },
  { icon: Workflow, title: "Agents API", body: "Compose spatial copilots, tool calls, and memory grounded in geometry." },
  { icon: Cpu, title: "Real-time data", body: "Stream telemetry from BMS, IoT and custom sources into any twin." },
  { icon: Shield, title: "Enterprise & security", body: "SSO, SCIM, audit logs, regional residency, and on-prem deployment." },
  { icon: BookOpen, title: "Guides", body: "Patterns for hospitals, campuses, malls, factories and smart cities." },
];

function DocsPage() {
  return (
    <PageShell
      eyebrow="Documentation"
      title={<>Build with <span className="text-gradient" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}>Make3DSpace.</span></>}
      subtitle="Everything you need to ship spatial software — from the first upload to a multi-region production deployment."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((s) => (
          <a key={s.title} href="#" onClick={(e) => e.preventDefault()} className="group rounded-2xl border border-border/70 bg-surface p-6 hover:border-foreground/30 transition-all">
            <div className="h-10 w-10 grid place-items-center rounded-xl bg-foreground/5 border border-border">
              <s.icon className="h-4 w-4" />
            </div>
            <h3 className="mt-5 font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </a>
        ))}
      </div>
    </PageShell>
  );
}