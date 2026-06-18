import { useState, useCallback } from "react";
import { motion, Reorder } from "framer-motion";
import { GripVertical, Award } from "lucide-react";
import PortfolioRenderer from "./PortfolioRenderer";
import type { PortfolioData } from "@/data/mockData";

export type SectionId = "about" | "skills" | "projects" | "experience" | "education" | "certifications" | "contact";

interface Props {
  templateId: string;
  data: PortfolioData;
  sectionOrder: SectionId[];
  onReorder: (newOrder: SectionId[]) => void;
  isDark?: boolean;
  themeColor?: string;
}

const sectionLabels: Record<SectionId, string> = {
  about: "About",
  skills: "Skills",
  projects: "Projects",
  experience: "Experience",
  education: "Education",
  certifications: "Certifications",
  contact: "Contact",
};

const DraggablePortfolio = ({ templateId, data, sectionOrder, onReorder, isDark, themeColor }: Props) => {
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

      {/* Reorderable sections */}
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
            id={sectionId}
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
  // Helper renderer for each layout style in drag-and-drop editor
  const renderContent = () => {
    switch (templateId) {
      case "tech-minimalist":
        return (
          <div className="bg-slate-950 text-slate-100 font-mono p-8 border border-slate-800 relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
            {sectionId === "about" && (
              <div>
                <h2 className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" /> // USER ABOUT_ME
                </h2>
                <p className="leading-relaxed text-sm text-slate-400">{data.about}</p>
              </div>
            )}
            {sectionId === "skills" && (
              <div>
                <h2 className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-4">// CORE SKILLS</h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((s) => (
                    <span key={s} className="bg-cyan-950/20 text-cyan-400 border border-cyan-800/40 rounded-sm px-2.5 py-1 text-xs">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "projects" && (
              <div>
                <h2 className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-4">// PROJECTS LIST</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {data.projects.map((p) => (
                    <div key={p.title} className="bg-slate-900/40 border border-slate-800 p-4 rounded-md flex flex-col justify-between h-40">
                      <div>
                        <h3 className="font-bold text-sm text-slate-200 mb-1">{p.title}</h3>
                        <p className="text-xs text-slate-400 mb-2 line-clamp-2">{p.description}</p>
                      </div>
                      <div className="flex gap-2">
                        {p.tags.map((tag) => (
                          <span key={tag} className="text-[10px] text-cyan-500/80 bg-cyan-950/10 px-1.5 py-0.5 rounded-sm">{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "experience" && (
              <div>
                <h2 className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-4">// PROFESSIONAL EXP</h2>
                <div className="space-y-4">
                  {data.experience.map((e) => (
                    <div key={e.role + e.company} className="border-l border-cyan-800/60 pl-4">
                      <h3 className="font-bold text-sm text-slate-200">{e.role}</h3>
                      <p className="text-xs text-cyan-400 mb-1">{e.company} · {e.duration}</p>
                      <p className="text-xs text-slate-400">{e.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "education" && (
              <div>
                <h2 className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-4">// ACADEMICS</h2>
                <div className="space-y-3">
                  {data.education.map((edu) => (
                    <div key={edu.degree}>
                      <p className="font-bold text-sm text-slate-200">{edu.degree}</p>
                      <p className="text-xs text-slate-400">{edu.school} · {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "certifications" && data.certifications && data.certifications.length > 0 && (
              <div>
                <h2 className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-4">// CERTIFICATIONS</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.certifications.map((c) => (
                    <div key={c.name} className="border border-slate-900 bg-slate-950 p-4 rounded flex items-start gap-3">
                      <Award className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-xs text-slate-200">{c.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-1">{c.issuer} · {c.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "contact" && (
              <div>
                <h2 className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-4">// SOCIAL LINK_MAP</h2>
                <div className="flex gap-4">
                  {data.socialLinks.map((l) => (
                    <span key={l.platform} className="text-xs text-cyan-500">{l.platform}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "retro-terminal":
        return (
          <div className="bg-black text-emerald-400 font-mono p-8 border border-emerald-950 relative shadow-inner">
            {sectionId === "about" && (
              <div>
                <p className="text-xs text-emerald-600 mb-2">visitor@rishi-portfolio:~$ cat about.md</p>
                <p className="leading-relaxed text-sm">{data.about}</p>
              </div>
            )}
            {sectionId === "skills" && (
              <div>
                <p className="text-xs text-emerald-600 mb-2">visitor@rishi-portfolio:~$ list-skills</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {data.skills.map((s) => (
                    <span key={s} className="before:content-['[x]_']">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "projects" && (
              <div>
                <p className="text-xs text-emerald-600 mb-2">visitor@rishi-portfolio:~$ get-projects</p>
                <div className="space-y-4">
                  {data.projects.map((p) => (
                    <div key={p.title} className="border border-emerald-900/50 p-3 bg-black/40">
                      <p className="font-bold text-sm text-emerald-300">File: {p.title.toLowerCase().replace(/\s+/g, "_")}.cfg</p>
                      <p className="text-xs mt-1 text-emerald-400/80">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "experience" && (
              <div>
                <p className="text-xs text-emerald-600 mb-2">visitor@rishi-portfolio:~$ get-experience</p>
                <div className="space-y-4">
                  {data.experience.map((e) => (
                    <div key={e.role}>
                      <p className="text-sm font-semibold">&gt;&gt; {e.role} @ {e.company}</p>
                      <p className="text-xs mt-1 text-emerald-450">{e.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "education" && (
              <div>
                <p className="text-xs text-emerald-600 mb-2">visitor@rishi-portfolio:~$ query-education</p>
                {data.education.map((edu) => (
                  <p key={edu.degree} className="text-sm">- {edu.degree} ({edu.school}, {edu.year})</p>
                ))}
              </div>
            )}
            {sectionId === "certifications" && data.certifications && data.certifications.length > 0 && (
              <div>
                <p className="text-xs text-emerald-600 mb-2">visitor@rishi-portfolio:~$ load-certs</p>
                {data.certifications.map((c) => (
                  <p key={c.name} className="text-sm">- [CERT] {c.name} ({c.issuer}, {c.date})</p>
                ))}
              </div>
            )}
            {sectionId === "contact" && (
              <div>
                <p className="text-xs text-emerald-600 mb-2">visitor@rishi-portfolio:~$ connect-net</p>
                <div className="flex gap-4 text-xs font-bold text-emerald-300">
                  {data.socialLinks.map((l) => (
                    <span key={l.platform}>[{l.platform}]</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "glass-aurora":
        return (
          <div className="relative p-8 rounded-2xl bg-slate-950 text-slate-100 border border-slate-900 shadow-xl">
            <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-700/20 p-6 rounded-xl shadow-lg">
              {sectionId === "about" && (
                <div>
                  <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-base font-bold uppercase tracking-widest mb-4">About Me</h2>
                  <p className="leading-relaxed text-sm text-slate-300">{data.about}</p>
                </div>
              )}
              {sectionId === "skills" && (
                <div>
                  <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-base font-bold uppercase tracking-widest mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((s) => (
                      <span key={s} className="rounded-full bg-slate-800/50 px-3 py-1.5 text-xs text-purple-300 border border-purple-500/10">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {sectionId === "projects" && (
                <div>
                  <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-base font-bold uppercase tracking-widest mb-4">Projects</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {data.projects.map((p) => (
                      <div key={p.title} className="rounded-xl bg-slate-950/45 border border-slate-800/40 p-4">
                        <h3 className="font-bold text-sm text-slate-200 mb-1">{p.title}</h3>
                        <p className="text-xs text-slate-400">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {sectionId === "experience" && (
                <div>
                  <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-base font-bold uppercase tracking-widest mb-4">Journey</h2>
                  <div className="space-y-4">
                    {data.experience.map((e) => (
                      <div key={e.role} className="border-l border-purple-800/30 pl-4">
                        <h3 className="font-bold text-sm text-slate-200">{e.role}</h3>
                        <p className="text-xs text-cyan-300 mb-1">{e.company} · {e.duration}</p>
                        <p className="text-xs text-slate-400">{e.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {sectionId === "education" && (
                <div>
                  <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-base font-bold uppercase tracking-widest mb-4">Academics</h2>
                  <div className="space-y-2">
                    {data.education.map((edu) => (
                      <div key={edu.degree}>
                        <p className="font-semibold text-sm text-slate-200">{edu.degree}</p>
                        <p className="text-xs text-slate-400">{edu.school} · {edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {sectionId === "certifications" && data.certifications && data.certifications.length > 0 && (
                <div>
                  <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-base font-bold uppercase tracking-widest mb-4">Certifications</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {data.certifications.map((c) => (
                      <div key={c.name} className="bg-slate-950/40 border border-slate-900/50 p-4 rounded-xl flex items-start gap-3">
                        <Award className="h-5 w-5 text-cyan-300 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-xs text-slate-200">{c.name}</h4>
                          <p className="text-[10px] text-slate-500">{c.issuer} · {c.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {sectionId === "contact" && (
                <div>
                  <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-base font-bold uppercase tracking-widest mb-4">Connect</h2>
                  <div className="flex gap-4 text-xs font-semibold text-purple-300">
                    {data.socialLinks.map((l) => (
                      <span key={l.platform}>{l.platform}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "cyberpunk-glitch":
        return (
          <div className="bg-zinc-950 text-zinc-100 font-mono p-8 border-l-4 border-fuchsia-500 relative bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]">
            {sectionId === "about" && (
              <div>
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-black uppercase tracking-[0.2em] text-sm mb-4">// OVERVIEW_INFO</h2>
                <p className="leading-relaxed text-sm text-zinc-400 border border-fuchsia-500/10 p-4 bg-zinc-900/40">{data.about}</p>
              </div>
            )}
            {sectionId === "skills" && (
              <div>
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-black uppercase tracking-[0.2em] text-sm mb-4">// UPLINK_CHIPS</h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((s) => (
                    <span key={s} className="border border-fuchsia-500/40 bg-fuchsia-950/10 text-fuchsia-400 px-3 py-1 text-xs">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "projects" && (
              <div>
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-black uppercase tracking-[0.2em] text-sm mb-4">// CODE_REPOS</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {data.projects.map((p) => (
                    <div key={p.title} className="border border-zinc-800 p-4 bg-zinc-900/60 shadow-md">
                      <h3 className="font-bold text-sm text-cyan-400 uppercase">{p.title}</h3>
                      <p className="text-xs mt-1 text-zinc-400">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "experience" && (
              <div>
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-black uppercase tracking-[0.2em] text-sm mb-4">// HISTORY_LOGS</h2>
                <div className="space-y-4">
                  {data.experience.map((e) => (
                    <div key={e.role} className="border-l border-fuchsia-500/50 pl-4 bg-zinc-900/20 p-2">
                      <h3 className="font-semibold text-sm text-cyan-300 uppercase">{e.role}</h3>
                      <p className="text-xs text-zinc-400">{e.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "education" && (
              <div>
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-black uppercase tracking-[0.2em] text-sm mb-4">// EDUCATION_FILE</h2>
                {data.education.map((edu) => (
                  <div key={edu.degree} className="border border-zinc-800 p-3 mb-2 bg-zinc-900/30">
                    <p className="font-bold text-sm text-zinc-200">{edu.degree}</p>
                    <p className="text-xs text-zinc-400">{edu.school} · {edu.year}</p>
                  </div>
                ))}
              </div>
            )}
            {sectionId === "certifications" && data.certifications && data.certifications.length > 0 && (
              <div>
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-black uppercase tracking-[0.2em] text-sm mb-4">// AUTH_CERTIFICATES</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.certifications.map((c) => (
                    <div key={c.name} className="border border-zinc-800 p-3 bg-zinc-900/20 flex items-start gap-2">
                      <Award className="h-4 w-4 text-fuchsia-400 mt-0.5" />
                      <div>
                        <p className="font-bold text-xs text-zinc-200">{c.name}</p>
                        <p className="text-[10px] text-zinc-500">{c.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "contact" && (
              <div>
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-black uppercase tracking-[0.2em] text-sm mb-4">// CONNECT_NODE</h2>
                <div className="flex gap-4 text-xs font-bold text-fuchsia-400">
                  {data.socialLinks.map((l) => (
                    <span key={l.platform}>&gt; {l.platform.toUpperCase()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "neobrutalist-bold":
        return (
          <div className="bg-amber-100 text-zinc-950 p-8 border-4 border-black shadow-[6px_6px_0px_#000] relative font-sans">
            {sectionId === "about" && (
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight border-b-4 border-black pb-2 mb-4">ABOUT ME</h2>
                <p className="leading-relaxed text-sm bg-white border-2 border-black p-4 font-medium shadow-[3px_3px_0px_#000]">{data.about}</p>
              </div>
            )}
            {sectionId === "skills" && (
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight border-b-4 border-black pb-2 mb-4">SKILLS</h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((s) => (
                    <span key={s} className="bg-violet-300 border-2 border-black px-3 py-1.5 text-xs font-black shadow-[2px_2px_0px_#000] uppercase">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "projects" && (
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight border-b-4 border-black pb-2 mb-4">PROJECTS</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {data.projects.map((p) => (
                    <div key={p.title} className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
                      <h3 className="font-extrabold text-sm text-black uppercase tracking-wide border-b-2 border-black pb-1 mb-2">{p.title}</h3>
                      <p className="text-xs text-zinc-800 font-medium mb-3">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "experience" && (
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight border-b-4 border-black pb-2 mb-4">WORK EXP</h2>
                <div className="space-y-4">
                  {data.experience.map((e) => (
                    <div key={e.role} className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_#000]">
                      <h3 className="font-black text-sm text-black">{e.role.toUpperCase()}</h3>
                      <p className="text-xs text-zinc-800 font-medium">{e.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "education" && (
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight border-b-4 border-black pb-2 mb-4">STUDIES</h2>
                {data.education.map((edu) => (
                  <div key={edu.degree} className="bg-white border-2 border-black p-3 mb-2 shadow-[2px_2px_0px_#000]">
                    <p className="font-extrabold text-sm">{edu.degree}</p>
                    <p className="text-xs text-zinc-700">{edu.school}</p>
                  </div>
                ))}
              </div>
            )}
            {sectionId === "certifications" && data.certifications && data.certifications.length > 0 && (
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight border-b-4 border-black pb-2 mb-4">CREDENTIALS</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.certifications.map((c) => (
                    <div key={c.name} className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_#000] flex items-start gap-2">
                      <Award className="h-4 w-4 text-black shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-xs">{c.name.toUpperCase()}</p>
                        <p className="text-[10px] text-zinc-500 font-bold">{c.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "contact" && (
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight border-b-4 border-black pb-2 mb-4">SOCIALS</h2>
                <div className="flex gap-3">
                  {data.socialLinks.map((l) => (
                    <span key={l.platform} className="bg-cyan-200 border-2 border-black px-3 py-1 font-bold text-xs shadow-[2px_2px_0px_#000]">{l.platform}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "elegant-serif":
        return (
          <div className="bg-[#fcfbf9] text-stone-900 font-serif p-8 border-y border-stone-200">
            {sectionId === "about" && (
              <div className="max-w-xl mx-auto text-center">
                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 mb-3 font-sans">About</h2>
                <p className="leading-[1.8] text-sm text-stone-700 italic">{data.about}</p>
              </div>
            )}
            {sectionId === "skills" && (
              <div className="max-w-xl mx-auto text-center">
                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 mb-4 font-sans">Expertise</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {data.skills.map((s) => (
                    <span key={s} className="text-stone-700 italic text-sm tracking-wide border border-stone-300/60 rounded-full px-4 py-1 bg-[#faf9f6]">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "projects" && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 text-center mb-6 font-sans">Selected Works</h2>
                <div className="space-y-6">
                  {data.projects.map((p) => (
                    <div key={p.title} className="border-b border-stone-200/60 pb-4 last:border-0">
                      <h3 className="font-semibold text-base text-stone-800 mb-1">{p.title}</h3>
                      <p className="text-xs leading-relaxed text-stone-600 font-serif">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "experience" && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 text-center mb-6 font-sans">Chronology</h2>
                <div className="space-y-6">
                  {data.experience.map((e) => (
                    <div key={e.role}>
                      <h3 className="font-bold text-sm text-stone-800">{e.role}</h3>
                      <p className="text-xs text-stone-600">{e.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "education" && (
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 mb-4 font-sans">Credentials</h2>
                {data.education.map((edu) => (
                  <div key={edu.degree} className="mb-2">
                    <p className="font-medium text-sm text-stone-800">{edu.degree}</p>
                    <p className="text-xs text-stone-500">{edu.school}</p>
                  </div>
                ))}
              </div>
            )}
            {sectionId === "certifications" && data.certifications && data.certifications.length > 0 && (
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 mb-4 font-sans">Certifications</h2>
                {data.certifications.map((c) => (
                  <div key={c.name} className="mb-2">
                    <p className="font-medium text-sm text-stone-800">{c.name}</p>
                    <p className="text-xs text-stone-400">{c.issuer}</p>
                  </div>
                ))}
              </div>
            )}
            {sectionId === "contact" && (
              <div className="text-center">
                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 mb-4 font-sans">Connect</h2>
                <div className="flex justify-center gap-6 text-sm text-stone-700 italic">
                  {data.socialLinks.map((l) => (
                    <span key={l.platform}>{l.platform}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "gradient-spotlight":
        return (
          <div className="relative bg-zinc-955 text-white p-8 overflow-hidden rounded-2xl">
            {sectionId === "about" && (
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">WHO I AM</h2>
                <p className="leading-relaxed text-sm text-zinc-350">{data.about}</p>
              </div>
            )}
            {sectionId === "skills" && (
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">EXPERTISE</h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((s) => (
                    <span key={s} className="rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 px-3.5 py-1.5 text-xs">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "projects" && (
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">REPOS</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {data.projects.map((p) => (
                    <div key={p.title} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                      <h3 className="font-bold text-sm text-zinc-100 mb-1">{p.title}</h3>
                      <p className="text-xs text-zinc-400 mb-2">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "experience" && (
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">WORK LOG</h2>
                <div className="space-y-4">
                  {data.experience.map((e) => (
                    <div key={e.role} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                      <h3 className="font-bold text-sm text-zinc-100">{e.role}</h3>
                      <p className="text-xs text-indigo-400 mb-1">{e.company} · {e.duration}</p>
                      <p className="text-xs text-zinc-400">{e.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "education" && (
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">STUDIES</h2>
                <div className="space-y-2">
                  {data.education.map((edu) => (
                    <div key={edu.degree} className="bg-zinc-900 p-3 rounded-lg border border-zinc-800/50">
                      <p className="font-semibold text-sm text-zinc-200">{edu.degree}</p>
                      <p className="text-xs text-zinc-400">{edu.school}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "certifications" && data.certifications && data.certifications.length > 0 && (
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">CERTIFICATES</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.certifications.map((c) => (
                    <div key={c.name} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-start gap-2">
                      <Award className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-xs text-zinc-200">{c.name}</p>
                        <p className="text-[10px] text-zinc-500">{c.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "contact" && (
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">SOCIALS</h2>
                <div className="flex gap-4 text-xs font-semibold text-indigo-400">
                  {data.socialLinks.map((l) => (
                    <span key={l.platform}>{l.platform}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "interactive-timeline":
        return (
          <div className="bg-slate-50 text-slate-800 p-8 border-l-4 border-emerald-500 shadow-sm relative">
            {sectionId === "about" && (
              <div>
                <h2 className="text-emerald-700 text-lg font-bold flex items-center gap-2 mb-4">
                  About Me
                </h2>
                <p className="leading-relaxed text-sm text-slate-600 pl-6">{data.about}</p>
              </div>
            )}
            {sectionId === "skills" && (
              <div>
                <h2 className="text-emerald-700 text-lg font-bold flex items-center gap-2 mb-4">
                  Core Focus
                </h2>
                <div className="flex flex-wrap gap-2 pl-6">
                  {data.skills.map((s) => (
                    <span key={s} className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300/40 px-3.5 py-1 text-xs font-semibold">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "projects" && (
              <div>
                <h2 className="text-emerald-700 text-lg font-bold flex items-center gap-2 mb-4">
                  Project Timeline
                </h2>
                <div className="space-y-4 pl-6">
                  {data.projects.map((p) => (
                    <div key={p.title} className="bg-white border border-slate-200 p-4 rounded-xl">
                      <h3 className="font-bold text-sm text-slate-800">{p.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "experience" && (
              <div>
                <h2 className="text-emerald-700 text-lg font-bold flex items-center gap-2 mb-6">
                  Professional Timeline
                </h2>
                <div className="space-y-4 pl-6 relative before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-[2px] before:bg-slate-200">
                  {data.experience.map((e) => (
                    <div key={e.role} className="relative pl-6">
                      <div className="absolute left-[3px] top-1.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                      <h3 className="font-bold text-sm text-slate-805">{e.role}</h3>
                      <p className="text-xs text-emerald-600 font-semibold">{e.company} · {e.duration}</p>
                      <p className="text-xs text-slate-500 mt-1">{e.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "education" && (
              <div>
                <h2 className="text-emerald-700 text-lg font-bold flex items-center gap-2 mb-4">
                  Academics
                </h2>
                <div className="space-y-2 pl-6">
                  {data.education.map((edu) => (
                    <div key={edu.degree}>
                      <p className="font-semibold text-sm text-slate-800">{edu.degree}</p>
                      <p className="text-xs text-slate-500">{edu.school} · {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "certifications" && data.certifications && data.certifications.length > 0 && (
              <div>
                <h2 className="text-emerald-700 text-lg font-bold flex items-center gap-2 mb-4">
                  Certifications
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 pl-6">
                  {data.certifications.map((c) => (
                    <div key={c.name} className="bg-white border border-slate-200 p-4 rounded-xl flex items-start gap-2">
                      <Award className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-xs text-slate-800">{c.name}</p>
                        <p className="text-[10px] text-slate-500">{c.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "contact" && (
              <div>
                <h2 className="text-emerald-700 text-lg font-bold flex items-center gap-2 mb-4">
                  Connect
                </h2>
                <div className="flex gap-4 text-xs font-bold text-emerald-700 pl-6">
                  {data.socialLinks.map((l) => (
                    <span key={l.platform}>{l.platform}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "card-deck":
        return (
          <div className="bg-slate-900 text-slate-100 p-8 border border-slate-800 shadow-2xl rounded-2xl">
            {sectionId === "about" && (
              <div>
                <h2 className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-850 pb-2">About Me</h2>
                <p className="leading-relaxed text-sm text-slate-300">{data.about}</p>
              </div>
            )}
            {sectionId === "skills" && (
              <div>
                <h2 className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-850 pb-2">Competencies</h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((s) => (
                    <span key={s} className="bg-slate-800 text-slate-300 rounded-md px-3 py-1.5 text-xs font-semibold">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "projects" && (
              <div>
                <h2 className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-850 pb-2">Projects Stack</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {data.projects.map((p) => (
                    <div key={p.title} className="bg-slate-850 border border-slate-800/80 p-4 rounded-xl">
                      <h3 className="font-bold text-sm text-slate-200 mb-1">{p.title}</h3>
                      <p className="text-xs text-slate-400 mb-2">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "experience" && (
              <div>
                <h2 className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-850 pb-2">Career Journey</h2>
                <div className="space-y-4">
                  {data.experience.map((e) => (
                    <div key={e.role} className="border-l-2 border-indigo-500 pl-4 bg-slate-850/20 p-2 rounded-r-lg">
                      <h3 className="font-bold text-sm text-slate-200">{e.role}</h3>
                      <p className="text-xs text-indigo-400 mb-1">{e.company} · {e.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "education" && (
              <div>
                <h2 className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-850 pb-2">Studies</h2>
                <div className="space-y-2">
                  {data.education.map((edu) => (
                    <div key={edu.degree} className="bg-slate-850 p-3 rounded-lg border border-slate-800">
                      <p className="font-semibold text-sm text-slate-200">{edu.degree}</p>
                      <p className="text-xs text-slate-400">{edu.school}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "certifications" && data.certifications && data.certifications.length > 0 && (
              <div>
                <h2 className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-850 pb-2">Certifications</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.certifications.map((c) => (
                    <div key={c.name} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-start gap-2">
                      <Award className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-xs text-slate-200">{c.name}</p>
                        <p className="text-[10px] text-slate-500">{c.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "contact" && (
              <div>
                <h2 className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-855 pb-2">Connect</h2>
                <div className="flex gap-4 text-xs font-bold text-indigo-400">
                  {data.socialLinks.map((l) => (
                    <span key={l.platform}>{l.platform}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "dashboard-saas":
        return (
          <div className="bg-slate-950 text-slate-200 p-8 border border-slate-800 rounded-2xl relative">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Dev Console // Drag Preview</span>
            </div>
            {sectionId === "about" && (
              <div>
                <h2 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-widest font-mono">// OVERVIEW</h2>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-sm leading-relaxed text-slate-400">
                  {data.about}
                </div>
              </div>
            )}
            {sectionId === "skills" && (
              <div>
                <h2 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-widest font-mono">// STACK PACKAGES</h2>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((s) => (
                      <span key={s} className="bg-slate-955 text-emerald-400 border border-emerald-950 rounded px-2 py-0.5 text-xs font-mono">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {sectionId === "projects" && (
              <div>
                <h2 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-widest font-mono">// PIPELINE DEPLOYED</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {data.projects.map((p) => (
                    <div key={p.title} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <h3 className="font-bold text-sm text-slate-200 mb-1">{p.title}</h3>
                      <p className="text-xs text-slate-400">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "experience" && (
              <div>
                <h2 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-widest font-mono">// CAREER LOGS</h2>
                <div className="space-y-4">
                  {data.experience.map((e) => (
                    <div key={e.role} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <h3 className="font-bold text-sm text-slate-200">{e.role}</h3>
                      <p className="text-xs text-slate-400">{e.company} · {e.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "education" && (
              <div>
                <h2 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-widest font-mono">// EDUCATION</h2>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                  {data.education.map((edu) => (
                    <div key={edu.degree}>
                      <p className="font-semibold text-sm text-slate-200">{edu.degree}</p>
                      <p className="text-xs text-slate-400">{edu.school} · {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "certifications" && data.certifications && data.certifications.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-widest font-mono">// CREDENTIALS</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.certifications.map((c) => (
                    <div key={c.name} className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-start gap-2">
                      <Award className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-xs text-slate-200">{c.name}</p>
                        <p className="text-[10px] text-slate-500">{c.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sectionId === "contact" && (
              <div>
                <h2 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-widest font-mono">// CONNECT</h2>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex gap-4 text-xs font-mono text-emerald-400">
                  {data.socialLinks.map((l) => (
                    <span key={l.platform}>/api/link/{l.platform.toLowerCase()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return renderContent();
};

export default DraggablePortfolio;
