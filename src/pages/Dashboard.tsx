import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Plus, X, ArrowRight, ArrowLeft, FileText, User, Briefcase,
  GraduationCap, Link as LinkIcon, Code, CheckCircle2, Sparkles,
  Award, Globe, Phone, Mail, MapPin, Trophy, Languages, Image as ImageIcon,
  Trash2, Camera, Save, AlertCircle, Check, Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { defaultPortfolioData, type PortfolioData } from "@/data/mockData";
import { API_URL } from "@/config";

/* ─── STYLES ─────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; }

.cp-root {
  min-height: 100vh;
  background: #FAF7F2;
  font-family: 'Inter', system-ui, sans-serif;
  padding-bottom: 4rem;
  padding-top: 5.5rem; /* space for fixed navbar */
}

/* ── PAGE WRAPPER ── */
.cp-page {
  max-width: 780px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 0;
}

.cp-back {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.82rem; font-weight: 500; color: #64748B;
  cursor: pointer; text-decoration: none; margin-bottom: 1.25rem;
  transition: color 0.15s;
}
.cp-back:hover { color: #4F46E5; }
.cp-back svg { width: 14px; height: 14px; }

.cp-heading { font-size: 1.9rem; font-weight: 700; color: #0F172A; letter-spacing: -0.04em; margin-bottom: 0.3rem; }
.cp-subheading { font-size: 0.875rem; color: #64748B; margin-bottom: 2rem; }

/* ── UPLOAD BOX ── */
.cp-upload-box {
  background: #fff;
  border: 2px dashed #DCD8D0;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  text-align: center;
  transition: border-color 0.2s, background 0.2s;
  cursor: pointer;
  margin-bottom: 2rem;
}
.cp-upload-box:hover, .cp-upload-box.drag-over {
  border-color: #4F46E5;
  background: #FAF8F5;
}
.cp-upload-icon-wrap {
  width: 60px; height: 60px;
  background: #F4EFE6;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1rem;
}
.cp-upload-icon-wrap svg { width: 28px; height: 28px; color: #4F46E5; }
.cp-upload-title { font-size: 1rem; font-weight: 600; color: #1E293B; margin-bottom: 0.35rem; }
.cp-upload-hint { font-size: 0.82rem; color: #94A3B8; margin-bottom: 1rem; }
.cp-upload-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 0.55rem 1.2rem;
  background: #fff;
  border: 1.5px solid #DCD8D0;
  border-radius: 8px;
  font-size: 0.82rem; font-weight: 600; color: #4F46E5;
  cursor: pointer; font-family: inherit;
  transition: background 0.15s, border-color 0.15s;
}
.cp-upload-btn:hover { background: #FAF8F5; border-color: #C1BCB2; }
.cp-upload-btn svg { width: 14px; height: 14px; }

.cp-file-success {
  display: flex; align-items: center; gap: 10px;
  padding: 0.7rem 1rem;
  background: #F0FDF4; border: 1.5px solid #BBF7D0; border-radius: 10px;
  font-size: 0.82rem; font-weight: 500; color: #15803D; margin-top: 0.75rem;
}
.cp-file-success svg { width: 16px; height: 16px; flex-shrink: 0; }

/* ── DIVIDER ── */
.cp-or-divider {
  display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;
}
.cp-or-line { flex: 1; height: 1px; background: #E4DFD5; }
.cp-or-text { font-size: 0.78rem; color: #94A3B8; font-weight: 500; white-space: nowrap; }

/* ── STEPPER ── */
.cp-stepper {
  display: flex; align-items: flex-start; gap: 0;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}
.cp-step {
  display: flex; flex-direction: column; align-items: center;
  flex: 1; min-width: 80px; position: relative; cursor: pointer;
}
.cp-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  left: calc(50% + 20px);
  width: calc(100% - 40px);
  height: 2px;
  background: #E4DFD5;
  z-index: 0;
}
.cp-step.done:not(:last-child)::after { background: #4F46E5; }
.cp-step-icon {
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: #FAF8F5; border: 2px solid #E4DFD5;
  transition: all 0.2s; position: relative; z-index: 1;
}
.cp-step-icon svg { width: 17px; height: 17px; color: #94A3B8; }
.cp-step.active .cp-step-icon {
  background: #4F46E5; border-color: #4F46E5;
}
.cp-step.active .cp-step-icon svg { color: #fff; }
.cp-step.done .cp-step-icon {
  background: #FAF8F5; border-color: #4F46E5;
}
.cp-step.done .cp-step-icon svg { color: #4F46E5; }
.cp-step-label {
  font-size: 0.72rem; font-weight: 500; color: #94A3B8;
  margin-top: 6px; text-align: center; white-space: nowrap;
}
.cp-step.active .cp-step-label { color: #4F46E5; font-weight: 600; }
.cp-step.done .cp-step-label { color: #4F46E5; }
.cp-step-underline {
  height: 3px; background: transparent; border-radius: 2px;
  width: 100%; margin-top: 6px;
}
.cp-step.active .cp-step-underline { background: #4F46E5; }

/* ── FORM CARD ── */
.cp-form-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #EFECE6;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(139, 92, 26, 0.05);
}

.cp-section-heading {
  display: flex; align-items: center; gap: 10px;
  font-size: 1.1rem; font-weight: 700; color: #1E293B;
  letter-spacing: -0.02em; margin-bottom: 1.5rem;
}
.cp-section-heading svg { width: 20px; height: 20px; color: #4F46E5; }

/* ── PHOTO + NAME ROW ── */
.cp-profile-row {
  display: flex; gap: 1.25rem; align-items: flex-start;
  margin-bottom: 1.25rem;
}
.cp-photo-upload {
  flex-shrink: 0;
  width: 76px; height: 76px; border-radius: 50%;
  border: 2px dashed #C1BCB2;
  background: #FAF8F5;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer; gap: 4px; transition: border-color 0.15s, background 0.15s;
}
.cp-photo-upload:hover { border-color: #4F46E5; background: #FAF8F5; }
.cp-photo-upload svg { width: 20px; height: 20px; color: #94A3B8; }
.cp-photo-label { font-size: 0.6rem; color: #94A3B8; font-weight: 500; text-align: center; line-height: 1.2; }
.cp-photo-img {
  width: 76px; height: 76px; border-radius: 50%;
  object-fit: cover; border: 2px solid #C1BCB2; flex-shrink: 0;
}
.cp-name-col { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; }

/* ── FIELDS ── */
.cp-field { margin-bottom: 1rem; }
.cp-field:last-child { margin-bottom: 0; }
.cp-label {
  display: block; font-size: 0.78rem; font-weight: 600; color: #374151;
  margin-bottom: 0.35rem; letter-spacing: -0.005em;
}
.cp-input-wrap { position: relative; display: flex; align-items: center; }
.cp-input-icon {
  position: absolute; left: 11px; color: #CBD5E1; pointer-events: none;
  display: flex; align-items: center;
}
.cp-input-icon svg { width: 15px; height: 15px; }
.cp-input {
  width: 100%; padding: 0.6rem 0.875rem 0.6rem 2.25rem;
  background: #FAF8F5; border: 1.5px solid #E4DFD5; border-radius: 10px;
  font-size: 0.875rem; color: #1E293B; font-family: inherit;
  transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
  outline: none;
}
.cp-input.no-icon { padding-left: 0.875rem; }
.cp-input::placeholder { color: #CBD5E1; }
.cp-input:hover { border-color: #C1BCB2; }
.cp-input:focus { border-color: #4F46E5; background: #fff; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.10); }

.cp-textarea {
  width: 100%; padding: 0.7rem 0.875rem;
  background: #FAF8F5; border: 1.5px solid #E4DFD5; border-radius: 10px;
  font-size: 0.875rem; color: #1E293B; font-family: inherit;
  resize: vertical; min-height: 90px; outline: none;
  transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
  line-height: 1.6;
}
.cp-textarea::placeholder { color: #CBD5E1; }
.cp-textarea:hover { border-color: #C1BCB2; }
.cp-textarea:focus { border-color: #4F46E5; background: #fff; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.10); }

.cp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; }
.cp-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.875rem; }

/* ── INNER CARD ── */
.cp-inner-card {
  background: #fff;
  border: 1px solid #E4DFD5;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
}
.cp-inner-card:last-child {
  margin-bottom: 0;
}

/* ── LANGUAGES ── */
.cp-lang-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 0.75rem; margin-top: 1.5rem;
}
.cp-lang-label {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.9rem; font-weight: 600; color: #1E293B;
}
.cp-lang-label svg { width: 16px; height: 16px; color: #4F46E5; }
.cp-add-btn {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.8rem; font-weight: 600; color: #4F46E5;
  background: none; border: none; cursor: pointer; font-family: inherit;
  transition: color 0.15s;
}
.cp-add-btn:hover { color: #312E81; }
.cp-add-btn svg { width: 14px; height: 14px; }

.cp-lang-row {
  display: grid; grid-template-columns: 1fr 160px 36px; gap: 0.75rem;
  align-items: center; margin-bottom: 0.65rem;
}
.cp-select {
  width: 100%; padding: 0.6rem 0.875rem;
  background: #FAF8F5; border: 1.5px solid #E4DFD5; border-radius: 10px;
  font-size: 0.875rem; color: #1E293B; font-family: inherit;
  outline: none; cursor: pointer;
  transition: border-color 0.18s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 2rem;
}
.cp-select:focus { border-color: #4F46E5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.10); }
.cp-del-btn {
  width: 36px; height: 36px; border-radius: 8px;
  background: #FFF5F5; border: 1.5px solid #FECACA;
  color: #EF4444; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.15s; flex-shrink: 0;
}
.cp-del-btn:hover { background: #FEE2E2; }
.cp-del-btn svg { width: 14px; height: 14px; }

/* ── BOTTOM BUTTONS ── */
.cp-actions {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 2rem; padding-top: 1.5rem;
  border-top: 1px solid #F1F5F9;
}
.cp-btn-back {
  display: flex; align-items: center; gap: 6px;
  padding: 0.65rem 1.25rem;
  background: #fff; border: 1.5px solid #E4DFD5; border-radius: 10px;
  font-size: 0.875rem; font-weight: 600; color: #64748B;
  cursor: pointer; font-family: inherit; transition: all 0.15s;
}
.cp-btn-back:hover:not(:disabled) { border-color: #C1BCB2; color: #4F46E5; }
.cp-btn-back svg { width: 14px; height: 14px; }
.cp-btn-next {
  display: flex; align-items: center; gap: 6px;
  padding: 0.65rem 1.5rem;
  background: #4F46E5; border: none; border-radius: 10px;
  font-size: 0.875rem; font-weight: 600; color: #fff;
  cursor: pointer; font-family: inherit;
  transition: background 0.18s, box-shadow 0.18s, transform 0.12s;
}
.cp-btn-next:hover:not(:disabled) {
  background: #312E81;
  box-shadow: 0 4px 14px rgba(79,70,229,0.28);
  transform: translateY(-1px);
}
.cp-btn-next:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
.cp-btn-next svg { width: 14px; height: 14px; }

/* ── PLACEHOLDER STEPS ── */
.cp-step-placeholder {
  text-align: center; padding: 3rem 1rem;
  color: #94A3B8; font-size: 0.875rem;
}
.cp-step-placeholder svg { width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.4; }
.cp-step-placeholder p { font-weight: 500; color: #64748B; }
.cp-step-placeholder span { font-size: 0.8rem; }

/* ── PERF BADGE ── */
.cp-perf-badge {
  position: fixed; bottom: 1.25rem; right: 1.25rem;
  display: flex; align-items: center; gap: 6px;
  padding: 0.5rem 0.875rem;
  background: #fff; border: 1px solid #E4DFD5; border-radius: 20px;
  font-size: 0.75rem; font-weight: 600; color: #64748B;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06); cursor: pointer;
  transition: box-shadow 0.15s;
  z-index: 1000;
}
.cp-perf-badge:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.10); }
.cp-perf-badge svg { width: 14px; height: 14px; color: #4F46E5; }

/* ── TAGS INPUT ── */
.cp-tags-input-wrap {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.cp-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.cp-tag-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #FAF8F5;
  border: 1px solid #E4DFD5;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 0.82rem;
  color: #374151;
}
.cp-tag-item button {
  background: none;
  border: none;
  color: #94A3B8;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.cp-tag-item button:hover {
  color: #EF4444;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .cp-grid-2 { grid-template-columns: 1fr; }
  .cp-grid-3 { grid-template-columns: 1fr; }
  .cp-page { padding: 1.5rem 1rem 0; }
  .cp-form-card { padding: 1.25rem; }
  .cp-heading { font-size: 1.5rem; }
  .cp-lang-row { grid-template-columns: 1fr 130px 36px; }
}
`;

const stepLabels = [
  { icon: User,           label: "Basic Info" },
  { icon: Briefcase,      label: "Experience & Edu" },
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
  <div className="cp-section-heading">
    <Icon /> {label}
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
        className={
          circle
            ? "cp-photo-upload"
            : "relative cursor-pointer border border-dashed hover:border-[#4F46E5] transition-colors flex items-center justify-center overflow-hidden h-28 w-full rounded-lg"
        }
        style={!circle ? { border: "1.5px dashed #C1BCB2", background: "#FAF8F5" } : undefined}
      >
        {value ? (
          <img
            src={value}
            alt="preview"
            className={circle ? "cp-photo-img" : "h-full w-full object-cover"}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground text-center">
            {circle ? <Camera className="h-5 w-5 text-[#94A3B8]" /> : <ImageIcon className="h-6 w-6 text-[#94A3B8]" />}
            <span className="text-[10px] px-2 text-[#94A3B8]">{label}</span>
          </div>
        )}
        {value && (
          <button
            onClick={e => { e.stopPropagation(); onChange(""); }}
            className="absolute top-1 right-1 bg-white/95 rounded-full p-0.5 hover:bg-red-500/10 hover:text-red-500 transition-colors border border-border"
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
  const [showManualForm, setShowManualForm] = useState(false);
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
          if (body?.data) {
            setData(body.data as PortfolioData);
            if (body.data.name && body.data.name !== defaultPortfolioData.name) {
              setShowManualForm(true);
            }
          }
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
    setData(p => ({ ...p, languages: [...(p.languages || []), { name: "", level: "Native" }] }));
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

  return (
    <>
      <style>{CSS}</style>
      <div className="cp-root">
        <Navbar />

        <div className="cp-page">
          <button className="cp-back" onClick={() => navigate(-1)} style={{ background: "none", border: "none" }}>
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="cp-heading">Create Your Portfolio</h1>
              <p className="cp-subheading">Upload your resume or fill in the details below to get started.</p>
            </div>
            {/* Save status badge */}
            <div className="shrink-0 mt-1.5">
              {saveStatus === "saving" && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
                  <Save className="h-3.5 w-3.5 text-[#4F46E5]" /> Saving…
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                  <Check className="h-3.5 w-3.5" /> Saved ✓
                </span>
              )}
              {saveStatus === "error" && (
                <span className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" /> Save failed!
                </span>
              )}
            </div>
          </div>

          {saveStatus === "error" && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <strong>Could not save your portfolio.</strong> Check that the backend server is running on port 4000. Your changes are preserved locally until fixed.
              </div>
            </div>
          )}

          {isLoading && <div className="mb-6 text-sm text-muted-foreground">Loading your saved portfolio…</div>}

          {/* ── Resume Upload ── */}
          <div className="mb-8">
            {isParsing ? (
              <div className="cp-form-card flex flex-col items-center justify-center py-10 text-center" style={{ borderColor: "#4F46E5", background: "#FAF8F5" }}>
                <Sparkles className="h-8 w-8 text-primary animate-pulse mb-3" style={{ color: "#4F46E5" }} />
                <h3 className="text-lg font-semibold animate-pulse" style={{ color: "#4F46E5" }}>Analyzing &amp; Parsing Resume…</h3>
                <p className="text-sm text-muted-foreground mt-1">Extracting details and saving to your portfolio…</p>
              </div>
            ) : !uploadedFile ? (
              <div
                className={`cp-upload-box${isDragOver ? " drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) processFile(f.name);
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) processFile(f.name);
                  }}
                />
                <div className="cp-upload-icon-wrap">
                  <Upload className="h-7 w-7" />
                </div>
                <p className="cp-upload-title">Upload Resume</p>
                <p className="cp-upload-hint">Drag &amp; drop PDF / DOCX here, or click to browse</p>
                <button
                  className="cp-upload-btn"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  <FileText className="h-4 w-4" /> Choose File
                </button>
              </div>
            ) : (
              <div className="cp-file-success">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Resume uploaded &amp; parsed successfully!</p>
                  <p className="text-xs text-green-700/80">{uploadedFile} — fields auto-filled</p>
                </div>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-green-700 hover:text-green-950 font-bold px-2 py-1 text-sm bg-transparent border-0 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* divider & manual option */}
          {!showManualForm && (
            <div className="flex flex-col items-center mt-6">
              <div className="cp-or-divider w-full">
                <div className="cp-or-line" />
                <span className="cp-or-text">or</span>
                <div className="cp-or-line" />
              </div>
              <button
                onClick={() => setShowManualForm(true)}
                className="cp-btn-next"
                style={{
                  background: "#fff",
                  color: "#4F46E5",
                  border: "1.5px solid #4F46E5",
                  padding: "0.75rem 2rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  boxShadow: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#FAF8F5";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(79, 70, 229, 0.08)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Fill manually (Preferred) <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {showManualForm && (
            <>
              {/* ── STEPPER ── */}
              <div className="cp-stepper">
                {stepLabels.map((s, i) => (
                  <div
                    key={s.label}
                    className={`cp-step${i === step ? " active" : ""}${i < step ? " done" : ""}`}
                    onClick={() => setStep(i)}
                  >
                    <div className="cp-step-icon">
                      {i < step ? <Check className="h-4.5 w-4.5" /> : <s.icon className="h-4.5 w-4.5" />}
                    </div>
                    <span className="cp-step-label">{s.label}</span>
                    <div className="cp-step-underline" />
                  </div>
                ))}
              </div>

              {/* ── FORM CARD ── */}
              <div className="cp-form-card">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* STEP 0: Basic Info */}
                    {step === 0 && (
                      <>
                        <SH icon={User} label="Basic Info" />

                        {/* Photo + Name */}
                        <div className="cp-profile-row">
                          <ImgUpload
                            value={data.photo || ""}
                            onChange={v => setData(p => ({ ...p, photo: v }))}
                            label="Upload Photo"
                            circle
                          />
                          <div className="cp-name-col">
                            <div className="cp-field" style={{ marginBottom: 0 }}>
                              <input
                                className="cp-input no-icon"
                                placeholder="Full Name"
                                value={data.name}
                                onChange={e => setData(p => ({ ...p, name: e.target.value }))}
                              />
                            </div>
                            <div className="cp-field" style={{ marginBottom: 0 }}>
                              <input
                                className="cp-input no-icon"
                                placeholder="Professional Title"
                                value={data.title}
                                onChange={e => setData(p => ({ ...p, title: e.target.value }))}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Bio */}
                        <div className="cp-field">
                          <label className="cp-label">Bio / Summary</label>
                          <textarea
                            className="cp-textarea"
                            placeholder="Write a short professional summary…"
                            value={data.about}
                            onChange={e => setData(p => ({ ...p, about: e.target.value }))}
                          />
                        </div>

                        {/* Contact grid */}
                        <div className="cp-grid-2">
                          <div className="cp-field">
                            <label className="cp-label">Email</label>
                            <div className="cp-input-wrap">
                              <span className="cp-input-icon"><Mail /></span>
                              <input
                                className="cp-input"
                                type="email"
                                placeholder="you@example.com"
                                value={data.email || ""}
                                onChange={e => setData(p => ({ ...p, email: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div className="cp-field">
                            <label className="cp-label">Phone</label>
                            <div className="cp-input-wrap">
                              <span className="cp-input-icon"><Phone /></span>
                              <input
                                className="cp-input"
                                type="tel"
                                placeholder="+91 00000 00000"
                                value={data.phone || ""}
                                onChange={e => setData(p => ({ ...p, phone: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div className="cp-field">
                            <label className="cp-label">Location</label>
                            <div className="cp-input-wrap">
                              <span className="cp-input-icon"><MapPin /></span>
                              <input
                                className="cp-input"
                                placeholder="City, State, Country"
                                value={data.location || ""}
                                onChange={e => setData(p => ({ ...p, location: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div className="cp-field">
                            <label className="cp-label">Website / Portfolio</label>
                            <div className="cp-input-wrap">
                              <span className="cp-input-icon"><Globe /></span>
                              <input
                                className="cp-input"
                                placeholder="https://yoursite.com"
                                value={data.website || ""}
                                onChange={e => setData(p => ({ ...p, website: e.target.value }))}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Languages */}
                        <div className="cp-lang-header">
                          <span className="cp-lang-label"><Languages /> Languages</span>
                          <button className="cp-add-btn" onClick={addLang}><Plus className="h-4 w-4" /> Add</button>
                        </div>
                        {(data.languages || []).map((lang, i) => (
                          <div key={i} className="cp-lang-row">
                            <input
                              className="cp-input no-icon"
                              placeholder="Language"
                              value={lang.name}
                              onChange={e => updateLang(i, "name", e.target.value)}
                            />
                            <select
                              className="cp-select"
                              value={lang.level}
                              onChange={e => updateLang(i, "level", e.target.value)}
                            >
                              {["Native", "Fluent", "Professional", "Conversational", "Basic"].map(lvl => (
                                <option key={lvl}>{lvl}</option>
                              ))}
                            </select>
                            <button className="cp-del-btn" onClick={() => removeLang(i)} aria-label="Remove language">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </>
                    )}

                    {/* STEP 1: Experience & Education */}
                    {step === 1 && (
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <SH icon={Briefcase} label="Work Experience" />
                            <button className="cp-add-btn" onClick={addExp}><Plus className="h-4 w-4" /> Add Role</button>
                          </div>
                          <div className="space-y-4">
                            {data.experience.map((exp, i) => (
                              <div key={i} className="cp-inner-card">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-xs font-semibold text-[#8B7E66] uppercase tracking-wider">Experience {i + 1}</span>
                                  {data.experience.length > 1 && (
                                    <button className="cp-del-btn" style={{ width: "30px", height: "30px" }} onClick={() => removeExp(i)}><Trash2 className="h-4 w-4" /></button>
                                  )}
                                </div>
                                <div className="cp-grid-3 mb-3">
                                  <div className="cp-field">
                                    <label className="cp-label">Job Title / Role *</label>
                                    <input className="cp-input no-icon" value={exp.role} onChange={e => updateExp(i, "role", e.target.value)} placeholder="Job Title" />
                                  </div>
                                  <div className="cp-field">
                                    <label className="cp-label">Company Name *</label>
                                    <input className="cp-input no-icon" value={exp.company} onChange={e => updateExp(i, "company", e.target.value)} placeholder="Company" />
                                  </div>
                                  <div className="cp-field">
                                    <label className="cp-label">Duration *</label>
                                    <input className="cp-input no-icon" value={exp.duration} onChange={e => updateExp(i, "duration", e.target.value)} placeholder="e.g. Jan 2024 – Now" />
                                  </div>
                                </div>
                                <div className="cp-field">
                                  <label className="cp-label">Description</label>
                                  <textarea className="cp-textarea" value={exp.description} onChange={e => updateExp(i, "description", e.target.value)} placeholder="Describe your responsibilities, achievements, and impact…" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <SH icon={GraduationCap} label="Education" />
                            <button className="cp-add-btn" onClick={addEdu}><Plus className="h-4 w-4" /> Add Education</button>
                          </div>
                          <div className="space-y-4">
                            {data.education.map((edu, i) => (
                              <div key={i} className="cp-inner-card">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-xs font-semibold text-[#8B7E66] uppercase tracking-wider">Education {i + 1}</span>
                                  {data.education.length > 1 && (
                                    <button className="cp-del-btn" style={{ width: "30px", height: "30px" }} onClick={() => removeEdu(i)}><Trash2 className="h-4 w-4" /></button>
                                  )}
                                </div>
                                <div className="cp-grid-3">
                                  <div className="cp-field">
                                    <label className="cp-label">Degree / Course *</label>
                                    <input className="cp-input no-icon" value={edu.degree} onChange={e => updateEdu(i, "degree", e.target.value)} placeholder="Degree" />
                                  </div>
                                  <div className="cp-field">
                                    <label className="cp-label">Institution *</label>
                                    <input className="cp-input no-icon" value={edu.school} onChange={e => updateEdu(i, "school", e.target.value)} placeholder="Institution" />
                                  </div>
                                  <div className="cp-field">
                                    <label className="cp-label">Year *</label>
                                    <input className="cp-input no-icon" value={edu.year} onChange={e => updateEdu(i, "year", e.target.value)} placeholder="e.g. 2021 – 2025" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Skills & Projects */}
                    {step === 2 && (
                      <div className="space-y-6">
                        <div>
                          <SH icon={Code} label="Skills" />
                          <div className="cp-tags-input-wrap">
                            <input
                              value={skillInput}
                              onChange={e => setSkillInput(e.target.value)}
                              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
                              placeholder="Add a skill and press Enter…"
                              className="cp-input no-icon"
                            />
                            <button onClick={addSkill} className="cp-btn-next" style={{ padding: "0 1.25rem", height: "42px", flexShrink: 0 }}><Plus className="h-5 w-5" /></button>
                          </div>
                          <p className="text-[11px] text-muted-foreground mb-3">💡 Add skills one by one. They'll be auto-categorized in your portfolio.</p>
                          <div className="cp-tags-list">
                            {data.skills.map((skill, i) => (
                              <span key={i} className="cp-tag-item">
                                {skill}
                                <button onClick={() => removeSkill(i)} aria-label="Remove skill">✕</button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <SH icon={Trophy} label="Achievements &amp; Awards" />
                          <div className="cp-tags-input-wrap">
                            <input
                              value={achievementInput}
                              onChange={e => setAchievementInput(e.target.value)}
                              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addAchievement())}
                              placeholder="e.g. 🏆 Won Hackathon 2024 – 1st place…"
                              className="cp-input no-icon"
                            />
                            <button onClick={addAchievement} className="cp-btn-next" style={{ padding: "0 1.25rem", height: "42px", flexShrink: 0 }}><Plus className="h-5 w-5" /></button>
                          </div>
                          <div className="space-y-2 mt-3">
                            {(data.achievements || []).map((ach, i) => (
                              <div key={i} className="flex items-center gap-2 rounded-lg bg-[#FAF8F5] border border-[#E4DFD5] px-3 py-2 text-sm">
                                <span className="flex-1 text-[#374151]">{ach}</span>
                                <button onClick={() => removeAchievement(i)} className="text-[#CBD5E1] hover:text-[#EF4444] bg-transparent border-0 cursor-pointer text-sm font-semibold">✕</button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <SH icon={Sparkles} label="Projects" />
                            <button className="cp-add-btn" onClick={addProject}><Plus className="h-4 w-4" /> Add Project</button>
                          </div>
                          <div className="space-y-5">
                            {data.projects.map((proj, i) => (
                              <div key={i} className="cp-inner-card">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-xs font-semibold text-[#8B7E66] uppercase tracking-wider">Project {i + 1}</span>
                                  {data.projects.length > 1 && (
                                    <button className="cp-del-btn" style={{ width: "30px", height: "30px" }} onClick={() => removeProject(i)}><Trash2 className="h-4 w-4" /></button>
                                  )}
                                </div>
                                {/* Project preview image */}
                                <div className="mb-3">
                                  <ImgUpload
                                    value={proj.imageUrl || ""}
                                    onChange={v => updateProject(i, "imageUrl", v)}
                                    label="Upload project screenshot / preview image"
                                  />
                                </div>
                                <div className="cp-grid-2">
                                  <div className="cp-field">
                                    <label className="cp-label">Project Title *</label>
                                    <input className="cp-input no-icon" value={proj.title} onChange={e => updateProject(i, "title", e.target.value)} placeholder="Project Title" />
                                  </div>
                                  <div className="cp-field">
                                    <label className="cp-label">GitHub / Source URL</label>
                                    <input className="cp-input no-icon" value={proj.link} onChange={e => updateProject(i, "link", e.target.value)} placeholder="https://github.com/..." />
                                  </div>
                                  <div className="cp-field">
                                    <label className="cp-label">Live Demo URL</label>
                                    <input className="cp-input no-icon" value={proj.liveLink || ""} onChange={e => updateProject(i, "liveLink", e.target.value)} placeholder="https://..." />
                                  </div>
                                  <div className="cp-field">
                                    <label className="cp-label">Tags (comma-separated)</label>
                                    <input
                                      className="cp-input no-icon"
                                      value={Array.isArray(proj.tags) ? proj.tags.join(", ") : (proj.tags as string)}
                                      onChange={e => {
                                        const u = [...data.projects];
                                        u[i] = { ...u[i], tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) };
                                        setData(p => ({ ...p, projects: u }));
                                      }}
                                      placeholder="React, Node.js, MongoDB…"
                                    />
                                  </div>
                                </div>
                                <div className="cp-field mt-3">
                                  <label className="cp-label">Description</label>
                                  <textarea className="cp-textarea" value={proj.description} onChange={e => updateProject(i, "description", e.target.value)} placeholder="Describe the project, your role, tech used, and impact…" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Certifications */}
                    {step === 3 && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <SH icon={Award} label="Certifications" />
                          <button className="cp-add-btn" onClick={addCert}><Plus className="h-4 w-4" /> Add Certificate</button>
                        </div>
                        <div className="space-y-5">
                          {(data.certifications || []).map((cert, i) => (
                            <div key={i} className="cp-inner-card">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-semibold text-[#8B7E66] uppercase tracking-wider">Certificate {i + 1}</span>
                                <button className="cp-del-btn" style={{ width: "30px", height: "30px" }} onClick={() => removeCert(i)}><Trash2 className="h-4 w-4" /></button>
                              </div>
                              {/* Certificate image */}
                              <div className="mb-3">
                                <ImgUpload
                                  value={cert.imageUrl || ""}
                                  onChange={v => updateCert(i, "imageUrl", v)}
                                  label="Upload certificate image / badge"
                                />
                              </div>
                              <div className="cp-grid-2">
                                <div className="cp-field">
                                  <label className="cp-label">Certificate Name *</label>
                                  <input className="cp-input no-icon" value={cert.name} onChange={e => updateCert(i, "name", e.target.value)} placeholder="Certificate Name" />
                                </div>
                                <div className="cp-field">
                                  <label className="cp-label">Issuing Organization *</label>
                                  <input className="cp-input no-icon" value={cert.issuer} onChange={e => updateCert(i, "issuer", e.target.value)} placeholder="e.g. Google, AWS, Coursera" />
                                </div>
                                <div className="cp-field">
                                  <label className="cp-label">Date</label>
                                  <input className="cp-input no-icon" value={cert.date} onChange={e => updateCert(i, "date", e.target.value)} placeholder="e.g. August 2024" />
                                </div>
                                <div className="cp-field">
                                  <label className="cp-label">Credential / Verify URL</label>
                                  <input className="cp-input no-icon" value={cert.credentialUrl || ""} onChange={e => updateCert(i, "credentialUrl", e.target.value)} placeholder="https://..." />
                                </div>
                              </div>
                            </div>
                          ))}
                          {(data.certifications || []).length === 0 && (
                            <div className="rounded-xl border border-dashed border-border/40 py-10 text-center text-muted-foreground text-sm">
                              No certifications yet. Click "Add Certificate" to add one.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* STEP 4: Links & Finish */}
                    {step === 4 && (
                      <div className="space-y-6">
                        <SH icon={LinkIcon} label="Social Links" />
                        <div className="space-y-3">
                          {data.socialLinks.map((link, i) => (
                            <div key={i} className="cp-lang-row">
                              <select
                                value={link.platform}
                                onChange={e => { const u = [...data.socialLinks]; u[i] = { ...link, platform: e.target.value }; setData(p => ({ ...p, socialLinks: u })); }}
                                className="cp-select"
                              >
                                {["GitHub", "LinkedIn", "Twitter", "Instagram", "YouTube", "Portfolio", "Other"].map(opt => <option key={opt}>{opt}</option>)}
                              </select>
                              <input
                                value={link.url}
                                onChange={e => { const u = [...data.socialLinks]; u[i] = { ...link, url: e.target.value }; setData(p => ({ ...p, socialLinks: u })); }}
                                placeholder="https://..."
                                className="cp-input no-icon"
                              />
                              {data.socialLinks.length > 1 ? (
                                <button className="cp-del-btn" onClick={() => setData(p => ({ ...p, socialLinks: p.socialLinks.filter((_, j) => j !== i) }))}>
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              ) : (
                                <div />
                              )}
                            </div>
                          ))}
                          <button className="cp-add-btn" style={{ marginTop: "8px" }} onClick={() => setData(p => ({ ...p, socialLinks: [...p.socialLinks, { platform: "GitHub", url: "" }] }))}>
                            <Plus className="h-4 w-4" /> Add Link
                          </button>
                        </div>

                        {/* Preview URL */}
                        <div className="cp-inner-card mt-6" style={{ background: "#FAF8F5" }}>
                          <p className="text-xs text-muted-foreground mb-1">Your portfolio URL</p>
                          <div className="flex items-center gap-2 font-mono text-sm">
                            <Globe className="h-4 w-4 text-[#4F46E5] shrink-0" />
                            <span className="text-[#374151] font-semibold">{data.name.toLowerCase().replace(/\s+/g, "")}.portgen.ai</span>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="cp-inner-card mt-4" style={{ borderColor: "#4F46E5", background: "#FAF8F5" }}>
                          <p className="text-sm font-semibold text-[#4F46E5] mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" /> Portfolio Summary
                          </p>
                          <div className="grid grid-cols-2 gap-3 text-xs text-[#64748B]">
                            <span>Name: <strong className="text-[#1E293B] font-medium">{data.name}</strong></span>
                            <span>Skills: <strong className="text-[#1E293B] font-medium">{data.skills.length}</strong></span>
                            <span>Projects: <strong className="text-[#1E293B] font-medium">{data.projects.length}</strong></span>
                            <span>Experience: <strong className="text-[#1E293B] font-medium">{data.experience.length}</strong></span>
                            <span>Certs: <strong className="text-[#1E293B] font-medium">{(data.certifications || []).length}</strong></span>
                            <span>Achievements: <strong className="text-[#1E293B] font-medium">{(data.achievements || []).length}</strong></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* ── ACTIONS ── */}
                <div className="cp-actions">
                  <button
                    className="cp-btn-back"
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                    style={{
                      opacity: step === 0 ? 0.4 : 1,
                      cursor: step === 0 ? "not-allowed" : "pointer"
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  {step < stepLabels.length - 1 ? (
                    <button className="cp-btn-next" onClick={() => setStep(step + 1)}>
                      Next <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      className="cp-btn-next"
                      onClick={async () => { await savePortfolio(); navigate("/templates"); }}
                      disabled={isSaving}
                      style={{ gap: "8px" }}
                    >
                      {isSaving ? "Saving…" : "Generate Portfolio"} <Sparkles className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Perf badge */}
        <div className="cp-perf-badge">
          <Star className="h-3.5 w-3.5" /> Perf Metrics
        </div>
      </div>
    </>
  );
};

export default Dashboard;
