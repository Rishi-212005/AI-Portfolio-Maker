import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Activity, 
  ExternalLink, 
  Award, 
  Menu, 
  X, 
  Briefcase, 
  GraduationCap, 
  Code, 
  User, 
  Mail, 
  Phone,
  MapPin, 
  ArrowRight,
  ChevronRight,
  Terminal,
  Layers,
  Layout,
  ArrowDown,
  MessageSquare,
  Lock,
  Send
} from "lucide-react";
import type { PortfolioData } from "@/data/mockData";

interface Props {
  templateId: string;
  data: PortfolioData;
  isDark?: boolean;
  themeColor?: string;
  sectionOrder?: string[];
}

const PortfolioRenderer = ({ templateId, data, isDark = true, themeColor, sectionOrder }: Props) => {
  const defaultOrder = ["about", "skills", "projects", "experience", "education", "certifications", "contact"];
  const orderToUse = sectionOrder && sectionOrder.length > 0 ? sectionOrder : defaultOrder;
  const activeThemeColor = themeColor || "hsl(190 95% 55%)";

  const renderTemplate = () => {
    switch (templateId) {
      case "tech-minimalist":
        return <TechMinimalist data={data} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} />;
      case "retro-terminal":
        return <RetroTerminal data={data} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} />;
      case "glass-aurora":
        return <GlassAurora data={data} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} />;
      case "cyberpunk-glitch":
        return <CyberpunkGlitch data={data} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} />;
      case "neobrutalist-bold":
        return <NeobrutalistBold data={data} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} />;
      case "elegant-serif":
        return <ElegantEditorial data={data} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} />;
      case "gradient-spotlight":
        return <GradientSpotlight data={data} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} />;
      case "interactive-timeline":
        return <InteractiveTimeline data={data} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} />;
      case "card-deck":
        return <CardDeck data={data} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} />;
      case "dashboard-saas":
        return <DashboardSaas data={data} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} />;
      default:
        return <TechMinimalist data={data} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} />;
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen">
      <style>{`
        :root {
          --portfolio-primary: ${activeThemeColor};
          --portfolio-primary-glow: ${activeThemeColor}30;
          --portfolio-primary-bg: ${activeThemeColor}10;
        }
        .theme-highlight-text { color: var(--portfolio-primary) !important; }
        .theme-highlight-border { border-color: var(--portfolio-primary) !important; }
        .theme-highlight-bg { background-color: var(--portfolio-primary) !important; }
        .theme-highlight-bg-opacity { background-color: var(--portfolio-primary-bg) !important; }
        .theme-highlight-border-opacity { border-color: var(--portfolio-primary-glow) !important; }
      `}</style>

      {renderTemplate()}

      <FloatingWidgets data={data} themeColor={activeThemeColor} />
    </div>
  );
};

/* ====== COMMON SOCIALS & FORM HELPER ====== */
const SocialIcons = ({ links, color }: { links: PortfolioData["socialLinks"]; color: string }) => (
  <div className="flex gap-4">
    {links.map((l) => (
      <a 
        key={l.platform} 
        href={l.url} 
        target="_blank" 
        rel="noreferrer" 
        className="transition-transform hover:scale-110 p-1.5 rounded-full hover:bg-white/5" 
        style={{ color }}
      >
        {l.platform.toLowerCase() === "github" && <Github className="h-5 w-5" />}
        {l.platform.toLowerCase() === "linkedin" && <Linkedin className="h-5 w-5" />}
        {l.platform.toLowerCase() === "twitter" && <Twitter className="h-5 w-5" />}
      </a>
    ))}
  </div>
);

const CommonContactForm = ({ 
  buttonStyle, 
  inputStyle, 
  buttonColor, 
  buttonTextColor 
}: { 
  buttonStyle?: string; 
  inputStyle?: string; 
  buttonColor?: string; 
  buttonTextColor?: string; 
}) => {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitted ? (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-md text-sm text-center">
          ✅ Message sent successfully! I'll get back to you soon.
        </div>
      ) : null}
      <input type="text" placeholder="Your Name" required className={inputStyle || "w-full p-2.5 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-primary"} />
      <input type="email" placeholder="Your Email" required className={inputStyle || "w-full p-2.5 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-primary"} />
      <textarea placeholder="Your Message" rows={4} required className={inputStyle || "w-full p-2.5 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-primary"}></textarea>
      <button
        type="submit"
        className={buttonStyle || "w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/95 transition-colors"}
        style={buttonColor || buttonTextColor ? { 
          backgroundColor: buttonColor, 
          color: buttonTextColor || "#fff" 
        } : undefined}
      >
        Send Message
      </button>
    </form>
  );
};


/* ====== SHARED SECTION HEADER ====== */
const SectionHeader = ({ label, color }: { label: string; color: string }) => (
  <div className="flex items-center gap-3 mb-2">
    <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color }}>{label}</span>
    <div className="flex-1 h-px opacity-20" style={{ backgroundColor: color }} />
  </div>
);

/* ====== 1. TECH MINIMALIST ====== */
const TechMinimalist = ({ data, isDark, themeColor, sectionOrder }: { data: PortfolioData; isDark?: boolean; themeColor: string; sectionOrder: string[] }) => {
  const [activeSection, setActiveSection] = useState("home");
  const [typedText, setTypedText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Typing effect
  useEffect(() => {
    let i = 0;
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < data.title.length) {
          setTypedText(data.title.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 55);
    }, 900);
    return () => clearTimeout(delay);
  }, [data.title]);

  // Active section tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 130;
      const ids = ["home", ...sectionOrder];
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(id);
          return;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionOrder]);

  const bg = isDark ? "bg-slate-950" : "bg-gray-50";
  const cardBg = isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const heading = isDark ? "text-slate-100" : "text-slate-900";

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  // Skill categories
  const frontendSkills = data.skills.filter(s =>
    ["React", "TypeScript", "JavaScript", "TailwindCSS", "Next.js", "Vue", "HTML", "CSS", "Svelte", "Vite"].includes(s)
  );
  const backendSkills = data.skills.filter(s =>
    ["Node.js", "Express", "Python", "PHP", "FastAPI", "Django", "Java", "Go", "Rust"].includes(s)
  );
  const dataSkills = data.skills.filter(s =>
    ["MySQL", "MongoDB", "PostgreSQL", "Redis", "AWS", "Firebase", "Docker", "Kubernetes", "Supabase"].includes(s)
  );
  const toolsSkills = data.skills.filter(s =>
    ["Git", "Linux", "VS Code", "Figma", "Postman", "GitHub", "Bash", "Jira"].includes(s)
  );
  const categorized = [...frontendSkills, ...backendSkills, ...dataSkills, ...toolsSkills];
  const otherSkills = data.skills.filter(s => !categorized.includes(s));

  const skillCategories = [
    { label: "Frontend", skills: frontendSkills },
    { label: "Backend", skills: backendSkills },
    { label: "Data & Cloud", skills: dataSkills },
    { label: "Tools", skills: toolsSkills },
    ...(otherSkills.length > 0 ? [{ label: "Other", skills: otherSkills }] : []),
  ].filter(c => c.skills.length > 0);

  const sections = sectionOrder;

  return (
    <div className={`min-h-screen font-mono pb-20 transition-colors duration-300 ${bg} ${isDark ? "text-slate-100" : "text-slate-900"} bg-[radial-gradient(${isDark ? "#1e293b" : "#e2e8f0"}_1px,transparent_1px)] [background-size:20px_20px]`}>

      {/* ===== STICKY NAVBAR ===== */}
      <nav className={`sticky top-0 z-40 backdrop-blur-md border-b px-6 py-3.5 flex items-center justify-between transition-colors duration-300 ${isDark ? "bg-slate-950/90 border-slate-800" : "bg-white/90 border-slate-200"}`}>
        <a href="#" className="font-extrabold tracking-wider text-sm flex items-center gap-2" style={{ color: themeColor }}>
          <span className="inline-flex items-center justify-center h-7 w-7 rounded text-xs font-black border" style={{ backgroundColor: `${themeColor}15`, borderColor: `${themeColor}30` }}>
            {data.name.charAt(0)}
          </span>
          {data.name.split(" ").map(w => w.charAt(0)).join("")}.DEV
        </a>
        <div className="hidden sm:flex gap-5 text-[11px] font-semibold">
          {sections.map((sec) => (
            <a
              key={sec}
              href={`#${sec}`}
              className="transition-all uppercase tracking-widest pb-0.5"
              style={activeSection === sec
                ? { color: themeColor, borderBottom: `2px solid ${themeColor}` }
                : { color: isDark ? "hsl(215 20% 55%)" : "hsl(215 20% 40%)" }
              }
            >
              {sec}
            </a>
          ))}
        </div>
        <button className="sm:hidden p-1 rounded transition-colors" onClick={() => setMenuOpen(m => !m)} style={{ color: themeColor }}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`sm:hidden sticky top-[53px] z-30 border-b px-6 py-4 flex flex-col gap-3 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}
          >
            {sections.map(sec => (
              <a key={sec} href={`#${sec}`} onClick={() => setMenuOpen(false)}
                className="uppercase text-xs font-semibold tracking-widest"
                style={{ color: activeSection === sec ? themeColor : undefined }}
              >{sec}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== HERO ===== */}
      <section id="home" className="min-h-[92vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.05] blur-[100px]" style={{ backgroundColor: themeColor }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6 max-w-3xl relative z-10"
        >
          {/* Profile photo */}
          {data.photo && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="flex justify-center">
              <div className="relative h-28 w-28 rounded-full overflow-hidden border-4" style={{ borderColor: themeColor, boxShadow: `0 0 32px ${themeColor}50` }}>
                <img src={data.photo} alt={data.name} className="h-full w-full object-cover" />
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-wider border font-semibold"
            style={{ backgroundColor: `${themeColor}10`, color: themeColor, borderColor: `${themeColor}30` }}
          >
            <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
            AVAILABLE FOR OPPORTUNITIES
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`text-5xl sm:text-7xl font-black tracking-tight leading-none ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {data.name.split(" ").map((word, wi) => (
              <span key={word} className="block" style={wi === data.name.split(" ").length - 1 ? { color: themeColor } : {}}>
                {word}
              </span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm sm:text-base font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-1 h-7"
            style={{ color: themeColor }}
          >
            <span>{typedText}</span>
            <span className="animate-pulse border-r-2 h-4 inline-block" style={{ borderColor: themeColor }} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`text-sm max-w-xl mx-auto leading-relaxed ${muted}`}
          >
            {data.about}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center gap-8 pt-1"
          >
            {[
              { num: `${data.experience.length}+`, label: "Experiences" },
              { num: `${data.projects.length}+`, label: "Projects" },
              { num: `${data.skills.length}+`, label: "Technologies" },
              { num: `${(data.certifications || []).length}+`, label: "Certifications" },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black" style={{ color: themeColor }}>{stat.num}</div>
                <div className={`text-[10px] uppercase tracking-wider mt-0.5 ${muted}`}>{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="flex flex-wrap justify-center gap-3 pt-1"
          >
            <a href="#projects"
              className="font-bold text-xs py-3 px-7 rounded-sm uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105"
              style={{ backgroundColor: themeColor, color: isDark ? "#020617" : "#ffffff", boxShadow: `0 0 24px ${themeColor}45` }}
            >
              View Projects <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a href="#contact"
              className="border font-bold text-xs py-3 px-7 rounded-sm uppercase tracking-wider transition-all hover:scale-105"
              style={{ borderColor: `${themeColor}50`, color: themeColor, backgroundColor: `${themeColor}08` }}
            >
              Get in Touch
            </a>
            {data.website && (
              <a href={data.website} target="_blank" rel="noreferrer"
                className={`border font-bold text-xs py-3 px-7 rounded-sm uppercase tracking-wider transition-all hover:scale-105 flex items-center gap-1.5 ${isDark ? "border-slate-700 text-slate-300 hover:border-slate-500" : "border-slate-300 text-slate-700 hover:border-slate-400"}`}
              >
                <ExternalLink className="h-3.5 w-3.5" /> Portfolio
              </a>
            )}
            <a href={data.socialLinks.find(l => l.platform === "GitHub")?.url || "#"}
              target="_blank" rel="noreferrer"
              className={`border font-bold text-xs py-3 px-7 rounded-sm uppercase tracking-wider transition-all hover:scale-105 flex items-center gap-1.5 ${isDark ? "border-slate-700 text-slate-300 hover:border-slate-500" : "border-slate-300 text-slate-700 hover:border-slate-400"}`}
            >
              <Github className="h-3.5 w-3.5" /> GitHub
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: themeColor }}
        >
          <span className="text-[10px] uppercase tracking-widest opacity-50">Scroll</span>
          <div className="w-px h-10 relative overflow-hidden">
            <motion.div
              animate={{ y: ["0%", "100%", "100%"] }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.4 }}
              className="absolute top-0 left-0 w-full h-1/2"
              style={{ backgroundColor: themeColor }}
            />
          </div>
        </motion.div>
      </section>

      {/* ===== DYNAMIC SECTIONS ===== */}
      <div className="mx-auto max-w-5xl px-6 pt-8 space-y-24 pb-24">
        {sections.map((sectionId) => {
          switch (sectionId) {

            case "about":
              return (
                <motion.section id="about" key="about" className="scroll-mt-24"
                  variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
                >
                  <SectionHeader label="// ABOUT" color={themeColor} />
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className={`p-6 rounded-lg border ${cardBg}`}>
                      {/* Photo in about if in hero already it duplicates – skip if already shown */}
                      {data.photo && (
                        <div className="flex items-center gap-4 mb-4">
                          <img src={data.photo} alt={data.name} className="h-16 w-16 rounded-full object-cover border-2" style={{ borderColor: themeColor }} />
                          <div>
                            <p className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{data.name}</p>
                            <p className="text-xs mt-0.5" style={{ color: themeColor }}>{data.title}</p>
                          </div>
                        </div>
                      )}
                      <p className={`text-sm leading-loose ${muted}`}>{data.about}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {data.socialLinks.map(l => (
                          <a key={l.platform} href={l.url} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded border uppercase tracking-wider transition-all hover:scale-105"
                            style={{ color: themeColor, borderColor: `${themeColor}30`, backgroundColor: `${themeColor}08` }}
                          >
                            {l.platform === "GitHub" && <Github className="h-3 w-3" />}
                            {l.platform === "LinkedIn" && <Linkedin className="h-3 w-3" />}
                            {l.platform === "Twitter" && <Twitter className="h-3 w-3" />}
                            {l.platform}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        data.location && { icon: <MapPin className="h-3.5 w-3.5" />, label: "Location", value: data.location },
                        data.email && { icon: <Mail className="h-3.5 w-3.5" />, label: "Email", value: data.email },
                        data.phone && { icon: <Phone className="h-3.5 w-3.5" />, label: "Phone", value: data.phone },
                        data.website && { icon: <ExternalLink className="h-3.5 w-3.5" />, label: "Website", value: data.website, href: data.website },
                        { icon: <GraduationCap className="h-3.5 w-3.5" />, label: "Education", value: data.education[0]?.degree || "—" },
                        { icon: <Briefcase className="h-3.5 w-3.5" />, label: "Current/Last Role", value: data.experience[0] ? `${data.experience[0].role} @ ${data.experience[0].company}` : "—" },
                      ].filter(Boolean).map((item: { icon: React.ReactNode; label: string; value: string; href?: string }, ii) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: ii * 0.07 }}
                          className={`p-3.5 rounded-lg border text-xs flex items-start gap-3 ${cardBg}`}
                        >
                          <span className="mt-0.5 shrink-0" style={{ color: themeColor }}>{item.icon}</span>
                          <div className="min-w-0">
                            <span className={`block text-[10px] uppercase tracking-wider mb-0.5 ${muted}`}>{item.label}</span>
                            {item.href ? (
                              <a href={item.href} target="_blank" rel="noreferrer" className="font-semibold truncate block hover:underline" style={{ color: themeColor }}>{item.value}</a>
                            ) : (
                              <span className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{item.value}</span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {/* Languages */}
                      {data.languages && data.languages.length > 0 && (
                        <div className={`p-3.5 rounded-lg border text-xs ${cardBg}`}>
                          <span className={`block text-[10px] uppercase tracking-wider mb-2 ${muted}`}>Languages</span>
                          <div className="flex flex-wrap gap-1.5">
                            {data.languages.map(lang => (
                              <span key={lang.name} className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                                style={{ color: themeColor, borderColor: `${themeColor}30`, backgroundColor: `${themeColor}08` }}
                              >
                                {lang.name} · {lang.level}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.section>
              );

            case "skills":
              return (
                <motion.section id="skills" key="skills" className="scroll-mt-24"
                  variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
                >
                  <SectionHeader label="// SKILL INVENTORY" color={themeColor} />
                  <div className="mt-6 space-y-7">
                    {skillCategories.map((cat, ci) => (
                      <motion.div key={cat.label}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ci * 0.1 }}
                      >
                        <div className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-3 ${muted}`}>{cat.label}</div>
                        <div className="flex flex-wrap gap-2">
                          {cat.skills.map((s, si) => (
                            <motion.span
                              key={s}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: ci * 0.1 + si * 0.04 }}
                              className="rounded-sm px-3 py-1.5 text-xs border font-semibold transition-all hover:scale-105 cursor-default"
                              style={{ backgroundColor: `${themeColor}10`, color: themeColor, borderColor: `${themeColor}25` }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 14px ${themeColor}50`; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                            >
                              {s}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );

            case "projects":
              return (
                <motion.section id="projects" key="projects" className="scroll-mt-24"
                  variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
                >
                  <SectionHeader label="// REPOS / PROJECTS" color={themeColor} />
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {data.projects.map((p, pi) => (
                      <motion.div
                        key={p.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: pi * 0.1 }}
                        className={`rounded-lg border flex flex-col transition-all hover:-translate-y-1 group overflow-hidden ${cardBg}`}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${themeColor}25`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                      >
                        {/* Project preview image */}
                        {p.imageUrl ? (
                          <div className="h-40 w-full overflow-hidden border-b" style={{ borderColor: `${themeColor}15` }}>
                            <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                        ) : (
                          <div className="h-32 w-full flex items-center justify-center border-b" style={{ borderColor: `${themeColor}15`, backgroundColor: `${themeColor}06` }}>
                            <Code className="h-10 w-10 opacity-20" style={{ color: themeColor }} />
                          </div>
                        )}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className={`font-bold text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>{p.title}</h3>
                            <div className="flex gap-1.5 shrink-0 ml-2">
                              {p.link && (
                                <a href={p.link} target="_blank" rel="noreferrer"
                                  className={`p-1.5 rounded border transition-all hover:scale-110 ${isDark ? "border-slate-700 text-slate-400 hover:border-slate-600" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                                  title="View Source"
                                >
                                  <Github className="h-3.5 w-3.5" />
                                </a>
                              )}
                              {p.liveLink && (
                                <a href={p.liveLink} target="_blank" rel="noreferrer"
                                  className="p-1.5 rounded border transition-all hover:scale-110"
                                  style={{ borderColor: `${themeColor}35`, color: themeColor, backgroundColor: `${themeColor}08` }}
                                  title="Live Demo"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                          <p className={`text-xs leading-relaxed flex-1 mb-4 ${muted}`}>{p.description}</p>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {p.tags.map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-sm border font-medium"
                                style={{ color: themeColor, backgroundColor: `${themeColor}08`, borderColor: `${themeColor}20` }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          {p.liveLink && (
                            <a href={p.liveLink} target="_blank" rel="noreferrer"
                              className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all group-hover:gap-2.5"
                              style={{ color: themeColor }}
                            >
                              <ExternalLink className="h-3 w-3" /> Live Demo →
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );

            case "experience":
              return (
                <motion.section id="experience" key="experience" className="scroll-mt-24"
                  variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
                >
                  <SectionHeader label="// PROFESSIONAL EXP" color={themeColor} />
                  <div className="mt-6 space-y-5 relative">
                    <div className="absolute left-5 top-2 bottom-2 w-px opacity-15" style={{ backgroundColor: themeColor }} />
                    {data.experience.map((e, ei) => (
                      <motion.div key={e.role + e.company}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ei * 0.15 }}
                        className="pl-14 relative"
                      >
                        <div className="absolute left-3 top-5 h-4 w-4 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: themeColor, backgroundColor: isDark ? "#020617" : "#f9fafb" }}
                        >
                          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
                        </div>
                        <div className={`p-5 rounded-lg border ${cardBg}`}>
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                            <div>
                              <h3 className={`font-bold text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>{e.role}</h3>
                              <p className="text-xs font-semibold mt-0.5" style={{ color: themeColor }}>{e.company}</p>
                            </div>
                            <span className={`text-[10px] font-mono px-2.5 py-1 rounded border shrink-0 ${isDark ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                              {e.duration}
                            </span>
                          </div>
                          <p className={`text-xs leading-relaxed ${muted}`}>{e.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );

            case "education":
              return (
                <motion.section id="education" key="education" className="scroll-mt-24"
                  variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
                >
                  <SectionHeader label="// ACADEMICS" color={themeColor} />
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {data.education.map((edu, ei) => (
                      <motion.div key={edu.degree}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ei * 0.1 }}
                        className={`p-5 rounded-lg border flex gap-4 ${cardBg}`}
                      >
                        <div className="h-10 w-10 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: `${themeColor}15` }}>
                          <GraduationCap className="h-5 w-5" style={{ color: themeColor }} />
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>{edu.degree}</p>
                          <p className={`text-xs mt-1 ${muted}`}>{edu.school}</p>
                          <span className="text-[10px] font-mono mt-2 inline-block px-2.5 py-0.5 rounded border"
                            style={{ color: themeColor, borderColor: `${themeColor}25`, backgroundColor: `${themeColor}08` }}
                          >
                            {edu.year}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );

            case "certifications":
              return data.certifications && data.certifications.length > 0 ? (
                <motion.section id="certifications" key="certifications" className="scroll-mt-24"
                  variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
                >
                  <SectionHeader label="// CERTIFICATIONS" color={themeColor} />
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {data.certifications.map((c, ci) => (
                      <motion.div key={c.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: ci * 0.08 }}
                        className={`rounded-lg border overflow-hidden transition-all hover:-translate-y-0.5 ${cardBg}`}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 24px ${themeColor}22`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                      >
                        {/* Certificate image */}
                        {c.imageUrl ? (
                          <div className="h-44 w-full overflow-hidden border-b" style={{ borderColor: `${themeColor}15` }}>
                            <img src={c.imageUrl} alt={c.name} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-24 w-full flex items-center justify-center border-b" style={{ borderColor: `${themeColor}15`, backgroundColor: `${themeColor}06` }}>
                            <Award className="h-10 w-10 opacity-20" style={{ color: themeColor }} />
                          </div>
                        )}
                        <div className="p-4 flex items-start gap-3">
                          <div className="h-8 w-8 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: `${themeColor}15` }}>
                            <Award className="h-4 w-4" style={{ color: themeColor }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className={`font-bold text-xs leading-snug ${isDark ? "text-slate-200" : "text-slate-800"}`}>{c.name}</h4>
                            <p className={`text-[10px] mt-1 ${muted}`}>{c.issuer}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[10px] font-mono" style={{ color: themeColor }}>{c.date}</span>
                              {c.credentialUrl && (
                                <a href={c.credentialUrl} target="_blank" rel="noreferrer"
                                  className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
                                  style={{ color: themeColor }}
                                >
                                  Verify <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ) : null;

            case "contact":
              return (
                <motion.section id="contact" key="contact" className="scroll-mt-24"
                  variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
                >
                  <SectionHeader label="// GET IN TOUCH" color={themeColor} />
                  <div className="mt-6 grid gap-8 md:grid-cols-2">
                    <div className="space-y-5">
                      <p className={`text-sm leading-relaxed ${muted}`}>
                        Open to job opportunities, collaborations, and interesting projects. Let's build something great together.
                      </p>
                      <div className="space-y-2.5 text-xs font-mono">
                        {[
                          data.email   && { icon: <Mail className="h-4 w-4" />,  text: data.email,    href: `mailto:${data.email}` },
                          data.phone   && { icon: <Phone className="h-4 w-4" />, text: data.phone,    href: `tel:${data.phone}` },
                          data.location && { icon: <MapPin className="h-4 w-4" />, text: data.location, href: null },
                          data.website && { icon: <ExternalLink className="h-4 w-4" />, text: data.website, href: data.website },
                        ].filter(Boolean).map((item: { icon: React.ReactNode; text: string; href: string | null }) => (
                          <div key={item.text} className="flex items-center gap-3">
                            <span style={{ color: themeColor }}>{item.icon}</span>
                            {item.href ? (
                              <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={`${muted} hover:underline`} style={{ color: themeColor }}>{item.text}</a>
                            ) : (
                              <span className={muted}>{item.text}</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <SocialIcons links={data.socialLinks} color={themeColor} />
                    </div>
                    <CommonContactForm
                      inputStyle={`w-full p-3 border rounded-sm text-xs font-mono focus:outline-none transition-colors ${isDark ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700 placeholder:text-slate-600" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-300 placeholder:text-slate-400"}`}
                      buttonStyle={`w-full py-3 font-bold rounded-sm uppercase tracking-widest text-xs transition-all hover:opacity-90 hover:scale-[1.01]`}
                      buttonColor={themeColor}
                    />
                  </div>
                </motion.section>
              );

            case "achievements" as string:
              return data.achievements && data.achievements.length > 0 ? (
                <motion.section id="achievements" key="achievements" className="scroll-mt-24"
                  variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
                >
                  <SectionHeader label="// ACHIEVEMENTS" color={themeColor} />
                  <div className="mt-6 space-y-3">
                    {data.achievements.map((ach, ai) => (
                      <motion.div key={ai}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ai * 0.07 }}
                        className={`p-4 rounded-lg border text-sm flex items-start gap-3 ${cardBg}`}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${themeColor}18`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                      >
                        <span className={muted}>{ach}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ) : null;

            default:
              return null;
          }
        })}

        <footer className={`border-t pt-8 flex flex-wrap items-center justify-between gap-4 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
          <SocialIcons links={data.socialLinks} color={themeColor} />
          <span className={`text-[10px] font-mono ${isDark ? "text-slate-600" : "text-slate-400"}`}>
            © 2026 {data.name} · AI Portfolio Maker
          </span>
        </footer>
      </div>
    </div>
  );
};


/* ====== 2. RETRO TERMINAL (INTERACTIVE CLI) ====== */
const RetroTerminal = ({ data, isDark, themeColor, sectionOrder }: { data: PortfolioData; isDark?: boolean; themeColor: string; sectionOrder: string[] }) => {
  const [history, setHistory] = useState<string[]>([
    "Sai Rishi Kumar Vedi Terminal [Version 2.0.1]",
    "(c) 2026 Developer Console. All rights reserved.",
    "",
    "Type 'help' to see the list of executable commands.",
    "Click bracket links to run configurations directly.",
    ""
  ]);
  const [cmdInput, setCmdInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const sectionCommands: Record<string, string> = {
    about: "about",
    skills: "skills",
    projects: "projects",
    experience: "experience",
    education: "education",
    certifications: "certs",
    contact: "socials"
  };

  const executeCommand = (command: string) => {
    const raw = command.trim();
    if (!raw) return;
    const lower = raw.toLowerCase();
    let res: string[] = [];

    switch (lower) {
      case "help":
        res = [
          "Available Commands:",
          "  about          Read user bio overview",
          "  skills         Display core technology inventory",
          "  projects       Show parsed project configs",
          "  experience     List professional career roadmap",
          "  education      Print certified credentials",
          "  certs          Show security and dev certificates",
          "  clear          Wipe console history log",
          "  socials        List networking URLs"
        ];
        break;
      case "about":
        res = [
          `> CAT ABOUT.TXT`,
          data.about,
          `Title: ${data.title}`
        ];
        break;
      case "skills":
        res = [
          `> LIST-SKILLS --ALL`,
          data.skills.map(s => `  [x] ${s}`).join("\n")
        ];
        break;
      case "projects":
        res = [
          `> GET-PROJECTS`,
          ...data.projects.map((p) => 
            `  * File: ${p.title.toLowerCase().replace(/\s+/g, "_")}.cfg\n    Desc: ${p.description}\n    Tags: ${p.tags.join(" / ")}\n    Repo: ${p.link}${p.liveLink ? `\n    Live: ${p.liveLink}` : ""}`
          )
        ];
        break;
      case "experience":
        res = [
          `> QUERY-CAREER`,
          ...data.experience.map(e => `  - ${e.role} @ ${e.company} (${e.duration})\n    Log: ${e.description}`)
        ];
        break;
      case "education":
        res = [
          `> GET-ACADEMICS`,
          ...data.education.map(edu => `  - ${edu.degree} from ${edu.school} (${edu.year})`)
        ];
        break;
      case "certs":
        if (data.certifications) {
          res = [
            `> LOAD-CERTIFICATES`,
            ...data.certifications.map(c => `  [Awarded] ${c.name} (${c.issuer}, ${c.date})`)
          ];
        } else {
          res = ["No certificates loaded."];
        }
        break;
      case "socials":
        res = [
          `> CONNECT-NET`,
          ...data.socialLinks.map(l => `  - ${l.platform}: ${l.url}`)
        ];
        break;
      case "clear":
        setHistory([]);
        setCmdInput("");
        return;
      default:
        res = [`Command not found: '${raw}'. Type 'help' for available commands.`];
    }

    setHistory(prev => [...prev, `visitor@rishi-portfolio:~$ ${raw}`, ...res, ""]);
    setCmdInput("");
  };

  return (
    <div className={`min-h-screen font-mono p-4 md:p-8 flex flex-col justify-between relative transition-colors duration-300 ${isDark ? "bg-black" : "bg-zinc-50"}`}>
      {/* Blinking CRT scanline overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-20" />
      
      {/* Sticky Bracket Nav */}
      <div className={`sticky top-0 z-10 border-b pb-3 flex flex-wrap gap-4 text-xs font-mono uppercase justify-between items-center mb-6 transition-colors duration-300 ${isDark ? "bg-black/95 border-slate-900 text-slate-400" : "bg-zinc-50/95 border-zinc-200 text-zinc-650"}`} style={{ color: themeColor, borderColor: `${themeColor}20` }}>
        <span>[CLI_PORTFOLIO]</span>
        <div className="flex flex-wrap gap-2 text-[10px]">
          {sectionOrder.map(secId => {
            const cmd = sectionCommands[secId];
            if (!cmd) return null;
            return (
              <button 
                key={cmd} 
                onClick={() => executeCommand(cmd)}
                className="transition-colors hover:underline cursor-pointer border px-2 py-0.5 rounded"
                style={{ color: themeColor, borderColor: `${themeColor}20`, backgroundColor: isDark ? "black" : "white" }}
              >
                [{cmd.toUpperCase()}]
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Console history view */}
      <div className={`flex-1 max-w-4xl mx-auto w-full space-y-2 overflow-y-auto mb-6 p-6 shadow-inner text-sm md:text-base leading-relaxed border transition-colors duration-300 ${isDark ? "bg-black/60 border-slate-900" : "bg-white border-zinc-200 shadow-sm"}`} style={{ color: themeColor }}>
        {history.map((line, i) => (
          <p key={i} className="whitespace-pre-wrap">{line}</p>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input panel prompt */}
      <div className={`max-w-4xl mx-auto w-full border-t pt-4 flex gap-2 items-center transition-colors duration-300 ${isDark ? "bg-black border-slate-900 text-slate-400" : "bg-zinc-50 border-zinc-200 text-zinc-500"}`} style={{ borderColor: `${themeColor}20` }}>
        <span className="shrink-0 select-none" style={{ color: themeColor }}>visitor@rishi-portfolio:~$</span>
        <form onSubmit={(e) => { e.preventDefault(); executeCommand(cmdInput); }} className="flex-1 flex gap-2">
          <input 
            type="text" 
            value={cmdInput} 
            onChange={(e) => setCmdInput(e.target.value)} 
            placeholder="Type 'help' and press Enter..."
            className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 font-mono"
            style={{ color: themeColor }}
            autoFocus 
          />
          <button 
            type="submit" 
            className="border text-xs px-4 py-1.5 uppercase font-bold rounded transition-opacity hover:opacity-80"
            style={{ color: themeColor, borderColor: `${themeColor}40`, backgroundColor: `${themeColor}05` }}
          >
            Run
          </button>
        </form>
      </div>
    </div>
  );
};


/* ====== 3. GLASSMORPHIC AURORA ====== */
const GlassAurora = ({ data, isDark, themeColor, sectionOrder }: { data: PortfolioData; isDark?: boolean; themeColor: string; sectionOrder: string[] }) => {
  const [activeSection, setActiveSection] = useState("about");
  const sections = sectionOrder;
  
  return (
    <div className={`min-h-screen relative overflow-hidden py-12 px-6 transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-zinc-50 text-slate-900"}`}>
      {/* Animated glowing moving aurora lights */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none animate-float opacity-30" 
        style={{ backgroundColor: themeColor }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none animate-float [animation-delay:2s] opacity-20" 
        style={{ backgroundColor: themeColor }}
      />

      {/* Floater navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-6">
        <div className={`backdrop-blur-xl border rounded-full px-6 py-3 flex items-center justify-between shadow-lg transition-colors duration-300 ${isDark ? "bg-slate-900/40 border-slate-700/20" : "bg-white/80 border-slate-200"}`}>
          <a href="#" className="font-black text-sm" style={{ color: themeColor }}>SRK</a>
          <div className="flex gap-4 text-xs font-semibold">
            {sections.map(sec => (
              <a 
                key={sec} 
                href={`#${sec}`} 
                onClick={() => setActiveSection(sec)}
                className="transition-colors uppercase"
                style={activeSection === sec ? { color: themeColor } : { color: isDark ? "hsl(215 20% 65%)" : "hsl(215 20% 45%)" }}
              >
                {sec.slice(0, 4)}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative mx-auto max-w-4xl min-h-[90vh] flex flex-col justify-center pt-24 space-y-8">
        <motion.header 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`backdrop-blur-xl border p-10 rounded-3xl shadow-xl space-y-6 text-center transition-colors duration-300 ${isDark ? "bg-slate-900/30 border-slate-700/10" : "bg-white/70 border-slate-200"}`}
        >
          <div 
            className="inline-block border px-3 py-1 text-xs font-bold uppercase rounded-full shadow-inner tracking-widest animate-pulse"
            style={{ backgroundColor: `${themeColor}15`, color: themeColor, borderColor: `${themeColor}20` }}
          >
            ● Available for Opportunities
          </div>
          <h1 
            className="text-5xl font-black bg-clip-text text-transparent leading-none"
            style={{ backgroundImage: `linear-gradient(135deg, ${themeColor}, ${isDark ? "#c084fc" : "#6366f1"})` }}
          >
            {data.name}
          </h1>
          <p className="text-base tracking-wider font-semibold uppercase" style={{ color: themeColor }}>{data.title}</p>
          <p className={`text-sm max-w-xl mx-auto leading-relaxed ${isDark ? "text-slate-350" : "text-slate-600"}`}>{data.about}</p>
          <div className="flex justify-center gap-4 pt-4">
            <a 
              href="#projects" 
              className="hover:opacity-90 font-extrabold text-xs py-3 px-8 rounded-full shadow-md uppercase tracking-wider flex items-center gap-2"
              style={{ backgroundImage: `linear-gradient(135deg, ${themeColor}, ${isDark ? "#d8b4fe" : "#818cf8"})`, color: isDark ? "#020617" : "#ffffff" }}
            >
              Explore Projects <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.header>
      </div>

      <div className="relative mx-auto max-w-4xl space-y-12 pt-8">
        {sections.map((sectionId) => {
          switch (sectionId) {
            case "about":
              return (
                <motion.div 
                  id="about"
                  key="about"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`backdrop-blur-xl border p-8 rounded-3xl shadow-lg space-y-6 scroll-mt-24 transition-colors duration-300 ${isDark ? "bg-slate-900/20 border-slate-700/10" : "bg-white/50 border-slate-200"}`}
                >
                  <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: themeColor }}>About Me</h2>
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    {data.photo && (
                      <motion.div initial={{ scale: 0.9 }} whileInView={{ scale: 1 }} className="shrink-0">
                        <img src={data.photo} alt={data.name} className="h-24 w-24 rounded-2xl object-cover border shadow-md" style={{ borderColor: themeColor }} />
                      </motion.div>
                    )}
                    <div className="space-y-4 flex-1">
                      <p className={`text-sm leading-relaxed ${isDark ? "text-slate-350" : "text-slate-700"}`}>{data.about}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                        {data.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" style={{ color: themeColor }} /> <span>{data.location}</span></div>}
                        {data.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" style={{ color: themeColor }} /> <a href={`mailto:${data.email}`} className="hover:underline">{data.email}</a></div>}
                        {data.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" style={{ color: themeColor }} /> <span>{data.phone}</span></div>}
                        {data.website && <div className="flex items-center gap-2"><ExternalLink className="h-4 w-4 shrink-0" style={{ color: themeColor }} /> <a href={data.website} target="_blank" rel="noreferrer" className="underline hover:opacity-80">{data.website}</a></div>}
                      </div>

                      {data.languages && data.languages.length > 0 && (
                        <div className="pt-2">
                          <span className={`block text-[10px] uppercase tracking-wider mb-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Languages</span>
                          <div className="flex flex-wrap gap-1.5">
                            {data.languages.map(l => (
                              <span key={l.name} className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border" style={{ color: themeColor, borderColor: `${themeColor}25`, backgroundColor: `${themeColor}08` }}>
                                {l.name} ({l.level})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            case "skills":
              return (
                <motion.div 
                  id="skills"
                  key="skills"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`backdrop-blur-xl border p-8 rounded-3xl shadow-lg space-y-4 scroll-mt-24 transition-colors duration-300 ${isDark ? "bg-slate-900/20 border-slate-700/10" : "bg-white/50 border-slate-200"}`}
                >
                  <h2 className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: themeColor }}>Expertise</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((s, si) => (
                      <motion.span 
                        key={s} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: si * 0.03 }}
                        whileHover={{ scale: 1.05 }}
                        className={`rounded-full px-4 py-2 text-xs border shadow-inner transition-colors duration-200 ${isDark ? "bg-slate-800/40 border-purple-500/10 hover:border-cyan-500/30" : "bg-white border-slate-200 hover:border-slate-300"}`}
                        style={{ color: themeColor }}
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              );
            case "projects":
              return (
                <motion.div 
                  id="projects"
                  key="projects"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`backdrop-blur-xl border p-8 rounded-3xl shadow-lg space-y-6 scroll-mt-24 transition-colors duration-300 ${isDark ? "bg-slate-900/20 border-slate-700/10" : "bg-white/50 border-slate-200"}`}
                >
                  <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: themeColor }}>Featured Projects</h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {data.projects.map((p, pi) => (
                      <motion.div 
                        key={p.title} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: pi * 0.08 }}
                        className={`rounded-2xl border flex flex-col justify-between transition-all hover:translate-y-[-3px] overflow-hidden ${isDark ? "bg-slate-950/40 border-slate-850 hover:border-slate-800" : "bg-white border-slate-200 hover:border-slate-300"}`}
                      >
                        {p.imageUrl ? (
                          <div className="h-44 w-full overflow-hidden border-b border-white/5">
                            <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                          </div>
                        ) : (
                          <div className="h-32 w-full flex items-center justify-center border-b border-white/5 bg-white/5">
                            <Code className="h-8 w-8 opacity-20" style={{ color: themeColor }} />
                          </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className={`font-bold text-sm mb-1.5 ${isDark ? "text-slate-200" : "text-slate-800"}`}>{p.title}</h3>
                            <p className={`text-xs mb-3 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{p.description}</p>
                            <div className="flex flex-wrap gap-1 mb-4">
                              {p.tags.map((tag) => (
                                <span 
                                  key={tag} 
                                  className="text-[9px] px-2 py-0.5 rounded-sm border font-semibold"
                                  style={{ color: themeColor, backgroundColor: `${themeColor}10`, borderColor: `${themeColor}20` }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-4 text-xs font-semibold">
                            {p.link && (
                              <a href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-slate-200">
                                <Github className="h-3.5 w-3.5" /> Code
                              </a>
                            )}
                            {p.liveLink && (
                              <a href={p.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:opacity-90" style={{ color: themeColor }}>
                                <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            case "experience":
              return (
                <motion.div 
                  id="experience"
                  key="experience"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`backdrop-blur-xl border p-8 rounded-3xl shadow-lg space-y-6 scroll-mt-24 transition-colors duration-300 ${isDark ? "bg-slate-900/20 border-slate-700/10" : "bg-white/50 border-slate-200"}`}
                >
                  <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: themeColor }}>Work History</h2>
                  <div className="space-y-6">
                    {data.experience.map((e, ei) => (
                      <motion.div 
                        key={e.role} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ei * 0.08 }}
                        className="border-l-2 pl-4 space-y-1"
                        style={{ borderLeftColor: `${themeColor}40` }}
                      >
                        <h4 className={`font-bold text-xs ${isDark ? "text-slate-200" : "text-slate-800"}`}>{e.role}</h4>
                        <p className="text-xs font-semibold" style={{ color: themeColor }}>{e.company} · {e.duration}</p>
                        <p className={`text-xs leading-relaxed pt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{e.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            case "education":
              return (
                <motion.div 
                  id="education"
                  key="education"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`backdrop-blur-xl border p-8 rounded-3xl shadow-lg space-y-4 scroll-mt-24 transition-colors duration-300 ${isDark ? "bg-slate-900/20 border-slate-700/10" : "bg-white/50 border-slate-200"}`}
                >
                  <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: themeColor }}>Studies</h2>
                  <div className="space-y-4">
                    {data.education.map((edu, edui) => (
                      <motion.div 
                        key={edu.degree}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: edui * 0.08 }}
                      >
                        <p className={`font-semibold text-xs ${isDark ? "text-slate-200" : "text-slate-800"}`}>{edu.degree}</p>
                        <p className={`text-[10px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{edu.school} · {edu.year}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            case "certifications":
              return data.certifications && data.certifications.length > 0 ? (
                <motion.div 
                  id="certifications"
                  key="certifications"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`backdrop-blur-xl border p-8 rounded-3xl shadow-lg space-y-4 scroll-mt-24 transition-colors duration-300 ${isDark ? "bg-slate-900/20 border-slate-700/10" : "bg-white/50 border-slate-200"}`}
                >
                  <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: themeColor }}>Certifications</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {data.certifications.map((c, ci) => (
                      <motion.div 
                        key={c.name} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: ci * 0.08 }}
                        className={`border p-4 rounded-xl flex items-center gap-4 transition-colors ${isDark ? "bg-slate-950/40 border-slate-900/50" : "bg-white border-slate-200 shadow-sm"}`}
                      >
                        {c.imageUrl ? (
                          <img src={c.imageUrl} alt={c.name} className="h-10 w-10 rounded object-cover shrink-0" />
                        ) : (
                          <Award className="h-5 w-5 shrink-0" style={{ color: themeColor }} />
                        )}
                        <div className="min-w-0">
                          <h4 className={`font-semibold text-xs truncate ${isDark ? "text-slate-250" : "text-slate-800"}`}>{c.name}</h4>
                          <p className={`text-[10px] mt-0.5 ${isDark ? "text-slate-500" : "text-slate-550"}`}>{c.issuer} · {c.date}</p>
                          {c.credentialUrl && (
                            <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-[9px] font-bold mt-1 inline-flex items-center gap-1 hover:underline" style={{ color: themeColor }}>
                              Verify <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : null;
            case "achievements":
              return data.achievements && data.achievements.length > 0 ? (
                <motion.div 
                  id="achievements"
                  key="achievements"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`backdrop-blur-xl border p-8 rounded-3xl shadow-lg space-y-4 scroll-mt-24 transition-colors duration-300 ${isDark ? "bg-slate-900/20 border-slate-700/10" : "bg-white/50 border-slate-200"}`}
                >
                  <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: themeColor }}>Achievements</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {data.achievements.map((ach, ai) => (
                      <motion.div 
                        key={ai}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ai * 0.07 }}
                        className={`p-4 border rounded-xl flex items-start gap-3 ${isDark ? "bg-slate-950/40 border-slate-900/50" : "bg-white border-slate-200 shadow-sm"}`}
                      >
                        <Award className="h-5 w-5 shrink-0 mt-0.5" style={{ color: themeColor }} />
                        <span className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{ach}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : null;
            case "languages":
              return data.languages && data.languages.length > 0 ? (
                <motion.div 
                  id="languages"
                  key="languages"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`backdrop-blur-xl border p-8 rounded-3xl shadow-lg space-y-4 scroll-mt-24 transition-colors duration-300 ${isDark ? "bg-slate-900/20 border-slate-700/10" : "bg-white/50 border-slate-200"}`}
                >
                  <h2 className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: themeColor }}>Languages</h2>
                  <div className="flex flex-wrap gap-2.5">
                    {data.languages.map((l, li) => (
                      <motion.span 
                        key={l.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: li * 0.05 }}
                        className={`rounded-full px-4 py-2 text-xs border shadow-inner ${isDark ? "bg-slate-800/40 border-purple-500/10" : "bg-white border-slate-200"}`}
                        style={{ color: themeColor }}
                      >
                        {l.name} · {l.level}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ) : null;
            case "contact":
              return (
                <motion.div 
                  id="contact"
                  key="contact"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`backdrop-blur-xl border p-8 rounded-3xl shadow-lg space-y-6 scroll-mt-24 transition-colors duration-300 ${isDark ? "bg-slate-900/20 border-slate-700/10" : "bg-white/50 border-slate-200"}`}
                >
                  <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: themeColor }}>Connect</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className={`space-y-4 text-sm ${isDark ? "text-slate-350" : "text-slate-600"}`}>
                      <p>Let's collaborate or discuss system features. Reach out via email or use the secure message form.</p>
                      <div className="space-y-2.5 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" style={{ color: themeColor }} />
                          <a href={`mailto:${data.email}`} className="hover:underline">{data.email || "sai.rishi@nic-intern.in"}</a>
                        </div>
                        {data.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" style={{ color: themeColor }} />
                            <span>{data.phone}</span>
                          </div>
                        )}
                        {data.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" style={{ color: themeColor }} />
                            <span>{data.location}</span>
                          </div>
                        )}
                      </div>
                      <div className="pt-2">
                        <SocialIcons links={data.socialLinks} color={themeColor} />
                      </div>
                    </div>
                    <CommonContactForm 
                      inputStyle={`w-full p-2.5 border rounded-xl text-xs focus:outline-none ${isDark ? "bg-slate-950 border-slate-850 text-white focus:border-slate-800" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-350"}`}
                      buttonStyle="w-full py-2.5 font-bold rounded-xl hover:opacity-90 uppercase tracking-widest text-xs transition-opacity"
                      buttonColor={themeColor}
                    />
                  </div>
                </motion.div>
              );
            default:
              return null;
          }
        })}

        <footer className={`flex justify-between items-center border-t pt-6 transition-colors duration-300 ${isDark ? "border-slate-900" : "border-slate-200"}`}>
          <SocialIcons links={data.socialLinks} color={themeColor} />
          <span className={`text-[9px] uppercase font-bold tracking-widest ${isDark ? "text-slate-600" : "text-slate-400"}`}>Glass & Aurora Design</span>
        </footer>
      </div>
    </div>
  );
};


/* ====== 4. CYBERPUNK GLITCH ====== */
const CyberpunkGlitch = ({ data, isDark, themeColor, sectionOrder }: { data: PortfolioData; isDark?: boolean; themeColor: string; sectionOrder: string[] }) => {
  const [activeSection, setActiveSection] = useState("about");
  const sections = sectionOrder;
  
  return (
    <div className={`min-h-screen font-mono py-16 px-6 relative transition-colors duration-300 ${isDark ? "bg-zinc-950 text-zinc-100 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]" : "bg-white text-zinc-900 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))]"} bg-[size:100%_4px,3px_100%]`}>
      {/* Sticky Glitch Nav */}
      <nav className={`sticky top-0 z-40 pb-3 flex items-center justify-between mb-10 border-b-2 transition-colors duration-300 ${isDark ? "bg-zinc-950 border-slate-900" : "bg-white border-zinc-200"}`}>
        <a href="#" className="font-black tracking-widest text-sm" style={{ color: themeColor }}>// CYBER_PORT</a>
        <div className="flex gap-4 text-[10px] font-bold">
          {sections.map(sec => (
            <a 
              key={sec} 
              href={`#${sec}`} 
              onClick={() => setActiveSection(sec)}
              className="transition-colors uppercase pb-1"
              style={activeSection === sec ? { color: themeColor, borderBottom: `2px solid ${themeColor}` } : { color: isDark ? "hsl(215 20% 65%)" : "hsl(215 20% 45%)" }}
            >
              {sec.slice(0, 4)}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl min-h-[75vh] flex flex-col justify-center pl-6 md:pl-10 space-y-6 border-l-4"
        style={{ borderLeftColor: themeColor }}
      >
        <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: themeColor }}>// SYSTEM DIRECTORY UPLINKED</div>
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {data.photo && (
            <div className="relative h-28 w-28 shrink-0 overflow-hidden border-2 p-1" style={{ borderColor: themeColor }}>
              <img src={data.photo} alt={data.name} className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
          )}
          <div className="space-y-4">
            <h1 
              className="text-5xl md:text-6xl font-black bg-clip-text text-transparent uppercase tracking-tighter"
              style={{ backgroundImage: `linear-gradient(135deg, ${themeColor}, ${isDark ? "#ec4899" : "#3b82f6"})` }}
            >
              {data.name}
            </h1>
            <p className="text-sm md:text-base font-bold uppercase tracking-wider">// {data.title}</p>
          </div>
        </div>
        <p className={`text-xs leading-relaxed max-w-xl ${isDark ? "text-zinc-400" : "text-zinc-650"}`}>{data.about}</p>
        <div className="flex gap-4 pt-4">
          <a 
            href="#projects" 
            className="border font-bold text-xs py-2.5 px-6 rounded-none uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            style={{ borderColor: themeColor, color: themeColor, backgroundColor: `${themeColor}10` }}
          >
            Access Projects <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </motion.div>

      <div className={`mx-auto max-w-4xl space-y-16 pl-6 md:pl-10 pt-16 border-l-4 ${isDark ? "border-zinc-800/40" : "border-zinc-200/50"}`}>
        {sections.map((sectionId) => {
          switch (sectionId) {
            case "about":
              return (
                <motion.section 
                  id="about" 
                  key="about" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4 scroll-mt-24"
                >
                  <h2 className="font-black uppercase tracking-[0.2em] text-xs" style={{ color: themeColor }}>// OVERVIEW_INFO</h2>
                  <div className={`border p-6 space-y-4 ${isDark ? "border-zinc-900 bg-zinc-900/30" : "border-zinc-200 bg-zinc-50/50"}`}>
                    <p className={`leading-relaxed text-sm ${isDark ? "text-zinc-400" : "text-zinc-750"}`}>{data.about}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                      {data.location && <div className="text-zinc-500 font-mono">LOCATION: <span className={isDark ? "text-zinc-300" : "text-zinc-800"}>{data.location}</span></div>}
                      {data.email && <div className="text-zinc-500 font-mono">UPLINK: <a href={`mailto:${data.email}`} className="underline" style={{ color: themeColor }}>{data.email}</a></div>}
                      {data.phone && <div className="text-zinc-500 font-mono">SECURE_COMM: <span className={isDark ? "text-zinc-300" : "text-zinc-800"}>{data.phone}</span></div>}
                      {data.website && <div className="text-zinc-500 font-mono">NET_NODE: <a href={data.website} target="_blank" rel="noreferrer" className="underline" style={{ color: themeColor }}>{data.website}</a></div>}
                    </div>

                    {data.languages && data.languages.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] uppercase text-zinc-500 block mb-1">LANGUAGES_LOGGED:</span>
                        <div className="flex flex-wrap gap-2">
                          {data.languages.map(l => (
                            <span key={l.name} className="border px-2 py-0.5 text-[10px]" style={{ color: themeColor, borderColor: `${themeColor}20` }}>
                              {l.name}:{l.level.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.section>
              );
            case "skills":
              return (
                <motion.section 
                  id="skills" 
                  key="skills" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4 scroll-mt-24"
                >
                  <h2 className="font-black uppercase tracking-[0.2em] text-xs" style={{ color: themeColor }}>// SKILL_CHIPS</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((s, si) => (
                      <motion.span 
                        key={s} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: si * 0.03 }}
                        className={`border px-3 py-1.5 text-xs transition-all select-none hover:translate-y-[-1px] ${isDark ? "bg-zinc-900/10 border-zinc-800 text-zinc-400 hover:bg-zinc-900/30 hover:border-zinc-700" : "bg-white border-zinc-250 text-zinc-650 hover:bg-zinc-50"}`}
                        style={{ color: themeColor }}
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </motion.section>
              );
            case "projects":
              return (
                <motion.section 
                  id="projects" 
                  key="projects" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6 scroll-mt-24"
                >
                  <h2 className="font-black uppercase tracking-[0.2em] text-xs" style={{ color: themeColor }}>// DATA_REPOSITORIES</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {data.projects.map((p, pi) => (
                      <motion.div 
                        key={p.title} 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: pi * 0.08 }}
                        className={`border flex flex-col justify-between overflow-hidden transition-all hover:translate-y-[-2px] ${isDark ? "border-zinc-900 bg-zinc-900/40 hover:border-zinc-800" : "border-zinc-200 bg-white hover:border-zinc-300"}`}
                      >
                        {p.imageUrl ? (
                          <div className="h-40 w-full overflow-hidden border-b border-zinc-900">
                            <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                          </div>
                        ) : (
                          <div className="h-24 w-full flex items-center justify-center border-b border-zinc-900 bg-zinc-900/10">
                            <Code className="h-6 w-6 opacity-20" style={{ color: themeColor }} />
                          </div>
                        )}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-extrabold text-sm uppercase tracking-wide" style={{ color: themeColor }}>{p.title}</h3>
                            <p className={`text-xs mt-1.5 leading-relaxed line-clamp-3 mb-4 ${isDark ? "text-zinc-400" : "text-zinc-650"}`}>{p.description}</p>
                            <div className="flex flex-wrap gap-1 mb-4">
                              {p.tags.map((tag) => (
                                <span 
                                  key={tag} 
                                  className="text-[9px] border px-2 py-0.5 rounded-sm"
                                  style={{ color: themeColor, borderColor: `${themeColor}20`, backgroundColor: `${themeColor}05` }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-4 text-[11px] font-bold">
                            {p.link && (
                              <a href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-slate-200">
                                <Github className="h-3 w-3" /> Source
                              </a>
                            )}
                            {p.liveLink && (
                              <a href={p.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline" style={{ color: themeColor }}>
                                <ExternalLink className="h-3 w-3" /> Live
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );
            case "experience":
              return (
                <motion.section 
                  id="experience" 
                  key="experience" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6 scroll-mt-24"
                >
                  <h2 className="font-black uppercase tracking-[0.2em] text-xs" style={{ color: themeColor }}>// WORKPLACE_LOGS</h2>
                  <div className="space-y-4">
                    {data.experience.map((e, ei) => (
                      <motion.div 
                        key={e.role} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ei * 0.08 }}
                        className={`border-l pl-4 p-4 transition-colors ${isDark ? "border-zinc-900 bg-zinc-900/10" : "border-zinc-200 bg-zinc-50/50"}`}
                        style={{ borderLeftColor: themeColor }}
                      >
                        <h3 className="font-semibold text-sm uppercase" style={{ color: themeColor }}>{e.role}</h3>
                        <p className="text-xs mb-2 text-zinc-450">{e.company} · {e.duration}</p>
                        <p className={`text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-650"}`}>{e.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );
            case "education":
              return (
                <motion.section 
                  id="education" 
                  key="education" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4 scroll-mt-24"
                >
                  <h2 className="font-black uppercase tracking-[0.2em] text-xs" style={{ color: themeColor }}>// ACADEMICS_FILE</h2>
                  {data.education.map((edu, edui) => (
                    <motion.div 
                      key={edu.degree} 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: edui * 0.08 }}
                      className={`border p-4 transition-colors ${isDark ? "border-zinc-900 bg-zinc-900/20" : "border-zinc-200 bg-white shadow-sm"}`}
                    >
                      <p className={`font-bold text-sm ${isDark ? "text-zinc-250" : "text-zinc-800"}`}>{edu.degree}</p>
                      <p className={`text-xs mt-1.5 ${isDark ? "text-zinc-450" : "text-zinc-550"}`}>{edu.school} · {edu.year}</p>
                    </motion.div>
                  ))}
                </motion.section>
              );
            case "certifications":
              return data.certifications && data.certifications.length > 0 ? (
                <motion.section 
                  id="certifications" 
                  key="certifications" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4 scroll-mt-24"
                >
                  <h2 className="font-black uppercase tracking-[0.2em] text-xs" style={{ color: themeColor }}>// AUTH_CERTIFICATES</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {data.certifications.map((c, ci) => (
                      <motion.div 
                        key={c.name} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: ci * 0.08 }}
                        className={`border p-4 flex items-center gap-4 transition-colors ${isDark ? "border-zinc-900 bg-zinc-950/40" : "border-zinc-200 bg-zinc-50"}`}
                      >
                        {c.imageUrl ? (
                          <img src={c.imageUrl} alt={c.name} className="h-10 w-10 object-cover rounded shrink-0" />
                        ) : (
                          <Award className="h-5 w-5 shrink-0" style={{ color: themeColor }} />
                        )}
                        <div className="min-w-0">
                          <h4 className={`font-bold text-xs truncate ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>{c.name}</h4>
                          <p className={`text-[10px] mt-1 ${isDark ? "text-slate-500" : "text-slate-650"}`}>{c.issuer} · {c.date}</p>
                          {c.credentialUrl && (
                            <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-[9px] font-bold mt-1.5 inline-flex items-center gap-1 hover:underline" style={{ color: themeColor }}>
                              Verify <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ) : null;
            case "achievements":
              return data.achievements && data.achievements.length > 0 ? (
                <motion.section 
                  id="achievements" 
                  key="achievements" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4 scroll-mt-24"
                >
                  <h2 className="font-black uppercase tracking-[0.2em] text-xs" style={{ color: themeColor }}>// SYSTEM_ACHIEVEMENTS</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {data.achievements.map((ach, ai) => (
                      <motion.div 
                        key={ai} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ai * 0.08 }}
                        className={`border p-4 flex items-start gap-3 ${isDark ? "border-zinc-900 bg-zinc-950/40" : "border-zinc-200 bg-zinc-50"}`}
                      >
                        <Award className="h-5 w-5 shrink-0 mt-0.5" style={{ color: themeColor }} />
                        <span className={`text-xs leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-750"}`}>{ach}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ) : null;
            case "languages":
              return data.languages && data.languages.length > 0 ? (
                <motion.section 
                  id="languages" 
                  key="languages" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4 scroll-mt-24"
                >
                  <h2 className="font-black uppercase tracking-[0.2em] text-xs" style={{ color: themeColor }}>// COMS_LANGUAGES</h2>
                  <div className="flex flex-wrap gap-2.5">
                    {data.languages.map((l, li) => (
                      <motion.span 
                        key={l.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: li * 0.05 }}
                        className={`border px-3 py-1.5 text-xs ${isDark ? "bg-zinc-900/10 border-zinc-800 text-zinc-400" : "bg-white border-zinc-250 text-zinc-650"}`}
                        style={{ color: themeColor }}
                      >
                        {l.name}::{l.level.toUpperCase()}
                      </motion.span>
                    ))}
                  </div>
                </motion.section>
              ) : null;
            case "contact":
              return (
                <motion.section 
                  id="contact" 
                  key="contact" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6 scroll-mt-24"
                >
                  <h2 className="font-black uppercase tracking-[0.2em] text-xs" style={{ color: themeColor }}>// SECURE_CONNECT</h2>
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className={`space-y-4 text-xs ${isDark ? "text-zinc-450" : "text-zinc-650"}`}>
                      <p>Authenticate connection or send encrypted messages. Social pathways listed below.</p>
                      <div className="space-y-2.5 font-mono">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" style={{ color: themeColor }} />
                          <a href={`mailto:${data.email}`} className="underline">{data.email || "sai.rishi@nic-intern.in"}</a>
                        </div>
                        {data.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" style={{ color: themeColor }} />
                            <span>{data.phone}</span>
                          </div>
                        )}
                        {data.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" style={{ color: themeColor }} />
                            <span>{data.location}</span>
                          </div>
                        )}
                      </div>
                      <div className="pt-4">
                        <SocialIcons links={data.socialLinks} color={themeColor} />
                      </div>
                    </div>
                    <CommonContactForm 
                      inputStyle={`w-full p-2.5 border rounded-none text-xs focus:outline-none font-mono ${isDark ? "bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-300"}`}
                      buttonStyle="w-full py-2.5 font-extrabold rounded-none uppercase tracking-widest text-xs transition-opacity hover:opacity-90"
                      buttonColor={themeColor}
                      buttonTextColor={isDark ? "#020617" : "#ffffff"}
                    />
                  </div>
                </motion.section>
              );
            default:
              return null;
          }
        })}

        <footer className={`border-t pt-6 flex items-center justify-between text-xs transition-colors duration-300 ${isDark ? "border-zinc-900" : "border-zinc-200"}`}>
          <SocialIcons links={data.socialLinks} color={themeColor} />
          <span className="uppercase tracking-wider font-bold" style={{ color: themeColor }}>// CONNECTED_NODE</span>
        </footer>
      </div>
    </div>
  );
};


/* ====== 5. NEOBRUTALIST BOLD ====== */
const NeobrutalistBold = ({ data, isDark, themeColor, sectionOrder }: { data: PortfolioData; isDark?: boolean; themeColor: string; sectionOrder: string[] }) => {
  const sections = sectionOrder;
  
  return (
    <div className={`min-h-screen font-sans pb-20 px-6 transition-colors duration-300 ${isDark ? "bg-zinc-950 text-zinc-100" : "bg-amber-50/50 text-zinc-950"}`}>
      {/* Sticky Brutalist Nav */}
      <nav className={`sticky top-0 z-40 border-b-4 border-black py-4 px-2 flex items-center justify-between transition-colors duration-300 ${isDark ? "bg-zinc-900 text-white" : "bg-amber-100 text-black"}`}>
        <a href="#" className="text-xl font-black tracking-tighter border-4 border-black bg-white text-black px-3 py-1 shadow-[2px_2px_0px_#000]">SRK</a>
        <div className="flex gap-2 sm:gap-4 text-xs font-black uppercase">
          {sections.map(sec => (
            <a 
              key={sec} 
              href={`#${sec}`} 
              className="hover:bg-cyan-200 border-2 border-black bg-white text-black px-2 py-0.5 transition-colors shadow-[1.5px_1.5px_0px_#000]"
            >
              {sec.slice(0, 4)}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-3xl mx-auto min-h-[80vh] flex flex-col justify-center space-y-6 pt-16">
        <motion.header 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className={`border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_#000] space-y-6 transition-colors duration-300 ${isDark ? "bg-zinc-900" : "bg-white"}`}
        >
          <div 
            className="inline-block border-2 border-black px-4 py-1 text-xs font-black tracking-wider uppercase shadow-[2.5px_2.5px_0px_#000]"
            style={{ backgroundColor: themeColor, color: isDark ? "#000000" : "#ffffff" }}
          >
            ● OPEN FOR ROLES
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {data.photo && (
              <motion.div whileHover={{ scale: 1.05 }} className="shrink-0 border-4 border-black shadow-[4px_4px_0px_#000] bg-white overflow-hidden p-1">
                <img src={data.photo} alt={data.name} className="h-28 w-28 object-cover" />
              </motion.div>
            )}
            <div className="space-y-4 text-center sm:text-left">
              <h1 className={`text-5xl md:text-6xl font-black uppercase tracking-tight leading-none ${isDark ? "text-white" : "text-black"}`}>{data.name}</h1>
              <div className="inline-block bg-pink-200 text-black border-2 border-black px-4 py-1.5 text-sm font-black uppercase shadow-[2.5px_2.5px_0px_#000]">{data.title}</div>
            </div>
          </div>

          <p className={`text-sm font-bold leading-relaxed border-t-2 border-black pt-4 ${isDark ? "text-zinc-350" : "text-zinc-700"}`}>{data.about}</p>
          <div className="flex flex-wrap gap-4 pt-2 justify-center sm:justify-start">
            <a 
              href="#projects" 
              className="border-4 border-black px-6 py-3 font-black text-xs uppercase shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000] transition-all"
              style={{ backgroundColor: themeColor, color: isDark ? "#000000" : "#ffffff" }}
            >
              EXPLORE PORTFOLIO
            </a>
          </div>
        </motion.header>
      </div>

      <div className="max-w-3xl mx-auto space-y-16 pt-8">
        {sections.map((sectionId) => {
          switch (sectionId) {
            case "about":
              return (
                <motion.section 
                  id="about" 
                  key="about" 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="space-y-4 scroll-mt-24"
                >
                  <h2 className={`text-2xl font-black uppercase border-b-4 border-black pb-2 ${isDark ? "text-white" : "text-black"}`}>WHO I AM</h2>
                  <div className={`border-2 border-black p-6 font-semibold shadow-[4px_4px_0px_#000] space-y-4 transition-colors duration-300 ${isDark ? "bg-zinc-900 text-zinc-350" : "bg-white text-zinc-900"}`}>
                    <p className="leading-relaxed text-sm">{data.about}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-4 border-t-2 border-black/10 font-bold uppercase tracking-wider">
                      {data.location && <div>LOCATION: <span className="underline">{data.location}</span></div>}
                      {data.email && <div>EMAIL: <a href={`mailto:${data.email}`} className="underline text-pink-500">{data.email}</a></div>}
                      {data.phone && <div>TELECOMM: <span className="underline">{data.phone}</span></div>}
                      {data.website && <div>WEB: <a href={data.website} target="_blank" rel="noreferrer" className="underline text-cyan-500">{data.website}</a></div>}
                    </div>

                    {data.languages && data.languages.length > 0 && (
                      <div className="pt-2 border-t border-black/10">
                        <span className="text-[10px] uppercase text-zinc-500 block mb-2 font-black">LANGUAGES SPOKEN:</span>
                        <div className="flex flex-wrap gap-2">
                          {data.languages.map(l => (
                            <span key={l.name} className="border-2 border-black px-2.5 py-1 text-xs font-black bg-pink-100 text-black shadow-[1.5px_1.5px_0px_#000]">
                              {l.name} · {l.level.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.section>
              );
            case "skills":
              return (
                <motion.section 
                  id="skills" 
                  key="skills" 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="space-y-4 scroll-mt-24"
                >
                  <h2 className={`text-2xl font-black uppercase border-b-4 border-black pb-2 ${isDark ? "text-white" : "text-black"}`}>CAPABILITIES</h2>
                  <div className="flex flex-wrap gap-2.5">
                    {data.skills.map((s, si) => (
                      <motion.span 
                        key={s} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 120, damping: 10, delay: si * 0.03 }}
                        whileHover={{ scale: 1.05 }}
                        className="border-2 border-black px-4 py-2 text-xs font-black shadow-[3px_3px_0px_#000] hover:bg-opacity-80 transition-colors uppercase"
                        style={{ backgroundColor: themeColor, color: isDark ? "#000000" : "#ffffff" }}
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </motion.section>
              );
            case "projects":
              return (
                <motion.section 
                  id="projects" 
                  key="projects" 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="space-y-6 scroll-mt-24"
                >
                  <h2 className={`text-2xl font-black uppercase border-b-4 border-black pb-2 ${isDark ? "text-white" : "text-black"}`}>PROJECT ARCHIVES</h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {data.projects.map((p, pi) => (
                      <motion.div 
                        key={p.title} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 100, damping: 12, delay: pi * 0.08 }}
                        className={`border-2 border-black p-5 shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all flex flex-col justify-between overflow-hidden ${isDark ? "bg-zinc-900 text-zinc-300" : "bg-white text-black"}`}
                      >
                        <div>
                          {p.imageUrl ? (
                            <div className="border-2 border-black mb-4 h-36 w-full overflow-hidden bg-white">
                              <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                            </div>
                          ) : (
                            <div className="border-2 border-black mb-4 h-24 w-full bg-stone-100 flex items-center justify-center">
                              <Code className="h-8 w-8 text-black opacity-30" />
                            </div>
                          )}
                          <h3 className={`font-extrabold text-sm uppercase tracking-wide border-b-2 border-black pb-1 mb-2 ${isDark ? "text-white" : "text-black"}`}>{p.title}</h3>
                          <p className={`text-xs font-semibold mb-3 leading-relaxed line-clamp-3 ${isDark ? "text-zinc-400" : "text-zinc-800"}`}>{p.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {p.tags.map((tag) => (
                              <span key={tag} className="text-[9px] bg-emerald-250 text-black border border-black px-2 py-0.5 font-bold uppercase">{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-4 mt-6 text-xs font-black uppercase pt-2 border-t border-black/10">
                          {p.link && (
                            <a href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-cyan-200 text-black border border-black px-2 py-0.5 shadow-[1px_1px_0px_#000] hover:scale-105 transition-transform">
                              CODE
                            </a>
                          )}
                          {p.liveLink ? (
                            <a 
                              href={p.liveLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="flex items-center gap-1 border border-black px-2 py-0.5 shadow-[1px_1px_0px_#000] hover:scale-105 transition-transform"
                              style={{ backgroundColor: themeColor, color: isDark ? "#000000" : "#ffffff" }}
                            >
                              LIVE DEMO
                            </a>
                          ) : null}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );
            case "experience":
              return (
                <motion.section 
                  id="experience" 
                  key="experience" 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="space-y-6 scroll-mt-24"
                >
                  <h2 className={`text-2xl font-black uppercase border-b-4 border-black pb-2 ${isDark ? "text-white" : "text-black"}`}>STATIONS</h2>
                  <div className="space-y-4">
                    {data.experience.map((e, ei) => (
                      <motion.div 
                        key={e.role} 
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ei * 0.08 }}
                        className={`border-2 border-black p-5 shadow-[4px_4px_0px_#000] ${isDark ? "bg-zinc-900 text-zinc-300" : "bg-white text-black"}`}
                      >
                        <h3 className={`font-black text-sm uppercase ${isDark ? "text-white" : "text-black"}`}>{e.role}</h3>
                        <p className="text-xs font-bold mb-2 text-violet-650" style={{ color: themeColor }}>{e.company} / {e.duration}</p>
                        <p className={`text-xs font-semibold leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-800"}`}>{e.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );
            case "education":
              return (
                <motion.section 
                  id="education" 
                  key="education" 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="space-y-4 scroll-mt-24"
                >
                  <h2 className={`text-2xl font-black uppercase border-b-4 border-black pb-2 ${isDark ? "text-white" : "text-black"}`}>STUDIES</h2>
                  <div className="space-y-2">
                    {data.education.map((edu, edui) => (
                      <motion.div 
                        key={edu.degree} 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: edui * 0.08 }}
                        className={`border-2 border-black p-4 shadow-[2px_2px_0px_#000] ${isDark ? "bg-zinc-900 text-zinc-300" : "bg-white text-black"}`}
                      >
                        <p className={`font-extrabold text-sm ${isDark ? "text-white" : "text-black"}`}>{edu.degree}</p>
                        <p className={`text-xs font-medium mt-1 ${isDark ? "text-zinc-400" : "text-zinc-700"}`}>{edu.school} · {edu.year}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );
            case "certifications":
              return data.certifications && data.certifications.length > 0 ? (
                <motion.section 
                  id="certifications" 
                  key="certifications" 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="space-y-4 scroll-mt-24"
                >
                  <h2 className={`text-2xl font-black uppercase border-b-4 border-black pb-2 ${isDark ? "text-white" : "text-black"}`}>CREDENTIALS</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {data.certifications.map((c, ci) => (
                      <motion.div 
                        key={c.name} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: ci * 0.08 }}
                        className={`border-2 border-black p-4 shadow-[3px_3px_0px_#000] flex items-center gap-3 ${isDark ? "bg-zinc-900 text-zinc-300" : "bg-white text-black"}`}
                      >
                        {c.imageUrl ? (
                          <img src={c.imageUrl} alt={c.name} className="h-10 w-10 object-cover rounded shrink-0 border border-black shadow-[1px_1px_0px_#000]" />
                        ) : (
                          <Award className="h-5 w-5 shrink-0" style={{ color: themeColor }} />
                        )}
                        <div>
                          <h4 className={`font-black text-xs ${isDark ? "text-white" : "text-black"}`}>{c.name.toUpperCase()}</h4>
                          <p className={`text-[10px] font-bold mt-1 ${isDark ? "text-zinc-450" : "text-zinc-650"}`}>{c.issuer} · {c.date}</p>
                          {c.credentialUrl && (
                            <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-[9px] font-black underline mt-2 block" style={{ color: themeColor }}>VERIFY LINK</a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ) : null;
            case "achievements":
              return data.achievements && data.achievements.length > 0 ? (
                <motion.section 
                  id="achievements" 
                  key="achievements" 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="space-y-4 scroll-mt-24"
                >
                  <h2 className={`text-2xl font-black uppercase border-b-4 border-black pb-2 ${isDark ? "text-white" : "text-black"}`}>HONORS</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {data.achievements.map((ach, ai) => (
                      <motion.div 
                        key={ai} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ai * 0.08 }}
                        className={`border-2 border-black p-4 shadow-[3px_3px_0px_#000] flex items-start gap-3 ${isDark ? "bg-zinc-900 text-zinc-300" : "bg-white text-black"}`}
                      >
                        <Award className="h-5 w-5 shrink-0 mt-0.5" style={{ color: themeColor }} />
                        <span className="text-xs font-black uppercase">{ach}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ) : null;
            case "contact":
              return (
                <motion.section 
                  id="contact" 
                  key="contact" 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6 scroll-mt-24"
                >
                  <h2 className={`text-2xl font-black uppercase border-b-4 border-black pb-2 ${isDark ? "text-white" : "text-black"}`}>SOCIALS & REACH</h2>
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className={`space-y-4 text-xs font-bold ${isDark ? "text-zinc-400" : "text-zinc-800"}`}>
                      <p className="leading-relaxed font-black uppercase">Ping me using the form or locate active handles below.</p>
                      <div className={`space-y-2.5 font-mono ${isDark ? "text-zinc-400" : "text-zinc-850"}`}>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" style={{ color: themeColor }} />
                          <a href={`mailto:${data.email}`} className="underline">{data.email || "sai.rishi@nic-intern.in"}</a>
                        </div>
                        {data.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" style={{ color: themeColor }} />
                            <span>{data.phone}</span>
                          </div>
                        )}
                        {data.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" style={{ color: themeColor }} />
                            <span>{data.location}</span>
                          </div>
                        )}
                      </div>
                      <div className="pt-4 flex gap-2">
                        {data.socialLinks.map((l) => (
                          <span 
                            key={l.platform} 
                            className="border-2 border-black px-3 py-1 font-black shadow-[2px_2px_0px_#000] cursor-pointer text-xs uppercase"
                            style={{ backgroundColor: themeColor, color: isDark ? "#000000" : "#ffffff" }}
                          >
                            {l.platform}
                          </span>
                        ))}
                      </div>
                    </div>
                    <CommonContactForm 
                      inputStyle={`w-full p-2.5 border-2 border-black text-xs focus:outline-none font-bold ${isDark ? "bg-zinc-800 text-white focus:bg-zinc-900" : "bg-white text-black focus:bg-yellow-50"}`}
                      buttonStyle="w-full py-2.5 bg-black text-white hover:bg-zinc-800 font-black rounded-none uppercase tracking-widest text-xs shadow-[3px_3px_0px_#000]" 
                    />
                  </div>
                </motion.section>
              );
            default:
              return null;
          }
        })}

        <footer className={`border-t-4 border-black pt-6 flex items-center justify-between ${isDark ? "border-zinc-800" : "border-black"}`}>
          <SocialIcons links={data.socialLinks} color={isDark ? "#ffffff" : "#000000"} />
          <span className="text-xs font-black uppercase">NEOBRUTALIST STYLE</span>
        </footer>
      </div>
    </div>
  );
};


/* ====== 6. ELEGANT EDITORIAL ====== */
const ElegantEditorial = ({ data, isDark, themeColor, sectionOrder }: { data: PortfolioData; isDark?: boolean; themeColor: string; sectionOrder: string[] }) => {
  const sections = sectionOrder;
  
  return (
    <div className={`min-h-screen font-serif py-16 px-6 transition-colors duration-300 ${isDark ? "bg-[#1c1917] text-[#fcfbf9]" : "bg-[#fcfbf9] text-[#1c1917]"}`}>
      {/* Sticky Editorial Nav */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b py-4 px-2 flex items-center justify-between font-sans mb-10 transition-colors duration-300 ${isDark ? "bg-[#1c1917]/95 border-stone-800" : "bg-[#fcfbf9]/95 border-[#292524]"}`}>
        <a href="#" className="font-extrabold text-sm uppercase tracking-widest" style={{ color: themeColor }}>{data.name.split(" ").map(w => w[0]).join("")} .</a>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
          {sections.map(sec => (
            <a 
              key={sec} 
              href={`#${sec}`} 
              className="hover:opacity-70 transition-opacity"
              style={{ color: themeColor }}
            >
              {sec.slice(0, 4)}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-2xl mx-auto min-h-[70vh] flex flex-col justify-center text-center space-y-6">
        <motion.header 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-4"
        >
          {data.photo && (
            <div className="flex justify-center mb-4">
              <img src={data.photo} alt={data.name} className="h-28 w-28 rounded-full object-cover border-2 shadow-sm" style={{ borderColor: themeColor }} />
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-normal tracking-tight leading-none mb-2 font-serif">{data.name}</h1>
          <p className="text-xs font-bold uppercase tracking-[0.25em] font-sans" style={{ color: themeColor }}>{data.title}</p>
          <div className="mx-auto w-16 h-px my-4" style={{ backgroundColor: themeColor }} />
          <p className="leading-[1.8] text-sm italic max-w-xl mx-auto opacity-80">{data.about}</p>
          <div className="pt-4">
            <a href="#projects" className="inline-block border font-sans font-bold text-xs py-2.5 px-8 uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all" style={{ borderColor: themeColor, color: themeColor }}>
              Read Portfolio
            </a>
          </div>
        </motion.header>
      </div>

      <div className="max-w-2xl mx-auto space-y-16 pt-8">
        {sections.map((sectionId) => {
          switch (sectionId) {
            case "about":
              return (
                <motion.section 
                  id="about" 
                  key="about" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center space-y-4 scroll-mt-24"
                >
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em] mb-4 font-sans opacity-60">Biography</h2>
                  {data.photo && (
                    <div className="flex justify-center mb-4 md:hidden">
                      <img src={data.photo} alt={data.name} className="h-20 w-20 rounded-full object-cover border" style={{ borderColor: themeColor }} />
                    </div>
                  )}
                  <p className="leading-[1.8] text-sm italic font-serif max-w-xl mx-auto opacity-90">{data.about}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-4 font-sans border-t border-stone-200/20 max-w-xl mx-auto text-left">
                    {data.location && <div>LOCATION: <span className="opacity-80">{data.location}</span></div>}
                    {data.email && <div>EMAIL: <a href={`mailto:${data.email}`} className="underline" style={{ color: themeColor }}>{data.email}</a></div>}
                    {data.phone && <div>TELECOMM: <span className="opacity-80">{data.phone}</span></div>}
                    {data.website && <div>NODE: <a href={data.website} target="_blank" rel="noreferrer" className="underline" style={{ color: themeColor }}>{data.website}</a></div>}
                  </div>

                  {data.languages && data.languages.length > 0 && (
                    <div className="pt-4 font-sans">
                      <span className="text-[10px] uppercase block mb-2 opacity-50">Languages recorded:</span>
                      <div className="flex flex-wrap justify-center gap-2">
                        {data.languages.map(l => (
                          <span key={l.name} className="border border-stone-300/60 px-3 py-1 rounded-full text-xs italic">
                            {l.name} · {l.level}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.section>
              );
            case "skills":
              return (
                <motion.section 
                  id="skills" 
                  key="skills" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center space-y-4 scroll-mt-24"
                >
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em] mb-4 font-sans opacity-60">Expertise</h2>
                  <div className="flex flex-wrap justify-center gap-3">
                    {data.skills.map((s, si) => (
                      <motion.span 
                        key={s} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: si * 0.03 }}
                        className="text-stone-700 italic text-sm tracking-wide border border-stone-300/40 rounded-full px-4 py-1.5 bg-[#faf9f6]/10 hover:opacity-80 transition-opacity"
                        style={{ color: themeColor }}
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </motion.section>
              );
            case "projects":
              return (
                <motion.section 
                  id="projects" 
                  key="projects" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6 scroll-mt-24"
                >
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-center mb-6 font-sans opacity-60">Selected Works</h2>
                  <div className="space-y-8">
                    {data.projects.map((p, pi) => (
                      <motion.div 
                        key={p.title} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: pi * 0.08 }}
                        className="border-b border-stone-200/20 pb-6 last:border-0"
                      >
                        {p.imageUrl && (
                          <div className="h-48 w-full overflow-hidden border border-stone-200/30 mb-4 bg-stone-100/10">
                            <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                          </div>
                        )}
                        <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                        <p className="text-xs leading-[1.7] opacity-80 mb-4 font-serif">{p.description}</p>
                        <div className="flex items-center justify-between text-[11px] font-sans font-bold uppercase tracking-wider">
                          <span className="opacity-40 font-normal">Stack / {p.tags.join(" / ")}</span>
                          <div className="flex gap-4">
                            {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="hover:underline">Code</a>}
                            {p.liveLink ? <a href={p.liveLink} target="_blank" rel="noreferrer" className="hover:underline text-stone-900" style={{ color: themeColor }}>Demo</a> : null}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );
            case "experience":
              return (
                <motion.section 
                  id="experience" 
                  key="experience" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6 scroll-mt-24"
                >
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-center mb-6 font-sans opacity-60">Chronology</h2>
                  <div className="space-y-6">
                    {data.experience.map((e, ei) => (
                      <motion.div 
                        key={e.role} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ei * 0.08 }}
                        className="space-y-1.5"
                      >
                        <h3 className="font-bold text-sm font-sans">{e.role}</h3>
                        <p className="text-xs italic opacity-50">{e.company} · {e.duration}</p>
                        <p className="text-xs leading-[1.7] font-serif pt-1 opacity-80">{e.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );
            case "education":
              return (
                <motion.section 
                  id="education" 
                  key="education" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4 scroll-mt-24"
                >
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-center mb-4 font-sans opacity-60">Credentials</h2>
                  <div className="space-y-4 text-center">
                    {data.education.map((edu, edui) => (
                      <motion.div 
                        key={edu.degree}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: edui * 0.06 }}
                      >
                        <p className="font-bold text-xs font-serif">{edu.degree}</p>
                        <p className="text-[10px] opacity-50 font-sans mt-0.5">{edu.school} · {edu.year}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );
            case "certifications":
              return data.certifications && data.certifications.length > 0 ? (
                <motion.section 
                  id="certifications" 
                  key="certifications" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4 scroll-mt-24"
                >
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-center mb-4 font-sans opacity-60">Certifications</h2>
                  <div className="space-y-3 font-sans text-center max-w-md mx-auto">
                    {data.certifications.map((c, ci) => (
                      <motion.div 
                        key={c.name} 
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: ci * 0.06 }}
                        className="border border-stone-200/10 p-4 rounded bg-[#faf9f6]/5 flex items-center gap-4 text-left"
                      >
                        {c.imageUrl ? (
                          <img src={c.imageUrl} alt={c.name} className="h-10 w-10 object-cover rounded shrink-0 border" style={{ borderColor: themeColor }} />
                        ) : (
                          <Award className="h-5 w-5 shrink-0" style={{ color: themeColor }} />
                        )}
                        <div>
                          <h4 className="font-bold text-xs">{c.name}</h4>
                          <p className="text-[9px] opacity-50 mt-0.5">{c.issuer} · {c.date}</p>
                          {c.credentialUrl && (
                            <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-[9px] font-bold underline mt-1.5 block hover:opacity-75">Verify URL</a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ) : null;
            case "achievements":
              return data.achievements && data.achievements.length > 0 ? (
                <motion.section 
                  id="achievements" 
                  key="achievements" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4 scroll-mt-24"
                >
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-center mb-4 font-sans opacity-60">Honors</h2>
                  <div className="space-y-3 font-sans text-center max-w-md mx-auto">
                    {data.achievements.map((ach, ai) => (
                      <motion.div 
                        key={ai} 
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: ai * 0.06 }}
                        className="border border-stone-200/10 p-4 rounded bg-[#faf9f6]/5 flex items-center gap-3 text-left font-serif italic"
                      >
                        <Award className="h-5 w-5 shrink-0" style={{ color: themeColor }} />
                        <span className="text-xs">{ach}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ) : null;
            case "contact":
              return (
                <motion.section 
                  id="contact" 
                  key="contact" 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6 scroll-mt-24"
                >
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-center mb-6 font-sans opacity-60">Contact</h2>
                  <div className="grid gap-8 md:grid-cols-2 font-sans text-left">
                    <div className="space-y-4 text-xs">
                      <p className="font-serif italic leading-relaxed opacity-80">Reach out regarding potential opportunities, integrations, or projects.</p>
                      <div className="space-y-2 font-mono">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" style={{ color: themeColor }} />
                          <a href={`mailto:${data.email}`} className="underline">{data.email || "rishi@portgen.ai"}</a>
                        </div>
                        {data.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" style={{ color: themeColor }} />
                            <span>{data.phone}</span>
                          </div>
                        )}
                        {data.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" style={{ color: themeColor }} />
                            <span>{data.location}</span>
                          </div>
                        )}
                      </div>
                      <div className="pt-2">
                        <SocialIcons links={data.socialLinks} color={themeColor} />
                      </div>
                    </div>
                    <CommonContactForm 
                      inputStyle={`w-full p-2.5 bg-transparent border rounded-none text-xs focus:outline-none font-serif italic ${isDark ? "border-stone-800 text-stone-200 focus:border-stone-700" : "border-stone-300 text-stone-800 focus:border-stone-800"}`}
                      buttonStyle="w-full py-2.5 bg-stone-900 text-white font-bold rounded-none hover:bg-stone-800 uppercase tracking-widest text-xs" 
                    />
                  </div>
                </motion.section>
              );
            default:
              return null;
          }
        })}

        <footer className={`border-t pt-8 flex items-center justify-between transition-colors duration-300 ${isDark ? "border-stone-800" : "border-stone-300"}`}>
          <SocialIcons links={data.socialLinks} color={themeColor} />
          <span className={`text-[9px] uppercase font-sans font-bold tracking-widest ${isDark ? "text-stone-600" : "text-stone-400"}`}>Elegant Editorial</span>
        </footer>
      </div>
    </div>
  );
};


/* ====== 7. CREATIVE SPOTLIGHT ====== */
const GradientSpotlight = ({ data, isDark, themeColor, sectionOrder }: { data: PortfolioData; isDark?: boolean; themeColor: string; sectionOrder: string[] }) => {
  const [activeSection, setActiveSection] = useState("about");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const sections = sectionOrder;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Active section tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 130;
      const ids = ["about", ...sections];
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(id);
          return;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-zinc-955 text-white font-sans py-16 px-6 relative overflow-hidden"
    >
      {/* Spotlight cursor radial glow */}
      <div 
        className="absolute pointer-events-none rounded-full w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 blur-[120px] transition-all duration-300"
        style={{ 
          left: mousePos.x, 
          top: mousePos.y,
          background: `radial-gradient(circle, ${themeColor}15 0%, transparent 70%)`
        }}
      />
      
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 pb-3 flex items-center justify-between mb-12">
        <a href="#" className="font-extrabold text-sm uppercase tracking-widest" style={{ color: themeColor }}>
          {data.name.split(' ').map(n=>n[0]).join('')}.IO
        </a>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
          {sections.map(sec => (
            <a 
              key={sec} 
              href={`#${sec}`} 
              onClick={() => setActiveSection(sec)}
              className="hover:text-white transition-colors"
              style={{ color: activeSection === sec ? themeColor : "#71717a" }}
            >
              {sec.slice(0, 4)}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto min-h-[60vh] flex flex-col justify-center space-y-6">
        <header className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${themeColor}, #818cf8, #c084fc)` }}>
            {data.name}
          </h1>
          <p className="text-lg md:text-2xl text-zinc-300 max-w-xl leading-relaxed font-light">{data.title}</p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 items-start sm:items-center">
            <a href="#projects" className="text-zinc-950 font-bold text-xs py-3.5 px-8 rounded-xl uppercase tracking-wider transition-opacity hover:opacity-90" style={{ backgroundColor: themeColor }}>
              View Work
            </a>
            <a href="#contact" className="text-white border border-zinc-800 hover:border-zinc-700 font-bold text-xs py-3.5 px-8 rounded-xl uppercase tracking-wider transition-colors">
              Contact Me
            </a>
          </div>
        </header>
      </div>

      <div className="max-w-4xl mx-auto space-y-24 pt-8 relative z-10">
        {sections.map((sectionId) => {
          switch (sectionId) {
            case "about":
              return (
                <motion.section id="about" key="about" className="space-y-4 scroll-mt-24" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="uppercase tracking-widest text-xs font-bold font-mono" style={{ color: themeColor }}>// INTRO SYSTEM</h2>
                  <div className="grid md:grid-cols-3 gap-6 items-start">
                    {data.photo && (
                      <div className="md:col-span-1 flex justify-center">
                        <div className="relative group/photo">
                          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r opacity-30 blur-sm group-hover/photo:opacity-60 transition duration-500" style={{ backgroundImage: `linear-gradient(to right, ${themeColor}, #6366f1)` }} />
                          <img src={data.photo} alt={data.name} className="relative h-48 w-48 object-cover rounded-2xl border border-zinc-850" />
                        </div>
                      </div>
                    )}
                    <div className={data.photo ? "md:col-span-2 space-y-4" : "md:col-span-3 space-y-4"}>
                      <p className="text-base text-zinc-300 leading-relaxed font-light">{data.about}</p>
                      {data.languages && data.languages.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-2 font-mono">// SPEAKING_PROTOCOLS:</span>
                          <div className="flex flex-wrap gap-2">
                            {data.languages.map(l => (
                              <span key={l.name} className="px-2.5 py-1 rounded-md text-xs font-mono border border-zinc-800 bg-zinc-900/60 text-zinc-350" style={{ borderLeftColor: themeColor, borderLeftWidth: "3px" }}>
                                {l.name} <span className="text-zinc-500">({l.level})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.section>
              );
            case "skills":
              return (
                <motion.section id="skills" key="skills" className="space-y-4 scroll-mt-24" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="uppercase tracking-widest text-xs font-bold font-mono" style={{ color: themeColor }}>// TOOL INVENTORY</h2>
                  <div className="flex flex-wrap gap-2.5">
                    {data.skills.map((s) => (
                      <span 
                        key={s} 
                        className="rounded-xl bg-zinc-900/40 border border-zinc-800 text-zinc-300 px-4 py-2.5 text-xs font-medium shadow-md hover:border-zinc-700 transition-all hover:-translate-y-0.5"
                        style={{ borderBottomColor: `${themeColor}40` }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.section>
              );
            case "projects":
              return (
                <motion.section id="projects" key="projects" className="space-y-6 scroll-mt-24" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="uppercase tracking-widest text-xs font-bold font-mono" style={{ color: themeColor }}>// CODE REPOSITORIES</h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {data.projects.map((p) => (
                      <div 
                        key={p.title} 
                        className="bg-zinc-900/30 border border-zinc-850 rounded-2xl hover:border-zinc-755 transition-all shadow-md flex flex-col justify-between overflow-hidden group"
                        style={{ borderLeftColor: `${themeColor}30`, borderLeftWidth: "2px" }}
                      >
                        {p.imageUrl ? (
                          <div className="h-44 w-full overflow-hidden border-b border-zinc-850">
                            <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                        ) : (
                          <div className="h-28 w-full flex items-center justify-center border-b border-zinc-850 bg-zinc-950/40">
                            <Code className="h-8 w-8 text-zinc-700" />
                          </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-base text-zinc-100 mb-2">{p.title}</h3>
                            <p className="text-xs text-zinc-400 mb-4 leading-relaxed line-clamp-2">{p.description}</p>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {p.tags.map((tag) => (
                                <span key={tag} className="text-[10px] px-2.5 py-0.5 rounded-md font-semibold font-mono" style={{ color: themeColor, backgroundColor: `${themeColor}10`, border: `1px solid ${themeColor}20` }}>{tag}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-4 text-xs font-bold uppercase tracking-wider" style={{ color: themeColor }}>
                            <a href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                              <Github className="h-4 w-4" /> Code
                            </a>
                            {p.liveLink ? (
                              <a href={p.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                                <ExternalLink className="h-4 w-4" /> Demo
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              );
            case "experience":
              return (
                <motion.section id="experience" key="experience" className="space-y-6 scroll-mt-24" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="uppercase tracking-widest text-xs font-bold font-mono" style={{ color: themeColor }}>// TIMELINE STATIONS</h2>
                  <div className="space-y-4">
                    {data.experience.map((e) => (
                      <div key={e.role} className="bg-zinc-900/20 border border-zinc-850 p-6 rounded-2xl relative" style={{ borderLeftColor: themeColor, borderLeftWidth: "3px" }}>
                        <h3 className="font-bold text-base text-zinc-100">{e.role}</h3>
                        <p className="text-xs font-semibold mb-2 font-mono" style={{ color: themeColor }}>{e.company} / {e.duration}</p>
                        <p className="text-xs text-zinc-400 leading-relaxed font-light">{e.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              );
            case "education":
              return (
                <motion.section id="education" key="education" className="space-y-4 scroll-mt-24" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="uppercase tracking-widest text-xs font-bold font-mono" style={{ color: themeColor }}>// ACADEMICS</h2>
                  <div className="space-y-3">
                    {data.education.map((edu) => (
                      <div key={edu.degree} className="bg-zinc-900/10 p-5 rounded-xl border border-zinc-855">
                        <p className="font-bold text-sm text-zinc-200">{edu.degree}</p>
                        <p className="text-xs text-zinc-450 mt-1">{edu.school} · {edu.year}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              );
            case "certifications":
              return data.certifications && data.certifications.length > 0 ? (
                <motion.section id="certifications" key="certifications" className="space-y-4 scroll-mt-24" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="uppercase tracking-widest text-xs font-bold font-mono" style={{ color: themeColor }}>// CERTIFICATES</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {data.certifications.map((c) => (
                      <div key={c.name} className="bg-zinc-900/20 border border-zinc-850 p-4 rounded-xl flex gap-3 overflow-hidden group">
                        {c.imageUrl ? (
                          <div className="h-12 w-12 rounded overflow-hidden shrink-0 border border-zinc-800">
                            <img src={c.imageUrl} alt={c.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                          </div>
                        ) : (
                          <Award className="h-5 w-5 shrink-0 mt-0.5" style={{ color: themeColor }} />
                        )}
                        <div>
                          <h4 className="font-bold text-xs text-zinc-200">{c.name}</h4>
                          <p className="text-[10px] text-zinc-500 mt-1">{c.issuer} · {c.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              ) : null;
            case "achievements":
              return data.achievements && data.achievements.length > 0 ? (
                <motion.section id="achievements" key="achievements" className="space-y-4 scroll-mt-24" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="uppercase tracking-widest text-xs font-bold font-mono" style={{ color: themeColor }}>// RECOGNITION KEYS</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {data.achievements.map((ach, index) => (
                      <div key={index} className="bg-zinc-900/20 border border-zinc-850 p-5 rounded-xl flex gap-3 items-start" style={{ borderRightColor: `${themeColor}20`, borderRightWidth: "2px" }}>
                        <Award className="h-5 w-5 shrink-0 mt-0.5" style={{ color: themeColor }} />
                        <p className="text-xs text-zinc-300 leading-relaxed font-light">{ach}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              ) : null;
            case "languages":
              return data.languages && data.languages.length > 0 ? (
                <motion.section id="languages" key="languages" className="space-y-4 scroll-mt-24" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="uppercase tracking-widest text-xs font-bold font-mono" style={{ color: themeColor }}>// SPEAKER CHANNELS</h2>
                  <div className="flex flex-wrap gap-3">
                    {data.languages.map((l) => (
                      <div key={l.name} className="bg-zinc-900/30 border border-zinc-850 rounded-xl px-4 py-2.5 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: themeColor }} />
                        <span className="text-xs font-bold text-zinc-200">{l.name}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">[{l.level}]</span>
                      </div>
                    ))}
                  </div>
                </motion.section>
              ) : null;
            case "contact":
              return (
                <motion.section id="contact" key="contact" className="space-y-6 scroll-mt-24" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="uppercase tracking-widest text-xs font-bold font-mono" style={{ color: themeColor }}>// CONNECT</h2>
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4 text-xs text-zinc-400">
                      <p>Send an API-style message or locate handles below.</p>
                      <div className="space-y-2 font-mono">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" style={{ color: themeColor }} />
                          <span>{data.email || "rishi@portgen.ai"}</span>
                        </div>
                        {data.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" style={{ color: themeColor }} />
                            <span>{data.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" style={{ color: themeColor }} />
                          <span>{data.location || "Ananthapuramu, India"}</span>
                        </div>
                      </div>
                      <div className="pt-4">
                        <SocialIcons links={data.socialLinks} color={themeColor} />
                      </div>
                    </div>
                    <CommonContactForm 
                      inputStyle="w-full p-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-350 focus:outline-none focus:border-zinc-700 font-mono"
                      buttonStyle="w-full py-2.5 text-zinc-950 font-extrabold rounded-xl uppercase tracking-widest text-xs transition-opacity hover:opacity-90 animate-pulse hover:animate-none" 
                      buttonColor={themeColor}
                    />
                  </div>
                </motion.section>
              );
            default:
              return null;
          }
        })}

        <footer className="border-t border-zinc-900 pt-8 flex items-center justify-between">
          <SocialIcons links={data.socialLinks} color={themeColor} />
          <span className="text-xs font-mono text-zinc-500">// ONLINE</span>
        </footer>
      </div>
    </div>
  );
};


/* ====== 8. PRODUCT TIMELINE ====== */
const InteractiveTimeline = ({ data, isDark, themeColor, sectionOrder }: { data: PortfolioData; isDark?: boolean; themeColor: string; sectionOrder: string[] }) => {
  const sections = sectionOrder;

  const containerBg = isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800";
  const headerText = isDark ? "text-white" : "text-slate-900";
  const cardBg = isDark ? "bg-slate-900/40 border-slate-850" : "bg-white border-slate-200";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";

  const sectionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <div className={`min-h-screen py-16 px-6 font-sans transition-colors duration-300 ${containerBg}`}>
      {/* Sticky Timeline Nav */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b pb-3 flex items-center justify-between mb-12 ${isDark ? "bg-slate-950/80 border-slate-900" : "bg-slate-50/80 border-slate-200"}`}>
        <a href="#" className="font-extrabold text-sm uppercase tracking-wider" style={{ color: themeColor }}>
          {data.name.split(' ').map(n=>n[0]).join('')} TIMELINE
        </a>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
          {sections.map(sec => (
            <a 
              key={sec} 
              href={`#${sec}`} 
              className="hover:opacity-100 transition-opacity"
              style={{ color: themeColor }}
            >
              {sec.slice(0, 4)}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-3xl mx-auto min-h-[60vh] flex flex-col justify-center border-l-4 pl-6 md:pl-10 space-y-6 relative" style={{ borderColor: themeColor }}>
        <div className="absolute -left-[10px] top-[14%] w-4 h-4 rounded-full border-4 border-white shadow-md animate-pulse" style={{ backgroundColor: themeColor }} />
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {data.photo && (
            <img src={data.photo} alt={data.name} className="h-28 w-28 rounded-full object-cover border-4" style={{ borderColor: themeColor }} />
          )}
          <div className="space-y-2">
            <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight leading-none ${headerText}`}>{data.name}</h1>
            <p className="text-sm font-semibold uppercase tracking-wider mt-1 animate-pulse" style={{ color: themeColor }}>{data.title}</p>
          </div>
        </div>
        <p className={`text-sm leading-relaxed max-w-xl ${mutedText}`}>{data.about}</p>
        <div className="pt-2">
          <a href="#projects" className="text-white font-bold text-xs py-3 px-8 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md transition-opacity hover:opacity-90" style={{ backgroundColor: themeColor }}>
            View Project Roadmap <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-20 border-l-4 pl-6 md:pl-10 pt-16" style={{ borderColor: `${themeColor}25` }}>
        {sections.map((sectionId) => {
          switch (sectionId) {
            case "about":
              return (
                <motion.section id="about" key="about" className="space-y-4 relative" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="absolute -left-[30px] md:-left-[46px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs" style={{ backgroundColor: themeColor, borderColor: themeColor }} />
                  <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: themeColor }}>About Me</h2>
                  <div className={`p-6 border rounded-xl shadow-xs leading-relaxed text-sm ${cardBg} ${mutedText}`}>
                    <p>{data.about}</p>
                    {data.languages && data.languages.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-800/40">
                        <span className="text-[10px] uppercase font-bold tracking-wider block mb-2 font-mono">// SPEAKING LAYERS</span>
                        <div className="flex flex-wrap gap-2">
                          {data.languages.map(l => (
                            <span key={l.name} className="px-2 py-0.5 rounded text-[10px] font-semibold border" style={{ color: themeColor, borderColor: `${themeColor}30`, backgroundColor: `${themeColor}08` }}>
                              {l.name} [{l.level}]
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.section>
              );
            case "skills":
              return (
                <motion.section id="skills" key="skills" className="space-y-4 relative" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="absolute -left-[30px] md:-left-[46px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs" style={{ backgroundColor: themeColor, borderColor: themeColor }} />
                  <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: themeColor }}>Skill Mapping</h2>
                  <div className="flex flex-wrap gap-2.5">
                    {data.skills.map((s) => (
                      <span key={s} className="rounded-full border px-4 py-1.5 text-xs font-semibold hover:scale-105 transition-transform" style={{ color: themeColor, borderColor: `${themeColor}40`, backgroundColor: `${themeColor}08` }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.section>
              );
            case "projects":
              return (
                <motion.section id="projects" key="projects" className="space-y-6 relative" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="absolute -left-[30px] md:-left-[46px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs" style={{ backgroundColor: themeColor, borderColor: themeColor }} />
                  <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: themeColor }}>Code Pipeline</h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {data.projects.map((p) => (
                      <div key={p.title} className={`border rounded-xl shadow-xs overflow-hidden flex flex-col justify-between group ${cardBg}`}>
                        {p.imageUrl ? (
                          <div className="h-36 w-full overflow-hidden border-b" style={{ borderColor: `${themeColor}15` }}>
                            <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                        ) : (
                          <div className="h-20 w-full flex items-center justify-center border-b" style={{ borderColor: `${themeColor}15`, backgroundColor: `${themeColor}04` }}>
                            <Code className="h-6 w-6 opacity-30" style={{ color: themeColor }} />
                          </div>
                        )}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className={`font-bold text-sm ${headerText}`}>{p.title}</h3>
                            <p className={`text-xs mt-2 leading-relaxed line-clamp-2 ${mutedText}`}>{p.description}</p>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {p.tags.map((tag) => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded font-medium" style={{ color: themeColor, backgroundColor: `${themeColor}10` }}>{tag}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-4 mt-4 text-[11px] font-bold" style={{ color: themeColor }}>
                            <a href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                              <Github className="h-3.5 w-3.5" /> Code
                            </a>
                            {p.liveLink ? (
                              <a href={p.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                                <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              );
            case "experience":
              return (
                <motion.section id="experience" key="experience" className="space-y-6 relative" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="absolute -left-[30px] md:-left-[46px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs" style={{ backgroundColor: themeColor, borderColor: themeColor }} />
                  <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: themeColor }}>Work Stations</h2>
                  <div className="space-y-6 relative">
                    <div className="absolute top-2 bottom-2 left-[7px] w-[2px]" style={{ backgroundColor: `${themeColor}15` }} />
                    {data.experience.map((e) => (
                      <div key={e.role} className="relative pl-6">
                        <div className="absolute left-[3px] top-1.5 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: themeColor }} />
                        <h3 className={`font-bold text-sm ${headerText}`}>{e.role}</h3>
                        <p className="text-xs font-semibold" style={{ color: themeColor }}>{e.company} · {e.duration}</p>
                        <p className={`text-xs mt-1.5 leading-relaxed ${mutedText}`}>{e.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              );
            case "education":
              return (
                <motion.section id="education" key="education" className="space-y-4 relative" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="absolute -left-[30px] md:-left-[46px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs" style={{ backgroundColor: themeColor, borderColor: themeColor }} />
                  <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: themeColor }}>Studies</h2>
                  <div className="space-y-4 pl-6">
                    {data.education.map((edu) => (
                      <div key={edu.degree}>
                        <p className={`font-semibold text-sm ${headerText}`}>{edu.degree}</p>
                        <p className={`text-xs mt-0.5 ${mutedText}`}>{edu.school} · {edu.year}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              );
            case "certifications":
              return data.certifications && data.certifications.length > 0 ? (
                <motion.section id="certifications" key="certifications" className="space-y-4 relative" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="absolute -left-[30px] md:-left-[46px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs" style={{ backgroundColor: themeColor, borderColor: themeColor }} />
                  <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: themeColor }}>Certifications</h2>
                  <div className="grid gap-3 sm:grid-cols-2 pl-6">
                    {data.certifications.map((c) => (
                      <div key={c.name} className={`border p-4 rounded-xl flex gap-3 group items-center ${cardBg}`}>
                        {c.imageUrl ? (
                          <div className="h-10 w-10 rounded overflow-hidden shrink-0 border border-zinc-800">
                            <img src={c.imageUrl} alt={c.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                          </div>
                        ) : (
                          <Award className="h-5 w-5 shrink-0" style={{ color: themeColor }} />
                        )}
                        <div>
                          <h4 className={`font-bold text-xs ${headerText}`}>{c.name}</h4>
                          <p className="text-[10px] text-slate-450 mt-1">{c.issuer} · {c.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              ) : null;
            case "achievements":
              return data.achievements && data.achievements.length > 0 ? (
                <motion.section id="achievements" key="achievements" className="space-y-4 relative" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="absolute -left-[30px] md:-left-[46px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs" style={{ backgroundColor: themeColor, borderColor: themeColor }} />
                  <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: themeColor }}>Achievements</h2>
                  <div className="space-y-3 pl-6">
                    {data.achievements.map((ach, ai) => (
                      <div key={ai} className={`border p-4 rounded-xl flex gap-3 items-start ${cardBg}`}>
                        <Award className="h-5 w-5 shrink-0" style={{ color: themeColor }} />
                        <p className={`text-xs leading-relaxed ${mutedText}`}>{ach}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              ) : null;
            case "languages":
              return data.languages && data.languages.length > 0 ? (
                <motion.section id="languages" key="languages" className="space-y-4 relative" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="absolute -left-[30px] md:-left-[46px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs" style={{ backgroundColor: themeColor, borderColor: themeColor }} />
                  <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: themeColor }}>Languages</h2>
                  <div className="flex flex-wrap gap-2 pl-6">
                    {data.languages.map((l) => (
                      <span key={l.name} className="px-3 py-1 rounded text-xs font-semibold border" style={{ color: themeColor, borderColor: `${themeColor}30`, backgroundColor: `${themeColor}08` }}>
                        {l.name} · {l.level}
                      </span>
                    ))}
                  </div>
                </motion.section>
              ) : null;
            case "contact":
              return (
                <motion.section id="contact" key="contact" className="space-y-6 relative" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="absolute -left-[30px] md:-left-[46px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs" style={{ backgroundColor: themeColor, borderColor: themeColor }} />
                  <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: themeColor }}>Connect</h2>
                  <div className="grid gap-8 md:grid-cols-2 pl-6">
                    <div className={`space-y-4 text-xs ${mutedText}`}>
                      <p>For operations log feedback or system integration, use the form.</p>
                      <div className="space-y-2 font-mono">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" style={{ color: themeColor }} />
                          <span>{data.email || "rishi@portgen.ai"}</span>
                        </div>
                        {data.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" style={{ color: themeColor }} />
                            <span>{data.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" style={{ color: themeColor }} />
                          <span>{data.location || "Ananthapuramu, India"}</span>
                        </div>
                      </div>
                      <div className="pt-4">
                        <SocialIcons links={data.socialLinks} color={themeColor} />
                      </div>
                    </div>
                    <CommonContactForm 
                      inputStyle={`w-full p-2.5 border rounded-xl text-xs focus:outline-none focus:ring-1 ${isDark ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700 focus:ring-slate-700" : "bg-white border-slate-250 text-slate-900 focus:border-slate-350 focus:ring-slate-350"}`}
                      buttonStyle="w-full py-2.5 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-opacity hover:opacity-90" 
                      buttonColor={themeColor}
                    />
                  </div>
                </motion.section>
              );
            default:
              return null;
          }
        })}

        <footer className="border-t pt-6 flex items-center justify-between" style={{ borderColor: `${themeColor}20` }}>
          <SocialIcons links={data.socialLinks} color={themeColor} />
          <span className="text-xs font-semibold" style={{ color: themeColor }}>Timeline Engine</span>
        </footer>
      </div>
    </div>
  );
};


/* ====== 9. 3D CARD DECK ====== */
const CardDeck = ({ data, isDark, themeColor, sectionOrder }: { data: PortfolioData; isDark?: boolean; themeColor: string; sectionOrder: string[] }) => {
  const sections = sectionOrder;

  const bg = isDark ? "bg-slate-955 text-slate-100" : "bg-slate-50 text-slate-800";
  const cardBg = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const headerText = isDark ? "text-white" : "text-slate-900";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <div className={`min-h-screen py-16 px-6 font-sans transition-colors duration-300 ${bg}`}>
      {/* Sticky Deck Nav */}
      <nav className={`sticky top-0 z-50 border-b pb-3 flex items-center justify-between mb-12 ${isDark ? "bg-slate-950/80 border-slate-900" : "bg-slate-50/80 border-slate-200"}`}>
        <a href="#" className="font-extrabold text-sm uppercase tracking-wider" style={{ color: themeColor }}>
          {data.name.split(' ').map(n=>n[0]).join('')} DECK
        </a>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
          {sections.map(sec => (
            <a 
              key={sec} 
              href={`#${sec}`} 
              className="hover:opacity-100 transition-opacity"
              style={{ color: themeColor }}
            >
              {sec.slice(0, 4)}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto min-h-[60vh] flex flex-col justify-center space-y-6">
        <header className={`border p-8 md:p-10 rounded-3xl shadow-xl space-y-5 relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full opacity-10 pointer-events-none" style={{ backgroundColor: themeColor }} />
          <div className="inline-flex items-center gap-1.5 border px-3 py-1 text-xs font-bold uppercase rounded-full" style={{ color: themeColor, borderColor: `${themeColor}40`, backgroundColor: `${themeColor}10` }}>
            ● Deploy Ready
          </div>
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {data.photo && (
              <img src={data.photo} alt={data.name} className="h-20 w-20 rounded-2xl object-cover border-2" style={{ borderColor: themeColor }} />
            )}
            <div>
              <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight leading-none ${headerText}`}>{data.name}</h1>
              <p className="text-sm font-semibold uppercase tracking-wider mt-1" style={{ color: themeColor }}>{data.title}</p>
            </div>
          </div>
          <p className={`text-xs md:text-sm leading-relaxed max-w-xl ${mutedText}`}>{data.about}</p>
          <div className="pt-2">
            <a href="#projects" className="font-bold text-xs py-3.5 px-8 rounded-xl uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md text-zinc-950 hover:opacity-90" style={{ backgroundColor: themeColor }}>
              Browse Deck <Layers className="h-4 w-4" />
            </a>
          </div>
        </header>
      </div>

      <div className="max-w-4xl mx-auto space-y-16 pt-8">
        {sections.map((sectionId) => {
          switch (sectionId) {
            case "about":
              return (
                <motion.section id="about" key="about" className={`border p-6 rounded-2xl shadow-lg ${cardBg}`} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2" style={{ color: themeColor, borderColor: isDark ? "#1e293b" : "#e2e8f0" }}>About Me</h2>
                  <div className="grid md:grid-cols-3 gap-6 items-start">
                    <div className="md:col-span-2 space-y-4">
                      <p className={`leading-relaxed text-sm font-light ${mutedText}`}>{data.about}</p>
                      {data.languages && data.languages.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider block mb-2 font-mono" style={{ color: themeColor }}>Languages Spoken:</span>
                          <div className="flex flex-wrap gap-2">
                            {data.languages.map(l => (
                              <span key={l.name} className="px-2.5 py-1 rounded text-xs border bg-slate-900/40 text-slate-300 border-slate-800">
                                {l.name} <span className="opacity-50 font-mono">({l.level})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {data.photo && (
                      <div className="md:col-span-1 flex justify-center">
                        <img src={data.photo} alt={data.name} className="h-40 w-40 object-cover rounded-xl border border-slate-800/80" />
                      </div>
                    )}
                  </div>
                </motion.section>
              );
            case "skills":
              return (
                <motion.section id="skills" key="skills" className={`border p-6 rounded-2xl shadow-lg ${cardBg}`} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2" style={{ color: themeColor, borderColor: isDark ? "#1e293b" : "#e2e8f0" }}>Skills Inventory</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((s) => (
                      <span key={s} className="bg-slate-900/60 text-slate-350 rounded-md px-3.5 py-1.5 text-xs font-semibold shadow-inner border border-slate-800/40">{s}</span>
                    ))}
                  </div>
                </motion.section>
              );
            case "projects":
              return (
                <motion.section id="projects" key="projects" className={`border p-6 rounded-2xl shadow-lg space-y-4 ${cardBg}`} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2" style={{ color: themeColor, borderColor: isDark ? "#1e293b" : "#e2e8f0" }}>Project Stack</h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {data.projects.map((p) => (
                      <div key={p.title} className="bg-slate-900/20 border border-slate-850 p-5 rounded-xl hover:bg-slate-800/10 transition-all flex flex-col justify-between overflow-hidden group">
                        {p.imageUrl ? (
                          <div className="h-32 w-full overflow-hidden border border-slate-800 mb-4 rounded">
                            <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                        ) : null}
                        <div>
                          <h3 className={`font-bold text-sm mb-1 ${headerText}`}>{p.title}</h3>
                          <p className={`text-xs mb-3 leading-relaxed line-clamp-2 ${mutedText}`}>{p.description}</p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {p.tags.map((tag) => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-sm font-mono" style={{ color: themeColor, backgroundColor: `${themeColor}12` }}>{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-4 text-xs font-bold uppercase pt-2 border-t border-slate-800/40" style={{ color: themeColor }}>
                          <a href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                            <Github className="h-3.5 w-3.5" /> Source
                          </a>
                          {p.liveLink ? (
                            <a href={p.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline text-white">
                              <ExternalLink className="h-3.5 w-3.5" /> Demo
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              );
            case "experience":
              return (
                <motion.section id="experience" key="experience" className={`border p-6 rounded-2xl shadow-lg space-y-4 ${cardBg}`} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2" style={{ color: themeColor, borderColor: isDark ? "#1e293b" : "#e2e8f0" }}>Career Journey</h2>
                  <div className="space-y-4">
                    {data.experience.map((e) => (
                      <div key={e.role} className="border-l-2 pl-4 bg-slate-900/10 p-4 rounded-r-xl" style={{ borderColor: themeColor }}>
                        <h3 className={`font-bold text-sm ${headerText}`}>{e.role}</h3>
                        <p className="text-xs mb-1" style={{ color: themeColor }}>{e.company} · {e.duration}</p>
                        <p className={`text-xs leading-relaxed font-light ${mutedText}`}>{e.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              );
            case "education":
              return (
                <motion.section id="education" key="education" className={`border p-6 rounded-2xl shadow-lg space-y-4 ${cardBg}`} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2" style={{ color: themeColor, borderColor: isDark ? "#1e293b" : "#e2e8f0" }}>Education</h2>
                  <div className="space-y-3">
                    {data.education.map((edu) => (
                      <div key={edu.degree} className="bg-slate-900/20 p-4 rounded-xl border border-slate-800/60">
                        <p className={`font-semibold text-xs ${headerText}`}>{edu.degree}</p>
                        <p className={`text-[10px] mt-1 ${mutedText}`}>{edu.school} · {edu.year}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              );
            case "certifications":
              return data.certifications && data.certifications.length > 0 ? (
                <motion.section id="certifications" key="certifications" className={`border p-6 rounded-2xl shadow-lg space-y-4 ${cardBg}`} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2" style={{ color: themeColor, borderColor: isDark ? "#1e293b" : "#e2e8f0" }}>Certifications</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {data.certifications.map((c) => (
                      <div key={c.name} className="bg-slate-900/20 p-4 rounded-xl border border-slate-800/50 flex items-center gap-3">
                        {c.imageUrl ? (
                          <img src={c.imageUrl} alt={c.name} className="h-10 w-10 rounded object-cover shrink-0 border border-slate-800/80" />
                        ) : (
                          <Award className="h-5 w-5 shrink-0" style={{ color: themeColor }} />
                        )}
                        <div>
                          <h4 className={`font-bold text-xs ${headerText}`}>{c.name}</h4>
                          <p className="text-[10px] text-slate-500 mt-1">{c.issuer} · {c.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              ) : null;
            case "achievements":
              return data.achievements && data.achievements.length > 0 ? (
                <motion.section id="achievements" key="achievements" className={`border p-6 rounded-2xl shadow-lg space-y-4 ${cardBg}`} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2" style={{ color: themeColor, borderColor: isDark ? "#1e293b" : "#e2e8f0" }}>Achievements</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {data.achievements.map((ach, ai) => (
                      <div key={ai} className="bg-slate-900/20 border border-slate-850 p-4 rounded-xl flex gap-2.5 items-start">
                        <Award className="h-5 w-5 shrink-0 mt-0.5" style={{ color: themeColor }} />
                        <p className={`text-xs leading-relaxed ${mutedText}`}>{ach}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              ) : null;
            case "languages":
              return data.languages && data.languages.length > 0 ? (
                <motion.section id="languages" key="languages" className={`border p-6 rounded-2xl shadow-lg space-y-4 ${cardBg}`} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2" style={{ color: themeColor, borderColor: isDark ? "#1e293b" : "#e2e8f0" }}>Languages</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.languages.map(l => (
                      <span key={l.name} className="bg-slate-900 px-3.5 py-1.5 rounded text-xs border border-slate-800" style={{ color: themeColor }}>
                        {l.name} · {l.level}
                      </span>
                    ))}
                  </div>
                </motion.section>
              ) : null;
            case "contact":
              return (
                <motion.section id="contact" key="contact" className={`border p-6 rounded-2xl shadow-lg space-y-6 ${cardBg}`} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2" style={{ color: themeColor, borderColor: isDark ? "#1e293b" : "#e2e8f0" }}>Connect</h2>
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className={`space-y-4 text-xs ${mutedText}`}>
                      <p>Get in touch for active opportunities or technical feedback.</p>
                      <div className="space-y-2 font-mono">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" style={{ color: themeColor }} />
                          <span>{data.email || "rishi@portgen.ai"}</span>
                        </div>
                        {data.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" style={{ color: themeColor }} />
                            <span>{data.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" style={{ color: themeColor }} />
                          <span>{data.location || "Ananthapuramu, India"}</span>
                        </div>
                      </div>
                      <div className="pt-4">
                        <SocialIcons links={data.socialLinks} color={themeColor} />
                      </div>
                    </div>
                    <CommonContactForm 
                      inputStyle={`w-full p-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 ${isDark ? "bg-slate-900 border-slate-800 text-indigo-400 focus:border-slate-700 focus:ring-slate-700" : "bg-white border-slate-250 text-slate-800 focus:border-slate-350 focus:ring-slate-350"}`}
                      buttonStyle="w-full py-2.5 text-zinc-950 font-bold rounded-xl uppercase tracking-widest text-xs transition-opacity hover:opacity-90" 
                      buttonColor={themeColor}
                    />
                  </div>
                </motion.section>
              );
            default:
              return null;
          }
        })}

        <footer className="border-t pt-6 flex items-center justify-between" style={{ borderColor: isDark ? "#1e293b" : "#e2e8f0" }}>
          <SocialIcons links={data.socialLinks} color={themeColor} />
          <span className="text-xs font-semibold text-slate-500">Card Deck layout</span>
        </footer>
      </div>
    </div>
  );
};


/* ====== 10. SAAS DEVELOPER (DASHBOARD TABS) ====== */
const DashboardSaas = ({ data, isDark, themeColor, sectionOrder }: { data: PortfolioData; isDark?: boolean; themeColor: string; sectionOrder: string[] }) => {
  const sections = sectionOrder;
  
  // Construct tabs dynamically based on the sectionOrder (respecting drag and drop ordering)
  const tabs = useMemo(() => sections.map(sec => {
    switch (sec) {
      case "about":
        return { id: "about", label: "Overview", icon: User };
      case "skills":
        return { id: "skills", label: "Stack Packages", icon: Terminal };
      case "projects":
        return { id: "projects", label: "Deployments", icon: Code };
      case "experience":
        return { id: "experience", label: "Career Logs", icon: Briefcase };
      case "education":
        return { id: "education", label: "Academic Logs", icon: GraduationCap };
      case "certifications":
        return { id: "certifications", label: "Credentials", icon: Award };
      case "achievements":
        return { id: "achievements", label: "Honors & Achievements", icon: Award };
      case "languages":
        return { id: "languages", label: "Languages", icon: Activity };
      case "contact":
        return { id: "contact", label: "Connect UPLINK", icon: Mail };
      default:
        return { id: sec, label: sec.toUpperCase(), icon: Layers };
    }
  }), [sections]);

  const [activeTab, setActiveTab] = useState("about");

  // Keep activeTab aligned if sections order changes or if "about" tab is not present initially
  useEffect(() => {
    if (tabs.length > 0 && !tabs.some(t => t.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-850 p-6 rounded-xl space-y-4">
              <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">// OPERATIONAL INTRO</div>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {data.photo && (
                  <img src={data.photo} alt={data.name} className="h-24 w-24 rounded-xl object-cover border border-slate-800" />
                )}
                <div className="space-y-2">
                  <p className="text-lg font-light text-slate-200">{data.title}</p>
                  <p className="text-sm leading-relaxed text-slate-400 font-light">{data.about}</p>
                </div>
              </div>
            </div>
            {/* Simple stats hub */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {[
                { label: "PROJECTS_LOADED", val: data.projects.length },
                { label: "EXPERIENCE_STATIONS", val: data.experience.length },
                { label: "SKILLS_REGISTERED", val: data.skills.length },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl font-mono">
                  <div className="text-[9px] text-slate-500">{stat.label}</div>
                  <div className="text-lg font-bold mt-1" style={{ color: themeColor }}>{stat.val}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case "skills":
        return (
          <div className="space-y-4">
            <div className="text-xs text-slate-550 font-mono tracking-widest uppercase mb-1">// STACK PACKAGES</div>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s) => (
                <span key={s} className="bg-slate-900 text-slate-200 border border-slate-800 rounded px-3 py-1.5 text-xs font-mono" style={{ borderLeftColor: themeColor, borderLeftWidth: "3px" }}>{s}</span>
              ))}
            </div>
          </div>
        );
      case "projects":
        return (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 font-mono tracking-widest uppercase mb-1">// Microservices Running</div>
            <div className="grid gap-6 sm:grid-cols-2">
              {data.projects.map((p) => (
                <div key={p.title} className="bg-slate-900 border border-slate-850 rounded-xl overflow-hidden flex flex-col justify-between group h-64 hover:border-slate-800 transition-colors">
                  {p.imageUrl ? (
                    <div className="h-32 w-full overflow-hidden border-b border-slate-850">
                      <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="h-24 w-full flex items-center justify-center border-b border-slate-855 bg-slate-950/45">
                      <Code className="h-8 w-8 text-slate-700" />
                    </div>
                  )}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                         <h3 className="font-bold text-sm text-slate-200">{p.title}</h3>
                         <span className="text-[8px] bg-slate-950 px-1.5 py-0.5 rounded font-mono border border-slate-800" style={{ color: themeColor }}>Status: UP</span>
                      </div>
                      <p className="text-xs text-slate-450 leading-relaxed line-clamp-2 mb-2">{p.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map((tag) => (
                          <span key={tag} className="text-[8px] text-slate-500 font-mono bg-slate-955 px-1.5 py-0.5 rounded border border-slate-800/60">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs font-mono mt-3 pt-2 border-t border-slate-850" style={{ color: themeColor }}>
                      <a href={p.link} target="_blank" rel="noreferrer" className="hover:underline">/repo</a>
                      {p.liveLink ? <a href={p.liveLink} target="_blank" rel="noreferrer" className="hover:underline text-white">/demo</a> : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "experience":
        return (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 font-mono tracking-widest uppercase mb-1">// Operational History</div>
            <div className="space-y-4">
              {data.experience.map((e) => (
                <div key={e.role} className="bg-slate-900 border border-slate-855 p-5 rounded-xl space-y-2" style={{ borderLeftColor: themeColor, borderLeftWidth: "3px" }}>
                  <h3 className="font-bold text-sm text-slate-200">{e.role}</h3>
                  <p className="text-xs font-semibold" style={{ color: themeColor }}>{e.company} · {e.duration}</p>
                  <p className="text-xs text-slate-450 leading-relaxed">{e.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "education":
        return (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 font-mono tracking-widest uppercase mb-1">// Academic Logs</div>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.degree} className="bg-slate-900 border border-slate-850 p-4 rounded-xl">
                  <h3 className="font-semibold text-xs text-slate-200">{edu.degree}</h3>
                  <p className="text-[10px] text-slate-550 font-mono mt-1">{edu.school} · {edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "certifications":
        return (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 font-mono tracking-widest uppercase mb-1">// Authority Credentials</div>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.certifications && data.certifications.length > 0 ? (
                data.certifications.map((c) => (
                  <div key={c.name} className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex gap-3 group">
                    {c.imageUrl ? (
                      <img src={c.imageUrl} alt={c.name} className="h-10 w-10 rounded object-cover shrink-0 border border-slate-800" />
                    ) : (
                      <Award className="h-5 w-5 shrink-0 mt-0.5" style={{ color: themeColor }} />
                    )}
                    <div>
                      <h4 className="font-semibold text-xs text-slate-200">{c.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-1">{c.issuer} · {c.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 font-mono">No credentials loaded.</div>
              )}
            </div>
          </div>
        );
      case "achievements":
        return (
          <div className="space-y-4">
            <div className="text-xs text-slate-550 font-mono tracking-widest uppercase mb-1">// System Achievements</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.achievements && data.achievements.length > 0 ? (
                data.achievements.map((ach, ai) => (
                  <div key={ai} className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex gap-3 items-start">
                    <Award className="h-5 w-5 shrink-0 mt-0.5" style={{ color: themeColor }} />
                    <p className="text-xs text-slate-300 font-mono leading-relaxed">{ach}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 font-mono">No achievements logged.</div>
              )}
            </div>
          </div>
        );
      case "languages":
        return (
          <div className="space-y-4">
            <div className="text-xs text-slate-550 font-mono tracking-widest uppercase mb-1">// Communication Protocol Channels</div>
            <div className="flex flex-wrap gap-3">
              {data.languages && data.languages.length > 0 ? (
                data.languages.map((l) => (
                  <div key={l.name} className="bg-slate-900 border border-slate-850 rounded-xl px-4 py-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: themeColor }} />
                    <span className="text-xs font-bold text-slate-200 font-mono">{l.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">[{l.level}]</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-550 font-mono">No language packages configured.</div>
              )}
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 text-xs text-slate-400">
              <p>Transmit an API-style message directly. Social links listed below.</p>
              <div className="space-y-2 font-mono">
                <div>Mail: {data.email || "rishi@portgen.ai"}</div>
                {data.phone && <div>Phone: {data.phone}</div>}
                <div>Loc: {data.location || "Ananthapuramu, India"}</div>
              </div>
              <div className="pt-2">
                <SocialIcons links={data.socialLinks} color={themeColor} />
              </div>
            </div>
            <CommonContactForm 
              inputStyle="w-full p-2.5 bg-slate-900 border border-slate-855 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-slate-700 font-mono"
              buttonStyle="w-full py-2.5 text-slate-955 font-bold rounded-lg hover:opacity-90 uppercase tracking-widest text-xs" 
              buttonColor={themeColor}
            />
          </div>
        );
      default:
        return <div className="text-xs text-slate-550 font-mono">Section unrecognized.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex flex-col md:flex-row gap-6 font-sans">
      {/* Sidebar Dashboard Navigation */}
      <aside className="w-full md:w-60 bg-slate-900 border border-slate-850 rounded-2xl p-6 shrink-0 flex flex-col justify-between h-fit md:h-[85vh]">
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-3 mb-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <Activity className="h-4 w-4" style={{ color: themeColor }} />
            <span>Dev Console</span>
          </div>
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  activeTab === tab.id
                    ? "bg-slate-955 border-slate-800"
                    : "border-transparent text-slate-400 hover:bg-slate-955/50 hover:text-slate-200"
                }`}
                style={activeTab === tab.id ? { color: themeColor } : {}}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="hidden md:block pt-6 border-t border-slate-850">
          <div className="text-[10px] text-slate-650 font-mono">
            DB_STATUS: CONNECTED
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-900 border border-slate-850 rounded-2xl p-6 md:p-8 shadow-2xl relative min-h-[85vh] flex flex-col justify-between">
        <div className="space-y-6 font-sans">
          {/* Header HUD */}
          <div className="flex items-center justify-between border-b border-slate-850 pb-4">
            <h1 className="text-sm font-extrabold text-white tracking-widest font-mono uppercase flex items-center gap-2">
              <Terminal className="h-4 w-4" style={{ color: themeColor }} />
              <span>{data.name} // {activeTab}</span>
            </h1>
            <span className="text-[9px] bg-slate-955 px-2 py-0.5 rounded font-mono border border-slate-850" style={{ color: themeColor }}>
              SESSION: ACTIVE
            </span>
          </div>

          {/* Dynamic Panel Views */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {renderActiveTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="border-t border-slate-855 pt-6 mt-8 flex items-center justify-between text-xs font-mono">
          <SocialIcons links={data.socialLinks} color={themeColor} />
          <span className="text-[10px] text-slate-600">// DASHBOARD END</span>
        </footer>
      </main>
    </div>
  );
};

/* ====== FLOATING AI CHATBOT & ADMIN WIDGETS ====== */
const FloatingWidgets = ({ data, themeColor }: { data: PortfolioData; themeColor: string }) => {
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "visitor" | "bot"; text: string }[]>([
    { role: "bot", text: `Hi there! I am an AI assistant representing ${data.name}. Feel free to ask me about credentials, projects, work experience, or tech stacks!` }
  ]);
  const [userInput, setUserInput] = useState("");
  
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminMsg, setAdminMsg] = useState("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleSendMessage = (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const messageText = (presetText || userInput).trim();
    if (!messageText) return;

    setChatMessages(prev => [...prev, { role: "visitor", text: messageText }]);
    setUserInput("");

    setTimeout(() => {
      let reply = "";
      const query = messageText.toLowerCase();

      if (query.includes("skills") || query.includes("stack") || query.includes("technology") || query.includes("coding")) {
        reply = `I specialize in the following technologies and tools:\n• ${data.skills.join("\n• ")}`;
      } else if (query.includes("project") || query.includes("code") || query.includes("repos") || query.includes("work")) {
        reply = `Here are some of my featured projects:\n` + 
          data.projects.map(p => `• **${p.title}**: ${p.description}\n  - Stack: ${p.tags.join(", ")}\n  - Code: ${p.link}${p.liveLink ? `\n  - Live: ${p.liveLink}` : ""}`).join("\n\n");
      } else if (query.includes("experience") || query.includes("intern") || query.includes("job") || query.includes("nic")) {
        if (data.experience && data.experience.length > 0) {
          reply = `Here is my professional timeline:\n` +
            data.experience.map(e => `• **${e.role}** at ${e.company} (${e.duration})\n  - ${e.description}`).join("\n\n");
        } else {
          reply = `I don't have any formal industry experience listed yet, but I've built several full-stack personal projects!`;
        }
      } else if (query.includes("education") || query.includes("college") || query.includes("degree") || query.includes("school")) {
        reply = `Here is my academic background:\n` +
          data.education.map(edu => `• **${edu.degree}** from ${edu.school} (${edu.year})`).join("\n");
      } else if (query.includes("certif") || query.includes("award") || query.includes("credential")) {
        if (data.certifications && data.certifications.length > 0) {
          reply = `Here are my verified certifications:\n` +
            data.certifications.map(c => `• **${c.name}** issued by ${c.issuer} (${c.date})`).join("\n");
        } else {
          reply = `I haven't added any certifications yet, but I am constantly learning and updating my credentials.`;
        }
      } else if (query.includes("contact") || query.includes("email") || query.includes("phone") || query.includes("social")) {
        reply = `You can reach me through:\n` +
          data.socialLinks.map(l => `• **${l.platform}**: ${l.url}`).join("\n");
      } else {
        reply = `I am a ${data.title}. Here is a bit about me:\n\n${data.about}\n\nAsk me specifically about my "skills", "projects", "experience", or "contact info"!`;
      }

      setChatMessages(prev => [...prev, { role: "bot", text: reply }]);
    }, 600);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser.trim() && adminPass.trim()) {
      setAdminMsg("Authenticating...");
      setTimeout(() => {
        setIsAdminLoggedIn(true);
        setAdminMsg("Access Granted! Welcome to Admin Panel.");
        setTimeout(() => {
          setShowAdmin(false);
          setAdminMsg("");
        }, 1500);
      }, 1000);
    } else {
      setAdminMsg("Please fill all fields.");
    }
  };

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setShowChat(!showChat)}
          className="h-12 w-12 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
          style={{ backgroundColor: themeColor, boxShadow: `0 8px 30px ${themeColor}40` }}
          title="Chat with AI Clone"
        >
          {showChat ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        </button>
      </div>

      <div className="fixed bottom-6 left-6 z-50">
        <button 
          onClick={() => setShowAdmin(true)}
          className="h-10 w-10 rounded-full flex items-center justify-center bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-400 hover:text-white shadow-lg hover:scale-110 transition-all duration-200"
          title="Admin Login"
        >
          <Lock className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {showChat && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 h-[480px] rounded-2xl flex flex-col bg-slate-950/95 border border-slate-900 shadow-2xl backdrop-blur-md overflow-hidden font-sans text-slate-200"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-900 flex items-center justify-between bg-slate-900/30">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-200 tracking-wider">AI ASSISTANT ({data.name.split(' ')[0]})</span>
              </div>
              <button onClick={() => setShowChat(false)} className="text-slate-500 hover:text-slate-200 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Message window */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "visitor" ? "justify-end" : "justify-start"}`}>
                  <div className={`rounded-xl px-3 py-2 max-w-[80%] whitespace-pre-wrap ${msg.role === "visitor" ? "text-slate-950 font-semibold" : "bg-slate-900 text-slate-300 border border-slate-800/80"}`}
                       style={msg.role === "visitor" ? { backgroundColor: themeColor } : {}}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick chips */}
            <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto border-t border-slate-900/60 bg-slate-950">
              {["Skills", "Projects", "Timeline", "Contact"].map(chip => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSendMessage(undefined, `Tell me about your ${chip.toLowerCase()}`)}
                  className="shrink-0 bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-400 hover:text-white px-2.5 py-1 rounded-full border border-slate-850 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-900 flex gap-2 bg-slate-950">
              <input
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="Ask about credentials or stack..."
                className="flex-1 bg-slate-900 border border-slate-850 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-slate-800"
              />
              <button 
                type="submit"
                className="p-2 rounded-lg text-slate-950 flex items-center justify-center font-bold"
                style={{ backgroundColor: themeColor }}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdmin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans text-slate-200"
            onClick={() => setShowAdmin(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-slate-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl flex flex-col relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowAdmin(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-colors">
                <X className="h-4 w-4" />
              </button>
              <div className="flex flex-col items-center mb-6">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-slate-900/60 border border-slate-850 text-slate-400 mb-3">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">Administrator Login</h3>
                <p className="text-xs text-slate-500 mt-1">Authenticate to open dashboard settings.</p>
              </div>

              {adminMsg && (
                <div className={`p-3 rounded-lg border text-xs text-center mb-4 ${isAdminLoggedIn ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"}`}>
                  {adminMsg}
                </div>
              )}

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5 block">Email / Username</label>
                  <input
                    type="text"
                    required
                    value={adminUser}
                    onChange={e => setAdminUser(e.target.value)}
                    placeholder="admin@sairishikumar.in"
                    className="w-full bg-slate-900 border border-slate-850 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5 block">Security Password</label>
                  <input
                    type="password"
                    required
                    value={adminPass}
                    onChange={e => setAdminPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-850 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity mt-2"
                  style={{ backgroundColor: themeColor }}
                >
                  Sign In Security UPLINK
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PortfolioRenderer;
