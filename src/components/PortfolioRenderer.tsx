import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
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
  AlertCircle,
  Send,
  Bell,
  Download,
  Trash2,
  Check,
  ChevronUp,
  ChevronDown,
  Plus,
  Save
} from "lucide-react";
import type { PortfolioData } from "@/data/mockData";

interface Props {
  templateId: string;
  data: PortfolioData;
  isDark?: boolean;
  themeColor?: string;
  sectionOrder?: string[];
  isPreview?: boolean;
  onDownloadCode?: () => void;
}

const ensureAbsoluteUrl = (url?: string): string => {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  
  // If it's already an email, tel, or hash link, leave it as is
  if (/^(mailto:|tel:|#)/i.test(trimmed)) {
    return trimmed;
  }
  
  // If it's a protocol-relative link (e.g., //google.com), prepend https:
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }
  
  // Handle protocol typo/normalization (e.g. "https//", "https:", etc)
  const protoMatch = trimmed.match(/^(https?|ftp)[:/\s]+(.*)/i);
  if (protoMatch) {
    const protocol = protoMatch[1].toLowerCase();
    const domainAndPath = protoMatch[2].trim();
    return `${protocol}://${domainAndPath}`;
  }
  
  // Otherwise, default to prepending https://
  return `https://${trimmed}`;
};
const getApiUrl = () => {
  if (typeof window !== "undefined") {
    if (window.location.port === "8080" || window.location.hostname === "localhost") {
      return "http://localhost:4000";
    }
  }
  return "";
};
const API_URL = getApiUrl();

interface SkillCategory {
  label: string;
  skills: string[];
}

const getSkillCategories = (skills: string[]): SkillCategory[] => {
  const categoryMap: Record<string, string[]> = {
    "Frontend": [],
    "Backend": [],
    "AI/ML": [],
    "Tools": [],
    "Others": []
  };

  const cleanSkills = (skills || []).map(s => s ? s.trim() : "").filter(Boolean);
  const hasPrefix = cleanSkills.some(s => s.includes(":"));

  if (hasPrefix) {
    cleanSkills.forEach(s => {
      if (s.includes(":")) {
        const parts = s.split(":");
        const cat = parts[0].trim();
        const skill = parts.slice(1).join(":").trim();
        
        let targetCat = "Others";
        const catLower = cat.toLowerCase();
        if (catLower.includes("frontend") || catLower.includes("front end") || catLower.includes("front-end") || catLower.includes("web dev") || catLower.includes("webdev")) {
          targetCat = "Frontend";
        } else if (catLower.includes("backend") || catLower.includes("back end") || catLower.includes("back-end") || catLower.includes("database") || catLower.includes("db") || catLower.includes("sql")) {
          targetCat = "Backend";
        } else if (catLower.includes("ai") || catLower.includes("ml") || catLower.includes("aiml") || catLower.includes("machine") || catLower.includes("deep") || catLower.includes("learning") || catLower.includes("vision") || catLower.includes("nlp")) {
          targetCat = "AI/ML";
        } else if (catLower.includes("tool") || catLower.includes("devops") || catLower.includes("git") || catLower.includes("platform") || catLower.includes("cloud")) {
          targetCat = "Tools";
        }

        if (!categoryMap[targetCat]) {
          categoryMap[targetCat] = [];
        }
        categoryMap[targetCat].push(skill);
      } else {
        categoryMap["Others"].push(s);
      }
    });
  } else {
    // Dynamic fallback auto-categorizer
    const frontendKeywords = [
      "react", "typescript", "javascript", "tailwind", "next", "vue", "html", "css", "svelte", 
      "vite", "bootstrap", "sass", "less", "jquery", "webflow", "frontend", "ui", "ux", "redux"
    ];
    const backendKeywords = [
      "node", "express", "php", "fastapi", "django", "java", "go", "rust", "python", "flask", 
      "laravel", "mysql", "mongodb", "postgres", "redis", "aws", "firebase", "docker", "kubernetes", 
      "supabase", "sql", "sqlite", "oracle", "database", "backend", "graphql", "rest api", "apis"
    ];
    const aiKeywords = [
      "machine learning", "deep learning", "computer vision", "natural language processing", "nlp", 
      "tensorflow", "pytorch", "keras", "scikit-learn", "tf-idf", "ocr", "model training", 
      "feature engineering", "data preprocessing", "tuning", "efficientnet", "llm", "opencv", 
      "langchain", "ai", "ml", "neural network", "grading"
    ];
    const toolsKeywords = [
      "git", "linux", "vs code", "figma", "postman", "github", "bash", "jira", "agile", "devops", 
      "ci/cd", "shell", "vscode"
    ];

    cleanSkills.forEach(s => {
      const lower = s.toLowerCase();
      if (aiKeywords.some(kw => lower.includes(kw))) {
        categoryMap["AI/ML"].push(s);
      } else if (frontendKeywords.some(kw => lower.includes(kw))) {
        categoryMap["Frontend"].push(s);
      } else if (backendKeywords.some(kw => lower.includes(kw))) {
        categoryMap["Backend"].push(s);
      } else if (toolsKeywords.some(kw => lower.includes(kw))) {
        categoryMap["Tools"].push(s);
      } else {
        categoryMap["Others"].push(s);
      }
    });
  }

  return [
    { label: "Frontend Development", skills: categoryMap["Frontend"] },
    { label: "Backend & Databases", skills: categoryMap["Backend"] },
    { label: "AI & Machine Learning", skills: categoryMap["AI/ML"] },
    { label: "Tools & DevOps", skills: categoryMap["Tools"] },
    { label: "Other Skills", skills: categoryMap["Others"] }
  ].filter(c => c.skills.length > 0);
};

/* ====== ACCORDION ITEM FOR MOBILE SECTION COLLAPSE ====== */
const MobileAccordionItem = ({
  sectionId,
  themeColor,
  isDark,
  isExpanded,
  onToggle,
  children
}: {
  sectionId: string;
  themeColor: string;
  isDark: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => {
  const title = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
  return (
    <div className={`border rounded-xl transition-all duration-300 ${isDark ? "bg-slate-900/30 border-slate-900/60" : "bg-white border-slate-200/80 shadow-sm"} mb-4`}>
      <button 
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 font-bold text-xs uppercase tracking-[0.15em] select-none text-left"
        style={{ color: themeColor }}
      >
        <span>// {title}</span>
        <span>{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`border-t overflow-hidden ${isDark ? "border-slate-800/40" : "border-slate-100"}`}
          >
            <div className="p-4 mobile-accordion-content">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ====== ACCORDION ITEM FOR VISUAL EDITOR SIDE DRAWER ====== */
const VisualAccordionItem = ({ 
  id, 
  title, 
  icon: Icon, 
  isOpen,
  onToggle,
  children 
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="border-b border-slate-850 last:border-0 select-text">
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between py-3 text-left font-semibold text-xs transition-colors hover:bg-slate-800/40 ${isOpen ? "text-primary" : "text-slate-300"}`}
        style={isOpen ? { color: "var(--portfolio-primary)" } : {}}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
      </button>
      {isOpen && (
        <div className="py-3 space-y-3 bg-slate-900/60 border-t border-slate-850/40 text-xs">
          {children}
        </div>
      )}
    </div>
  );
};

/* ====== VISUAL EDITOR SIDE DRAWER ====== */
const EDIT_CATEGORIES = [
  { label: "Frontend Development", prefix: "Frontend Development" },
  { label: "Backend & Databases", prefix: "Backend & Databases" },
  { label: "AI & Machine Learning", prefix: "AI & Machine Learning" },
  { label: "Tools & DevOps", prefix: "Tools & DevOps" },
  { label: "Other Skills", prefix: "Other Skills" }
];

const VisualEditorDrawer = ({
  data,
  onChange,
  onSave,
  isSaving,
  themeColor
}: {
  data: PortfolioData;
  onChange: React.Dispatch<React.SetStateAction<PortfolioData>>;
  onSave: () => void;
  isSaving: boolean;
  themeColor: string;
}) => {
  const [activeSec, setActiveSec] = useState<string>("about");
  const [newAch, setNewAch] = useState("");
  const [activeCatEdit, setActiveCatEdit] = useState<string | null>("Frontend Development");
  const [categoryInputs, setCategoryInputs] = useState<Record<string, string>>({});
  
  const [expandedProj, setExpandedProj] = useState<number | null>(0);
  const [expandedExp, setExpandedExp] = useState<number | null>(0);
  const [expandedEdu, setExpandedEdu] = useState<number | null>(0);
  const [expandedCert, setExpandedCert] = useState<number | null>(0);

  // File reader helper
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | { projectIndex: number } | { certIndex: number }) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      if (type === "avatar") {
        onChange(prev => ({ ...prev, photo: base64 }));
      } else if (typeof type === "object" && "projectIndex" in type) {
        onChange(prev => {
          const projects = [...(prev.projects || [])];
          projects[type.projectIndex] = { ...projects[type.projectIndex], imageUrl: base64 };
          return { ...prev, projects };
        });
      } else if (typeof type === "object" && "certIndex" in type) {
        onChange(prev => {
          const certifications = [...(prev.certifications || [])];
          certifications[type.certIndex] = { ...certifications[type.certIndex], imageUrl: base64 };
          return { ...prev, certifications };
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSocialChange = (platform: string, url: string) => {
    onChange(prev => {
      const socialLinks = [...(prev.socialLinks || [])];
      const idx = socialLinks.findIndex(l => l.platform.toLowerCase() === platform.toLowerCase());
      if (idx !== -1) {
        socialLinks[idx] = { ...socialLinks[idx], url };
      } else {
        socialLinks.push({ platform, url });
      }
      return { ...prev, socialLinks };
    });
  };

  const handleProjectChange = (idx: number, field: string, val: string) => {
    onChange(prev => {
      const projects = [...(prev.projects || [])];
      if (field === "tags") {
        projects[idx] = { ...projects[idx], tags: val.split(",").map(t => t.trim()).filter(Boolean) };
      } else {
        projects[idx] = { ...projects[idx], [field]: val };
      }
      return { ...prev, projects };
    });
  };

  const handleAddProject = () => {
    onChange(prev => {
      const projects = [...(prev.projects || []), { title: "New Project", description: "", tags: [], link: "", liveLink: "", imageUrl: "" }];
      setExpandedProj(projects.length - 1);
      return { ...prev, projects };
    });
  };

  const handleExpChange = (idx: number, field: string, val: string) => {
    onChange(prev => {
      const experience = [...(prev.experience || [])];
      experience[idx] = { ...experience[idx], [field]: val };
      return { ...prev, experience };
    });
  };

  const handleAddExperience = () => {
    onChange(prev => {
      const experience = [...(prev.experience || []), { role: "Software Engineer", company: "Company Name", duration: "2025 - Present", description: "" }];
      setExpandedExp(experience.length - 1);
      return { ...prev, experience };
    });
  };

  const handleEduChange = (idx: number, field: string, val: string) => {
    onChange(prev => {
      const education = [...(prev.education || [])];
      education[idx] = { ...education[idx], [field]: val };
      return { ...prev, education };
    });
  };

  const handleAddEducation = () => {
    onChange(prev => {
      const education = [...(prev.education || []), { degree: "Degree Name", school: "School Name", year: "2025" }];
      setExpandedEdu(education.length - 1);
      return { ...prev, education };
    });
  };

  const handleCertChange = (idx: number, field: string, val: string) => {
    onChange(prev => {
      const certifications = [...(prev.certifications || [])];
      certifications[idx] = { ...certifications[idx], [field]: val };
      return { ...prev, certifications };
    });
  };

  const handleAddCert = () => {
    onChange(prev => {
      const certifications = [...(prev.certifications || []), { name: "Certification Name", issuer: "Issuer Name", date: "2025", credentialUrl: "" }];
      setExpandedCert(certifications.length - 1);
      return { ...prev, certifications };
    });
  };

  const handleAddAchievement = () => {
    if (newAch.trim()) {
      onChange(prev => ({ ...prev, achievements: [...(prev.achievements || []), newAch.trim()] }));
      setNewAch("");
    }
  };

  const handleAchievementChange = (idx: number, val: string) => {
    onChange(prev => {
      const achievements = [...(prev.achievements || [])];
      achievements[idx] = val;
      return { ...prev, achievements };
    });
  };

  const handleLangChange = (idx: number, field: string, val: string) => {
    onChange(prev => {
      const languages = [...(prev.languages || [])];
      languages[idx] = { ...languages[idx], [field]: val };
      return { ...prev, languages };
    });
  };

  const handleAddLanguage = () => {
    onChange(prev => ({
      ...prev,
      languages: [...(prev.languages || []), { name: "Language", level: "Professional" }]
    }));
  };

  const labelStyle = "text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-1 block";
  const inputStyle = "w-full bg-slate-950/80 border border-slate-800 focus:border-slate-700 text-xs text-white rounded px-2.5 py-1.5 focus:outline-none transition-colors";
  const selectStyle = "w-full bg-slate-950/80 border border-slate-800 focus:border-slate-700 text-xs text-white rounded px-2 py-1.5 focus:outline-none transition-colors";

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-14 right-0 bottom-0 w-full sm:w-96 bg-slate-900/98 border-l border-slate-800 text-slate-200 z-[49] flex flex-col shadow-2xl backdrop-blur-md overflow-hidden select-text font-sans"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-850 flex items-center justify-between bg-slate-950/30">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Visual Editor Drawer</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Edit live custom styles and data</p>
        </div>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-3.5 py-1.5 bg-primary text-slate-950 font-bold uppercase text-[10px] tracking-wider rounded-md transition-opacity hover:opacity-90 flex items-center gap-1.5 disabled:opacity-50"
          style={{ backgroundColor: themeColor }}
        >
          <Save className="h-3 w-3" />
          {isSaving ? "Saving..." : "Save Code"}
        </button>
      </div>

      {/* Editor list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
        {/* 1. Basic Info */}
        <VisualAccordionItem
          id="about"
          title="Basic Details"
          icon={User}
          isOpen={activeSec === "about"}
          onToggle={() => setActiveSec(activeSec === "about" ? "" : "about")}
        >
          <div className="space-y-3 px-1">
            {/* Avatar upload */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-850">
              <div className="relative h-12 w-12 rounded-full overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center shrink-0">
                {data.photo ? (
                  <img src={data.photo} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-slate-655" />
                )}
              </div>
              <div>
                <span className={labelStyle}>Profile Photo</span>
                <div className="flex gap-2 mt-1">
                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-750 px-2.5 py-1 rounded text-[10px] font-semibold text-white border border-slate-700 transition-colors">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handlePhotoUpload(e, "avatar")}
                      className="hidden"
                    />
                  </label>
                  {data.photo && (
                    <button
                      onClick={() => onChange(prev => ({ ...prev, photo: "" }))}
                      className="text-red-400 hover:text-red-300 text-[10px] font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelStyle}>Full Name</label>
                <input
                  type="text"
                  value={data.name || ""}
                  onChange={e => onChange(prev => ({ ...prev, name: e.target.value }))}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Professional Title</label>
                <input
                  type="text"
                  value={data.title || ""}
                  onChange={e => onChange(prev => ({ ...prev, title: e.target.value }))}
                  className={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className={labelStyle}>Biography / About</label>
              <textarea
                value={data.about || ""}
                onChange={e => onChange(prev => ({ ...prev, about: e.target.value }))}
                rows={3}
                className={inputStyle}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={data.email || ""}
                  onChange={e => onChange(prev => ({ ...prev, email: e.target.value }))}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Phone Number</label>
                <input
                  type="text"
                  value={data.phone || ""}
                  onChange={e => onChange(prev => ({ ...prev, phone: e.target.value }))}
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelStyle}>Location Node</label>
                <input
                  type="text"
                  value={data.location || ""}
                  onChange={e => onChange(prev => ({ ...prev, location: e.target.value }))}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Personal Website</label>
                <input
                  type="text"
                  value={data.website || ""}
                  onChange={e => onChange(prev => ({ ...prev, website: e.target.value }))}
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="border-t border-slate-850 pt-2.5">
              <span className={labelStyle}>Social Links</span>
              <div className="grid grid-cols-3 gap-1.5 mt-1">
                <div>
                  <label className="text-[8px] text-slate-500 uppercase font-semibold">GitHub</label>
                  <input
                    type="text"
                    value={data.socialLinks.find(l => l.platform.toLowerCase() === "github")?.url || ""}
                    onChange={e => handleSocialChange("GitHub", e.target.value)}
                    placeholder="URL"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-[8px] text-slate-500 uppercase font-semibold">LinkedIn</label>
                  <input
                    type="text"
                    value={data.socialLinks.find(l => l.platform.toLowerCase() === "linkedin")?.url || ""}
                    onChange={e => handleSocialChange("LinkedIn", e.target.value)}
                    placeholder="URL"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-[8px] text-slate-500 uppercase font-semibold">Twitter</label>
                  <input
                    type="text"
                    value={data.socialLinks.find(l => l.platform.toLowerCase() === "twitter")?.url || ""}
                    onChange={e => handleSocialChange("Twitter", e.target.value)}
                    placeholder="URL"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-850 pt-2.5 flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold text-slate-400">Opportunities Badge</span>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.designSettings?.showOpportunitiesBadge !== false}
                  onChange={e => onChange(prev => ({
                    ...prev,
                    designSettings: {
                      ...(prev.designSettings || {}),
                      showOpportunitiesBadge: e.target.checked
                    }
                  }))}
                  className="rounded bg-slate-950 border-slate-800 text-primary focus:ring-0 h-4 w-4"
                />
                <span className="text-[10px] text-slate-400 font-semibold">Visible</span>
              </div>
            </div>
            {data.designSettings?.showOpportunitiesBadge !== false && (
              <div>
                <label className={labelStyle}>Badge Message Text</label>
                <input
                  type="text"
                  value={data.designSettings?.opportunitiesText || "AVAILABLE FOR OPPORTUNITIES"}
                  onChange={e => onChange(prev => ({
                    ...prev,
                    designSettings: {
                      ...(prev.designSettings || {}),
                      opportunitiesText: e.target.value
                    }
                  }))}
                  className={inputStyle}
                />
              </div>
            )}
          </div>
        </VisualAccordionItem>

        {/* 2. Skills Inventory */}
        <VisualAccordionItem
          id="skills"
          title="Skills Inventory"
          icon={Code}
          isOpen={activeSec === "skills"}
          onToggle={() => setActiveSec(activeSec === "skills" ? "" : "skills")}
        >
          <div className="space-y-3 px-1">
            {EDIT_CATEGORIES.map((cat) => {
              const isExpanded = activeCatEdit === cat.label;
              const catSkills = getSkillCategories(data.skills).find(c => c.label === cat.label)?.skills || [];
              const inputValue = categoryInputs[cat.label] || "";

              const handleAddSkillToCat = () => {
                if (inputValue.trim()) {
                  const prefixedSkill = `${cat.prefix}:${inputValue.trim()}`;
                  if (!data.skills.includes(prefixedSkill)) {
                    onChange(prev => ({
                      ...prev,
                      skills: [...prev.skills, prefixedSkill]
                    }));
                  }
                  setCategoryInputs(prev => ({ ...prev, [cat.label]: "" }));
                }
              };

              return (
                <div key={cat.label} className="border border-slate-850 rounded-lg overflow-hidden bg-slate-950/40">
                  <div
                    onClick={() => setActiveCatEdit(isExpanded ? null : cat.label)}
                    className="flex items-center justify-between p-2.5 cursor-pointer bg-slate-900/40 hover:bg-slate-850/40 select-none"
                  >
                    <span className="text-[11px] font-bold text-slate-350">{cat.label}</span>
                    <span className="text-[10px] text-slate-500">{catSkills.length} skills</span>
                  </div>
                  {isExpanded && (
                    <div className="p-2.5 border-t border-slate-850 space-y-3 bg-slate-900/10">
                      <div className="flex flex-wrap gap-1">
                        {catSkills.length === 0 ? (
                          <span className="text-[10px] text-slate-500 italic">No skills in this category.</span>
                        ) : (
                          catSkills.map((s, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 bg-slate-950 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-850">
                              <span>{s}</span>
                              <button
                                onClick={() => {
                                  onChange(prev => ({
                                    ...prev,
                                    skills: prev.skills.filter(raw => {
                                      const parts = raw.split(":");
                                      const skillName = parts.length > 1 ? parts.slice(1).join(":").trim() : raw.trim();
                                      const rawCat = getSkillCategories([raw])[0]?.label;
                                      return !(skillName === s && rawCat === cat.label);
                                    })
                                  }));
                                }}
                                className="text-slate-500 hover:text-red-400"
                              >
                                ×
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                      <div className="flex gap-1.5 pt-1">
                        <input
                          type="text"
                          placeholder={`Add ${cat.label.split(" ")[0]} skill...`}
                          value={inputValue}
                          onChange={e => setCategoryInputs(prev => ({ ...prev, [cat.label]: e.target.value }))}
                          onKeyDown={e => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSkillToCat();
                            }
                          }}
                          className={inputStyle}
                        />
                        <button
                          onClick={handleAddSkillToCat}
                          className="bg-slate-800 hover:bg-slate-750 border border-slate-700 px-3 py-1.5 rounded text-xs font-semibold text-white"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </VisualAccordionItem>

        {/* 3. Projects */}
        <VisualAccordionItem
          id="projects"
          title="Projects Portfolio"
          icon={Briefcase}
          isOpen={activeSec === "projects"}
          onToggle={() => setActiveSec(activeSec === "projects" ? "" : "projects")}
        >
          <div className="space-y-2.5 px-1">
            {data.projects.map((proj, idx) => {
              const isExpanded = expandedProj === idx;
              return (
                <div key={idx} className="border border-slate-850 rounded-lg overflow-hidden bg-slate-950/40">
                  <div
                    onClick={() => setExpandedProj(isExpanded ? null : idx)}
                    className="flex items-center justify-between p-2.5 cursor-pointer bg-slate-900/40 hover:bg-slate-850/40 select-none"
                  >
                    <span className="text-[11px] font-bold text-slate-300 truncate max-w-[200px]">{proj.title || `Project #${idx + 1}`}</span>
                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          onChange(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== idx) }));
                          if (expandedProj === idx) setExpandedProj(null);
                        }}
                        className="p-1 rounded text-red-400 hover:bg-slate-800"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      {isExpanded ? <ChevronUp className="h-3 w-3 text-slate-500" /> : <ChevronDown className="h-3 w-3 text-slate-500" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="p-3 border-t border-slate-850 bg-slate-950/60 space-y-2">
                      <div>
                        <span className={labelStyle}>Project Image URL / Base64</span>
                        <div className="flex gap-2 items-center mt-1">
                          {proj.imageUrl && (
                            <img src={proj.imageUrl} alt="preview" className="h-8 w-12 object-cover rounded border border-slate-800" />
                          )}
                          <label className="cursor-pointer bg-slate-850 border border-slate-750 px-2 py-1 rounded text-[9px] font-semibold text-white">
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handlePhotoUpload(e, { projectIndex: idx })}
                              className="hidden"
                            />
                          </label>
                          {proj.imageUrl && (
                            <button
                              onClick={() => handleProjectChange(idx, "imageUrl", "")}
                              className="text-red-400 text-[9px] font-semibold"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className={labelStyle}>Title</label>
                        <input
                          type="text"
                          value={proj.title || ""}
                          onChange={e => handleProjectChange(idx, "title", e.target.value)}
                          className={inputStyle}
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>Description</label>
                        <textarea
                          value={proj.description || ""}
                          onChange={e => handleProjectChange(idx, "description", e.target.value)}
                          rows={2}
                          className={inputStyle}
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>Tags (Comma-separated)</label>
                        <input
                          type="text"
                          value={(proj.tags || []).join(", ")}
                          onChange={e => handleProjectChange(idx, "tags", e.target.value)}
                          className={inputStyle}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelStyle}>Code Link</label>
                          <input
                            type="text"
                            value={proj.link || ""}
                            onChange={e => handleProjectChange(idx, "link", e.target.value)}
                            className={inputStyle}
                          />
                        </div>
                        <div>
                          <label className={labelStyle}>Live Link</label>
                          <input
                            type="text"
                            value={proj.liveLink || ""}
                            onChange={e => handleProjectChange(idx, "liveLink", e.target.value)}
                            className={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <button
              onClick={handleAddProject}
              className="w-full py-1.5 border border-dashed border-slate-700 rounded text-[10px] font-bold text-center text-slate-400 hover:text-white transition-colors"
            >
              + Add Project
            </button>
          </div>
        </VisualAccordionItem>

        {/* 4. Experience */}
        <VisualAccordionItem
          id="experience"
          title="Work Experience"
          icon={Briefcase}
          isOpen={activeSec === "experience"}
          onToggle={() => setActiveSec(activeSec === "experience" ? "" : "experience")}
        >
          <div className="space-y-2.5 px-1">
            {data.experience.map((exp, idx) => {
              const isExpanded = expandedExp === idx;
              return (
                <div key={idx} className="border border-slate-850 rounded-lg overflow-hidden bg-slate-950/40">
                  <div
                    onClick={() => setExpandedExp(isExpanded ? null : idx)}
                    className="flex items-center justify-between p-2.5 cursor-pointer bg-slate-900/40 hover:bg-slate-850/40 select-none"
                  >
                    <span className="text-[11px] font-bold text-slate-300 truncate max-w-[200px]">{exp.role || `Role #${idx + 1}`}</span>
                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          onChange(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }));
                          if (expandedExp === idx) setExpandedExp(null);
                        }}
                        className="p-1 rounded text-red-400 hover:bg-slate-800"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      {isExpanded ? <ChevronUp className="h-3 w-3 text-slate-500" /> : <ChevronDown className="h-3 w-3 text-slate-500" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="p-3 border-t border-slate-850 bg-slate-950/60 space-y-2">
                      <div>
                        <label className={labelStyle}>Company</label>
                        <input
                          type="text"
                          value={exp.company || ""}
                          onChange={e => handleExpChange(idx, "company", e.target.value)}
                          className={inputStyle}
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>Role</label>
                        <input
                          type="text"
                          value={exp.role || ""}
                          onChange={e => handleExpChange(idx, "role", e.target.value)}
                          className={inputStyle}
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>Duration</label>
                        <input
                          type="text"
                          value={exp.duration || ""}
                          onChange={e => handleExpChange(idx, "duration", e.target.value)}
                          className={inputStyle}
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>Job Duties / Description</label>
                        <textarea
                          value={exp.description || ""}
                          onChange={e => handleExpChange(idx, "description", e.target.value)}
                          rows={3}
                          className={inputStyle}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <button
              onClick={handleAddExperience}
              className="w-full py-1.5 border border-dashed border-slate-700 rounded text-[10px] font-bold text-center text-slate-400 hover:text-white transition-colors"
            >
              + Add Experience
            </button>
          </div>
        </VisualAccordionItem>

        {/* 5. Education */}
        <VisualAccordionItem
          id="education"
          title="Education"
          icon={GraduationCap}
          isOpen={activeSec === "education"}
          onToggle={() => setActiveSec(activeSec === "education" ? "" : "education")}
        >
          <div className="space-y-2.5 px-1">
            {data.education.map((edu, idx) => {
              const isExpanded = expandedEdu === idx;
              return (
                <div key={idx} className="border border-slate-850 rounded-lg overflow-hidden bg-slate-950/40">
                  <div
                    onClick={() => setExpandedEdu(isExpanded ? null : idx)}
                    className="flex items-center justify-between p-2.5 cursor-pointer bg-slate-900/40 hover:bg-slate-850/40 select-none"
                  >
                    <span className="text-[11px] font-bold text-slate-300 truncate max-w-[200px]">{edu.degree || `Degree #${idx + 1}`}</span>
                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          onChange(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }));
                          if (expandedEdu === idx) setExpandedEdu(null);
                        }}
                        className="p-1 rounded text-red-400 hover:bg-slate-800"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      {isExpanded ? <ChevronUp className="h-3 w-3 text-slate-500" /> : <ChevronDown className="h-3 w-3 text-slate-500" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="p-3 border-t border-slate-850 bg-slate-950/60 space-y-2">
                      <div>
                        <label className={labelStyle}>Degree</label>
                        <input
                          type="text"
                          value={edu.degree || ""}
                          onChange={e => handleEduChange(idx, "degree", e.target.value)}
                          className={inputStyle}
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>School / Institution</label>
                        <input
                          type="text"
                          value={edu.school || ""}
                          onChange={e => handleEduChange(idx, "school", e.target.value)}
                          className={inputStyle}
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>Year</label>
                        <input
                          type="text"
                          value={edu.year || ""}
                          onChange={e => handleEduChange(idx, "year", e.target.value)}
                          className={inputStyle}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <button
              onClick={handleAddEducation}
              className="w-full py-1.5 border border-dashed border-slate-700 rounded text-[10px] font-bold text-center text-slate-400 hover:text-white transition-colors"
            >
              + Add Education
            </button>
          </div>
        </VisualAccordionItem>

        {/* 6. Certifications */}
        <VisualAccordionItem
          id="certifications"
          title="Certifications"
          icon={Award}
          isOpen={activeSec === "certifications"}
          onToggle={() => setActiveSec(activeSec === "certifications" ? "" : "certifications")}
        >
          <div className="space-y-2.5 px-1">
            {(data.certifications || []).map((cert, idx) => {
              const isExpanded = expandedCert === idx;
              return (
                <div key={idx} className="border border-slate-850 rounded-lg overflow-hidden bg-slate-950/40">
                  <div
                    onClick={() => setExpandedCert(isExpanded ? null : idx)}
                    className="flex items-center justify-between p-2.5 cursor-pointer bg-slate-900/40 hover:bg-slate-850/40 select-none"
                  >
                    <span className="text-[11px] font-bold text-slate-300 truncate max-w-[200px]">{cert.name || `Cert #${idx + 1}`}</span>
                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          onChange(prev => ({ ...prev, certifications: (prev.certifications || []).filter((_, i) => i !== idx) }));
                          if (expandedCert === idx) setExpandedCert(null);
                        }}
                        className="p-1 rounded text-red-400 hover:bg-slate-800"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      {isExpanded ? <ChevronUp className="h-3 w-3 text-slate-500" /> : <ChevronDown className="h-3 w-3 text-slate-500" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="p-3 border-t border-slate-850 bg-slate-950/60 space-y-2">
                      <div>
                        <span className={labelStyle}>Cert Image / Badge</span>
                        <div className="flex gap-2 items-center mt-1">
                          {cert.imageUrl && (
                            <img src={cert.imageUrl} alt="preview" className="h-8 w-12 object-cover rounded border border-slate-800" />
                          )}
                          <label className="cursor-pointer bg-slate-850 border border-slate-750 px-2 py-1 rounded text-[9px] font-semibold text-white">
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handlePhotoUpload(e, { certIndex: idx })}
                              className="hidden"
                            />
                          </label>
                          {cert.imageUrl && (
                            <button
                              onClick={() => handleCertChange(idx, "imageUrl", "")}
                              className="text-red-400 text-[9px] font-semibold"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className={labelStyle}>Cert Name</label>
                        <input
                          type="text"
                          value={cert.name || ""}
                          onChange={e => handleCertChange(idx, "name", e.target.value)}
                          className={inputStyle}
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>Issuer</label>
                        <input
                          type="text"
                          value={cert.issuer || ""}
                          onChange={e => handleCertChange(idx, "issuer", e.target.value)}
                          className={inputStyle}
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>Date Issued</label>
                        <input
                          type="text"
                          value={cert.date || ""}
                          onChange={e => handleCertChange(idx, "date", e.target.value)}
                          className={inputStyle}
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>Credential Verification URL</label>
                        <input
                          type="text"
                          value={cert.credentialUrl || ""}
                          onChange={e => handleCertChange(idx, "credentialUrl", e.target.value)}
                          className={inputStyle}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <button
              onClick={handleAddCert}
              className="w-full py-1.5 border border-dashed border-slate-700 rounded text-[10px] font-bold text-center text-slate-400 hover:text-white transition-colors"
            >
              + Add Certification
            </button>
          </div>
        </VisualAccordionItem>

        {/* 7. Achievements */}
        <VisualAccordionItem
          id="achievements"
          title="Achievements Honors"
          icon={Award}
          isOpen={activeSec === "achievements"}
          onToggle={() => setActiveSec(activeSec === "achievements" ? "" : "achievements")}
        >
          <div className="space-y-3 px-1">
            <div className="space-y-2">
              {(data.achievements || []).map((ach, idx) => (
                <div key={idx} className="flex gap-2 items-start bg-slate-950 p-2 rounded border border-slate-850">
                  <textarea
                    value={ach}
                    onChange={e => handleAchievementChange(idx, e.target.value)}
                    rows={2}
                    className="flex-1 bg-transparent text-xs text-white border-0 p-0 focus:ring-0 resize-none focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      onChange(prev => ({
                        ...prev,
                        achievements: (prev.achievements || []).filter((_, i) => i !== idx)
                      }));
                    }}
                    className="text-red-400 hover:text-red-300 p-0.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 pt-1.5">
              <input
                type="text"
                placeholder="Acquired Gold Medal in Coding Competition"
                value={newAch}
                onChange={e => setNewAch(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddAchievement(); } }}
                className={inputStyle}
              />
              <button
                onClick={handleAddAchievement}
                className="bg-slate-800 hover:bg-slate-750 border border-slate-700 px-3 py-1.5 rounded text-xs font-semibold text-white font-sans shrink-0"
              >
                Add
              </button>
            </div>
          </div>
        </VisualAccordionItem>

        {/* 8. Languages */}
        <VisualAccordionItem
          id="languages"
          title="Languages"
          icon={Award}
          isOpen={activeSec === "languages"}
          onToggle={() => setActiveSec(activeSec === "languages" ? "" : "languages")}
        >
          <div className="space-y-3 px-1">
            {(data.languages || []).map((lang, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-slate-950 p-2 rounded border border-slate-850">
                <input
                  type="text"
                  value={lang.name}
                  onChange={e => handleLangChange(idx, "name", e.target.value)}
                  className="flex-1 bg-transparent border-0 p-0 focus:ring-0 text-xs focus:outline-none"
                  placeholder="Language"
                />
                <select
                  value={lang.level}
                  onChange={e => handleLangChange(idx, "level", e.target.value)}
                  className="bg-slate-900 text-xs border-0 p-0 focus:ring-0 text-white select-none pr-6 rounded focus:outline-none"
                >
                  <option value="Native">Native</option>
                  <option value="Professional">Professional</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Basic">Basic</option>
                </select>
                <button
                  onClick={() => onChange(prev => ({ ...prev, languages: (prev.languages || []).filter((_, i) => i !== idx) }))}
                  className="text-red-400 hover:text-red-300 p-0.5 ml-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddLanguage}
              className="w-full py-1.5 border border-dashed border-slate-700 rounded text-[10px] font-bold text-center text-slate-400 hover:text-white transition-colors"
            >
              + Add Language
            </button>
          </div>
        </VisualAccordionItem>
      </div>
    </motion.div>
  );
};

/* ====== ADMIN CONTROL BAR ====== */
const AdminControlBar = ({
  isEditMode,
  setIsEditMode,
  isSaving,
  onSave,
  unreadCount,
  onOpenNotifications,
  onLogout,
  themeColor
}: {
  isEditMode: boolean;
  setIsEditMode: (v: boolean) => void;
  isSaving: boolean;
  onSave: () => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onLogout: () => void;
  themeColor: string;
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-slate-950 border-b border-slate-850 z-[50] flex items-center justify-between px-6 text-white select-none font-sans">
      <div className="flex items-center gap-2">
        <div className="h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: themeColor }}>
          <div className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: themeColor }} />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-slate-100 font-mono">PORTGEN ADMIN CONSOLE</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Toggle Edit Mode */}
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={isEditMode} 
            onChange={e => setIsEditMode(e.target.checked)} 
            className="sr-only peer" 
          />
          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 peer-checked:after:bg-white peer-checked:after:border-emerald-650" />
          <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-slate-350">Edit Content</span>
        </label>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors"
          title="Open Inbox Messages"
        >
          <Bell className="h-4.5 w-4.5 text-slate-400 hover:text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[8px] h-3.5 w-3.5 leading-none font-sans font-bold flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Save Code changes manually */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-750 text-white text-[10px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Save className="h-3 w-3" style={{ color: themeColor }} />
          <span>{isSaving ? "Syncing..." : "Save Sync"}</span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-red-400 transition-colors border border-slate-800 hover:border-red-500/20 px-2.5 py-1.5 rounded-md bg-slate-900"
        >
          Exit
        </button>
      </div>
    </div>
  );
};

const PortfolioRenderer = ({ templateId, data, isDark = true, themeColor, sectionOrder, isPreview = false, onDownloadCode }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [notifications, setNotifications] = useState<{ _id: string; name: string; email: string; message: string; is_read: boolean; createdAt: string }[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Admin Panel states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState<PortfolioData>(data);
  const [isSaving, setIsSaving] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  useEffect(() => {
    // Check if mobile viewport
    const checkMobile = () => {
      const isMob = window.innerWidth < 768;
      const dismissed = sessionStorage.getItem("mobile_warning_dismissed");
      if (isMob && !dismissed) {
        setShowMobileWarning(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSavePortfolioChanges = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token || !API_URL) {
      alert("No backend server connected. Changes saved locally in memory.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/portfolio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editedData)
      });
      if (res.ok) {
        alert("Portfolio changes successfully synced to backend database and codebase mock data!");
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body.message || "Failed to save portfolio changes.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error: Failed to sync changes.");
    } finally {
      setIsSaving(false);
    }
  };
  useEffect(() => {
    setEditedData(data);
  }, [data]);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setIsAdminLoggedIn(true);
      fetchNotifications();
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token || !API_URL) {
      const localData = localStorage.getItem('local_portfolio_notifications');
      if (localData) {
        try {
          const list = JSON.parse(localData);
          setNotifications(list);
          setUnreadCount(list.filter((n: any) => !n.is_read).length);
        } catch (e) {
          console.warn("Failed to parse local notifications", e);
        }
      } else {
        const defaultMocks = [
          {
            _id: "mock-1",
            name: "Sarah Jenkins",
            email: "sarah.j@example.com",
            message: "Hello! Loved your portfolio projects. Are you open to freelance contracts for a React/Tailwind frontend project?",
            is_read: false,
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
          },
          {
            _id: "mock-2",
            name: "David Chen",
            email: "dchen@techstartup.io",
            message: "Hi there, we are looking for a senior dev advocate at our startup. Would love to hop on a call next week to discuss your work.",
            is_read: true,
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
          }
        ];
        localStorage.setItem('local_portfolio_notifications', JSON.stringify(defaultMocks));
        setNotifications(defaultMocks);
        setUnreadCount(1);
      }
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/portfolio/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const body = await res.json();
        if (body?.notifications) {
          setNotifications(body.notifications);
          setUnreadCount(body.notifications.filter((n: { is_read: boolean }) => !n.is_read).length);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch notifications:", e);
    }
  };

  const handleMessageSent = (name: string, email: string, message: string) => {
    const newNotif = {
      _id: `local-${Date.now()}`,
      name,
      email,
      message,
      is_read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
    setUnreadCount(prev => prev + 1);
    const token = localStorage.getItem("auth_token");
    if (!token || !API_URL) {
      const localData = localStorage.getItem('local_portfolio_notifications');
      const currentList = localData ? JSON.parse(localData) : [];
      const updatedList = [newNotif, ...currentList];
      localStorage.setItem('local_portfolio_notifications', JSON.stringify(updatedList));
    }
  };

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem("auth_token");
    if (!token || !API_URL) {
      const localData = localStorage.getItem('local_portfolio_notifications');
      if (localData) {
        try {
          const list = JSON.parse(localData);
          const updated = list.map((n: any) => n._id === id ? { ...n, is_read: true } : n);
          localStorage.setItem('local_portfolio_notifications', JSON.stringify(updated));
          setNotifications(updated);
          setUnreadCount(updated.filter((n: any) => !n.is_read).length);
        } catch (e) {
          console.warn(e);
        }
      }
      return;
    }
    try {
      await fetch(`${API_URL}/api/portfolio/notifications/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notificationId: id })
      });
      fetchNotifications();
    } catch (e) {
      console.warn(e);
    }
  };

  const deleteNotification = async (id: string) => {
    const token = localStorage.getItem("auth_token");
    if (!token || !API_URL) {
      const localData = localStorage.getItem('local_portfolio_notifications');
      if (localData) {
        try {
          const list = JSON.parse(localData);
          const updated = list.filter((n: any) => n._id !== id);
          localStorage.setItem('local_portfolio_notifications', JSON.stringify(updated));
          setNotifications(updated);
          setUnreadCount(updated.filter((n: any) => !n.is_read).length);
        } catch (e) {
          console.warn(e);
        }
      }
      return;
    }
    try {
      await fetch(`${API_URL}/api/portfolio/notifications/clear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notificationId: id })
      });
      fetchNotifications();
    } catch (e) {
      console.warn(e);
    }
  };

  const clearAllNotifications = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token || !API_URL) {
      localStorage.setItem('local_portfolio_notifications', JSON.stringify([]));
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      await fetch(`${API_URL}/api/portfolio/notifications/clear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
      fetchNotifications();
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (isPreview || isAdminLoggedIn) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [isPreview, isAdminLoggedIn]);

  const defaultOrder = ["about", "skills", "projects", "experience", "education", "certifications", "contact"];
  const orderToUse = sectionOrder && sectionOrder.length > 0 ? sectionOrder : defaultOrder;
  const activeThemeColor = themeColor || "hsl(190 95% 55%)";

  // Normalize all URLs and array collections in the data object before rendering to prevent relative URL issues and runtime TypeError crashes
  const normalizedData = useMemo(() => {
    const activeData = isAdminLoggedIn ? editedData : data;
    return {
      ...activeData,
      name: (activeData.name || "").trim().replace(/\s+/g, " "),
      website: activeData.website ? ensureAbsoluteUrl(activeData.website) : activeData.website,
      socialLinks: (activeData.socialLinks || []).map(l => ({
        ...l,
        url: ensureAbsoluteUrl(l.url)
      })),
      projects: (activeData.projects || []).map((p, idx) => ({
        ...p,
        title: p.title || `Project ${idx + 1}`,
        tags: p.tags || [],
        link: p.link ? ensureAbsoluteUrl(p.link) : p.link,
        liveLink: p.liveLink ? ensureAbsoluteUrl(p.liveLink) : p.liveLink
      })),
      skills: activeData.skills || [],
      experience: (activeData.experience || []).map((e, idx) => ({
        ...e,
        role: e.role || `Role ${idx + 1}`,
        company: e.company || `Company ${idx + 1}`
      })),
      education: (activeData.education || []).map((edu, idx) => ({
        ...edu,
        degree: edu.degree || `Degree ${idx + 1}`,
        school: edu.school || `School ${idx + 1}`
      })),
      certifications: (activeData.certifications || []).map((c, idx) => ({
        ...c,
        name: c.name || `Certification ${idx + 1}`,
        issuer: c.issuer || `Issuer ${idx + 1}`,
        credentialUrl: c.credentialUrl ? ensureAbsoluteUrl(c.credentialUrl) : c.credentialUrl
      })),
      achievements: activeData.achievements || [],
      languages: (activeData.languages || []).map((lang, idx) => ({
        ...lang,
        name: lang.name || `Language ${idx + 1}`
      }))
    };
  }, [data, editedData, isAdminLoggedIn]);

    const renderTemplate = () => {
    const isMobile = containerWidth < 768;
    switch (templateId) {
      case "tech-minimalist":
        return <TechMinimalist data={normalizedData} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} isPreview={isPreview} unreadCount={unreadCount} onOpenNotifications={() => setShowNotifications(true)} isMobile={isMobile} onDownloadCode={onDownloadCode} onMessageSent={handleMessageSent} />;
      case "retro-terminal":
        return <RetroTerminal data={normalizedData} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} isPreview={isPreview} unreadCount={unreadCount} onOpenNotifications={() => setShowNotifications(true)} onDownloadCode={onDownloadCode} onMessageSent={handleMessageSent} />;
      case "glass-aurora":
        return <GlassAurora data={normalizedData} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} isPreview={isPreview} unreadCount={unreadCount} onOpenNotifications={() => setShowNotifications(true)} isMobile={isMobile} onDownloadCode={onDownloadCode} onMessageSent={handleMessageSent} />;
      case "cyberpunk-glitch":
        return <CyberpunkGlitch data={normalizedData} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} isPreview={isPreview} unreadCount={unreadCount} onOpenNotifications={() => setShowNotifications(true)} isMobile={isMobile} onDownloadCode={onDownloadCode} onMessageSent={handleMessageSent} />;
      case "neobrutalist-bold":
        return <NeobrutalistBold data={normalizedData} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} isPreview={isPreview} unreadCount={unreadCount} onOpenNotifications={() => setShowNotifications(true)} isMobile={isMobile} onDownloadCode={onDownloadCode} onMessageSent={handleMessageSent} />;
      case "elegant-serif":
        return <ElegantEditorial data={normalizedData} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} isPreview={isPreview} unreadCount={unreadCount} onOpenNotifications={() => setShowNotifications(true)} isMobile={isMobile} onDownloadCode={onDownloadCode} onMessageSent={handleMessageSent} />;
      case "gradient-spotlight":
        return <GradientSpotlight data={normalizedData} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} isPreview={isPreview} unreadCount={unreadCount} onOpenNotifications={() => setShowNotifications(true)} isMobile={isMobile} onDownloadCode={onDownloadCode} onMessageSent={handleMessageSent} />;
      case "interactive-timeline":
        return <InteractiveTimeline data={normalizedData} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} isPreview={isPreview} unreadCount={unreadCount} onOpenNotifications={() => setShowNotifications(true)} isMobile={isMobile} onDownloadCode={onDownloadCode} onMessageSent={handleMessageSent} />;
      case "card-deck":
        return <CardDeck data={normalizedData} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} isPreview={isPreview} unreadCount={unreadCount} onOpenNotifications={() => setShowNotifications(true)} isMobile={isMobile} onDownloadCode={onDownloadCode} onMessageSent={handleMessageSent} />;
      case "dashboard-saas":
        return <DashboardSaas data={normalizedData} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} isPreview={isPreview} unreadCount={unreadCount} onOpenNotifications={() => setShowNotifications(true)} onDownloadCode={onDownloadCode} onMessageSent={handleMessageSent} />;
      default:
        return <TechMinimalist data={normalizedData} isDark={isDark} themeColor={activeThemeColor} sectionOrder={orderToUse} isPreview={isPreview} unreadCount={unreadCount} onOpenNotifications={() => setShowNotifications(true)} isMobile={isMobile} onDownloadCode={onDownloadCode} onMessageSent={handleMessageSent} />;
    }
  };

    return (
    <div ref={containerRef} className="relative w-full h-full min-h-screen">
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
        .mobile-accordion-content .section-header-container,
        .mobile-accordion-content h2,
        .mobile-accordion-content h3.text-xs.font-bold.uppercase {
          display: none !important;
        }
        ${data.designSettings?.customCss || ""}
      `}</style>

      {isAdminLoggedIn && (
        <AdminControlBar
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          isSaving={isSaving}
          onSave={handleSavePortfolioChanges}
          unreadCount={unreadCount}
          onOpenNotifications={() => setShowNotifications(true)}
          onLogout={() => {
            localStorage.removeItem("auth_token");
            setIsAdminLoggedIn(false);
            setIsEditMode(false);
            window.location.reload();
          }}
          themeColor={activeThemeColor}
        />
      )}

      <div id="portfolio-template-root" className={`w-full h-full animate-fade-in ${isAdminLoggedIn ? "pt-14" : ""}`}>
        {renderTemplate()}
      </div>

      <AnimatePresence>
        {isAdminLoggedIn && isEditMode && (
          <VisualEditorDrawer
            data={editedData}
            onChange={setEditedData}
            onSave={handleSavePortfolioChanges}
            isSaving={isSaving}
            themeColor={activeThemeColor}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMobileWarning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans select-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-7 w-7 text-amber-500 shrink-0" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Mobile Viewport Warning</h3>
              </div>
              <p className="text-xs text-slate-350 leading-relaxed mb-6">
                This page is optimized for desktop viewports to showcase premium design elements. 
                We have enabled a simplified mobile accordion layout for you, but for the full interactive developer portfolio experience, opening this page on a desktop is highly recommended.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    sessionStorage.setItem("mobile_warning_dismissed", "true");
                    setShowMobileWarning(false);
                  }}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase text-[10px] tracking-wider rounded-lg transition-colors text-center"
                  style={{ backgroundColor: activeThemeColor, color: "#000" }}
                >
                  Continue Anyway
                </button>
                <button
                  onClick={() => {
                    window.location.href = "/dashboard";
                  }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold uppercase text-[10px] tracking-wider rounded-lg transition-colors border border-slate-700 text-center"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            className={`absolute top-16 right-6 z-[60] w-80 sm:w-96 max-h-[500px] flex flex-col bg-slate-900/95 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden font-sans`}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" style={{ color: activeThemeColor }} />
                <span className="text-xs font-bold uppercase tracking-wider">Inbox Notifications</span>
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button 
                    onClick={clearAllNotifications}
                    className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors uppercase font-bold"
                  >
                    Clear All
                  </button>
                )}
                <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-slate-200 transition-colors ml-1">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[380px] scrollbar-thin select-text">
              {notifications.length === 0 ? (
                <div className="text-center py-10 text-xs text-zinc-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-25" />
                  <p>No messages received yet.</p>
                  <p className="text-[10px] mt-1 text-zinc-500/70">Submit the contact form to trigger a notification!</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif._id} 
                    className={`p-3 rounded-xl border text-xs leading-normal transition-all relative ${notif.is_read ? "bg-slate-950/40 border-slate-900/60 opacity-60" : "bg-slate-950/90 border-slate-850"}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="font-bold text-white truncate max-w-[180px]">{notif.name}</div>
                        <div className="text-[10px] text-zinc-500 truncate max-w-[180px]">{notif.email}</div>
                      </div>
                      <div className="flex gap-2 items-center shrink-0 select-none">
                        {!notif.is_read && (
                          <button 
                            onClick={() => markAsRead(notif._id)}
                            className="p-1 rounded bg-slate-850 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 transition-colors"
                            title="Mark as Read"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(notif._id)}
                          className="p-1 rounded bg-slate-850 hover:bg-slate-800 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-zinc-300 bg-slate-950 border border-slate-900/60 p-2.5 rounded-lg whitespace-pre-wrap font-sans text-[11px] leading-relaxed select-text">{notif.message}</p>
                    <div className="text-[9px] text-zinc-550 mt-2 text-right select-none">
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingWidgets 
        data={normalizedData} 
        themeColor={activeThemeColor} 
        isPreview={isPreview} 
        showAdmin={showAdmin}
        setShowAdmin={setShowAdmin}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
        fetchNotifications={fetchNotifications}
      />
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
  buttonTextColor,
  portfolioId
}: { 
  buttonStyle?: string; 
  inputStyle?: string; 
  buttonColor?: string; 
  buttonTextColor?: string; 
  portfolioId?: string;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    // Fallback if no backend connection is active (e.g. standalone codebase download)
    if (!portfolioId || !API_URL) {
      setTimeout(() => {
        setSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
        setIsSubmitting(false);
        setTimeout(() => setSubmitted(false), 5000);
      }, 500);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/portfolio/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          portfolioId,
          name,
          email,
          message
        })
      });
      if (res.ok) {
        setSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.message || "Failed to send message.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error. Failed to reach the server.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitted && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs text-center font-sans">
          ✅ Message sent successfully! I'll get back to you soon.
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs text-center font-sans">
          ❌ {error}
        </div>
      )}
      <input 
        type="text" 
        placeholder="Your Name" 
        required 
        value={name}
        onChange={e => setName(e.target.value)}
        className={inputStyle || "w-full p-2.5 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-primary"} 
      />
      <input 
        type="email" 
        placeholder="Your Email" 
        required 
        value={email}
        onChange={e => setEmail(e.target.value)}
        className={inputStyle || "w-full p-2.5 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-primary"} 
      />
      <textarea 
        placeholder="Your Message" 
        rows={4} 
        required 
        value={message}
        onChange={e => setMessage(e.target.value)}
        className={inputStyle || "w-full p-2.5 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-primary"}
      ></textarea>
      <button
        type="submit"
        disabled={isSubmitting}
        className={buttonStyle || "w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/95 transition-colors disabled:opacity-50"}
        style={buttonColor || buttonTextColor ? { 
          backgroundColor: buttonColor, 
          color: buttonTextColor || "#fff" 
        } : undefined}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};


/* ====== DECIPHER TEXT ENHANCEMENT ====== */
const DecipherText = ({ text, className = "", style = {} }: { text: string; className?: string; style?: React.CSSProperties }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "01_+#[]x/\\<>$&%@*";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let iterations = 0;
    
    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iterations) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iterations >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      iterations += 1 / 3;
    }, 30);
  }, [text]);

  useEffect(() => {
    startAnimation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, startAnimation]);

  const handleMouseEnter = () => {
    startAnimation();
  };

  return (
    <span 
      className={className} 
      style={style}
      onMouseEnter={handleMouseEnter}
    >
      {displayText}
    </span>
  );
};

/* ====== SHARED SECTION HEADER ====== */
const SectionHeader = ({ label, color }: { label: string; color: string }) => (
  <div className="flex items-center gap-3 mb-2 select-none">
    <DecipherText 
      text={label} 
      className="text-xs font-bold uppercase tracking-[0.2em]" 
      style={{ color }} 
    />
    <div className="flex-1 h-px opacity-20" style={{ backgroundColor: color }} />
  </div>
);

/* ====== SHARED SKILL BADGE ENHANCEMENT ====== */
const SkillBadge = ({ skill, themeColor }: { skill: string; themeColor: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
      }}
      whileHover={{ 
        scale: 1.08, 
        borderColor: themeColor, 
        boxShadow: `0 0 16px ${themeColor}40`,
        backgroundColor: `${themeColor}15`
      }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="rounded-sm px-3.5 py-1.5 text-xs border font-semibold cursor-default transition-all flex items-center gap-1 select-none"
      style={{ 
        backgroundColor: hovered ? `${themeColor}15` : `${themeColor}08`, 
        color: themeColor, 
        borderColor: hovered ? themeColor : `${themeColor}20` 
      }}
    >
      <span>{skill}</span>
      {hovered && (
        <motion.span 
          animate={{ opacity: [1, 0, 1] }} 
          transition={{ duration: 0.8, repeat: Infinity }}
          className="font-bold shrink-0"
        >
          _
        </motion.span>
      )}
    </motion.span>
  );
};

/* ====== 1. TECH MINIMALIST ====== */

// ==================== DESIGN UPGRADES INJECTIONS ====================
interface FlipCardProps {
  cert: any;
  themeColor: string;
  isDark: boolean;
  muted: string;
  cardBg: string;
}

const CertificateFlipCard = ({ cert, themeColor, isDark, muted, cardBg }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div 
      className="relative w-full h-[220px] [perspective:1000px] cursor-pointer group font-sans"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(prev => !prev)}
    >
      <div 
        className="w-full h-full transition-transform duration-500 [transform-style:preserve-3d] relative"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front side */}
        <div className={`absolute inset-0 [backface-visibility:hidden] w-full h-full rounded-xl border flex flex-col justify-between overflow-hidden shadow-sm ${cardBg}`}>
          {cert.imageUrl ? (
            <div className="h-28 w-full overflow-hidden border-b relative" style={{ borderColor: `${themeColor}20` }}>
              <img src={cert.imageUrl} alt={cert.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          ) : (
            <div className="h-24 w-full flex items-center justify-center border-b relative" style={{ borderColor: `${themeColor}20`, backgroundColor: `${themeColor}06` }}>
              <Award className="h-10 w-10 opacity-25" style={{ color: themeColor }} />
            </div>
          )}
          <div className="p-3.5 flex-1 flex flex-col justify-between">
            <h4 className={`font-bold text-xs leading-snug line-clamp-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}>{cert.name}</h4>
            <div className="flex items-center justify-between mt-1 select-none">
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border" style={{ color: themeColor, borderColor: `${themeColor}25`, backgroundColor: `${themeColor}05` }}>{cert.issuer}</span>
              <span className="text-[9px] text-zinc-550 font-medium">Hover to flip</span>
            </div>
          </div>
        </div>

        {/* Back side */}
        <div 
          className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] w-full h-full rounded-xl border flex flex-col justify-between p-4 shadow-lg ${cardBg}`}
          style={{ borderColor: `${themeColor}40` }}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4" style={{ color: themeColor }} />
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 select-none">Verification</span>
            </div>
            <h4 className={`font-bold text-xs leading-snug ${isDark ? "text-slate-250" : "text-slate-800"}`}>{cert.name}</h4>
            <p className="text-[10px] text-zinc-400 leading-normal">Issuer: <strong className={isDark ? "text-slate-200" : "text-slate-800"}>{cert.issuer}</strong></p>
            <p className="text-[10px] text-zinc-400 leading-normal">Issued: <strong className={isDark ? "text-slate-200" : "text-slate-800"}>{cert.date}</strong></p>
          </div>
          {cert.credentialUrl && (
            <a 
              href={cert.credentialUrl} 
              target="_blank" 
              rel="noreferrer"
              className="w-full text-center py-1.5 rounded font-bold text-[9px] uppercase tracking-wider transition-colors inline-block select-none"
              style={{ backgroundColor: themeColor, color: isDark ? '#000' : '#fff' }}
            >
              Verify Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const TemplateHeroBackground = ({ templateId, themeColor, isDark }: { templateId: string; themeColor: string; isDark: boolean }) => {
  switch (templateId) {
    case "tech-minimalist":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] dark:opacity-[0.015]" />
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full filter blur-[80px]"
              style={{
                width: 200 + i * 50,
                height: 200 + i * 50,
                backgroundColor: themeColor,
                opacity: 0.02,
                top: `${20 + i * 15}%`,
                left: `${15 + i * 20}%`,
              }}
              animate={{
                x: [0, 30, -20, 0],
                y: [0, -40, 30, 0],
              }}
              transition={{
                duration: 12 + i * 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      );
    case "retro-terminal":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
        </div>
      );
    case "glass-aurora":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          <motion.div 
            className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full filter blur-[100px] opacity-20" 
            style={{ backgroundColor: themeColor }}
            animate={{ x: [0, 80, -40, 0], y: [0, -45, 80, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full filter blur-[100px] opacity-15" 
            style={{ backgroundColor: "hsl(270 80% 65%)" }}
            animate={{ x: [0, -80, 40, 0], y: [0, 45, -80, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-[30%] right-[10%] w-[40vw] h-[40vw] rounded-full filter blur-[120px] opacity-10" 
            style={{ backgroundColor: "hsl(190 95% 55%)" }}
            animate={{ x: [0, 40, -40, 0], y: [0, -50, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      );
    case "cyberpunk-glitch":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,204,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,0,85,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <motion.div
            className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff0055] to-transparent opacity-40"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>
      );
    case "neobrutalist-bold":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.05]" />
          <motion.div 
            className="absolute top-[20%] left-[8%] w-10 h-10 border-2 border-black dark:border-white shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#fff] rotate-12"
            style={{ backgroundColor: themeColor }}
            animate={{ y: [0, -12, 0], rotate: [12, 25, 12] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-[30%] right-[10%] w-14 h-14 border-2 border-black dark:border-white rounded-full shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#fff]"
            style={{ backgroundColor: "hsl(40 100% 50%)" }}
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      );
    case "elegant-serif":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 opacity-[0.04]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#000_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
      );
    case "gradient-spotlight":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.02] dark:opacity-[0.01]" />
        </div>
      );
    case "interactive-timeline":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 opacity-15">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:50px_50px] opacity-[0.05]" />
        </div>
      );
    case "card-deck":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          <motion.div 
            className="absolute top-[40%] left-[20%] w-[35vw] h-[35vw] rounded-full filter blur-[100px] opacity-10" 
            style={{ backgroundColor: themeColor }}
            animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      );
    case "dashboard-saas":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
      );
    default:
      return null;
  }
};
// ====================================================================

const TechMinimalist = ({
  onDownloadCode,
  onMessageSent, 
  data, 
  isDark, 
  themeColor, 
  sectionOrder, 
  isPreview = false,
  unreadCount = 0,
  onOpenNotifications,
  portfolioId,
  isMobile
}: { 
  data: PortfolioData; 
  isDark?: boolean; 
  themeColor: string; 
  sectionOrder: string[]; 
  isPreview?: boolean;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onDownloadCode?: () => void;
  onMessageSent?: (name: string, email: string, message: string) => void;
  portfolioId?: string;
  isMobile: boolean;
}) => {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedTag, setSelectedTag] = useState("All");
  const allTags = useMemo(() => ["All", ...Array.from(new Set((data.projects || []).flatMap(p => p.tags || [])))], [data.projects]);
  const filteredProjects = useMemo(() => {
    if (selectedTag === "All") return data.projects || [];
    return (data.projects || []).filter(p => p.tags?.includes(selectedTag));
  }, [data.projects, selectedTag]);
  
  const [typedText, setTypedText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Mouse tracking for spotlight glow
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

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

  const bg = isDark ? "bg-slate-950 text-slate-100" : "bg-[#FAF9F5] text-slate-800";
  const cardBg = isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200";
  const muted = isDark ? "text-slate-400" : "text-slate-600";

  const sectionVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" as const } },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 20 }
    }
  };

  const skillCategories = getSkillCategories(data.skills);

  const sections = sectionOrder;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`min-h-screen font-mono pb-20 transition-colors duration-300 relative overflow-hidden ${bg} bg-[radial-gradient(${isDark ? "#1e293b" : "#e2e8f0"}_1px,transparent_1px)] [background-size:20px_20px]`}
    >
      <style>{`
        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(2deg);
          }
        }
      `}</style>

      {/* Scroll Progress Bar */}
      <motion.div
        className={`${isPreview ? "absolute" : "fixed"} top-0 left-0 right-0 h-[3px] z-50 origin-left`}
        style={{
          scaleX,
          backgroundColor: themeColor,
          boxShadow: `0 0 10px ${themeColor}, 0 0 15px ${themeColor}`
        }}
      />

      {/* Sweeping laser scanline */}
      {(!data.designSettings || data.designSettings.scanlinesEnabled !== false) && (
        <div 
          className={`pointer-events-none ${isPreview ? "absolute" : "fixed"} inset-x-0 top-0 h-[2px] z-30 opacity-[0.12]`}
          style={{
            background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)`,
            boxShadow: `0 0 8px ${themeColor}, 0 0 15px ${themeColor}`,
            animation: "scanline 10s linear infinite"
          }}
        />
      )}

      {/* Background status nodes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 opacity-[0.04] text-[10px] font-mono">
        <div className="absolute top-[18%] left-[4%] animate-[float-slow_7s_ease-in-out_infinite]" style={{ color: themeColor }}>
          [SYSTEM_STATUS: ACTIVE]
        </div>
        <div className="absolute top-[32%] right-[6%] animate-[float-slow_9s_ease-in-out_infinite_1s]" style={{ color: themeColor }}>
          [PORT_LOAD: 8080/TCP]
        </div>
        <div className="absolute top-[58%] left-[2%] animate-[float-slow_8s_ease-in-out_infinite_2s]" style={{ color: themeColor }}>
          [CONN_ESTABLISHED: OK]
        </div>
        <div className="absolute top-[78%] right-[4%] animate-[float-slow_10s_ease-in-out_infinite_1.5s]" style={{ color: themeColor }}>
          01001011 01011001
        </div>
      </div>
      {/* Interactive Mouse Spotlight */}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute rounded-full blur-[120px] z-0"
          style={{
            width: "350px",
            height: "350px",
            left: mousePos.x - 175,
            top: mousePos.y - 175,
            background: `radial-gradient(circle, ${themeColor} 0%, transparent 70%)`,
            opacity: isDark ? 0.08 : 0.05
          }}
          transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
        />
      )}

            {/* ===== STICKY NAVBAR ===== */}
      <nav className={`sticky top-0 z-40 backdrop-blur-md border-b px-6 py-3.5 flex items-center justify-between transition-colors duration-300 ${isDark ? "bg-slate-950/90 border-slate-800" : "bg-white/90 border-slate-200"}`}>
        <a href="#" className="font-extrabold tracking-wider text-sm flex items-center gap-2 animate-pulse" style={{ color: themeColor }}>
          <span className="inline-flex items-center justify-center h-7 w-7 rounded text-xs font-black border" style={{ backgroundColor: `${themeColor}15`, borderColor: `${themeColor}30` }}>
            {data.name.charAt(0)}
          </span>
          {data.name.split(" ").map(w => w.charAt(0)).join("")}.DEV
        </a>
        <div className={`${isMobile ? "hidden" : "flex"} gap-5 text-[11px] font-semibold`}>
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
        <div className="flex items-center gap-3">
          {
            isPreview && onOpenNotifications && (
              <button
              onClick={onOpenNotifications}
              className="relative p-1.5 rounded-full hover:bg-slate-850/10 dark:hover:bg-slate-800/40 transition-colors"
              title="Open Inbox Messages"
            >
              <Bell className="h-4.5 w-4.5" style={{ color: themeColor }} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[8px] h-3.5 w-3.5 leading-none font-sans font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            )
          }
          {
            onDownloadCode && (
              <button
              onClick={onDownloadCode}
              className="relative p-1.5 rounded-full hover:bg-slate-850/10 dark:hover:bg-slate-800/40 transition-colors"
              title="Download Codebase"
            >
              <Download className="h-4.5 w-4.5" style={{ color: themeColor }} />
              
            </button>
            )
          }
          <button className={`${isMobile ? "block" : "hidden"} p-1 rounded transition-colors`} onClick={() => setMenuOpen(m => !m)} style={{ color: themeColor }}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`sticky top-[53px] z-30 border-b px-6 py-4 flex flex-col gap-3 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}
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
      <section id="home" className="min-h-[92vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden z-10">
        <TemplateHeroBackground templateId="tech-minimalist" themeColor={themeColor} isDark={isDark || false} />
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
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }} className="flex justify-center">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="relative h-28 w-28 rounded-full overflow-hidden border-4" 
                style={{ borderColor: themeColor, boxShadow: `0 0 32px ${themeColor}30` }}
              >
                <img src={data.photo} alt={data.name} className="h-full w-full object-cover" />
              </motion.div>
            </motion.div>
          )}

          {(!data.designSettings || data.designSettings.showOpportunitiesBadge !== false) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-wider border font-semibold"
              style={{ backgroundColor: `${themeColor}10`, color: themeColor, borderColor: `${themeColor}30` }}
            >
              <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
              {data.designSettings?.opportunitiesText || "AVAILABLE FOR OPPORTUNITIES"}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`text-5xl sm:text-7xl font-black tracking-tight leading-none ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {data.name.split(" ").map((word, wi) => (
              <span key={`${word}-${wi}`} className="inline-block mr-4 sm:mr-6" style={wi === data.name.split(" ").length - 1 ? { color: themeColor } : {}}>
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
            <motion.a 
              href="#projects"
              whileHover={{ scale: 1.05, boxShadow: `0 0 24px ${themeColor}60` }}
              whileTap={{ scale: 0.98 }}
              className="font-bold text-xs py-3 px-7 rounded-sm uppercase tracking-wider flex items-center gap-1.5 transition-all"
              style={{ backgroundColor: themeColor, color: isDark ? "#020617" : "#ffffff" }}
            >
              View Projects <ExternalLink className="h-3.5 w-3.5" />
            </motion.a>
            <motion.a 
              href="#contact"
              whileHover={{ scale: 1.05, backgroundColor: `${themeColor}15`, borderColor: themeColor }}
              whileTap={{ scale: 0.98 }}
              className="border font-bold text-xs py-3 px-7 rounded-sm uppercase tracking-wider transition-all"
              style={{ borderColor: `${themeColor}50`, color: themeColor, backgroundColor: `${themeColor}08` }}
            >
              Get in Touch
            </motion.a>
            {data.website && (
              <motion.a 
                href={data.website} 
                target="_blank" 
                rel="noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`border font-bold text-xs py-3 px-7 rounded-sm uppercase tracking-wider transition-all flex items-center gap-1.5 ${isDark ? "border-slate-700 text-slate-300 hover:border-slate-500" : "border-slate-300 text-slate-700 hover:border-slate-400"}`}
              >
                <ExternalLink className="h-3.5 w-3.5" /> Portfolio
              </motion.a>
            )}
            <motion.a 
              href={data.socialLinks.find(l => l.platform === "GitHub")?.url || "#"}
              target="_blank" 
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`border font-bold text-xs py-3 px-7 rounded-sm uppercase tracking-wider transition-all flex items-center gap-1.5 ${isDark ? "border-slate-700 text-slate-300 hover:border-slate-500" : "border-slate-300 text-slate-700 hover:border-slate-400"}`}
            >
              <Github className="h-3.5 w-3.5" /> GitHub
            </motion.a>
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

      {/* Dynamic sections wrapper */}
      <div className="mx-auto max-w-5xl px-6 pt-8 space-y-24 pb-24 relative z-10">
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
                          <motion.a 
                            key={l.platform} 
                            href={l.url} 
                            target="_blank" 
                            rel="noreferrer"
                            whileHover={{ scale: 1.05, borderColor: themeColor }}
                            className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded border uppercase tracking-wider transition-all"
                            style={{ color: themeColor, borderColor: `${themeColor}30`, backgroundColor: `${themeColor}08` }}
                          >
                            {l.platform === "GitHub" && <Github className="h-3 w-3" />}
                            {l.platform === "LinkedIn" && <Linkedin className="h-3 w-3" />}
                            {l.platform === "Twitter" && <Twitter className="h-3 w-3" />}
                            {l.platform}
                          </motion.a>
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
                    {skillCategories.map((cat) => (
                      <div key={cat.label}>
                        <div className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-3 ${muted}`}>{cat.label}</div>
                        <motion.div 
                          variants={containerVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          className="flex flex-wrap gap-2"
                        >
                          {cat.skills.map((s) => (
                            <SkillBadge key={s} skill={s} themeColor={themeColor} />
                          ))}
                        </motion.div>
                      </div>
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
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-6 grid gap-5 sm:grid-cols-2"
                  >
                    {data.projects.map((p) => (
                      <motion.div
                        key={p.title}
                        variants={itemVariants}
                        whileHover={{ 
                          y: -8, 
                          scale: 1.015, 
                          borderColor: `${themeColor}60`, 
                          boxShadow: `0 12px 32px ${themeColor}15` 
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className={`rounded-lg border flex flex-col overflow-hidden transition-colors group ${cardBg}`}
                      >
                        {/* Project preview image */}
                        {p.imageUrl ? (
                          <div className="h-40 w-full overflow-hidden border-b relative" style={{ borderColor: `${themeColor}15` }}>
                            {/* Terminal Scanline overlay */}
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.18)_50%)] bg-[size:100%_4px] z-10 opacity-50" />
                            <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-106" />
                          </div>
                        ) : (
                          <div className="h-32 w-full flex items-center justify-center border-b relative overflow-hidden" style={{ borderColor: `${themeColor}15`, backgroundColor: `${themeColor}06` }}>
                            {/* Terminal Scanline overlay */}
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.18)_50%)] bg-[size:100%_4px] z-10 opacity-30" />
                            <Code className="h-10 w-10 opacity-20 transition-all duration-300 group-hover:opacity-40 group-hover:scale-110" style={{ color: themeColor }} />
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
                  </motion.div>
                </motion.section>
              );

            case "experience":
              return (
                <motion.section id="experience" key="experience" className="scroll-mt-24"
                  variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
                >
                  <SectionHeader label="// PROFESSIONAL EXP" color={themeColor} />
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-6 space-y-5 relative"
                  >
                    <motion.div 
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute left-5 top-2 bottom-2 w-px origin-top opacity-30" 
                      style={{ backgroundColor: themeColor, boxShadow: `0 0 8px ${themeColor}` }}
                    />
                    {data.experience.map((e) => (
                      <motion.div key={e.role + e.company}
                        variants={itemVariants}
                        className="pl-14 relative"
                      >
                        <motion.div 
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                          className="absolute left-3 top-5 h-4 w-4 rounded-full border-2 flex items-center justify-center z-10"
                          style={{ borderColor: themeColor, backgroundColor: isDark ? "#020617" : "#f9fafb" }}
                        >
                          <motion.div 
                            animate={{ scale: [1, 1.3, 1] }} 
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-1.5 w-1.5 rounded-full" 
                            style={{ backgroundColor: themeColor }} 
                          />
                        </motion.div>
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
                  </motion.div>
                </motion.section>
              );

            case "education":
              return (
                <motion.section id="education" key="education" className="scroll-mt-24"
                  variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
                >
                  <SectionHeader label="// ACADEMICS" color={themeColor} />
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-6 grid gap-4 sm:grid-cols-2"
                  >
                    {data.education.map((edu) => (
                      <motion.div key={edu.degree}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, borderColor: `${themeColor}40` }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
                  </motion.div>
                </motion.section>
              );

            case "certifications":
              return data.certifications && data.certifications.length > 0 ? (
                <motion.section id="certifications" key="certifications" className="scroll-mt-24"
                  variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
                >
                  <SectionHeader label="// CERTIFICATIONS" color={themeColor} />
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-6 grid gap-5 sm:grid-cols-2"
                  >
                    {data.certifications.map((c) => (
                      <motion.div key={c.name}
                        variants={itemVariants}
                        whileHover={{ y: -6, scale: 1.015, borderColor: `${themeColor}60`, boxShadow: `0 8px 24px ${themeColor}15` }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className={`rounded-lg border overflow-hidden ${cardBg}`}
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
                  </motion.div>
                </motion.section>
              ) : null;

            case "achievements":
              return data.achievements && data.achievements.length > 0 ? (
                <motion.section id="achievements" key="achievements" className="scroll-mt-24"
                  variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
                >
                  <SectionHeader label="// ACHIEVEMENTS" color={themeColor} />
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-6 space-y-3"
                  >
                    {data.achievements.map((ach, ai) => (
                      <motion.div key={ai}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01, borderColor: `${themeColor}40`, x: 4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`p-4 rounded-lg border text-sm flex items-start gap-3 ${cardBg}`}
                      >
                        <span className={muted}>{ach}</span>
                      </motion.div>
                    ))}
                  </motion.div>
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
                    <CommonContactForm onMessageSent={onMessageSent}
                      inputStyle={`w-full p-3 border rounded-sm text-xs font-mono focus:outline-none transition-colors ${isDark ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700 placeholder:text-slate-600" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-300 placeholder:text-slate-400"}`}
                      buttonStyle={`w-full py-3 font-bold rounded-sm uppercase tracking-widest text-xs transition-all hover:opacity-90 hover:scale-[1.01]`}
                      buttonColor={themeColor}
                      portfolioId={portfolioId}
                    />
                  </div>
                </motion.section>
              );

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
const RetroTerminal = ({
  onDownloadCode,
  onMessageSent, 
  data, 
  isDark, 
  themeColor, 
  sectionOrder,
  isPreview = false,
  unreadCount = 0,
  onOpenNotifications,
  portfolioId
}: { 
  data: PortfolioData; 
  isDark?: boolean; 
  themeColor: string; 
  sectionOrder: string[];
  isPreview?: boolean;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onDownloadCode?: () => void;
  onMessageSent?: (name: string, email: string, message: string) => void;
  portfolioId?: string;
}) => {
  const hostUser = useMemo(() => (data.name || "user").toLowerCase().replace(/\s+/g, "-"), [data.name]);
  const hostPrompt = `visitor@${hostUser}-portfolio:~$`;

  // Dynamically constructed files mapping database details to standard coding extension filenames
  const files = useMemo(() => {
    const fileMap: Record<string, { label: string; lang: string; content: string }> = {
      "welcome.txt": {
        label: "welcome.txt",
        lang: "plaintext",
        content: `========================================================================
██████╗  ██████╗ ██████╗ ████████╗ ██████╗ ███████╗███╗   ██╗
██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝ ██╔════╝████╗  ██║
██████╔╝██║   ██║██████╔╝   ██║   ██║  ███╗█████╗  ██╔██╗ ██║
██╔═══╝ ██║   ██║██╔══██╗   ██║   ██║   ██║██╔══╝  ██║╚██╗██║
██║     ╚██████╔╝██║  ██║   ██║   ╚██████╔╝███████╗██║ ╚████║
╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═══╝
========================================================================
SYSTEM STATUS : ONLINE / ACTIVE
IP NODE       : 127.0.0.1
HOST DOMAIN   : ${hostUser}.dev
DEVELOPER     : ${data.name}
DESIGNATION   : ${data.title}

Welcome to my retro terminal interface.
You can explore my credentials in two ways:
  1. Click files in the Workspace Sidebar on the left.
  2. Use the interactive shell terminal at the bottom.
     Type 'help' to see list of valid command inputs.

Try clicking 'about.txt' or 'skills.json' to review data.
------------------------------------------------------------------------`
      },
      "about.txt": {
        label: "about.txt",
        lang: "plaintext",
        content: `========================================================================
PROFILE BIOGRAPHY
========================================================================
Name       : ${data.name}
C-Title    : ${data.title}
Location   : ${data.location || "Remote node"}
Contact    : ${data.email || "No email mapped"}
Voice      : ${data.phone || "No phone mapped"}
Weblink    : ${data.website || "No URL mapped"}

------------------------------------------------------------------------
${data.about}
------------------------------------------------------------------------`
      },
      "skills.json": {
        label: "skills.json",
        lang: "json",
        content: JSON.stringify({
          developer: data.name,
          title: data.title,
          status: "Fully loaded",
          skills: getSkillCategories(data.skills).reduce((acc, cat) => {
            acc[cat.label] = cat.skills;
            return acc;
          }, {} as Record<string, string[]>)
        }, null, 2)
      },
      "projects.json": {
        label: "projects.json",
        lang: "json",
        content: JSON.stringify((data.projects || []).map(p => ({
          name: p.title,
          description: p.description,
          technologies: p.tags || [],
          code_repo: p.link || "",
          live_demo: p.liveLink || null
        })), null, 2)
      },
      "experience.md": {
        label: "experience.md",
        lang: "markdown",
        content: `# Chronological Career Log

${(data.experience || []).map((e, idx) => `## ${idx + 1}. ${e.role}
*Company:* ${e.company}
*Duration:* ${e.duration}
*Duty log:* ${e.description}

---`).join("\n\n")}`
      },
      "education.md": {
        label: "education.md",
        lang: "markdown",
        content: `# Academic Credentials Log

${(data.education || []).map(edu => `- **${edu.degree}**
  *Facility:* ${edu.school}
  *Year:*     ${edu.year}`).join("\n\n")}`
      },
      "certs.json": {
        label: "certs.json",
        lang: "json",
        content: JSON.stringify((data.certifications || []).map(c => ({
          credential: c.name,
          authority: c.issuer,
          awarded: c.date,
          verification: c.credentialUrl || null
        })), null, 2)
      },
      "contact.sh": {
        label: "contact.sh",
        lang: "bash",
        content: `#!/bin/bash
# Networking Uplink Script
# Initializing communication tunnels with node ${data.name}...

echo "Handshaking with socket..."
echo "Node response: SUCCESS"
echo "---------------------------------------------------------"
echo "Email Node      : ${data.email || "Unlinked"}"
echo "Secure Comm Node: ${data.phone || "Unlinked"}"
echo "Current Grid    : ${data.location || "Unlocated"}"
echo "---------------------------------------------------------"
echo "Active Tunnels  :"
${(data.socialLinks || []).map(l => `echo "  - [${l.platform}] ${l.url}"`).join("\n")}
echo "---------------------------------------------------------"
echo "Session transmission completed. Terminal returning."`
      },
      "send_message.sh": {
        label: "send_message.sh",
        lang: "bash",
        content: `#!/bin/bash
# CLI Message Wizard Uplink
# Click here or run \`./send_message.sh\` in terminal to start sending a message!

./send_message.sh`
      }
    };
    return fileMap;
  }, [data, hostUser]);

  const [activeFile, setActiveFile] = useState<string>("welcome.txt");
  const [openTabs, setOpenTabs] = useState<string[]>(["welcome.txt"]);
  const [history, setHistory] = useState<string[]>([
    `${data.name} Terminal Console [Version 2.0.1]`,
    `(c) 2026 ${data.name} Mainframe Nodes. All rights reserved.`,
    "",
    "Interactive console ready. Type 'help' for support.",
    ""
  ]);
  const [cmdInput, setCmdInput] = useState("");
  const [wizardStep, setWizardStep] = useState(0); // 0 = off, 1 = name, 2 = email, 3 = message
  const [wizardData, setWizardData] = useState({ name: "", email: "" });
  
  const endRef = useRef<HTMLDivElement>(null);
  const editorScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll console output to bottom when history changes
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Click file from sidebar
  const handleSelectFile = (fileName: string) => {
    if (fileName === "send_message.sh") {
      executeCommand("./send_message.sh");
      return;
    }
    if (!openTabs.includes(fileName)) {
      setOpenTabs(prev => [...prev, fileName]);
    }
    setActiveFile(fileName);
    
    // Automatically trigger visual console commands to match the editor file selection
    const fileObj = files[fileName];
    if (fileObj) {
      setHistory(prev => [
        ...prev,
        `${hostPrompt} cat ${fileName}`,
        fileObj.content,
        ""
      ]);
    }

    // Scroll editor window to top on file swap
    if (editorScrollRef.current) {
      editorScrollRef.current.scrollTop = 0;
    }
  };

  const handleCloseTab = (e: React.MouseEvent, tabName: string) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(t => t !== tabName);
    setOpenTabs(newTabs);
    
    if (activeFile === tabName && newTabs.length > 0) {
      setActiveFile(newTabs[newTabs.length - 1]);
    }
  };

  const executeCommand = (command: string) => {
    const raw = command.trim();
    if (!raw) return;

    if (wizardStep > 0) {
      let nextStep = wizardStep;
      const nextData = { ...wizardData };
      let promptLines: string[] = [];

      if (wizardStep === 1) {
        nextData.name = raw;
        nextStep = 2;
        promptLines = [
          `> Name: ${raw}`,
          "Please enter your email address:",
        ];
      } else if (wizardStep === 2) {
        nextData.email = raw;
        nextStep = 3;
        promptLines = [
          `> Email: ${raw}`,
          "Please enter your message:",
        ];
      } else if (wizardStep === 3) {
        nextStep = 0;
        promptLines = [
          `> Message: ${raw}`,
          "Transmitting packet payload to host database...",
        ];

        const submitWizardMessage = async () => {
          if (!portfolioId || !API_URL) {
            setTimeout(() => {
              onMessageSent?.(nextData.name, nextData.email, raw);
              setHistory(prev => [
                ...prev,
                "[UPLINK SYSTEM: OFFLINE]",
                "✓ Message successfully delivered (offline fallback mode)!",
                ""
              ]);
            }, 600);
            return;
          }
          try {
            const res = await fetch(`${API_URL}/api/portfolio/contact`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                portfolioId,
                name: nextData.name,
                email: nextData.email,
                message: raw
              })
            });
            if (res.ok) {
              onMessageSent?.(nextData.name, nextData.email, raw);
              setHistory(prev => [
                ...prev,
                "[STATUS: SUCCESS]",
                "✓ Message successfully delivered & stored in portfolio owner database!",
                ""
              ]);
            } else {
              const body = await res.json().catch(() => ({}));
              setHistory(prev => [
                ...prev,
                `❌ Transmission failed: ${body.message || "Server rejected payload"}`,
                ""
              ]);
            }
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Uplink unreachable";
            setHistory(prev => [
              ...prev,
              `❌ Connection error: ${msg}`,
              ""
            ]);
          }
        };
        submitWizardMessage();
      }

      setWizardData(nextData);
      setWizardStep(nextStep);
      setHistory(prev => [...prev, `${raw}`, ...promptLines, ""]);
      setCmdInput("");
      return;
    }

    const lower = raw.toLowerCase();
    let res: string[] = [];

    // Map console commands directly to open/display file contents automatically
    if (lower === "welcome.txt" || lower === "cat welcome.txt") {
      handleSelectFile("welcome.txt");
      return;
    }
    if (lower === "about" || lower === "about.txt" || lower === "cat about.txt") {
      handleSelectFile("about.txt");
      return;
    }
    if (lower === "skills" || lower === "skills.json" || lower === "cat skills.json") {
      handleSelectFile("skills.json");
      return;
    }
    if (lower === "projects" || lower === "projects.json" || lower === "cat projects.json") {
      handleSelectFile("projects.json");
      return;
    }
    if (lower === "experience" || lower === "experience.md" || lower === "cat experience.md") {
      handleSelectFile("experience.md");
      return;
    }
    if (lower === "education" || lower === "education.md" || lower === "cat education.md") {
      handleSelectFile("education.md");
      return;
    }
    if (lower === "certs" || lower === "certs.json" || lower === "cat certs.json") {
      handleSelectFile("certs.json");
      return;
    }
    if (lower === "contact.sh" || lower === "cat contact.sh" || lower === "socials") {
      handleSelectFile("contact.sh");
      return;
    }
    if (lower === "send_message.sh" || lower === "cat send_message.sh") {
      handleSelectFile("send_message.sh");
      return;
    }

    if (lower === "./send_message.sh" || lower === "sh send_message.sh" || lower === "run send_message.sh") {
      setWizardStep(1);
      setWizardData({ name: "", email: "" });
      setHistory(prev => [
        ...prev,
        `${hostPrompt} ${raw}`,
        "Initializing secure message uplink process...",
        "Please enter your name:",
        ""
      ]);
      setCmdInput("");
      return;
    }

    switch (lower) {
      case "help":
        res = [
          "Available Shell Commands:",
          "  ls             List workspace configuration files",
          "  cat [file]     Print target file in terminal (e.g. cat skills.json)",
          "  clear          Wipe terminal logging history",
          "  whoami         Query currently logged in host mainframe metadata",
          "  ./send_message.sh  Execute interactive messaging wizard",
          "",
          "Workstation Files:",
          "  welcome.txt    General system greeting & guidelines",
          "  about.txt      Professional profile outline",
          "  skills.json    Developer skill ratings & categories",
          "  projects.json  Directory of completed software deployments",
          "  experience.md  Chronological employment history",
          "  education.md   Academic achievements",
          "  certs.json     Authorized licenses and credentials",
          "  contact.sh     Uplink execution script for socials/network",
          "  send_message.sh Executive contact wrapper script"
        ];
        break;
      case "ls":
        res = [
          "Workspace Files in /src:",
          "  -rw-r--r--   1 visitor  staff   1.2K Jun 22 21:44 welcome.txt",
          "  -rw-r--r--   1 visitor  staff   890B Jun 22 21:44 about.txt",
          "  -rw-r--r--   1 visitor  staff   720B Jun 22 21:44 skills.json",
          "  -rw-r--r--   1 visitor  staff   1.8K Jun 22 21:44 projects.json",
          "  -rw-r--r--   1 visitor  staff   1.4K Jun 22 21:44 experience.md",
          "  -rw-r--r--   1 visitor  staff   620B Jun 22 21:44 education.md",
          "  -rw-r--r--   1 visitor  staff   810B Jun 22 21:44 certs.json",
          "  -rwxr-xr-x   1 visitor  staff   980B Jun 22 21:44 contact.sh",
          "  -rwxr-xr-x   1 visitor  staff   420B Jun 22 21:44 send_message.sh"
        ];
        break;
      case "whoami":
        res = [
          `Mainframe Profile Node:`,
          `  Developer : ${data.name}`,
          `  Title     : ${data.title}`,
          `  Session   : ACTIVE`,
          `  Terminal  : xterm-256color`,
          `  Client IP : 192.168.1.45`
        ];
        break;
      case "clear":
        setHistory([]);
        setCmdInput("");
        return;
      default:
        res = [`Command not found: '${raw}'. Type 'help' to review directory and commands.`];
    }

    setHistory(prev => [...prev, `${hostPrompt} ${raw}`, ...res, ""]);
    setCmdInput("");
  };

  const activeContent = files[activeFile]?.content || "File not found.";
  const activeLang = files[activeFile]?.lang || "plaintext";

  return (
    <div className={`h-screen md:h-screen w-full font-mono border-2 flex flex-col md:flex-row justify-between relative overflow-hidden transition-all duration-300 ${isDark ? "bg-black border-green-950 text-green-400" : "bg-[#F3F2EE] border-stone-400 text-stone-900"}`} style={isDark ? { borderColor: `${themeColor}25` } : {}}>
      {/* Blinking CRT scanline laser overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.18)_50%)] bg-[size:100%_4px] pointer-events-none opacity-25 z-30" />
      
      {/* 1. LEFT FILE TREE SIDEBAR */}
      <aside className={`w-full md:w-52 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r z-15 ${isDark ? "border-green-950 bg-black" : "border-stone-300 bg-[#E5E5DF] text-stone-800"}`} style={isDark ? { borderColor: `${themeColor}25` } : {}}>
        <div>
          {/* Workspace Header */}
          <div className="p-3 border-b flex items-center gap-1.5 text-[10px] tracking-wider uppercase font-black" style={{ color: isDark ? themeColor : "#1c1917", borderColor: isDark ? `${themeColor}20` : "#d6d3d1" }}>
            <Terminal className="h-3.5 w-3.5" />
            <span>EXPLORER : SRC</span>
          </div>
          
          {/* Folder Hierarchy List */}
          <div className="p-2 space-y-1.5 text-xs">
            <div className="text-[10px] text-zinc-500 font-bold uppercase select-none">// workspace</div>
            <div className="pl-2 space-y-1">
              {Object.keys(files).map((fName) => {
                const isActive = activeFile === fName;
                const isExecutable = fName.endsWith(".sh");
                const isJson = fName.endsWith(".json");
                const isMd = fName.endsWith(".md");

                let fileColor = isDark ? "text-green-500" : "text-stone-750 hover:text-stone-900";
                if (isActive) {
                  fileColor = isDark ? "text-white font-bold bg-green-950/40 rounded-sm" : "text-stone-950 font-bold bg-stone-300/80 rounded-sm";
                } else if (isExecutable) {
                  fileColor = isDark ? "text-amber-500 hover:text-amber-400" : "text-amber-700 hover:text-amber-800";
                } else if (isJson) {
                  fileColor = isDark ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-750 hover:text-cyan-905";
                } else if (isMd) {
                  fileColor = isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-750 hover:text-blue-905";
                }
                
                return (
                  <button
                    key={fName}
                    onClick={() => handleSelectFile(fName)}
                    className={`w-full text-left py-1 px-1.5 flex items-center gap-1.5 cursor-pointer transition-colors text-[11px] ${fileColor}`}
                    style={isActive && isDark ? { borderLeft: `2px solid ${themeColor}` } : isActive ? { borderLeft: `2px solid #1c1917` } : {}}
                  >
                    <span>{isExecutable ? "⚙" : isJson ? "{}" : isMd ? "☰" : "📄"}</span>
                    <span className="truncate">{fName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* System Node Info Footer */}
        <div className="p-3 border-t text-[10px] text-zinc-500 select-none hidden md:block" style={{ borderColor: isDark ? `${themeColor}20` : "#d6d3d1" }}>
          <div>NODE: ONLINE</div>
          <div className="truncate">USR: {hostUser}</div>
        </div>
      </aside>

      {/* 2. RIGHT WORKSPACE (TABS + FILE WRITER + BOTTOM TERMINAL) */}
      <section className={`flex-1 flex flex-col justify-between overflow-hidden relative ${isDark ? "bg-black" : "bg-[#F3F2EE]"}`}>
        {/* TOP TAB ROW */}
        <div className={`flex border-b text-[10px] uppercase font-bold shrink-0 items-center justify-between ${isDark ? "border-green-950 bg-neutral-950" : "border-stone-300 bg-[#D9D8D2] text-stone-850"}`} style={{ borderColor: isDark ? `${themeColor}20` : "#d6d3d1" }}>
          <div className="flex overflow-x-auto">
            {openTabs.map((tabName) => {
              const isActive = activeFile === tabName;
              return (
                <div
                  key={tabName}
                  onClick={() => setActiveFile(tabName)}
                  className={`py-2 px-3.5 border-r cursor-pointer flex items-center gap-2 transition-colors select-none ${isActive ? (isDark ? "bg-black text-white border-b-2" : "bg-[#F3F2EE] text-stone-950 font-bold border-b-2") : (isDark ? "text-zinc-500 hover:text-zinc-300" : "text-stone-500 hover:text-stone-700")}`}
                  style={isActive ? { borderBottomColor: isDark ? themeColor : "#1c1917", borderRightColor: isDark ? `${themeColor}20` : "#d6d3d1" } : { borderRightColor: isDark ? `${themeColor}20` : "#d6d3d1" }}
                >
                  <span>{tabName}</span>
                  {openTabs.length > 1 && (
                    <button onClick={(e) => handleCloseTab(e, tabName)} className="hover:text-red-400 transition-colors ml-1 font-bold">×</button>
                  )}
                </div>
              );
            })}
          </div>
          {
            isPreview && onOpenNotifications && (
              <button
              onClick={onOpenNotifications}
              className="relative p-1.5 mr-3 rounded-full hover:bg-slate-800/10 dark:hover:bg-white/10 transition-colors"
              title="Open Inbox Messages"
            >
              <Bell className="h-4 w-4" style={{ color: isDark ? themeColor : "#1c1917" }} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[8px] h-3.5 w-3.5 leading-none font-sans font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            )
          }
          {
            onDownloadCode && (
              <button
              onClick={onDownloadCode}
              className="relative p-1.5 mr-3 rounded-full hover:bg-slate-800/10 dark:hover:bg-white/10 transition-colors"
              title="Download Codebase"
            >
              <Download className="h-4 w-4" style={{ color: isDark ? themeColor : "#1c1917" }} />
              
            </button>
            )
          }
        </div>

        {/* MIDDLE CODE VIEWER */}
        <div 
          ref={editorScrollRef}
          className={`flex-1 overflow-y-auto p-4 md:p-6 text-xs md:text-sm leading-relaxed border-b scrollbar-thin select-text ${isDark ? "bg-black/45 border-green-950" : "bg-white border-stone-300"}`} 
          style={isDark ? { borderColor: `${themeColor}20` } : {}}
        >
          {activeFile && (
            <div className="font-mono">
              {/* Tab Header breadcrumb */}
              <div className="text-[10px] text-zinc-650 mb-3 select-none">// Workspace: src/{activeFile} ({activeLang})</div>
              
              {/* Code text content mapping line numbers */}
              <div className="flex">
                <div className={`w-8 shrink-0 text-right pr-3 font-semibold border-r select-none ${isDark ? "text-zinc-700 border-zinc-900" : "text-stone-400 border-stone-200"}`}>
                  {activeContent.split("\n").map((_, lineIdx) => (
                    <div key={lineIdx}>{lineIdx + 1}</div>
                  ))}
                </div>
                <pre className={`pl-4 flex-1 whitespace-pre-wrap overflow-x-auto ${isDark ? "text-emerald-400" : "text-stone-850"}`} style={{ color: activeFile.endsWith(".sh") ? (isDark ? "#f59e0b" : "#b45309") : activeFile.endsWith(".json") ? (isDark ? "#22d3ee" : "#0891b2") : undefined }}>
                  <code>{activeContent}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM SHELL PANEL CONTAINER */}
        <div className={`h-44 md:h-52 flex flex-col justify-between shrink-0 font-mono text-[11px] md:text-xs ${isDark ? "bg-neutral-950" : "bg-[#E5E5DF]"}`}>
          {/* Console Header tab */}
          <div className={`px-3 py-1.5 border-b flex items-center justify-between text-[9px] text-zinc-500 select-none ${isDark ? "border-green-950" : "border-stone-300"}`} style={isDark ? { borderColor: `${themeColor}20` } : {}}>
            <span>TERMINAL : SH SHELL</span>
            <span>PORT_LOAD: 8080/TCP</span>
          </div>

          {/* Console logger window */}
          <div className={`flex-1 overflow-y-auto p-3 space-y-1 select-text scrollbar-thin ${isDark ? "text-green-400" : "text-stone-900 bg-white"}`}>
            {history.map((line, lineIdx) => (
              <p key={lineIdx} className="whitespace-pre-wrap leading-relaxed" style={{ color: line.startsWith("visitor@") ? (isDark ? "#f59e0b" : "#b45309") : undefined }}>
                {line}
              </p>
            ))}
            <div ref={endRef} />
          </div>

          {/* Terminal prompt keyboard input */}
          <div className={`border-t p-2 flex items-center gap-1.5 shrink-0 ${isDark ? "bg-black border-green-950" : "bg-[#FAF8F5] border-stone-300"}`} style={isDark ? { borderColor: `${themeColor}20` } : {}}>
            <span className="shrink-0 font-bold select-none" style={{ color: isDark ? "#f59e0b" : "#b45309" }}>{hostPrompt}</span>
            <form onSubmit={(e) => { e.preventDefault(); executeCommand(cmdInput); }} className="flex-1 flex gap-2">
              <input 
                type="text" 
                value={cmdInput} 
                onChange={(e) => setCmdInput(e.target.value)} 
                placeholder={
                  wizardStep === 1 ? "Enter your name..." :
                  wizardStep === 2 ? "Enter your email..." :
                  wizardStep === 3 ? "Enter your message text..." :
                  "Type 'help' or click files above..."
                }
                className={`flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 font-mono text-xs ${isDark ? "text-green-400" : "text-stone-900"}`}
                style={isDark ? { color: themeColor } : {}}
                autoFocus 
              />
              <button 
                type="submit" 
                className="border text-[10px] px-3.5 py-1 uppercase font-bold rounded-sm cursor-pointer transition-colors"
                style={isDark ? { color: themeColor, borderColor: `${themeColor}40`, backgroundColor: `${themeColor}05` } : { color: "#1c1917", borderColor: "#a8a29e", backgroundColor: "#f5f5f4" }}
              >
                RUN
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};






/* ====== 3. GLASSMORPHIC AURORA ====== */
const GlassAurora = ({
  onDownloadCode,
  onMessageSent, 
  data, 
  isDark, 
  themeColor, 
  sectionOrder, 
  isPreview = false,
  unreadCount = 0,
  onOpenNotifications,
  portfolioId,
  isMobile
}: { 
  data: PortfolioData; 
  isDark?: boolean; 
  themeColor: string; 
  sectionOrder: string[]; 
  isPreview?: boolean;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onDownloadCode?: () => void;
  onMessageSent?: (name: string, email: string, message: string) => void;
  portfolioId?: string;
  isMobile: boolean;
}) => {
  const [activeSection, setActiveSection] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
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
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none animate-float [animation-delay:4s] opacity-15" 
        style={{ backgroundColor: isDark ? "#c084fc" : "#6366f1" }}
      />

            {/* Floater navbar */}
      <nav className={`${isPreview ? "absolute" : "fixed"} top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-6`}>
        <div className={`backdrop-blur-xl border rounded-full px-6 py-3 flex items-center justify-between shadow-lg transition-colors duration-300 ${isDark ? "bg-slate-900/40 border-slate-700/20" : "bg-white/80 border-slate-200"}`}>
          <a href="#" className="font-black text-sm" style={{ color: themeColor }}>{(data.name || "user").split(" ").map(w => w[0]).join("")}</a>
          <div className="flex items-center gap-4">
            <div className={`${isMobile ? "hidden" : "flex"} items-center gap-4 text-xs font-semibold`}>
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
            {
            isPreview && onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="relative p-1 rounded-full hover:bg-slate-500/10 dark:hover:bg-slate-300/10 transition-colors"
                title="Open Inbox Messages"
              >
                <Bell className="h-4 w-4" style={{ color: themeColor }} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[8px] h-3.5 w-3.5 leading-none font-sans font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            )
          }
          {
            onDownloadCode && (
              <button
                onClick={onDownloadCode}
                className="relative p-1 rounded-full hover:bg-slate-500/10 dark:hover:bg-slate-300/10 transition-colors"
                title="Download Codebase"
              >
                <Download className="h-4 w-4" style={{ color: themeColor }} />
                
              </button>
            )
          }
            <button className={`${isMobile ? "block" : "hidden"} p-1 rounded transition-colors`} onClick={() => setMenuOpen(m => !m)} style={{ color: themeColor }}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`backdrop-blur-xl border rounded-2xl px-6 py-4 flex flex-col gap-3 mt-2 shadow-lg transition-colors duration-300 ${isDark ? "bg-slate-900/90 border-slate-700/20" : "bg-white/90 border-slate-200"}`}
            >
              {sections.map(sec => (
                <a key={sec} href={`#${sec}`} onClick={() => { setActiveSection(sec); setMenuOpen(false); }}
                  className="uppercase text-xs font-semibold tracking-widest"
                  style={{ color: activeSection === sec ? themeColor : undefined }}
                >{sec}</a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <div className="relative mx-auto max-w-4xl min-h-[90vh] flex flex-col justify-center pt-24 space-y-8">
        <motion.header 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`backdrop-blur-xl border p-10 rounded-3xl shadow-xl space-y-6 text-center transition-colors duration-300 ${isDark ? "bg-slate-900/30 border-slate-700/10" : "bg-white/70 border-slate-200"}`}
        >
          {(!data.designSettings || data.designSettings.showOpportunitiesBadge !== false) && (
            <div 
              className="inline-block border px-3 py-1 text-xs font-bold uppercase rounded-full shadow-inner tracking-widest animate-pulse"
              style={{ backgroundColor: `${themeColor}15`, color: themeColor, borderColor: `${themeColor}20` }}
            >
              ● {data.designSettings?.opportunitiesText || "Available for Opportunities"}
            </div>
          )}
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
                  <div className="space-y-6">
                    {getSkillCategories(data.skills).map((cat, ci) => (
                      <div key={cat.label} className="space-y-2 text-left">
                        <h3 className={`text-[10px] uppercase tracking-wider font-semibold font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>{cat.label}</h3>
                        <div className="flex flex-wrap gap-2">
                          {cat.skills.map((s, si) => (
                            <motion.span 
                              key={`${s}-${si}`}
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: (ci * 5 + si) * 0.02 }}
                              whileHover={{ scale: 1.05 }}
                              className={`rounded-full px-4 py-2 text-xs border shadow-inner transition-colors duration-200 ${isDark ? "bg-slate-800/40 border-purple-500/10 hover:border-cyan-500/30" : "bg-white border-slate-200 hover:border-slate-300"}`}
                              style={{ color: themeColor }}
                            >
                              {s}
                            </motion.span>
                          ))}
                        </div>
                      </div>
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
                          <a href={`mailto:${data.email}`} className="hover:underline">{data.email || "hello@domain.com"}</a>
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
                    <CommonContactForm onMessageSent={onMessageSent} 
                      inputStyle={`w-full p-2.5 border rounded-xl text-xs focus:outline-none ${isDark ? "bg-slate-950 border-slate-850 text-white focus:border-slate-800" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-350"}`}
                      buttonStyle="w-full py-2.5 font-bold rounded-xl hover:opacity-90 uppercase tracking-widest text-xs transition-opacity"
                      buttonColor={themeColor}
                      portfolioId={portfolioId}
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
const CyberpunkGlitch = ({
  onDownloadCode,
  onMessageSent, 
  data, 
  isDark, 
  themeColor, 
  sectionOrder,
  isPreview = false,
  unreadCount = 0,
  onOpenNotifications,
  portfolioId,
  isMobile
}: { 
  data: PortfolioData; 
  isDark?: boolean; 
  themeColor: string; 
  sectionOrder: string[];
  isPreview?: boolean;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onDownloadCode?: () => void;
  onMessageSent?: (name: string, email: string, message: string) => void;
  portfolioId?: string;
  isMobile: boolean;
}) => {
  const [activeSection, setActiveSection] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const sections = sectionOrder;
  
  return (
    <div className={`min-h-screen font-mono py-16 px-6 relative transition-colors duration-300 ${isDark ? "bg-zinc-950 text-zinc-100 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]" : "bg-[#FAF9F6] text-zinc-900 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))]"} bg-[size:100%_4px,3px_100%] overflow-hidden`}>
      {/* Cyberpunk neon grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full blur-[130px] pointer-events-none opacity-20 z-0" style={{ backgroundColor: themeColor }} />
            {/* Sticky Glitch Nav */}
      <nav className={`sticky top-0 z-40 pb-3 flex items-center justify-between mb-10 border-b-2 transition-colors duration-300 ${isDark ? "bg-zinc-955 border-slate-900" : "bg-[#FAF9F6] border-zinc-200"}`}>
        <a href="#" className="font-black tracking-widest text-sm" style={{ color: themeColor }}>// CYBER_PORT</a>
        <div className="flex items-center gap-4">
          <div className={`${isMobile ? "hidden" : "flex"} items-center gap-4 text-[10px] font-bold`}>
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
          {
            isPreview && onOpenNotifications && (
              <button
              onClick={onOpenNotifications}
              className="relative p-1 rounded hover:bg-slate-800/10 dark:hover:bg-white/10 transition-colors"
              title="Open Inbox Messages"
            >
              <Bell className="h-4 w-4" style={{ color: themeColor }} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[8px] h-3.5 w-3.5 leading-none font-sans font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            )
          }
          {
            onDownloadCode && (
              <button
              onClick={onDownloadCode}
              className="relative p-1 rounded hover:bg-slate-800/10 dark:hover:bg-white/10 transition-colors"
              title="Download Codebase"
            >
              <Download className="h-4 w-4" style={{ color: themeColor }} />
              
            </button>
            )
          }
          <button className={`${isMobile ? "block" : "hidden"} p-1 rounded transition-colors`} onClick={() => setMenuOpen(m => !m)} style={{ color: themeColor }}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`sticky top-[45px] z-30 border-b-2 px-6 py-4 flex flex-col gap-3 transition-colors duration-300 ${isDark ? "bg-zinc-955 border-slate-900" : "bg-[#FAF9F6] border-zinc-200"}`}
          >
            {sections.map(sec => (
              <a key={sec} href={`#${sec}`} onClick={() => { setActiveSection(sec); setMenuOpen(false); }}
                className="uppercase text-xs font-semibold tracking-widest font-mono"
                style={{ color: activeSection === sec ? themeColor : undefined }}
              >{sec}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
                  <div className="space-y-6">
                    {getSkillCategories(data.skills).map((cat, ci) => (
                      <div key={cat.label} className="space-y-2 text-left">
                        <h3 className={`text-[10px] uppercase font-bold tracking-widest font-mono ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>&gt; {cat.label.toUpperCase()}</h3>
                        <div className="flex flex-wrap gap-2">
                          {cat.skills.map((s, si) => (
                            <motion.span 
                              key={`${s}-${si}`}
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: (ci * 5 + si) * 0.02 }}
                              className={`border px-3 py-1.5 text-xs transition-all select-none hover:translate-y-[-1px] ${isDark ? "bg-zinc-900/10 border-zinc-800 text-zinc-400 hover:bg-zinc-900/30 hover:border-zinc-700" : "bg-white border-zinc-250 text-zinc-650 hover:bg-zinc-50"}`}
                              style={{ color: themeColor }}
                            >
                              {s}
                            </motion.span>
                          ))}
                        </div>
                      </div>
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
                          <a href={`mailto:${data.email}`} className="underline">{data.email || "hello@domain.com"}</a>
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
                    <CommonContactForm onMessageSent={onMessageSent} 
                      inputStyle={`w-full p-2.5 border rounded-none text-xs focus:outline-none font-mono ${isDark ? "bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-300"}`}
                      buttonStyle="w-full py-2.5 font-extrabold rounded-none uppercase tracking-widest text-xs transition-opacity hover:opacity-90"
                      buttonColor={themeColor}
                      buttonTextColor={isDark ? "#020617" : "#ffffff"}
                      portfolioId={portfolioId}
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
const NeobrutalistBold = ({
  onDownloadCode,
  onMessageSent, 
  data, 
  isDark, 
  themeColor, 
  sectionOrder,
  isPreview = false,
  unreadCount = 0,
  onOpenNotifications,
  portfolioId,
  isMobile
}: { 
  data: PortfolioData; 
  isDark?: boolean; 
  themeColor: string; 
  sectionOrder: string[];
  isPreview?: boolean;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onDownloadCode?: () => void;
  onMessageSent?: (name: string, email: string, message: string) => void;
  portfolioId?: string;
  isMobile: boolean;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const sections = sectionOrder;
  
  return (
    <div className={`min-h-screen font-sans pb-20 px-6 transition-colors duration-300 ${isDark ? "bg-zinc-950 text-zinc-100" : "bg-[#FFFBEB] text-zinc-950"}`}>
            {/* Sticky Brutalist Nav */}
      <nav className={`sticky top-0 z-40 border-b-4 border-black py-4 px-2 flex items-center justify-between transition-colors duration-300 ${isDark ? "bg-zinc-900 text-white" : "bg-[#FFFBEB] text-black"}`}>
        <a href="#" className="text-xl font-black tracking-tighter border-4 border-black bg-white text-black px-3 py-1 shadow-[2px_2px_0px_#000]">{(data.name || "user").split(" ").map(w => w[0]).join("")}</a>
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-black uppercase">
          <div className={`${isMobile ? "hidden" : "flex"} items-center gap-2 sm:gap-4`}>
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
          {
            isPreview && onOpenNotifications && (
              <button
              onClick={onOpenNotifications}
              className="relative hover:bg-cyan-200 border-2 border-black bg-white text-black p-1 transition-colors shadow-[1.5px_1.5px_0px_#000] cursor-pointer"
              title="Open Inbox Messages"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white border border-black rounded-full text-[8px] h-4.5 w-4.5 leading-none font-sans font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            )
          }
          {
            onDownloadCode && (
              <button
              onClick={onDownloadCode}
              className="relative hover:bg-cyan-200 border-2 border-black bg-white text-black p-1 transition-colors shadow-[1.5px_1.5px_0px_#000] cursor-pointer"
              title="Download Codebase"
            >
              <Download className="h-4.5 w-4.5" />
              
            </button>
            )
          }
          <button className={`${isMobile ? "block" : "hidden"} hover:bg-cyan-200 border-2 border-black bg-white text-black p-1 transition-colors shadow-[1.5px_1.5px_0px_#000] cursor-pointer`} onClick={() => setMenuOpen(m => !m)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`sticky top-[52px] z-30 border-b-4 border-black px-6 py-4 flex flex-col gap-3 transition-colors duration-300 ${isDark ? "bg-zinc-900 text-white" : "bg-[#FFFBEB] text-black"}`}
          >
            {sections.map(sec => (
              <a key={sec} href={`#${sec}`} onClick={() => { setMenuOpen(false); }}
                className="hover:bg-cyan-200 border-2 border-black bg-white text-black px-3 py-1.5 transition-colors shadow-[1.5px_1.5px_0px_#000] text-center font-black uppercase text-xs"
              >{sec}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
                  <div className="space-y-6">
                    {getSkillCategories(data.skills).map((cat, ci) => (
                      <div key={cat.label} className="space-y-3 text-left">
                        <h3 className={`text-sm font-black uppercase tracking-wider ${isDark ? "text-slate-350" : "text-black"}`}>{cat.label}</h3>
                        <div className="flex flex-wrap gap-2.5">
                          {cat.skills.map((s, si) => (
                            <motion.span 
                              key={`${s}-${si}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ type: "spring", stiffness: 120, damping: 10, delay: (ci * 5 + si) * 0.02 }}
                              whileHover={{ scale: 1.05 }}
                              className="border-2 border-black px-4 py-2 text-xs font-black shadow-[3px_3px_0px_#000] hover:bg-opacity-80 transition-colors uppercase"
                              style={{ backgroundColor: themeColor, color: isDark ? "#000000" : "#ffffff" }}
                            >
                              {s}
                            </motion.span>
                          ))}
                        </div>
                      </div>
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
                          <a href={`mailto:${data.email}`} className="underline">{data.email || "hello@domain.com"}</a>
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
                    <CommonContactForm onMessageSent={onMessageSent} 
                      inputStyle={`w-full p-2.5 border-2 border-black text-xs focus:outline-none font-bold ${isDark ? "bg-zinc-800 text-white focus:bg-zinc-900" : "bg-white text-black focus:bg-yellow-50"}`}
                      buttonStyle="w-full py-2.5 bg-black text-white hover:bg-zinc-800 font-black rounded-none uppercase tracking-widest text-xs shadow-[3px_3px_0px_#000]" 
                      portfolioId={portfolioId}
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
const ElegantEditorial = ({
  onDownloadCode,
  onMessageSent, 
  data, 
  isDark, 
  themeColor, 
  sectionOrder,
  isPreview = false,
  unreadCount = 0,
  onOpenNotifications,
  portfolioId,
  isMobile
}: { 
  data: PortfolioData; 
  isDark?: boolean; 
  themeColor: string; 
  sectionOrder: string[];
  isPreview?: boolean;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onDownloadCode?: () => void;
  onMessageSent?: (name: string, email: string, message: string) => void;
  portfolioId?: string;
  isMobile: boolean;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const sections = sectionOrder;
  
  return (
    <div className={`min-h-screen font-serif py-16 px-6 transition-colors duration-300 ${isDark ? "bg-[#1c1917] text-[#fcfbf9]" : "bg-[#FDFBF7] text-[#1c1917]"}`}>
            {/* Sticky Editorial Nav */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b py-4 px-2 flex items-center justify-between font-sans mb-10 transition-colors duration-300 ${isDark ? "bg-[#1c1917]/95 border-stone-800" : "bg-[#FDFBF7]/95 border-[#292524]"}`}>
        <a href="#" className="font-extrabold text-sm uppercase tracking-widest" style={{ color: themeColor }}>{data.name.split(" ").map(w => w[0]).join("")} .</a>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
          <div className={`${isMobile ? "hidden" : "flex"} items-center gap-4`}>
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
          {
            isPreview && onOpenNotifications && (
              <button
              onClick={onOpenNotifications}
              className="relative p-1 rounded hover:bg-stone-500/10 dark:hover:bg-[#fcfbf9]/10 transition-colors"
              title="Open Inbox Messages"
            >
              <Bell className="h-4 w-4" style={{ color: themeColor }} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[8px] h-3.5 w-3.5 leading-none font-sans font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            )
          }
          {
            onDownloadCode && (
              <button
              onClick={onDownloadCode}
              className="relative p-1 rounded hover:bg-stone-500/10 dark:hover:bg-[#fcfbf9]/10 transition-colors"
              title="Download Codebase"
            >
              <Download className="h-4 w-4" style={{ color: themeColor }} />
              
            </button>
            )
          }
          <button className={`${isMobile ? "block" : "hidden"} p-1 rounded transition-colors`} onClick={() => setMenuOpen(m => !m)} style={{ color: themeColor }}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`sticky top-[45px] z-50 border-b py-4 px-6 flex flex-col gap-3 font-sans transition-colors duration-350 ${isDark ? "bg-[#1c1917]/95 border-stone-800" : "bg-[#FDFBF7]/95 border-[#292524]"}`}
          >
            {sections.map(sec => (
              <a key={sec} href={`#${sec}`} onClick={() => { setMenuOpen(false); }}
                className="uppercase text-xs font-semibold tracking-widest"
                style={{ color: themeColor }}
              >{sec}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
                  <div className="space-y-6">
                    {getSkillCategories(data.skills).map((cat, ci) => (
                      <div key={cat.label} className="space-y-2 text-center">
                        <h3 className={`text-[10px] uppercase tracking-wider font-semibold opacity-60 font-sans`}>{cat.label}</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                          {cat.skills.map((s, si) => (
                            <motion.span 
                              key={`${s}-${si}`}
                              initial={{ opacity: 0, scale: 0.95 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: (ci * 5 + si) * 0.02 }}
                              className="text-stone-700 italic text-sm tracking-wide border border-stone-300/40 rounded-full px-4 py-1.5 bg-[#faf9f6]/10 hover:opacity-80 transition-opacity"
                              style={{ color: themeColor }}
                            >
                              {s}
                            </motion.span>
                          ))}
                        </div>
                      </div>
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
                          <a href={`mailto:${data.email}`} className="underline">{data.email || "hello@domain.com"}</a>
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
                    <CommonContactForm onMessageSent={onMessageSent} 
                      inputStyle={`w-full p-2.5 bg-transparent border rounded-none text-xs focus:outline-none font-serif italic ${isDark ? "border-stone-800 text-stone-200 focus:border-stone-700" : "border-stone-300 text-stone-800 focus:border-stone-800"}`}
                      buttonStyle="w-full py-2.5 bg-stone-900 text-white font-bold rounded-none hover:bg-stone-800 uppercase tracking-widest text-xs" 
                      portfolioId={portfolioId}
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
const GradientSpotlight = ({
  onDownloadCode,
  onMessageSent, 
  data, 
  isDark, 
  themeColor, 
  sectionOrder,
  isPreview = false,
  unreadCount = 0,
  onOpenNotifications,
  portfolioId,
  isMobile
}: { 
  data: PortfolioData; 
  isDark?: boolean; 
  themeColor: string; 
  sectionOrder: string[];
  isPreview?: boolean;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onDownloadCode?: () => void;
  onMessageSent?: (name: string, email: string, message: string) => void;
  portfolioId?: string;
  isMobile: boolean;
}) => {
  const [activeSection, setActiveSection] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
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
      className={`min-h-screen font-sans py-16 px-6 relative overflow-hidden transition-colors duration-350 ${isDark ? "bg-[#09090b] text-white" : "bg-[#f4f4f5] text-zinc-900"}`}
    >
      {/* Spotlight cursor radial glow */}
      <div 
        className="absolute pointer-events-none rounded-full w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 blur-[120px] transition-all duration-300"
        style={{ 
          left: mousePos.x, 
          top: mousePos.y,
          background: `radial-gradient(circle, ${themeColor}${isDark ? "15" : "10"} 0%, transparent 70%)`
        }}
      />
      
            {/* Sticky Nav */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md pb-3 flex items-center justify-between mb-12 border-b transition-colors duration-300 ${isDark ? "bg-[#09090b]/80 border-zinc-900" : "bg-[#f4f4f5]/80 border-zinc-200"}`}>
        <a href="#" className="font-extrabold text-sm uppercase tracking-widest" style={{ color: themeColor }}>
          {data.name.split(' ').map(n=>n[0]).join('')}.IO
        </a>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
          <div className={`${isMobile ? "hidden" : "flex"} items-center gap-4`}>
            {sections.map(sec => (
              <a 
                key={sec} 
                href={`#${sec}`} 
                onClick={() => setActiveSection(sec)}
                className="hover:text-zinc-400 transition-colors"
                style={{ color: activeSection === sec ? themeColor : "#71717a" }}
              >
                {sec.slice(0, 4)}
              </a>
            ))}
          </div>
          {
            isPreview && onOpenNotifications && (
              <button
              onClick={onOpenNotifications}
              className="relative p-1 rounded hover:bg-slate-800/10 dark:hover:bg-white/10 transition-colors"
              title="Open Inbox Messages"
            >
              <Bell className="h-4 w-4" style={{ color: themeColor }} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[8px] h-3.5 w-3.5 leading-none font-sans font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            )
          }
          {
            onDownloadCode && (
              <button
              onClick={onDownloadCode}
              className="relative p-1 rounded hover:bg-slate-800/10 dark:hover:bg-white/10 transition-colors"
              title="Download Codebase"
            >
              <Download className="h-4 w-4" style={{ color: themeColor }} />
              
            </button>
            )
          }
          <button className={`${isMobile ? "block" : "hidden"} p-1 rounded transition-colors`} onClick={() => setMenuOpen(m => !m)} style={{ color: themeColor }}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`sticky top-[45px] z-50 border-b py-4 px-6 flex flex-col gap-3 font-sans transition-colors duration-300 ${isDark ? "bg-[#09090b]/95 border-zinc-900" : "bg-[#f4f4f5]/95 border-zinc-200"}`}
          >
            {sections.map(sec => (
              <a key={sec} href={`#${sec}`} onClick={() => { setMenuOpen(false); }}
                className="uppercase text-xs font-semibold tracking-widest"
                style={{ color: themeColor }}
              >{sec}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto min-h-[60vh] flex flex-col justify-center space-y-6">
        <header className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${themeColor}, #818cf8, #c084fc)` }}>
            {data.name}
          </h1>
          <p className={`text-lg md:text-2xl max-w-xl leading-relaxed font-light ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>{data.title}</p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 items-start sm:items-center">
            <a href="#projects" className="font-bold text-xs py-3.5 px-8 rounded-xl uppercase tracking-wider transition-opacity hover:opacity-90" style={{ backgroundColor: themeColor, color: isDark ? "#020617" : "#ffffff" }}>
              View Work
            </a>
            <a href="#contact" className={`font-bold text-xs py-3.5 px-8 rounded-xl uppercase tracking-wider transition-colors border ${isDark ? "text-white border-zinc-800 hover:border-zinc-700" : "text-zinc-800 border-zinc-300 hover:border-zinc-400"}`}>
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
                  <div className="space-y-6">
                    {getSkillCategories(data.skills).map((cat) => (
                      <div key={cat.label} className="space-y-2.5 text-left">
                        <h3 className={`text-[10px] uppercase font-bold tracking-widest font-mono ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{cat.label}</h3>
                        <div className="flex flex-wrap gap-2.5">
                          {cat.skills.map((s) => (
                            <motion.span
                              key={s}
                              whileHover={{ scale: 1.05, y: -2, borderColor: themeColor }}
                              className={`rounded-xl border px-4 py-2.5 text-xs font-medium shadow-md transition-all ${isDark ? "bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:border-zinc-700" : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 shadow-sm"}`}
                              style={{ borderBottomColor: `${themeColor}40` }}
                            >
                              {s}
                            </motion.span>
                          ))}
                        </div>
                      </div>
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
                          <span>{data.email || "hello@domain.com"}</span>
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
                    <CommonContactForm onMessageSent={onMessageSent} 
                      inputStyle={`w-full p-2.5 border rounded-xl text-xs focus:outline-none font-mono ${isDark ? "bg-zinc-900/60 border-zinc-800 text-zinc-350 focus:border-zinc-700" : "bg-white border-zinc-200 text-zinc-850 focus:border-zinc-350 shadow-sm"}`}
                      buttonStyle={`w-full py-2.5 font-extrabold rounded-xl uppercase tracking-widest text-xs transition-opacity hover:opacity-90 ${isDark ? "text-zinc-950" : "text-white"}`}
                      buttonColor={themeColor}
                      portfolioId={portfolioId}
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
const InteractiveTimeline = ({
  onDownloadCode,
  onMessageSent, 
  data, 
  isDark, 
  themeColor, 
  sectionOrder,
  isPreview = false,
  unreadCount = 0,
  onOpenNotifications,
  portfolioId,
  isMobile
}: { 
  data: PortfolioData; 
  isDark?: boolean; 
  themeColor: string; 
  sectionOrder: string[];
  isPreview?: boolean;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onDownloadCode?: () => void;
  onMessageSent?: (name: string, email: string, message: string) => void;
  portfolioId?: string;
  isMobile: boolean;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const sections = sectionOrder;

  const containerBg = isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800";
  const headerText = isDark ? "text-white" : "text-slate-900";
  const cardBg = isDark ? "bg-slate-900/40 border-slate-850" : "bg-white border-slate-200";
  const mutedText = isDark ? "text-slate-400" : "text-slate-655";

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
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
          <div className={`${isMobile ? "hidden" : "flex"} items-center gap-4`}>
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
          {
            isPreview && onOpenNotifications && (
              <button
              onClick={onOpenNotifications}
              className="relative p-1 rounded hover:bg-slate-800/10 dark:hover:bg-white/10 transition-colors"
              title="Open Inbox Messages"
            >
              <Bell className="h-4 w-4" style={{ color: themeColor }} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[8px] h-3.5 w-3.5 leading-none font-sans font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            )
          }
          {
            onDownloadCode && (
              <button
              onClick={onDownloadCode}
              className="relative p-1 rounded hover:bg-slate-800/10 dark:hover:bg-white/10 transition-colors"
              title="Download Codebase"
            >
              <Download className="h-4 w-4" style={{ color: themeColor }} />
              
            </button>
            )
          }
          <button className={`${isMobile ? "block" : "hidden"} p-1 rounded transition-colors`} onClick={() => setMenuOpen(m => !m)} style={{ color: themeColor }}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`sticky top-[45px] z-50 border-b py-4 px-6 flex flex-col gap-3 font-sans transition-colors duration-300 ${isDark ? "bg-slate-950/95 border-slate-900" : "bg-slate-50/95 border-slate-200"}`}
          >
            {sections.map(sec => (
              <a key={sec} href={`#${sec}`} onClick={() => { setMenuOpen(false); }}
                className="uppercase text-xs font-semibold tracking-widest"
                style={{ color: themeColor }}
              >{sec}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="max-w-3xl mx-auto min-h-[60vh] flex flex-col justify-center border-l-4 pl-6 md:pl-10 space-y-6 relative" style={{ borderColor: themeColor }}>
        <div className="absolute -left-[10px] top-[14%] w-4 h-4 rounded-full border-4 shadow-md animate-pulse" style={{ backgroundColor: themeColor, borderColor: isDark ? "#020617" : "#f8fafc" }} />
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {data.photo && (
            <img src={data.photo} alt={data.name} className="h-28 w-28 rounded-full object-cover border-4" style={{ borderColor: themeColor }} />
          )}
          <div className="space-y-2">
            <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight leading-none ${headerText}`}>{data.name}</h1>
            <p className="text-sm font-semibold uppercase tracking-wider mt-1" style={{ color: themeColor }}>{data.title}</p>
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
                  <div className="space-y-6 text-left">
                    {getSkillCategories(data.skills).map((cat) => (
                      <div key={cat.label} className="space-y-2">
                        <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>{cat.label}</h3>
                        <div className="flex flex-wrap gap-2.5">
                          {cat.skills.map((s) => (
                            <span key={s} className="rounded-full border px-4 py-1.5 text-xs font-semibold hover:scale-105 transition-transform inline-block" style={{ color: themeColor, borderColor: `${themeColor}40`, backgroundColor: `${themeColor}08` }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
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
                          <span>{data.email || "hello@domain.com"}</span>
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
                    <CommonContactForm onMessageSent={onMessageSent} 
                      inputStyle={`w-full p-2.5 border rounded-xl text-xs focus:outline-none focus:ring-1 ${isDark ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700 focus:ring-slate-700" : "bg-white border-slate-250 text-slate-900 focus:border-slate-350 focus:ring-slate-350"}`}
                      buttonStyle="w-full py-2.5 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-opacity hover:opacity-90" 
                      buttonColor={themeColor}
                      portfolioId={portfolioId}
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
const CardDeck = ({
  onDownloadCode,
  onMessageSent, 
  data, 
  isDark, 
  themeColor, 
  sectionOrder,
  isPreview = false,
  unreadCount = 0,
  onOpenNotifications,
  portfolioId,
  isMobile
}: { 
  data: PortfolioData; 
  isDark?: boolean; 
  themeColor: string; 
  sectionOrder: string[];
  isPreview?: boolean;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onDownloadCode?: () => void;
  onMessageSent?: (name: string, email: string, message: string) => void;
  portfolioId?: string;
  isMobile: boolean;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const sections = sectionOrder;

  const bg = isDark ? "bg-slate-955 text-slate-100" : "bg-[#FAF9F5] text-slate-800";
  const cardBg = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-md";
  const headerText = isDark ? "text-white" : "text-slate-900";
  const mutedText = isDark ? "text-slate-400" : "text-slate-655";

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <div className={`min-h-screen py-16 px-6 font-sans transition-colors duration-300 ${bg}`}>
            {/* Sticky Deck Nav */}
      <nav className={`sticky top-0 z-50 border-b pb-3 flex items-center justify-between mb-12 backdrop-blur-md ${isDark ? "bg-slate-955/80 border-slate-900" : "bg-[#FAF9F5]/80 border-slate-200"}`.replace("slate-955/80", "slate-950/80")}>
        <a href="#" className="font-extrabold text-sm uppercase tracking-wider" style={{ color: themeColor }}>
          {data.name.split(' ').map(n=>n[0]).join('')} DECK
        </a>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
          <div className={`${isMobile ? "hidden" : "flex"} items-center gap-4`}>
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
          {
            isPreview && onOpenNotifications && (
              <button
              onClick={onOpenNotifications}
              className="relative p-1 rounded hover:bg-slate-800/10 dark:hover:bg-white/10 transition-colors"
              title="Open Inbox Messages"
            >
              <Bell className="h-4 w-4" style={{ color: themeColor }} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[8px] h-3.5 w-3.5 leading-none font-sans font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            )
          }
          {
            onDownloadCode && (
              <button
              onClick={onDownloadCode}
              className="relative p-1 rounded hover:bg-slate-800/10 dark:hover:bg-white/10 transition-colors"
              title="Download Codebase"
            >
              <Download className="h-4 w-4" style={{ color: themeColor }} />
              
            </button>
            )
          }
          <button className={`${isMobile ? "block" : "hidden"} p-1 rounded transition-colors`} onClick={() => setMenuOpen(m => !m)} style={{ color: themeColor }}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`sticky top-[45px] z-50 border-b py-4 px-6 flex flex-col gap-3 font-sans transition-colors duration-300 ${isDark ? "bg-slate-950/95 border-slate-900" : "bg-[#FAF9F5]/95 border-slate-200"}`}
          >
            {sections.map(sec => (
              <a key={sec} href={`#${sec}`} onClick={() => { setMenuOpen(false); }}
                className="uppercase text-xs font-semibold tracking-widest"
                style={{ color: themeColor }}
              >{sec}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
                  <div className="space-y-6">
                    {getSkillCategories(data.skills).map((cat) => (
                      <div key={cat.label} className="space-y-2.5 text-left">
                        <h3 className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>{cat.label}</h3>
                        <div className="flex flex-wrap gap-2">
                          {cat.skills.map((s) => (
                            <motion.span
                              key={s}
                              whileHover={{ scale: 1.06, borderColor: themeColor }}
                              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold shadow-inner border transition-all ${isDark ? "bg-slate-900/60 text-slate-350 border-slate-800/40" : "bg-slate-50 text-slate-700 border-slate-200"}`}
                              style={{ color: themeColor }}
                            >
                              {s}
                            </motion.span>
                          ))}
                        </div>
                      </div>
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
                      <motion.div 
                        key={p.title} 
                        whileHover={{ 
                          scale: 1.025, 
                          borderColor: themeColor,
                          boxShadow: `0 20px 40px rgba(0, 0, 0, 0.1), 0 0 15px ${themeColor}20`
                        }}
                        className={`p-5 rounded-xl border flex flex-col justify-between overflow-hidden group transition-all duration-300 tilt-3d hover-glow shimmer-hover ${isDark ? "bg-slate-900/30 border-slate-850" : "bg-white border-slate-200"}`}
                      >
                        {p.imageUrl ? (
                          <div className="h-36 w-full overflow-hidden border border-slate-800/40 mb-4 rounded-lg">
                            <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-106" />
                          </div>
                        ) : (
                          <div className="h-28 w-full flex items-center justify-center border border-slate-800/30 mb-4 rounded-lg bg-slate-950/20">
                            <Code className="h-8 w-8 opacity-25 group-hover:opacity-40 transition-opacity" style={{ color: themeColor }} />
                          </div>
                        )}
                        <div>
                          <h3 className={`font-bold text-sm mb-1 ${headerText}`}>{p.title}</h3>
                          <p className={`text-xs mb-4 leading-relaxed line-clamp-2 ${mutedText}`}>{p.description}</p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {p.tags.map((tag) => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-sm font-mono border" style={{ color: themeColor, backgroundColor: `${themeColor}10`, borderColor: `${themeColor}20` }}>{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-4 text-xs font-bold uppercase pt-3.5 border-t" style={{ color: themeColor, borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                          <a href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                            <Github className="h-3.5 w-3.5" /> Source
                          </a>
                          {p.liveLink ? (
                            <a href={p.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline text-white" style={{ color: themeColor }}>
                              <ExternalLink className="h-3.5 w-3.5" /> Demo
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
                      <span key={l.name} className={`px-3.5 py-1.5 rounded text-xs border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`} style={{ color: themeColor }}>
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
                          <span>{data.email || "hello@domain.com"}</span>
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
                    <CommonContactForm onMessageSent={onMessageSent} 
                      inputStyle={`w-full p-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 ${isDark ? "bg-slate-900 border-slate-800 text-indigo-400 focus:border-slate-700 focus:ring-slate-700" : "bg-white border-slate-250 text-slate-800 focus:border-slate-350 focus:ring-slate-350"}`}
                      buttonStyle="w-full py-2.5 text-zinc-950 font-bold rounded-xl uppercase tracking-widest text-xs transition-opacity hover:opacity-90" 
                      buttonColor={themeColor}
                      portfolioId={portfolioId}
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
const DashboardSaas = ({
  onDownloadCode,
  onMessageSent, 
  data, 
  isDark, 
  themeColor, 
  sectionOrder,
  isPreview = false,
  unreadCount = 0,
  onOpenNotifications,
  portfolioId
}: { 
  data: PortfolioData; 
  isDark?: boolean; 
  themeColor: string; 
  sectionOrder: string[];
  isPreview?: boolean;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onDownloadCode?: () => void;
  onMessageSent?: (name: string, email: string, message: string) => void;
  portfolioId?: string;
}) => {
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
    const cardStyle = isDark ? "bg-slate-900 border border-slate-850" : "bg-slate-50 border border-slate-200";
    const cardMuted = isDark ? "text-slate-400" : "text-slate-600";
    const statCard = isDark ? "bg-slate-900/40 border border-slate-850" : "bg-white border border-slate-200 shadow-sm";
    switch (activeTab) {
      case "about":
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-xl space-y-4 ${cardStyle}`}>
              <div className="text-[10px] font-mono tracking-widest uppercase" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>// OPERATIONAL INTRO</div>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {data.photo && (
                  <img src={data.photo} alt={data.name} className="h-24 w-24 rounded-xl object-cover border" style={{ borderColor: `${themeColor}40` }} />
                )}
                <div className="space-y-2">
                  <p className="text-lg font-light" style={{ color: isDark ? "#e2e8f0" : "#0f172a" }}>{data.title}</p>
                  <p className={`text-sm leading-relaxed font-light ${cardMuted}`}>{data.about}</p>
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
                <div key={stat.label} className={`p-4 rounded-xl font-mono ${statCard}`}>
                  <div className="text-[9px]" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>{stat.label}</div>
                  <div className="text-lg font-bold mt-1" style={{ color: themeColor }}>{stat.val}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case "skills":
        return (
          <div className="space-y-8">
            {getSkillCategories(data.skills).map((cat, ci) => (
              <div key={cat.label} className="space-y-3">
                <div className="text-[10px] font-mono tracking-widest uppercase mb-1" style={{ color: isDark ? "#475569" : "#94a3b8" }}>
                  {`// ${cat.label.toUpperCase()}`}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {cat.skills.map((s, idx) => {
                    const percentage = 75 + ((ci * 7 + idx) * 7) % 25;
                    const barFilled = Math.round(percentage / 10);
                    const barStr = "█".repeat(barFilled) + "░".repeat(10 - barFilled);
                    return (
                      <motion.div
                        key={`${s}-${idx}`}
                        whileHover={{ scale: 1.02, borderColor: themeColor }}
                        className={`p-4 rounded-xl font-mono text-xs flex flex-col justify-between transition-all border ${isDark ? "bg-slate-900 border-slate-850 hover:border-slate-800" : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold" style={{ color: isDark ? "#e2e8f0" : "#0f172a" }}>{s}</span>
                          <span style={{ color: isDark ? "#64748b" : "#94a3b8" }}>{percentage}% Capacity</span>
                        </div>
                        <div className="text-[10px] tracking-wider font-semibold font-mono flex items-center gap-2">
                          <span style={{ color: themeColor }}>[{barStr}]</span>
                          <span style={{ color: isDark ? "#475569" : "#94a3b8" }}>v1.{((ci * 5 + idx) * 2) % 10}.{((ci * 3 + idx) * 3) % 9}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      case "projects":
        return (
          <div className="space-y-4">
            <div className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>// Microservices Running</div>
            <div className="grid gap-6 sm:grid-cols-2">
              {data.projects.map((p) => (
                <div key={p.title} className={`border rounded-xl overflow-hidden flex flex-col justify-between group transition-all hover:-translate-y-1 ${isDark ? "bg-slate-900 border-slate-850 hover:border-slate-800" : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"}`}>
                  {p.imageUrl ? (
                    <div className="h-32 w-full overflow-hidden border-b" style={{ borderColor: isDark ? "#0f172a" : "#e2e8f0" }}>
                      <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="h-32 w-full flex items-center justify-center border-b" style={{ borderColor: isDark ? "#0f172a" : "#e2e8f0", backgroundColor: isDark ? "rgba(2,6,23,0.45)" : "rgba(248,250,252,1)" }}>
                      <Code className="h-8 w-8" style={{ color: isDark ? "#334155" : "#cbd5e1" }} />
                    </div>
                  )}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                         <h3 className="font-bold text-sm" style={{ color: isDark ? "#e2e8f0" : "#0f172a" }}>{p.title}</h3>
                         <span className="text-[8px] px-2 py-0.5 rounded font-mono border flex items-center gap-1" style={{ borderColor: isDark ? "#1e293b" : "#e2e8f0", backgroundColor: isDark ? "#020617" : "#f8fafc" }}>
                           <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                           <span style={{ color: themeColor }}>ACTIVE</span>
                         </span>
                      </div>
                      <p className="text-xs leading-relaxed line-clamp-2 mb-2" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>{p.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map((tag) => (
                          <span key={tag} className="text-[8px] font-mono px-1.5 py-0.5 rounded border" style={{ color: isDark ? "#64748b" : "#94a3b8", borderColor: isDark ? "#1e293b" : "#e2e8f0", backgroundColor: isDark ? "#020617" : "#f8fafc" }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs font-mono mt-3 pt-2 border-t" style={{ color: themeColor, borderColor: isDark ? "#0f172a" : "#e2e8f0" }}>
                      <a href={p.link} target="_blank" rel="noreferrer" className="hover:underline">/repo</a>
                      {p.liveLink ? <a href={p.liveLink} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: themeColor }}>/demo</a> : null}
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
            <div className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>// Operational History</div>
            <div className="space-y-4">
              {data.experience.map((e) => (
                <div key={e.role} className={`border p-5 rounded-xl space-y-2 ${isDark ? "bg-slate-900 border-slate-855" : "bg-white border-slate-200 shadow-sm"}`} style={{ borderLeftColor: themeColor, borderLeftWidth: "3px" }}>
                  <h3 className="font-bold text-sm" style={{ color: isDark ? "#e2e8f0" : "#0f172a" }}>{e.role}</h3>
                  <p className="text-xs font-semibold" style={{ color: themeColor }}>{e.company} · {e.duration}</p>
                  <p className="text-xs leading-relaxed" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>{e.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "education":
        return (
          <div className="space-y-4">
            <div className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>// Academic Logs</div>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.degree} className={`border p-4 rounded-xl ${isDark ? "bg-slate-900 border-slate-850" : "bg-white border-slate-200 shadow-sm"}`}>
                  <h3 className="font-semibold text-xs" style={{ color: isDark ? "#e2e8f0" : "#0f172a" }}>{edu.degree}</h3>
                  <p className="text-[10px] font-mono mt-1" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>{edu.school} · {edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "certifications":
        return (
          <div className="space-y-4">
            <div className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>// Authority Credentials</div>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.certifications && data.certifications.length > 0 ? (
                data.certifications.map((c) => (
                  <div key={c.name} className={`border p-4 rounded-xl flex gap-3 group ${isDark ? "bg-slate-900 border-slate-850" : "bg-white border-slate-200 shadow-sm"}`}>
                    {c.imageUrl ? (
                      <img src={c.imageUrl} alt={c.name} className="h-10 w-10 rounded object-cover shrink-0 border" style={{ borderColor: isDark ? "#1e293b" : "#e2e8f0" }} />
                    ) : (
                      <Award className="h-5 w-5 shrink-0 mt-0.5" style={{ color: themeColor }} />
                    )}
                    <div>
                      <h4 className="font-semibold text-xs" style={{ color: isDark ? "#e2e8f0" : "#0f172a" }}>{c.name}</h4>
                      <p className="text-[10px] mt-1" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>{c.issuer} · {c.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs font-mono" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>No credentials loaded.</div>
              )}
            </div>
          </div>
        );
      case "achievements":
        return (
          <div className="space-y-4">
            <div className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>// System Achievements</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.achievements && data.achievements.length > 0 ? (
                data.achievements.map((ach, ai) => (
                  <div key={ai} className={`border p-4 rounded-xl flex gap-3 items-start ${isDark ? "bg-slate-900 border-slate-850" : "bg-white border-slate-200 shadow-sm"}`}>
                    <Award className="h-5 w-5 shrink-0 mt-0.5" style={{ color: themeColor }} />
                    <p className="text-xs font-mono leading-relaxed" style={{ color: isDark ? "#cbd5e1" : "#334155" }}>{ach}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs font-mono" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>No achievements logged.</div>
              )}
            </div>
          </div>
        );
      case "languages":
        return (
          <div className="space-y-4">
            <div className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>// Communication Protocol Channels</div>
            <div className="flex flex-wrap gap-3">
              {data.languages && data.languages.length > 0 ? (
                data.languages.map((l) => (
                  <div key={l.name} className={`border rounded-xl px-4 py-2 flex items-center gap-2 ${isDark ? "bg-slate-900 border-slate-850" : "bg-white border-slate-200 shadow-sm"}`}>
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: themeColor }} />
                    <span className="text-xs font-bold font-mono" style={{ color: isDark ? "#e2e8f0" : "#0f172a" }}>{l.name}</span>
                    <span className="text-[10px] font-mono" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>[{l.level}]</span>
                  </div>
                ))
              ) : (
                <div className="text-xs font-mono" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>No language packages configured.</div>
              )}
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 text-xs" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
              <p>Transmit an API-style message directly. Social links listed below.</p>
              <div className="space-y-2 font-mono">
                <div>Mail: {data.email || "hello@domain.com"}</div>
                {data.phone && <div>Phone: {data.phone}</div>}
                <div>Loc: {data.location || "Remote"}</div>
              </div>
              <div className="pt-2">
                <SocialIcons links={data.socialLinks} color={themeColor} />
              </div>
            </div>
            <CommonContactForm onMessageSent={onMessageSent} 
              inputStyle={`w-full p-2.5 border rounded-lg text-xs focus:outline-none font-mono ${isDark ? "bg-slate-900 border-slate-855 text-slate-200 focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`}
              buttonStyle="w-full py-2.5 font-bold rounded-lg hover:opacity-90 uppercase tracking-widest text-xs" 
              buttonColor={themeColor}
              portfolioId={portfolioId}
            />
          </div>
        );
      default:
        return <div className="text-xs font-mono" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>Section unrecognized.</div>;
    }
  };

  const dashBg = isDark ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-800";
  const dashSidebar = isDark ? "bg-slate-900 border-slate-850" : "bg-white border-slate-200 shadow-sm";
  const dashMain = isDark ? "bg-slate-900 border-slate-850" : "bg-white border-slate-200";
  const dashTab = isDark ? "text-slate-400 hover:bg-slate-955/50 hover:text-slate-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800";
  const dashTabActive = isDark ? "bg-slate-955 border-slate-800" : "bg-primary/10 border-primary/20";
  const dashMuted = isDark ? "text-slate-500" : "text-slate-400";

  return (
    <div className={`min-h-screen p-4 md:p-8 flex flex-col md:flex-row gap-6 font-sans transition-colors duration-300 ${dashBg}`}>
      {/* Sidebar Dashboard Navigation */}
      <aside className={`w-full md:w-60 border rounded-2xl p-6 shrink-0 flex flex-col justify-between h-fit md:h-[85vh] ${dashSidebar}`}>
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b pb-3 mb-2 text-[10px] font-mono uppercase tracking-widest" style={{ color: isDark ? "#64748b" : "#94a3b8", borderColor: isDark ? "#1e293b" : "#e2e8f0" }}>
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
                    ? dashTabActive
                    : `border-transparent ${dashTab}`
                }`}
                style={activeTab === tab.id ? { color: themeColor } : {}}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="hidden md:block pt-6 border-t" style={{ borderColor: isDark ? "#1e293b" : "#e2e8f0" }}>
          <div className="text-[10px] font-mono" style={{ color: isDark ? "#475569" : "#94a3b8" }}>
            DB_STATUS: CONNECTED
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 border rounded-2xl p-6 md:p-8 shadow-xl relative min-h-[85vh] flex flex-col justify-between ${dashMain}`}>
        <div className="space-y-6 font-sans">
          {/* Header HUD */}
          <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: isDark ? "#1e293b" : "#e2e8f0" }}>
            <h1 className="text-sm font-extrabold tracking-widest font-mono uppercase flex items-center gap-2" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
              <Terminal className="h-4 w-4" style={{ color: themeColor }} />
              <span>{data.name} // {activeTab}</span>
            </h1>
            <div className="flex items-center gap-3">
              {
            isPreview && onOpenNotifications && (
              <button
                  onClick={onOpenNotifications}
                  className="relative p-1.5 rounded-lg hover:bg-slate-500/10 transition-colors"
                  title="Open Inbox Messages"
                >
                  <Bell className="h-4 w-4" style={{ color: themeColor }} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[8px] h-3.5 w-3.5 leading-none font-sans font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
            )
          }
          {
            onDownloadCode && (
              <button
                  onClick={onDownloadCode}
                  className="relative p-1.5 rounded-lg hover:bg-slate-500/10 transition-colors"
                  title="Download Codebase"
                >
                  <Download className="h-4 w-4" style={{ color: themeColor }} />
                  
                </button>
            )
          }
              <span className="text-[9px] px-2 py-0.5 rounded font-mono border" style={{ color: themeColor, borderColor: isDark ? "#1e293b" : "#e2e8f0", backgroundColor: isDark ? "#020617" : "#f1f5f9" }}>
                SESSION: ACTIVE
              </span>
            </div>
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

        <footer className="border-t pt-6 mt-8 flex items-center justify-between text-xs font-mono" style={{ borderColor: isDark ? "#0f172a" : "#e2e8f0" }}>
          <SocialIcons links={data.socialLinks} color={themeColor} />
          <span className="text-[10px]" style={{ color: isDark ? "#475569" : "#94a3b8" }}>// DASHBOARD END</span>
        </footer>
      </main>
    </div>
  );
};

/* ====== FLOATING AI CHATBOT & ADMIN WIDGETS ====== */
const FloatingWidgets = ({ 
  data, 
  themeColor, 
  isPreview = false,
  showAdmin,
  setShowAdmin,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  fetchNotifications
}: { 
  data: PortfolioData; 
  themeColor: string; 
  isPreview?: boolean;
  showAdmin: boolean;
  setShowAdmin: (v: boolean) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (v: boolean) => void;
  fetchNotifications: () => Promise<void>;
}) => {
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "visitor" | "bot"; text: string }[]>([
    { role: "bot", text: `Hi there! I am an AI assistant representing ${data.name}. Feel free to ask me about credentials, projects, work experience, or tech stacks!` }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminMsg, setAdminMsg] = useState("");

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isBotTyping]);

  const handleSendMessage = async (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const messageText = (presetText || userInput).trim();
    if (!messageText || isBotTyping) return;

    const prevMessages = [...chatMessages];
    setChatMessages(prev => [...prev, { role: "visitor", text: messageText }]);
    setUserInput("");
    setIsBotTyping(true);

    // Query server AI chat endpoint
    try {
      const res = await fetch(`${API_URL || "http://localhost:4000"}/api/ai/portfolio-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolioData: data,
          message: messageText,
          chatHistory: prevMessages.slice(-6).map(m => ({ role: m.role, text: m.text }))
        })
      });
      if (res.ok) {
        const body = await res.json();
        if (body.reply) {
          setIsBotTyping(false);
          setChatMessages(prev => [...prev, { role: "bot", text: body.reply }]);
          return;
        }
      }
    } catch (err) {
      console.warn("AI chatbot endpoint failed, falling back to keywords:", err);
    }

    // Static keywords fallback (keep isBotTyping=true until reply is set)
    setTimeout(() => {
      let reply = "";
      const query = messageText.toLowerCase();

      if (query.includes("skills") || query.includes("stack") || query.includes("technology") || query.includes("coding")) {
        reply = `I specialize in the following technologies and tools:\n• ${data.skills.join("\n• ")}`;
      } else if (query.includes("project") || query.includes("code") || query.includes("repos") || query.includes("work")) {
        reply = `Here are some of my featured projects:\n` + 
          data.projects.map(p => `• **${p.title}**: ${p.description}\n  - Stack: ${p.tags.join(", ")}\n  - Code: ${p.link}${p.liveLink ? `\n  - Live: ${p.liveLink}` : ""}`).join("\n\n");
      } else if (query.includes("experience") || query.includes("intern") || query.includes("job") || query.includes("work") || query.includes("career")) {
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

      setIsBotTyping(false);
      setChatMessages(prev => [...prev, { role: "bot", text: reply }]);
    }, 800);
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser.trim() || !adminPass.trim()) {
      setAdminMsg("Please fill all fields.");
      return;
    }
    
    setAdminMsg("Authenticating...");
    try {
      const res = await fetch(`${API_URL || "http://localhost:4000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminUser, password: adminPass })
      });
      const resData = await res.json();
      if (res.ok && resData.token) {
        localStorage.setItem("auth_token", resData.token);
        if (resData.user) {
          localStorage.setItem("auth_user", JSON.stringify(resData.user));
        }
        setIsAdminLoggedIn(true);
        setAdminMsg("Access Granted! Welcome to Admin Panel.");
        await fetchNotifications();
        setTimeout(() => {
          setShowAdmin(false);
          setAdminMsg("");
        }, 1500);
      } else {
        setAdminMsg(resData.message || "Invalid admin credentials! Please check inputs.");
      }
    } catch (err) {
      // Offline fallback
      if (adminUser.trim() === "admin@domain.com" && adminPass.trim() === "admin123") {
        setIsAdminLoggedIn(true);
        setAdminMsg("Access Granted (Demo Offline Mode)!");
        setTimeout(() => {
          setShowAdmin(false);
          setAdminMsg("");
        }, 1500);
      } else {
        setAdminMsg("Invalid admin credentials or connection error.");
      }
    }
  };

  return (
    <>
      {/* Floating Buttons */}
      <div className={`${isPreview ? "absolute" : "fixed"} bottom-6 right-6 z-50`}>
        <button 
          onClick={() => setShowChat(!showChat)}
          className="h-12 w-12 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
          style={{ backgroundColor: themeColor, boxShadow: `0 8px 30px ${themeColor}40` }}
          title="Chat with AI Clone"
        >
          {showChat ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        </button>
      </div>

      <div className={`${isPreview ? "absolute" : "fixed"} bottom-6 left-6 z-50`}>
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
            className={`${isPreview ? "absolute" : "fixed"} bottom-20 right-6 z-50 w-80 sm:w-96 h-[480px] rounded-2xl flex flex-col bg-slate-950/95 border border-slate-900 shadow-2xl backdrop-blur-md overflow-hidden font-sans text-slate-200`}
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
              {/* Typing indicator */}
              {isBotTyping && (
                <div className="flex justify-start">
                  <div className="rounded-xl px-4 py-3 bg-slate-900 border border-slate-800/80 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatMessagesEndRef} />
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
                disabled={isBotTyping}
                className="p-2 rounded-lg text-slate-950 flex items-center justify-center font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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
            className={`${isPreview ? "absolute" : "fixed"} inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans text-slate-200`}
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
                <div className="mt-3 text-[10px] text-amber-500 bg-amber-500/5 border border-amber-500/20 p-2.5 rounded-lg font-mono leading-relaxed text-center w-full">
                  Demo Credentials (Save this):<br/>
                  User: <span className="font-bold text-amber-400">admin@domain.com</span><br/>
                  Pass: <span className="font-bold text-amber-400">admin123</span>
                </div>
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
                    placeholder="admin@domain.com"
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
