import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Wand2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK = [
  "Turn my office floor plan into a 3D twin",
  "Show energy usage for the campus model",
  "How accurate is image-to-3D reconstruction?",
  "Best practices for hospital digital twins",
];

const REPLIES = [
  "Got it — I'll spin up a fresh twin from your floor plan. Upload a PDF, PNG, or short walkthrough video in the Builder and I'll handle scale, lighting, and asset detection automatically.",
  "On most spaces under 50k sqft, expect a structured twin in under 4 minutes. I align point clouds, infer materials, and rebuild geometry so the result is editable, not a static mesh.",
  "I can stream live occupancy and energy telemetry into the twin. Connect any source — BMS, Modbus, or our REST API — and I'll render it as glowing overlays in real time.",
  "For hospitals I recommend zoning by department first, then layering staff flow and equipment telemetry on top. It keeps the twin readable as you scale to multiple buildings.",
];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi — I'm the Make3DSpace copilot. Ask me anything about turning a space into an interactive twin." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", content: t }]);
    setInput("");
    setTyping(true);
    const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    }, 900 + Math.random() * 600);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent-glow shadow-2xl shadow-primary/40 grid place-items-center text-primary-foreground"
        aria-label="Open AI assistant"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent-glow blur-xl opacity-60 -z-10 animate-pulse-glow" />
        <Sparkles className="h-5 w-5" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-[min(380px,calc(100vw-3rem))] rounded-2xl glass shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 grid place-items-center rounded-full bg-gradient-to-br from-primary to-accent-glow">
                  <Wand2 className="h-3.5 w-3.5 text-primary-foreground" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 border border-background" />
                </div>
                <div>
                  <p className="text-sm font-medium">AI Copilot</p>
                  <p className="text-[10px] text-muted-foreground">Online · spatial intelligence</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] text-sm px-3.5 py-2.5 rounded-2xl leading-relaxed ${m.role === "user" ? "bg-foreground text-background rounded-br-sm" : "bg-foreground/5 text-foreground rounded-bl-sm"}`}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex gap-1 px-3 py-2 w-max bg-foreground/5 rounded-2xl">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            {messages.length < 3 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {QUICK.map((q) => (
                  <button key={q} onClick={() => send(q)} className="text-xs px-2.5 py-1.5 rounded-full border border-border hover:border-accent-glow/60 hover:bg-accent-glow/5 transition-colors text-muted-foreground hover:text-foreground">
                    {q}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="px-3 py-3 border-t border-border/60 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                className="flex-1 px-3 py-2 rounded-full bg-foreground/5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              <button type="submit" className="h-9 w-9 grid place-items-center rounded-full bg-gradient-to-br from-primary to-accent-glow text-primary-foreground hover:opacity-90 transition-opacity">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}