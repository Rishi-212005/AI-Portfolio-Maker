import { useState, useCallback } from "react";
import { motion, Reorder } from "framer-motion";
import { GripVertical } from "lucide-react";
import PortfolioRenderer from "./PortfolioRenderer";
import type { PortfolioData } from "@/data/mockData";

export type SectionId = "about" | "skills" | "projects" | "experience" | "education" | "contact";

interface Props {
  templateId: string;
  data: PortfolioData;
  sectionOrder: SectionId[];
  onReorder: (newOrder: SectionId[]) => void;
}

const sectionLabels: Record<SectionId, string> = {
  about: "About",
  skills: "Skills",
  projects: "Projects",
  experience: "Experience",
  education: "Education",
  contact: "Contact",
};

const DraggablePortfolio = ({ templateId, data, sectionOrder, onReorder }: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="relative">
      {/* Drag reorder toolbar */}
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border/30 bg-background/90 backdrop-blur-md px-4 py-2">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">Drag to reorder sections</span>
        <div className="ml-auto flex gap-1">
          {sectionOrder.map((id) => (
            <span key={id} className="rounded bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">
              {sectionLabels[id]}
            </span>
          ))}
        </div>
      </div>

      {/* Reorderable section labels */}
      <Reorder.Group
        axis="y"
        values={sectionOrder}
        onReorder={onReorder}
        className="relative"
      >
        {sectionOrder.map((sectionId) => (
          <Reorder.Item
            key={sectionId}
            value={sectionId}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            className="relative group"
            whileDrag={{ scale: 1.02, zIndex: 50 }}
          >
            {/* Drag handle overlay */}
            <div className="absolute left-0 top-0 bottom-0 z-10 flex w-8 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
              <div className="flex h-10 w-6 items-center justify-center rounded-r-lg bg-primary/80 shadow-lg">
                <GripVertical className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            
            {/* Section label badge */}
            <div className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-semibold text-primary-foreground shadow-lg">
                {sectionLabels[sectionId]}
              </span>
            </div>

            {/* Highlight border on hover */}
            <div className={`transition-all duration-200 ${isDragging ? "" : "group-hover:ring-2 group-hover:ring-primary/30 group-hover:ring-inset"}`}>
              <PortfolioSection
                sectionId={sectionId}
                templateId={templateId}
                data={data}
              />
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

/* Renders a single section of the portfolio based on template + section ID */
const PortfolioSection = ({ sectionId, templateId, data }: { sectionId: SectionId; templateId: string; data: PortfolioData }) => {
  // Use inline styles matching the template's design language
  const isDark = ["minimal-dark", "neon-cyberpunk", "glassmorphism", "gradient-aurora", "creative-colorful"].includes(templateId);
  const bg = isDark ? "hsl(222 47% 5%)" : "hsl(0 0% 98%)";
  const fg = isDark ? "hsl(210 40% 96%)" : "hsl(222 47% 11%)";
  const accent = getAccent(templateId);
  const muted = isDark ? "hsl(215 20% 55%)" : "hsl(215 16% 47%)";

  const wrapStyle: React.CSSProperties = { background: bg, color: fg, padding: "2rem 1.5rem" };

  switch (sectionId) {
    case "about":
      return (
        <div style={wrapStyle}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest" style={{ color: accent }}>About</h2>
          <p className="leading-relaxed" style={{ color: muted }}>{data.about}</p>
        </div>
      );
    case "skills":
      return (
        <div style={wrapStyle}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color: accent }}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <span key={s} className="rounded-md px-3 py-1 text-sm" style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}>{s}</span>
            ))}
          </div>
        </div>
      );
    case "projects":
      return (
        <div style={wrapStyle}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color: accent }}>Projects</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.projects.map((p) => (
              <div key={p.title} className="rounded-xl p-4" style={{ background: isDark ? "hsl(222 30% 9%)" : "hsl(0 0% 100%)", border: `1px solid ${isDark ? "hsl(222 20% 15%)" : "hsl(220 13% 91%)"}` }}>
                <h3 className="mb-1 font-semibold text-sm">{p.title}</h3>
                <p className="text-xs" style={{ color: muted }}>{p.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.tags.map((tag) => (
                    <span key={tag} className="rounded text-[10px] px-1.5 py-0.5" style={{ background: `${accent}10`, color: accent }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "experience":
      return (
        <div style={wrapStyle}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color: accent }}>Experience</h2>
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.role + e.company} className="border-l-2 pl-4" style={{ borderColor: `${accent}40` }}>
                <h3 className="font-semibold text-sm">{e.role}</h3>
                <p className="text-xs" style={{ color: accent }}>{e.company} · {e.duration}</p>
                <p className="mt-1 text-xs" style={{ color: muted }}>{e.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "education":
      return (
        <div style={wrapStyle}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color: accent }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.degree} className="mb-2">
              <p className="font-medium text-sm">{edu.degree}</p>
              <p className="text-xs" style={{ color: muted }}>{edu.school} · {edu.year}</p>
            </div>
          ))}
        </div>
      );
    case "contact":
      return (
        <div style={wrapStyle}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color: accent }}>Connect</h2>
          <div className="flex gap-4">
            {data.socialLinks.map((l) => (
              <span key={l.platform} className="text-sm" style={{ color: accent }}>{l.platform}</span>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
};

function getAccent(templateId: string): string {
  switch (templateId) {
    case "minimal-dark": return "hsl(190 95% 55%)";
    case "creative-colorful": return "hsl(330 80% 65%)";
    case "corporate-clean": return "hsl(220 60% 50%)";
    case "glassmorphism": return "hsl(270 80% 75%)";
    case "neon-cyberpunk": return "hsl(160 100% 50%)";
    case "elegant-serif": return "hsl(35 90% 45%)";
    case "gradient-aurora": return "hsl(280 70% 70%)";
    case "brutalist-bold": return "hsl(0 0% 20%)";
    default: return "hsl(190 95% 55%)";
  }
}

export default DraggablePortfolio;
