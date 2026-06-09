import { createFileRoute } from "@tanstack/react-router";

type Msg = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM = `You are the Make3DSpace AI Copilot — a calm, expert spatial-intelligence assistant for an enterprise digital twin platform.

Make3DSpace turns real-world spaces (campuses, malls, hospitals, smart buildings, factories, warehouses, airports, hotels, stadiums, retail, residential) into editable, telemetry-ready 3D twins from photos, video walkthroughs, floor plans and drone footage.

Help users:
- understand how to capture & upload a space (photos, video, plans, drone, point cloud)
- explain the reconstruction pipeline (point cloud → mesh → textured model)
- answer questions about editing, materials, dimensions, exporting (GLB / GLTF / OBJ / FBX)
- reason about live telemetry, occupancy, energy, anomalies, AI agents
- recommend best practices per industry

Be concise (2-5 sentences usually), confident, no fluff. Use markdown sparingly. Never invent pricing.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        let body: { messages?: Msg[] };
        try { body = await request.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
        const history = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
        if (!history.length) return new Response("messages required", { status: 400 });

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            stream: true,
            messages: [{ role: "system", content: SYSTEM }, ...history],
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const text = await upstream.text().catch(() => "");
          return new Response(text || "Upstream error", { status: upstream.status });
        }

        return new Response(upstream.body, {
          status: 200,
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      },
    },
  },
});