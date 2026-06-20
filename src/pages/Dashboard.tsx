import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Plus, X, ArrowRight, ArrowLeft, FileText, User, Briefcase,
  GraduationCap, Link as LinkIcon, Code, CheckCircle2, Sparkles,
  Award, Globe, Phone, Mail, MapPin, Trophy, Languages, Image as ImageIcon,
  Trash2, Camera, Save, AlertCircle, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { defaultPortfolioData, type PortfolioData } from "@/data/mockData";
import BackButton from "@/components/BackButton";
import { API_URL } from "@/config";

const stepLabels = [
  { icon: User,           label: "Basic Info" },
  { icon: Briefcase,      label: "Experience" },
  { icon: Code,           label: "Skills & Projects" },
  { icon: Award,          label: "Certifications" },
  { icon: LinkIcon,       label: "Links & Finish" },
];

/* ── tiny helper: read a File as base64 data-URL ── */
const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

/* ── styled section heading ── */
const SH = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
    <Icon className="h-5 w-5 text-primary" /> {label}
  </h2>
);

/* ── card wrapper ── */
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`glass-card rounded-xl p-4 space-y-3 border border-border/40 ${className}`}>
    {children}
  </div>
);

/* ── image upload button ── */
const ImgUpload = ({
  value, onChange, label, circle = false,
}: {
  value: string; onChange: (v: string) => void; label: string; circle?: boolean;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={() => ref.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed border-border/40 hover:border-primary/50 transition-colors flex items-center justify-center overflow-hidden bg-secondary/30 ${
          circle ? "h-24 w-24 rounded-full" : "h-28 w-full rounded-lg"
        }`}
      >
        {value ? (
          <img src={value} alt="preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            {circle ? <Camera className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
            <span className="text-[10px] text-center px-2">{label}</span>
          </div>
        )}
        {value && (
          <button
            onClick={e => { e.stopPropagation(); onChange(""); }}
            className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 hover:bg-destructive/80 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      <input
        ref={ref} type="file" accept="image/*" className="hidden"
        onChange={async e => {
          const f = e.target.files?.[0];
          if (f) onChange(await readFileAsDataUrl(f));
        }}
      />
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [skillInput, setSkillInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { navigate("/login"); return; }
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const body = await res.json();
          if (body?.data) setData(body.data as PortfolioData);
        }
      } catch { /* fallback */ } finally { setIsLoading(false); }
    })();
  }, [navigate]);

  /* ── Auto-save: debounce 2s after any data change ── */
  useEffect(() => {
    if (isLoading) return; // don't auto-save the initial load
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    setSaveStatus("saving");
    autoSaveTimer.current = setTimeout(async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/portfolio`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ data, description: "Auto-save from Dashboard" }),
        });
        if (res.ok) {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2500);
        } else {
          const err = await res.json();
          console.error("Auto-save failed:", err);
          setSaveStatus("error");
        }
      } catch (e) {
        console.error("Auto-save network error:", e);
        setSaveStatus("error");
      }
    }, 2000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const savePortfolio = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) { navigate("/login"); return; }
    setIsSaving(true);
    try {
      await fetch(`${API_URL}/api/portfolio`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ data, description: "Manual save from Dashboard" }),
      });
    } catch { /* noop */ } finally { setIsSaving(false); }
  };

  const saveAndRedirect = async (parsed: PortfolioData) => {
    const token = localStorage.getItem("auth_token");
    if (!token) { navigate("/login"); return; }
    try {
      const res = await fetch(`${API_URL}/api/portfolio`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ data: parsed, description: "Resume Upload" }),
      });
      if (res.ok) navigate("/templates");
    } catch (err) { console.error(err); }
  };

  /* ── helpers ── */
  const addSkill = () => {
    if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
      setData(p => ({ ...p, skills: [...p.skills, skillInput.trim()] }));
      setSkillInput("");
    }
  };
  const removeSkill = (i: number) => setData(p => ({ ...p, skills: p.skills.filter((_, j) => j !== i) }));

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setData(p => ({ ...p, achievements: [...(p.achievements || []), achievementInput.trim()] }));
      setAchievementInput("");
    }
  };
  const removeAchievement = (i: number) =>
    setData(p => ({ ...p, achievements: (p.achievements || []).filter((_, j) => j !== i) }));

  /* ── project helpers ── */
  const updateProject = (i: number, field: string, value: string) => {
    const u = [...data.projects];
    u[i] = { ...u[i], [field]: value };
    setData(p => ({ ...p, projects: u }));
  };
  const addProject = () =>
    setData(p => ({
      ...p,
      projects: [...p.projects, { title: "", description: "", tags: [], link: "", liveLink: "", imageUrl: "" }],
    }));
  const removeProject = (i: number) =>
    setData(p => ({ ...p, projects: p.projects.filter((_, j) => j !== i) }));
  const updateProjectTags = (i: number, raw: string) =>
    updateProject(i, "tags", raw as never);

  /* ── experience helpers ── */
  const updateExp = (i: number, field: string, value: string) => {
    const u = [...data.experience];
    u[i] = { ...u[i], [field]: value };
    setData(p => ({ ...p, experience: u }));
  };
  const addExp = () =>
    setData(p => ({ ...p, experience: [...p.experience, { role: "", company: "", duration: "", description: "" }] }));
  const removeExp = (i: number) =>
    setData(p => ({ ...p, experience: p.experience.filter((_, j) => j !== i) }));

  /* ── education helpers ── */
  const updateEdu = (i: number, field: string, value: string) => {
    const u = [...data.education];
    u[i] = { ...u[i], [field]: value };
    setData(p => ({ ...p, education: u }));
  };
  const addEdu = () =>
    setData(p => ({ ...p, education: [...p.education, { degree: "", school: "", year: "" }] }));
  const removeEdu = (i: number) =>
    setData(p => ({ ...p, education: p.education.filter((_, j) => j !== i) }));

  /* ── cert helpers ── */
  const updateCert = (i: number, field: string, value: string) => {
    const u = [...(data.certifications || [])];
    u[i] = { ...u[i], [field]: value };
    setData(p => ({ ...p, certifications: u }));
  };
  const addCert = () =>
    setData(p => ({
      ...p,
      certifications: [
        ...(p.certifications || []),
        { name: "", issuer: "", date: "", imageUrl: "", credentialUrl: "" },
      ],
    }));
  const removeCert = (i: number) =>
    setData(p => ({ ...p, certifications: (p.certifications || []).filter((_, j) => j !== i) }));

  /* ── language helpers ── */
  const updateLang = (i: number, field: string, value: string) => {
    const u = [...(data.languages || [])];
    u[i] = { ...u[i], [field]: value };
    setData(p => ({ ...p, languages: u }));
  };
  const addLang = () =>
    setData(p => ({ ...p, languages: [...(p.languages || []), { name: "", level: "" }] }));
  const removeLang = (i: number) =>
    setData(p => ({ ...p, languages: (p.languages || []).filter((_, j) => j !== i) }));

  /* ── file parse ── */
  const processFile = (fileName: string) => {
    setUploadedFile(fileName);
    setIsParsing(true);
    let userName = "Alex Johnson";
    try {
      const u = JSON.parse(localStorage.getItem("auth_user") || "{}");
      if (u.name) userName = u.name;
    } catch { /* noop */ }
    const parsed: PortfolioData = { ...defaultPortfolioData, name: userName };
    setTimeout(async () => {
      setData(parsed);
      await saveAndRedirect(parsed);
      setIsParsing(false);
    }, 1500);
  };

  const inp = "h-11 bg-secondary/50 border-border/40 text-sm";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 pt-24 pb-16">
        <BackButton />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Create Your Portfolio</h1>
            <p className="mb-8 text-muted-foreground">Upload your resume or fill in the details below to get started.</p>
          </div>
          {/* Save status badge */}
          <div className="shrink-0 mt-1">
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
                <Save className="h-3.5 w-3.5" /> Saving…
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1.5 text-xs text-green-500">
                <Check className="h-3.5 w-3.5" /> Saved ✓
              </span>
            )}
            {saveStatus === "error" && (
              <span className="flex items-center gap-1.5 text-xs text-red-500">
                <AlertCircle className="h-3.5 w-3.5" /> Save failed!
              </span>
            )}
          </div>
        </motion.div>

        {saveStatus === "error" && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <strong>Could not save your portfolio.</strong> Check that the backend server is running on port 4000. Your changes are preserved locally until fixed.
            </div>
          </div>
        )}

        {isLoading && <div className="mb-10 text-sm text-muted-foreground">Loading your saved portfolio…</div>}

        {/* ── Resume Upload ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
          {isParsing ? (
            <div className="glass-card flex flex-col items-center justify-center rounded-2xl border border-primary/20 p-10 text-center">
              <Sparkles className="h-8 w-8 text-primary animate-pulse mb-3" />
              <h3 className="text-lg font-semibold text-primary animate-pulse">Analyzing & Parsing Resume…</h3>
              <p className="text-sm text-muted-foreground mt-1">Extracting details and saving to your portfolio…</p>
            </div>
          ) : !uploadedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={e => { e.preventDefault(); setIsDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f.name); }}
              className={`glass-card flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ${isDragOver ? "border-primary bg-primary/5 scale-[1.02]" : "border-border/40 hover:border-primary/30 hover:bg-primary/[0.02]"}`}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f.name); }} />
              <motion.div animate={isDragOver ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }} className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </motion.div>
              <h3 className="mb-2 text-lg font-semibold">Upload Resume</h3>
              <p className="mb-4 text-sm text-muted-foreground">Drag & drop PDF / DOCX here, or click to browse</p>
              <Button variant="outline" className="gap-2 border-border/60"><FileText className="h-4 w-4" /> Choose File</Button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card flex items-center gap-4 rounded-2xl border border-primary/30 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Resume uploaded & parsed successfully!</p>
                <p className="text-xs text-muted-foreground">{uploadedFile} — fields auto-filled</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setUploadedFile(null)}><X className="h-4 w-4" /></Button>
            </motion.div>
          )}
        </motion.div>

        {/* divider */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-border/50" />
          <span className="text-sm text-muted-foreground">or fill in manually</span>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        {/* ── Progress Steps ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {stepLabels.map((s, i) => (
              <button key={s.label} onClick={() => setStep(i)} className="flex flex-col items-center gap-1.5 group">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${i <= step ? "border-primary bg-primary/10 text-primary" : "border-border/40 text-muted-foreground group-hover:border-primary/30"}`}>
                  {i < step ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
                </div>
                <span className={`hidden text-[10px] sm:block ${i <= step ? "text-primary font-medium" : "text-muted-foreground"}`}>{s.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 h-1 w-full rounded-full bg-secondary">
            <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${((step + 1) / stepLabels.length) * 100}%` }} transition={{ duration: 0.3 }} />
          </div>
        </div>

        {/* ── Step Content ── */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

            {/* ══════════════════════════════
                STEP 0 – BASIC INFO
            ══════════════════════════════ */}
            {step === 0 && (
              <div className="space-y-6">
                <SH icon={User} label="Basic Info" />

                {/* Profile photo + name/title */}
                <div className="flex gap-6 items-start">
                  <div className="shrink-0">
                    <ImgUpload
                      value={data.photo || ""}
                      onChange={v => setData(p => ({ ...p, photo: v }))}
                      label="Upload Photo"
                      circle
                    />
                    <p className="text-[10px] text-center text-muted-foreground mt-1">Profile Photo</p>
                  </div>
                  <div className="flex-1 space-y-3">
                    <Input value={data.name} onChange={e => setData(p => ({ ...p, name: e.target.value }))} placeholder="Full Name *" className={inp} />
                    <Input value={data.title} onChange={e => setData(p => ({ ...p, title: e.target.value }))} placeholder="Professional Title *" className={inp} />
                  </div>
                </div>

                <Textarea value={data.about} onChange={e => setData(p => ({ ...p, about: e.target.value }))} placeholder="Write a compelling bio about yourself…" rows={4} className="bg-secondary/50 border-border/40 text-sm" />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input value={data.email || ""} onChange={e => setData(p => ({ ...p, email: e.target.value }))} placeholder="Email address" className={`${inp} pl-9`} />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input value={data.phone || ""} onChange={e => setData(p => ({ ...p, phone: e.target.value }))} placeholder="Phone number" className={`${inp} pl-9`} />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input value={data.location || ""} onChange={e => setData(p => ({ ...p, location: e.target.value }))} placeholder="City, Country" className={`${inp} pl-9`} />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input value={data.website || ""} onChange={e => setData(p => ({ ...p, website: e.target.value }))} placeholder="Portfolio website URL" className={`${inp} pl-9`} />
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="flex items-center gap-2 font-medium text-sm"><Languages className="h-4 w-4 text-primary" /> Languages</h3>
                    <Button variant="ghost" size="sm" onClick={addLang} className="h-7 text-xs gap-1"><Plus className="h-3 w-3" /> Add</Button>
                  </div>
                  <div className="space-y-2">
                    {(data.languages || []).map((lang, i) => (
                      <div key={i} className="flex gap-2">
                        <Input value={lang.name} onChange={e => updateLang(i, "name", e.target.value)} placeholder="Language" className="bg-secondary/50 border-border/40 text-sm h-9" />
                        <select value={lang.level} onChange={e => updateLang(i, "level", e.target.value)} className="h-9 flex-1 rounded-md border border-border/40 bg-secondary/50 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                          {["Native", "Fluent", "Professional", "Conversational", "Basic"].map(l => <option key={l}>{l}</option>)}
                        </select>
                        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeLang(i)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════
                STEP 1 – EXPERIENCE + EDUCATION
            ══════════════════════════════ */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <SH icon={Briefcase} label="Work Experience" />
                    <Button variant="ghost" size="sm" onClick={addExp} className="h-8 text-xs gap-1 mb-5"><Plus className="h-3 w-3" /> Add Role</Button>
                  </div>
                  <div className="space-y-4">
                    {data.experience.map((exp, i) => (
                      <Card key={i}>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Experience {i + 1}</span>
                          {data.experience.length > 1 && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeExp(i)}><Trash2 className="h-3.5 w-3.5" /></Button>
                          )}
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <Input value={exp.role} onChange={e => updateExp(i, "role", e.target.value)} placeholder="Job Title / Role *" className={inp} />
                          <Input value={exp.company} onChange={e => updateExp(i, "company", e.target.value)} placeholder="Company Name *" className={inp} />
                          <Input value={exp.duration} onChange={e => updateExp(i, "duration", e.target.value)} placeholder="e.g. Jan 2024 – Now" className={inp} />
                        </div>
                        <Textarea value={exp.description} onChange={e => updateExp(i, "description", e.target.value)} placeholder="Describe your responsibilities, achievements, and impact…" rows={3} className="bg-secondary/50 border-border/40 text-sm" />
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <SH icon={GraduationCap} label="Education" />
                    <Button variant="ghost" size="sm" onClick={addEdu} className="h-8 text-xs gap-1 mb-5"><Plus className="h-3 w-3" /> Add</Button>
                  </div>
                  <div className="space-y-4">
                    {data.education.map((edu, i) => (
                      <Card key={i}>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Education {i + 1}</span>
                          {data.education.length > 1 && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeEdu(i)}><Trash2 className="h-3.5 w-3.5" /></Button>
                          )}
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <Input value={edu.degree} onChange={e => updateEdu(i, "degree", e.target.value)} placeholder="Degree / Course *" className={inp} />
                          <Input value={edu.school} onChange={e => updateEdu(i, "school", e.target.value)} placeholder="Institution *" className={inp} />
                          <Input value={edu.year} onChange={e => updateEdu(i, "year", e.target.value)} placeholder="e.g. 2021 – 2025" className={inp} />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════
                STEP 2 – SKILLS + PROJECTS
            ══════════════════════════════ */}
            {step === 2 && (
              <div className="space-y-8">
                {/* Skills */}
                <div>
                  <SH icon={Code} label="Skills" />
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill and press Enter…"
                      className={inp}
                    />
                    <Button onClick={addSkill} size="icon" className="h-11 w-11 bg-primary text-primary-foreground shrink-0"><Plus className="h-4 w-4" /></Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-3">💡 Add skills one by one. They'll be auto-categorized in your portfolio.</p>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                      <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-sm text-primary"
                      >
                        {skill}
                        <button onClick={() => removeSkill(i)} className="hover:text-destructive transition-colors"><X className="h-3 w-3" /></button>
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <SH icon={Trophy} label="Achievements & Awards" />
                  <div className="flex gap-2 mb-3">
                    <Input value={achievementInput} onChange={e => setAchievementInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addAchievement())} placeholder="e.g. 🏆 Won Hackathon 2024 – 1st place…" className={inp} />
                    <Button onClick={addAchievement} size="icon" className="h-11 w-11 bg-primary text-primary-foreground shrink-0"><Plus className="h-4 w-4" /></Button>
                  </div>
                  <div className="space-y-2">
                    {(data.achievements || []).map((ach, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg bg-secondary/40 px-3 py-2 text-sm">
                        <span className="flex-1">{ach}</span>
                        <button onClick={() => removeAchievement(i)} className="text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <SH icon={Sparkles} label="Projects" />
                    <Button variant="ghost" size="sm" onClick={addProject} className="h-8 text-xs gap-1 mb-5"><Plus className="h-3 w-3" /> Add Project</Button>
                  </div>
                  <div className="space-y-5">
                    {data.projects.map((proj, i) => (
                      <Card key={i}>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project {i + 1}</span>
                          {data.projects.length > 1 && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeProject(i)}><Trash2 className="h-3.5 w-3.5" /></Button>
                          )}
                        </div>
                        {/* Project preview image */}
                        <ImgUpload
                          value={proj.imageUrl || ""}
                          onChange={v => updateProject(i, "imageUrl", v)}
                          label="Upload project screenshot / preview image"
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Input value={proj.title} onChange={e => updateProject(i, "title", e.target.value)} placeholder="Project Title *" className={inp} />
                          <Input value={proj.link} onChange={e => updateProject(i, "link", e.target.value)} placeholder="GitHub / Source URL" className={inp} />
                          <Input value={proj.liveLink || ""} onChange={e => updateProject(i, "liveLink", e.target.value)} placeholder="Live Demo URL" className={inp} />
                          <Input
                            value={Array.isArray(proj.tags) ? proj.tags.join(", ") : (proj.tags as string)}
                            onChange={e => {
                              const u = [...data.projects];
                              u[i] = { ...u[i], tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) };
                              setData(p => ({ ...p, projects: u }));
                            }}
                            placeholder="Tags: React, Node.js, MongoDB…"
                            className={inp}
                          />
                        </div>
                        <Textarea value={proj.description} onChange={e => updateProject(i, "description", e.target.value)} placeholder="Describe the project, your role, tech used, and impact…" rows={3} className="bg-secondary/50 border-border/40 text-sm" />
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════
                STEP 3 – CERTIFICATIONS
            ══════════════════════════════ */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <SH icon={Award} label="Certifications" />
                  <Button variant="ghost" size="sm" onClick={addCert} className="h-8 text-xs gap-1 mb-5"><Plus className="h-3 w-3" /> Add Certificate</Button>
                </div>
                <div className="space-y-5">
                  {(data.certifications || []).map((cert, i) => (
                    <Card key={i}>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Certificate {i + 1}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeCert(i)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                      {/* Certificate image */}
                      <ImgUpload
                        value={cert.imageUrl || ""}
                        onChange={v => updateCert(i, "imageUrl", v)}
                        label="Upload certificate image / badge"
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Input value={cert.name} onChange={e => updateCert(i, "name", e.target.value)} placeholder="Certificate Name *" className={inp} />
                        <Input value={cert.issuer} onChange={e => updateCert(i, "issuer", e.target.value)} placeholder="Issuing Organization *" className={inp} />
                        <Input value={cert.date} onChange={e => updateCert(i, "date", e.target.value)} placeholder="Date (e.g. August 2024)" className={inp} />
                        <Input value={cert.credentialUrl || ""} onChange={e => updateCert(i, "credentialUrl", e.target.value)} placeholder="Credential / Verify URL" className={inp} />
                      </div>
                    </Card>
                  ))}
                  {(data.certifications || []).length === 0 && (
                    <div className="rounded-xl border border-dashed border-border/40 py-10 text-center text-muted-foreground text-sm">
                      No certifications yet. Click "Add Certificate" to add one.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══════════════════════════════
                STEP 4 – LINKS & FINISH
            ══════════════════════════════ */}
            {step === 4 && (
              <div className="space-y-6">
                <SH icon={LinkIcon} label="Social Links" />
                <div className="space-y-3">
                  {data.socialLinks.map((link, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <select
                        value={link.platform}
                        onChange={e => { const u = [...data.socialLinks]; u[i] = { ...link, platform: e.target.value }; setData(p => ({ ...p, socialLinks: u })); }}
                        className="h-11 w-36 rounded-md border border-border/40 bg-secondary/50 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shrink-0"
                      >
                        {["GitHub", "LinkedIn", "Twitter", "Instagram", "YouTube", "Portfolio", "Other"].map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                      <Input
                        value={link.url}
                        onChange={e => { const u = [...data.socialLinks]; u[i] = { ...link, url: e.target.value }; setData(p => ({ ...p, socialLinks: u })); }}
                        placeholder="https://..."
                        className={`${inp} flex-1`}
                      />
                      {data.socialLinks.length > 1 && (
                        <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => setData(p => ({ ...p, socialLinks: p.socialLinks.filter((_, j) => j !== i) }))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => setData(p => ({ ...p, socialLinks: [...p.socialLinks, { platform: "GitHub", url: "" }] }))}>
                    <Plus className="h-3 w-3" /> Add Link
                  </Button>
                </div>

                {/* Preview URL */}
                <div className="glass-card rounded-xl p-4 border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Your portfolio URL</p>
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <Globe className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">{data.name.toLowerCase().replace(/\s+/g, "")}.portgen.ai</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="glass-card rounded-xl p-5 space-y-3 border border-primary/15">
                  <p className="text-sm font-semibold text-primary">📋 Portfolio Summary</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span>✅ Name: <strong className="text-foreground">{data.name}</strong></span>
                    <span>✅ Skills: <strong className="text-foreground">{data.skills.length}</strong></span>
                    <span>✅ Projects: <strong className="text-foreground">{data.projects.length}</strong></span>
                    <span>✅ Experience: <strong className="text-foreground">{data.experience.length}</strong></span>
                    <span>✅ Certs: <strong className="text-foreground">{(data.certifications || []).length}</strong></span>
                    <span>✅ Achievements: <strong className="text-foreground">{(data.achievements || []).length}</strong></span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Navigation Buttons ── */}
        <div className="mt-10 flex items-center justify-between">
          <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="gap-2 border-border/60">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {step < stepLabels.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={async () => { await savePortfolio(); navigate("/templates"); }}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 gap-2"
              disabled={isSaving}
            >
              {isSaving ? "Saving…" : "Generate Portfolio"} <Sparkles className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
