import { motion } from "framer-motion";
import { Code2, Layers, Palette, Zap, GitBranch, Shield } from "lucide-react";

const TechnicalOverview = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Code2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Technical Overview</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            icon: Layers,
            title: "Component Architecture",
            detail: "Modular components with single responsibility. Shared UI primitives via shadcn/ui with custom variants.",
          },
          {
            icon: Palette,
            title: "Theme System",
            detail: "HSL-based CSS variables with semantic tokens. All colors flow from index.css through Tailwind config.",
          },
          {
            icon: Zap,
            title: "Performance",
            detail: "React.memo on heavy renders, lazy route loading, optimized re-renders via granular state updates.",
          },
          {
            icon: GitBranch,
            title: "State Management",
            detail: "Local state with useState for forms. Lifted state for cross-component data. No unnecessary global store.",
          },
          {
            icon: Shield,
            title: "Type Safety",
            detail: "End-to-end TypeScript coverage. Strict interfaces for portfolio data, templates, and chat messages.",
          },
          {
            icon: Code2,
            title: "Code Quality",
            detail: "Clean file structure, consistent naming conventions, reusable utility functions, semantic HTML.",
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-xl p-4 hover-glow transition-all hover:border-primary/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">{item.title}</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalOverview;
