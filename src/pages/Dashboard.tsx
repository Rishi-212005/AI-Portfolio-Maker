import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Plus, X, ArrowRight, ArrowLeft, FileText, User, Briefcase, GraduationCap, Link as LinkIcon, Code, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { defaultPortfolioData, type PortfolioData } from "@/data/mockData";
import AnalyticsMock from "@/components/AnalyticsMock";
import TechnicalOverview from "@/components/TechnicalOverview";
import BackButton from "@/components/BackButton";

const stepLabels = [
  { icon: User, label: "Basic Info" },
  { icon: Briefcase, label: "Experience" },
  { icon: Code, label: "Projects & Skills" },
  { icon: LinkIcon, label: "Links & Finish" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [skillInput, setSkillInput] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPortfolio = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/portfolio", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const body = await res.json();
          if (body?.data) {
            setData(body.data as PortfolioData);
          }
        }
      } catch {
        // ignore, fall back to default
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [navigate]);

  const savePortfolio = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsSaving(true);
    try {
      await fetch("http://localhost:4000/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
    } catch {
      // could surface an error UI later
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setData((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    setData((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  const simulateUpload = () => {
    setUploadedFile("resume_alex_johnson.pdf");
    // Auto-fill with mock extracted resume data
    setTimeout(() => {
      setData({
        name: "Alex Johnson",
        title: "Full-Stack Developer & UI Designer",
        about: "Passionate developer with 5+ years of experience building modern web applications. I specialize in React, TypeScript, and Node.js, crafting elegant solutions that bridge design and engineering.",
        skills: ["React", "TypeScript", "Node.js", "Python", "Figma", "AWS", "GraphQL", "TailwindCSS", "Docker", "PostgreSQL"],
        projects: [
          { title: "CloudSync Dashboard", description: "Real-time data visualization dashboard for cloud infrastructure monitoring.", tags: ["React", "D3.js", "WebSocket"], link: "#" },
          { title: "AI Content Studio", description: "AI-powered content creation platform for marketing copy.", tags: ["Next.js", "OpenAI", "Prisma"], link: "#" },
          { title: "FinTrack Mobile", description: "Personal finance tracker with budget analytics and bank integration.", tags: ["React Native", "Firebase", "Plaid"], link: "#" },
          { title: "DevCollab", description: "Collaborative code editor with real-time pair programming.", tags: ["WebRTC", "Monaco", "Socket.io"], link: "#" },
        ],
        experience: [
          { role: "Senior Frontend Engineer", company: "TechCorp Inc.", duration: "2022 - Present", description: "Leading frontend architecture for a SaaS platform serving 50K+ users." },
          { role: "Full-Stack Developer", company: "StartupXYZ", duration: "2020 - 2022", description: "Built and maintained client-facing applications using React and Node.js." },
          { role: "Junior Developer", company: "WebAgency", duration: "2018 - 2020", description: "Developed responsive websites and web applications for various clients." },
        ],
        education: [
          { degree: "B.S. Computer Science", school: "MIT", year: "2018" },
          { degree: "Full-Stack Bootcamp", school: "Codecademy", year: "2017" },
        ],
        socialLinks: [
          { platform: "GitHub", url: "https://github.com/alexjohnson" },
          { platform: "LinkedIn", url: "https://linkedin.com/in/alexjohnson" },
          { platform: "Twitter", url: "https://twitter.com/alexjohnson" },
        ],
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 pt-24 pb-16">
        <BackButton />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-3xl font-bold">Create Your Portfolio</h1>
          <p className="mb-8 text-muted-foreground">Upload your resume or fill in your details below.</p>
        </motion.div>

        {isLoading && (
          <div className="mb-10 text-sm text-muted-foreground">
            Loading your saved portfolio...
          </div>
        )}

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          {!uploadedFile ? (
            <div
              onClick={simulateUpload}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragOver(false); simulateUpload(); }}
              className={`glass-card flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ${isDragOver ? "border-primary bg-primary/5 scale-[1.02]" : "border-border/40 hover:border-primary/30 hover:bg-primary/[0.02]"}`}
            >
              <motion.div
                animate={isDragOver ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
              >
                <Upload className="h-8 w-8 text-primary" />
              </motion.div>
              <h3 className="mb-2 text-lg font-semibold">Upload Resume</h3>
              <p className="mb-4 text-sm text-muted-foreground">Drag & drop your PDF or DOCX file here, or click to browse</p>
              <Button variant="outline" className="gap-2 border-border/60">
                <FileText className="h-4 w-4" />
                Choose File
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card flex items-center gap-4 rounded-2xl border border-primary/30 p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Resume uploaded & parsed successfully!</p>
                <p className="text-xs text-muted-foreground">{uploadedFile} — All fields auto-filled from your resume</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setUploadedFile(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>

        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-border/50" />
          <span className="text-sm text-muted-foreground">or fill in manually</span>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {stepLabels.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setStep(i)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  i <= step
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/40 text-muted-foreground group-hover:border-primary/30"
                }`}>
                  {i < step ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <s.icon className="h-4 w-4" />
                  )}
                </div>
                <span className={`hidden text-xs sm:block ${i <= step ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-3 h-1 w-full rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${((step + 1) / stepLabels.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                  <User className="h-5 w-5 text-primary" /> Basic Info
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Full Name" className="h-11 bg-secondary/50 border-border/40" />
                  <Input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder="Professional Title" className="h-11 bg-secondary/50 border-border/40" />
                </div>
                <Textarea value={data.about} onChange={(e) => setData({ ...data, about: e.target.value })} placeholder="Tell us about yourself..." rows={5} className="bg-secondary/50 border-border/40" />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                  <Briefcase className="h-5 w-5 text-primary" /> Experience
                </h2>
                {data.experience.map((exp, i) => (
                  <div key={i} className="glass-card rounded-xl p-4 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Input value={exp.role} onChange={(e) => { const u = [...data.experience]; u[i] = { ...exp, role: e.target.value }; setData({ ...data, experience: u }); }} placeholder="Role" className="bg-secondary/50 border-border/40" />
                      <Input value={exp.company} onChange={(e) => { const u = [...data.experience]; u[i] = { ...exp, company: e.target.value }; setData({ ...data, experience: u }); }} placeholder="Company" className="bg-secondary/50 border-border/40" />
                      <Input value={exp.duration} onChange={(e) => { const u = [...data.experience]; u[i] = { ...exp, duration: e.target.value }; setData({ ...data, experience: u }); }} placeholder="Duration" className="bg-secondary/50 border-border/40" />
                    </div>
                    <Textarea value={exp.description} onChange={(e) => { const u = [...data.experience]; u[i] = { ...exp, description: e.target.value }; setData({ ...data, experience: u }); }} placeholder="Description" rows={2} className="bg-secondary/50 border-border/40" />
                  </div>
                ))}
                <h2 className="mt-8 mb-4 flex items-center gap-2 text-xl font-semibold">
                  <GraduationCap className="h-5 w-5 text-primary" /> Education
                </h2>
                {data.education.map((edu, i) => (
                  <div key={i} className="glass-card rounded-xl p-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Input value={edu.degree} onChange={(e) => { const u = [...data.education]; u[i] = { ...edu, degree: e.target.value }; setData({ ...data, education: u }); }} placeholder="Degree" className="bg-secondary/50 border-border/40" />
                      <Input value={edu.school} onChange={(e) => { const u = [...data.education]; u[i] = { ...edu, school: e.target.value }; setData({ ...data, education: u }); }} placeholder="School" className="bg-secondary/50 border-border/40" />
                      <Input value={edu.year} onChange={(e) => { const u = [...data.education]; u[i] = { ...edu, year: e.target.value }; setData({ ...data, education: u }); }} placeholder="Year" className="bg-secondary/50 border-border/40" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <Code className="h-5 w-5 text-primary" /> Skills
                  </h2>
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill..."
                      className="h-11 bg-secondary/50 border-border/40"
                    />
                    <Button onClick={addSkill} size="icon" className="h-11 w-11 bg-primary text-primary-foreground">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                      >
                        {skill}
                        <button onClick={() => removeSkill(i)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <Sparkles className="h-5 w-5 text-primary" /> Projects
                  </h2>
                  {data.projects.map((proj, i) => (
                    <div key={i} className="glass-card mb-3 rounded-xl p-4 space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Input value={proj.title} onChange={(e) => { const u = [...data.projects]; u[i] = { ...proj, title: e.target.value }; setData({ ...data, projects: u }); }} placeholder="Project Title" className="bg-secondary/50 border-border/40" />
                        <Input value={proj.link} onChange={(e) => { const u = [...data.projects]; u[i] = { ...proj, link: e.target.value }; setData({ ...data, projects: u }); }} placeholder="Project URL" className="bg-secondary/50 border-border/40" />
                      </div>
                      <Textarea value={proj.description} onChange={(e) => { const u = [...data.projects]; u[i] = { ...proj, description: e.target.value }; setData({ ...data, projects: u }); }} placeholder="Description" rows={2} className="bg-secondary/50 border-border/40" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                  <LinkIcon className="h-5 w-5 text-primary" /> Social Links
                </h2>
                {data.socialLinks.map((link, i) => (
                  <div key={i} className="grid gap-3 sm:grid-cols-2">
                    <Input value={link.platform} onChange={(e) => { const u = [...data.socialLinks]; u[i] = { ...link, platform: e.target.value }; setData({ ...data, socialLinks: u }); }} placeholder="Platform" className="bg-secondary/50 border-border/40" />
                    <Input value={link.url} onChange={(e) => { const u = [...data.socialLinks]; u[i] = { ...link, url: e.target.value }; setData({ ...data, socialLinks: u }); }} placeholder="URL" className="bg-secondary/50 border-border/40" />
                  </div>
                ))}

                {/* Slug Preview */}
                <div className="glass-card rounded-xl p-4 border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Your portfolio URL</p>
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="text-muted-foreground">{data.name.toLowerCase().replace(/\s+/g, "")}.portgen.ai</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-10 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="gap-2 border-border/60"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {step < stepLabels.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={async () => {
                await savePortfolio();
                navigate("/templates");
              }}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 gap-2 disabled:opacity-70"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Generate Portfolio"}
              <Sparkles className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Analytics & Technical Overview */}
        <div className="mt-16 border-t border-border/30 pt-12 space-y-12">
          <AnalyticsMock />
          <TechnicalOverview />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
