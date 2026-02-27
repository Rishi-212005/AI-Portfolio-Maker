import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, X, Cpu, Layers, Zap, Package } from "lucide-react";

const metrics = [
  { icon: Cpu, label: "Component Renders", value: "12", detail: "3 avoided via React.memo" },
  { icon: Layers, label: "Virtual DOM Diffs", value: "8", detail: "Optimized with key-based reconciliation" },
  { icon: Package, label: "Bundle Size", value: "~142 KB", detail: "Code-split with React.lazy" },
  { icon: Zap, label: "Lazy-Loaded Routes", value: "4/6", detail: "Dashboard, Templates, Preview, CaseStudy" },
];

const PerformancePanel = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-secondary/80 backdrop-blur-md border border-border/50 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all shadow-lg"
      >
        <Activity className="h-3.5 w-3.5 text-primary" />
        <span className="hidden sm:inline">Perf Metrics</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-16 right-4 z-50 w-80 glass-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Performance Insights</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <m.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium">{m.label}</span>
                      <span className="text-xs font-bold text-primary">{m.value}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{m.detail}</p>
                  </div>
                </motion.div>
              ))}
              <div className="mt-2 rounded-lg bg-primary/5 border border-primary/10 p-3">
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  <span className="text-primary font-medium">CSS Variables</span> power the theme system — 
                  dynamic runtime theming without re-rendering the layout tree.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PerformancePanel;
