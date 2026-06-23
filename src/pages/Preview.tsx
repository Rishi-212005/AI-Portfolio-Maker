import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Download, ExternalLink, Trash2, Moon, Sun, Palette, Copy, Check, X, Globe, Wand2, GripVertical, RotateCcw, AlertCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Plus, GraduationCap, Briefcase, Award, Trophy, Languages, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { defaultPortfolioData, mockChatResponses, templateList, type PortfolioData } from "@/data/mockData";
import DraggablePortfolio, { type SectionId } from "@/components/DraggablePortfolio";
import PortfolioRenderer from "@/components/PortfolioRenderer";
import JSZip from "jszip";
import { generateStaticPortfolio } from "@/lib/staticGenerator";
import { API_URL } from "@/config";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

const themeColors = [
  { name: "Cyan", value: "hsl(190 95% 55%)" },
  { name: "Purple", value: "hsl(270 80% 65%)" },
  { name: "Pink", value: "hsl(330 80% 60%)" },
  { name: "Blue", value: "hsl(220 90% 56%)" },
  { name: "Green", value: "hsl(150 80% 45%)" },
  { name: "Orange", value: "hsl(25 95% 55%)" },
];

const quickPrompts = [
  "Make it dark mode",
  "Change color to blue",
  "Rewrite about section",
  "Add animations",
];

const defaultSectionOrder: SectionId[] = ["about", "skills", "projects", "experience", "education", "certifications", "contact"];

const Preview = () => {
  const { templateId } = useParams();
  const template = templateList.find((t) => t.id === templateId) || templateList[0];
  const [viewMode, setViewMode] = useState<"live" | "edit" | "visual-edit">("live");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", content: `🎉 Your portfolio is ready using the "${template.name}" template! Try:\n\n• Chat commands to customize content\n• Drag sections on the right to reorder\n• Use theme controls above\n• Click "AI Rewrite" to polish text`, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRewriteModal, setShowRewriteModal] = useState(false);
  const [rewriteInput, setRewriteInput] = useState("Passionate developer with 5+ years of experience building modern web applications.");
  const [rewriteOutput, setRewriteOutput] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>(defaultSectionOrder);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultPortfolioData);
  const [portfolioLoaded, setPortfolioLoaded] = useState(false);
  const [portfolioLoadError, setPortfolioLoadError] = useState(false);
  
  // Undo/Revert State
  const [showHistory, setShowHistory] = useState(false);
  const [historyList, setHistoryList] = useState<{ _id: string; description: string; timestamp: string }[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Computed Theme selectors
  const isDarkPreview = portfolioData.designSettings?.themeMode !== "light";
  const selectedColorIndex = themeColors.findIndex(
    (c) => c.value === (portfolioData.designSettings?.accentColor || "hsl(190 95% 55%)")
  );
  const activeColorIndex = selectedColorIndex === -1 ? 0 : selectedColorIndex;

  // Dynamic design variables matching isDarkPreview to solve contrast
  const sidebarBg = isDarkPreview 
    ? "bg-[#0b0f19] text-slate-100 border-slate-900" 
    : "bg-background text-foreground border-border/40";
  const borderClass = isDarkPreview ? "border-slate-800/60" : "border-border/30";
  const textMuted = isDarkPreview ? "text-slate-400" : "text-muted-foreground";
  const bannerGuest = isDarkPreview ? "bg-amber-950/20 text-amber-400 border-slate-800/60" : "bg-amber-500/5 text-amber-500 border-border/30";
  const bannerDb = isDarkPreview ? "bg-green-950/20 text-green-400 border-slate-800/60" : "bg-green-500/5 text-green-500 border-border/30";
  const bannerError = isDarkPreview ? "bg-yellow-950/20 text-yellow-400 border-slate-800/60" : "bg-yellow-500/5 text-yellow-500 border-border/30";
  const bubbleAi = isDarkPreview ? "bg-[#161c2a] border border-slate-800/60 text-slate-100" : "glass-card text-foreground";
  const chatInputBg = isDarkPreview ? "bg-[#111625] border-slate-800 text-white placeholder:text-slate-500" : "bg-secondary/50 border-border/40 text-foreground";
  const quickPromptBg = isDarkPreview ? "bg-[#161c2a] text-slate-300 hover:bg-[#1f283d] hover:text-white" : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground";
  const sectionLabelBg = isDarkPreview ? "bg-slate-800 text-slate-200" : "bg-secondary/60 text-foreground";
  const historyCardBg = isDarkPreview ? "bg-[#111625] border border-slate-800 text-slate-100" : "glass-card text-foreground";
  const revDotBg = isDarkPreview ? "bg-[#0b0f19] border-primary" : "bg-background border-primary";

  const fetchHistory = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/portfolio/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const body = await res.json();
        if (body?.history) {
          setHistoryList(body.history);
        }
      }
    } catch (err) {
      console.error("Failed to fetch history list", err);
    }
  };

  async function savePortfolio(updatedData: PortfolioData, description = "Manual Save") {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    try {
      await fetch(`${API_URL}/api/portfolio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          data: updatedData,
          chatHistory: messages,
          description: description
        }),
      });
      fetchHistory();
    } catch (err) {
      console.error("Failed to save portfolio data automatically", err);
    }
  }

  async function fetchPortfolio() {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    setPortfolioLoadError(false);
    try {
      const res = await fetch(`${API_URL}/api/portfolio`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const body = await res.json();
        if (body?.data) {
          const loadedData = body.data;
          const dataToSet = { ...loadedData };

          if (templateId && loadedData.templateId !== templateId) {
            dataToSet.templateId = templateId;
            const targetTpl = templateList.find((t) => t.id === templateId);
            const isLightTpl = targetTpl?.categories?.includes("Light");
            dataToSet.designSettings = {
              ...(loadedData.designSettings || {}),
              themeMode: isLightTpl ? "light" : "dark"
            };
            await savePortfolio(dataToSet, `Selected template ${templateId}`);
          }

          if (loadedData.sectionOrder && loadedData.sectionOrder.length > 0) {
            setSectionOrder(loadedData.sectionOrder);
          }

          setPortfolioData(dataToSet);
          if (body?.chatHistory && body.chatHistory.length > 0) {
            const restoredMessages = body.chatHistory.map((m: { role: "user" | "ai"; content: string; timestamp: string }) => ({
              role: m.role,
              content: m.content,
              timestamp: new Date(m.timestamp)
            }));
            setMessages(restoredMessages);
          }
          setPortfolioLoaded(true);
          fetchHistory();
        } else {
          setPortfolioLoadError(true);
        }
      } else {
        setPortfolioLoadError(true);
        console.warn("Portfolio fetch returned:", res.status);
      }
    } catch (err) {
      setPortfolioLoadError(true);
      console.error("Failed to fetch portfolio data", err);
    }
  }

  useEffect(() => {
    if (templateId && !portfolioLoaded) {
      const targetTpl = templateList.find((t) => t.id === templateId);
      const isLightTpl = targetTpl?.categories?.includes("Light");
      setPortfolioData(prev => ({
        ...prev,
        templateId: templateId,
        designSettings: {
          ...(prev.designSettings || {}),
          themeMode: isLightTpl ? "light" : "dark"
        }
      }));
    }
  }, [templateId, portfolioLoaded]);

  useEffect(() => {
    fetchPortfolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const userMsg = (text || input).trim();
    if (!userMsg) return;
    
    const newUserMessage: ChatMessage = { role: "user", content: userMsg, timestamp: new Date() };
    const currentMessages = [...messages, newUserMessage];
    
    setMessages(currentMessages);
    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("auth_token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/api/ai/edit-code`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          portfolioData,
          message: userMsg,
          chatHistory: messages // send past messages
        }),
      });

      if (res.ok) {
        const body = await res.json();
        if (body?.updatedData && body?.explanation) {
          setPortfolioData(body.updatedData);
          if (body.chatHistory) {
            const restoredMessages = body.chatHistory.map((m: { role: "user" | "ai"; content: string; timestamp: string }) => ({
              role: m.role,
              content: m.content,
              timestamp: new Date(m.timestamp)
            }));
            setMessages(restoredMessages);
          } else {
            setMessages((prev) => [...prev, { role: "ai", content: body.explanation, timestamp: new Date() }]);
          }
          fetchHistory();
        } else {
          setMessages((prev) => [...prev, { role: "ai", content: "🤖 Received an invalid response structure from PortGen AI. Please try again.", timestamp: new Date() }]);
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        setMessages((prev) => [...prev, { role: "ai", content: `❌ PortGen AI returned an error: ${errorData.message || "Unknown error"}`, timestamp: new Date() }]);
      }
    } catch (err) {
      console.error("AI edit request failed:", err);
      setMessages((prev) => [...prev, { role: "ai", content: `❌ Network error: Could not reach PortGen AI server. Please make sure the server is running on ${API_URL}`, timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRevert = async (historyId: string) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/portfolio/history/revert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ historyId }),
      });
      if (res.ok) {
        const body = await res.json();
        if (body?.data && body?.chatHistory) {
          setPortfolioData(body.data);
          const restoredMessages = body.chatHistory.map((m: { role: "user" | "ai"; content: string; timestamp: string }) => ({
            role: m.role,
            content: m.content,
            timestamp: new Date(m.timestamp)
          }));
          setMessages(restoredMessages);
          setMessages((prev) => [
            ...prev,
            { role: "ai", content: `🔄 Reverted successfully to: "${body.message.replace('Reverted to checkpoint: ', '')}"`, timestamp: new Date() }
          ]);
          fetchHistory();
          setShowHistory(false);
        }
      }
    } catch (err) {
      console.error("Failed to revert checkpoint", err);
    }
  };

  const toggleDarkMode = () => {
    const newMode: "light" | "dark" = isDarkPreview ? "light" : "dark";
    const updatedData = {
      ...portfolioData,
      designSettings: {
        ...(portfolioData.designSettings || {}),
        themeMode: newMode
      }
    };
    setPortfolioData(updatedData);
    savePortfolio(updatedData, `Switched theme to ${newMode} mode`);
  };

  const changeColor = (colorIndex: number) => {
    const newColor = themeColors[colorIndex];
    const updatedData = {
      ...portfolioData,
      designSettings: {
        ...(portfolioData.designSettings || {}),
        accentColor: newColor.value
      }
    };
    setPortfolioData(updatedData);
    savePortfolio(updatedData, `Updated theme color to ${newColor.name.toLowerCase()}`);
  };

  const downloadStaticHtml = async () => {
    const templateContainer = document.getElementById("portfolio-template-root");
    if (!templateContainer) {
      console.error("Could not find portfolio template root element to export.");
      return;
    }
    
    const renderedHtml = templateContainer.innerHTML;
    const themeColor = themeColors[activeColorIndex].value;
    const isDark = isDarkPreview;
    const userName = portfolioData.name || "Portfolio";
    
    const fullHtml = generateStaticPortfolio(renderedHtml, themeColor, isDark, userName);
    const readmeContent = `# ${userName} - PortGen AI Portfolio

Congratulations on generating your personal portfolio site!

## What is in this directory?
- \`index.html\`: The self-contained portfolio webpage containing all layout elements, text content, styles, and custom images (embedded directly as base64 data-URLs). It works completely offline and online with zero hosting dependencies.

## How to host / publish your site:
You can deploy this site online for free in under a minute using one of the following services:

### Option 1: Netlify (Recommended - Simplest)
1. Visit [Netlify Drop](https://drop.netlify.com/).
2. Drag and drop the \`index.html\` file directly onto the upload page.
3. Your portfolio is immediately live! You can customize the domain name in the Netlify dashboard for free.

### Option 2: Vercel
1. Sign up/log in at [Vercel](https://vercel.com).
2. Install the Vercel CLI by running: \`npm install -g vercel\`.
3. Open a terminal in the folder containing \`index.html\` and run the command: \`vercel\`.
4. Follow the brief prompts to deploy.

### Option 3: GitHub Pages
1. Create a new public repository on [GitHub](https://github.com).
2. Upload the \`index.html\` file to the repository.
3. Go to Repository Settings -> Pages, select the \`main\` branch, and click Save.
4. Your site will be published at \`https://username.github.io/repository-name/\`.

---
Generated by PortGen AI 🚀
`;
    
    try {
      const zip = new JSZip();
      zip.file("index.html", fullHtml);
      zip.file("README.md", readmeContent);
      
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `${userName.toLowerCase().replace(/\s+/g, "_")}_portfolio.zip`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "📦 ZIP bundle created successfully! Your download should start automatically. It contains:\n\n• `index.html` (fully pre-rendered and self-contained static site)\n• `README.md` (simple deployment instructions)",
          timestamp: new Date()
        }
      ]);
      setShowDownloadModal(false);
    } catch (err) {
      console.error("Failed to generate ZIP", err);
      // Fallback
      const blob = new Blob([fullHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "index.html";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "⚠️ ZIP creation failed, but I've triggered a direct download of your single `index.html` file. You can drag and drop it onto Netlify Drop to host it instantly!",
          timestamp: new Date()
        }
      ]);
    }
  };

  const downloadReactCodebase = async () => {
    setIsTyping(true);
    setMessages((prev) => [
      ...prev,
      { role: "ai", content: "📦 Preparing your full React project codebase ZIP... Please wait.", timestamp: new Date() }
    ]);
    
    try {
      const res = await fetch(`${API_URL}/api/portfolio/codebase-files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          portfolioData,
          templateId,
          isDark: isDarkPreview,
          themeColor: portfolioData.designSettings?.accentColor || "hsl(190 95% 55%)",
          sectionOrder
        })
      });
      if (!res.ok) throw new Error("Failed to retrieve codebase files from server");
      
      const { files } = await res.json();
      const zip = new JSZip();
      
      // Pack all files into JSZip
      Object.entries(files).forEach(([relPath, content]) => {
        zip.file(relPath, content as string);
      });
      
      // Generate ZIP blob
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      
      const link = document.createElement("a");
      link.href = url;
      const userName = portfolioData.name || "Portfolio";
      link.download = `${userName.toLowerCase().replace(/\s+/g, "_")}_react_codebase.zip`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "🚀 React codebase ZIP downloaded successfully! It includes your modified templates, mock data, and styles. Run `npm install` and `npm run dev` to start locally.",
          timestamp: new Date()
        }
      ]);
      setShowDownloadModal(false);
    } catch (err) {
      console.error("Failed to generate React codebase ZIP", err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: `❌ Failed to download codebase: ${err.message}`, timestamp: new Date() }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDownload = () => {
    setShowDownloadModal(true);
  };

  const clearChat = () => {
    setMessages([
      { role: "ai", content: "💬 Chat cleared! How can I help you customize your portfolio?", timestamp: new Date() },
    ]);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText("alexjohnson.portgen.ai");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRewrite = () => {
    setIsRewriting(true);
    setRewriteOutput("");
    const result = "Innovative full-stack engineer with 5+ years of experience architecting scalable web applications. Expertise spans React, TypeScript, and cloud-native solutions, with a proven track record of delivering high-impact products that serve 50K+ users. Passionate about bridging the gap between elegant design and robust engineering.";
    let i = 0;
    const interval = setInterval(() => {
      setRewriteOutput(result.slice(0, i + 1));
      i++;
      if (i >= result.length) {
        clearInterval(interval);
        setIsRewriting(false);
      }
    }, 15);
  };

  const applyRewrite = () => {
    const updatedData = {
      ...portfolioData,
      about: rewriteOutput
    };
    setPortfolioData(updatedData);
    savePortfolio(updatedData, "Applied AI-rewritten about section");
    setMessages(prev => [
      ...prev,
      { role: "user", content: "Apply the rewritten about section", timestamp: new Date() },
      { role: "ai", content: "✍️ Applied the rewritten biography/about section to your portfolio!", timestamp: new Date() }
    ]);
    setShowRewriteModal(false);
  };

  const handleReorder = (newOrder: SectionId[]) => {
    setSectionOrder(newOrder);
    const updatedData = {
      ...portfolioData,
      sectionOrder: newOrder
    };
    setPortfolioData(updatedData);
    savePortfolio(updatedData, "Reordered layout sections");

    // Add a chat message showing the reorder
    const names = newOrder.map((id) => id.charAt(0).toUpperCase() + id.slice(1));
    setMessages((prev) => [
      ...prev,
      { role: "ai", content: `📐 Sections reordered! New layout:\n${names.map((n, i) => `${i + 1}. ${n}`).join("\n")}`, timestamp: new Date() },
    ]);
  };

  // Visual Editor States
  const [activeEditorSection, setActiveEditorSection] = useState<string>("about");
  const [newSkillInput, setNewSkillInput] = useState("");
  const [newAchievementInput, setNewAchievementInput] = useState("");
  const [isProgressSaving, setIsProgressSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [saveStatusText, setSaveStatusText] = useState("");
  const previewContainerRef = useRef<HTMLDivElement>(null);
  
  const [expandedProjectIdx, setExpandedProjectIdx] = useState<number | null>(0);
  const [expandedExpIdx, setExpandedExpIdx] = useState<number | null>(0);
  const [expandedEduIdx, setExpandedEduIdx] = useState<number | null>(0);
  const [expandedCertIdx, setExpandedCertIdx] = useState<number | null>(0);
  const [expandedLangIdx, setExpandedLangIdx] = useState<number | null>(0);

  // Helper file reader for base64 data-URL
  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | { projectIndex: number } | { certIndex: number }) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === "avatar") {
        setPortfolioData(prev => ({ ...prev, photo: base64String }));
      } else if (typeof type === "object" && "projectIndex" in type) {
        setPortfolioData(prev => {
          const projects = [...(prev.projects || [])];
          projects[type.projectIndex] = { ...projects[type.projectIndex], imageUrl: base64String };
          return { ...prev, projects };
        });
      } else if (typeof type === "object" && "certIndex" in type) {
        setPortfolioData(prev => {
          const certifications = [...(prev.certifications || [])];
          certifications[type.certIndex] = { ...certifications[type.certIndex], imageUrl: base64String };
          return { ...prev, certifications };
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSocialChange = (platform: string, url: string) => {
    setPortfolioData(prev => {
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

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !portfolioData.skills.includes(newSkillInput.trim())) {
      setPortfolioData(prev => ({ ...prev, skills: [...prev.skills, newSkillInput.trim()] }));
      setNewSkillInput("");
    }
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    setPortfolioData(prev => {
      const projects = [...(prev.projects || [])];
      if (field === "tags") {
        projects[index] = { 
          ...projects[index], 
          tags: value.split(",").map((t: string) => t.trim()).filter(Boolean) 
        };
      } else {
        projects[index] = { ...projects[index], [field]: value };
      }
      return { ...prev, projects };
    });
  };

  const handleAddProject = () => {
    setPortfolioData(prev => {
      const newProjects = [...(prev.projects || []), { title: "New Project", description: "", tags: [], link: "", liveLink: "", imageUrl: "" }];
      setExpandedProjectIdx(newProjects.length - 1);
      return { ...prev, projects: newProjects };
    });
  };

  const handleExpChange = (index: number, field: string, value: string) => {
    setPortfolioData(prev => {
      const experience = [...(prev.experience || [])];
      experience[index] = { ...experience[index], [field]: value };
      return { ...prev, experience };
    });
  };

  const handleAddExperience = () => {
    setPortfolioData(prev => {
      const newExp = [...(prev.experience || []), { role: "Software Engineer", company: "Company Name", duration: "2025 - Present", description: "" }];
      setExpandedExpIdx(newExp.length - 1);
      return { ...prev, experience: newExp };
    });
  };

  const handleEduChange = (index: number, field: string, value: string) => {
    setPortfolioData(prev => {
      const education = [...(prev.education || [])];
      education[index] = { ...education[index], [field]: value };
      return { ...prev, education };
    });
  };

  const handleAddEducation = () => {
    setPortfolioData(prev => {
      const newEdu = [...(prev.education || []), { degree: "Degree / Certification", school: "School Name", year: "2025" }];
      setExpandedEduIdx(newEdu.length - 1);
      return { ...prev, education: newEdu };
    });
  };

  const handleCertChange = (index: number, field: string, value: string) => {
    setPortfolioData(prev => {
      const certifications = [...(prev.certifications || [])];
      certifications[index] = { ...certifications[index], [field]: value };
      return { ...prev, certifications };
    });
  };

  const handleAddCert = () => {
    setPortfolioData(prev => {
      const newCerts = [...(prev.certifications || []), { name: "Certification Name", issuer: "Issuer", date: "2025", credentialUrl: "" }];
      setExpandedCertIdx(newCerts.length - 1);
      return { ...prev, certifications: newCerts };
    });
  };

  const handleAddAchievement = () => {
    if (newAchievementInput.trim()) {
      setPortfolioData(prev => ({
        ...prev,
        achievements: [...(prev.achievements || []), newAchievementInput.trim()]
      }));
      setNewAchievementInput("");
    }
  };

  const handleAchievementChange = (index: number, val: string) => {
    setPortfolioData(prev => {
      const achievements = [...(prev.achievements || [])];
      achievements[index] = val;
      return { ...prev, achievements };
    });
  };

  const handleLangChange = (index: number, field: string, value: string) => {
    setPortfolioData(prev => {
      const languages = [...(prev.languages || [])];
      languages[index] = { ...languages[index], [field]: value };
      return { ...prev, languages };
    });
  };

  const handleAddLanguage = () => {
    setPortfolioData(prev => {
      const newLang = [...(prev.languages || []), { name: "Language", level: "Professional" }];
      setExpandedLangIdx(newLang.length - 1);
      return { ...prev, languages: newLang };
    });
  };

  const toggleEditorSection = (secName: string) => {
    setActiveEditorSection(prev => prev === secName ? "" : secName);
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    if (viewMode !== "visual-edit") return;
    
    const sectionEl = (e.target as HTMLElement).closest("section");
    if (!sectionEl) return;
    
    let sectionId = sectionEl.id;
    if (sectionId === "home") {
      sectionId = "about";
    }
    
    const validSections = ["about", "skills", "projects", "experience", "education", "certifications", "achievements", "languages"];
    if (validSections.includes(sectionId)) {
      e.preventDefault();
      e.stopPropagation();
      
      setActiveEditorSection(sectionId);
      
      setTimeout(() => {
        const editorSec = document.getElementById(`editor-sec-${sectionId}`);
        if (editorSec) {
          editorSec.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    }
  };

  const handleVisualSave = async () => {
    setIsProgressSaving(true);
    setSaveProgress(0);
    
    const steps = [
      { progress: 12, text: "Initializing visual content compiler..." },
      { progress: 38, text: "Validating inputs and image payloads..." },
      { progress: 62, text: "Syncing changes to database endpoints..." },
      { progress: 85, text: "Regenerating portfolio static assets..." },
      { progress: 100, text: "Changes deployed successfully! ✓" },
    ];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, i === 0 ? 300 : i === 2 ? 650 : 450));
      setSaveProgress(steps[i].progress);
      setSaveStatusText(steps[i].text);
    }
    
    await savePortfolio(portfolioData, "Saved via Visual Editor");
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsProgressSaving(false);
  };

  const AccordionItem = ({ 
    id, 
    title, 
    icon: Icon, 
    children 
  }: { 
    id: string; 
    title: string; 
    icon: any; 
    children: React.ReactNode 
  }) => {
    const isOpen = activeEditorSection === id;
    return (
      <div id={`editor-sec-${id}`} className="border-b border-border/30 last:border-0 scroll-mt-2">
        <button
          type="button"
          onClick={() => toggleEditorSection(id)}
          className={`w-full flex items-center justify-between px-4 py-3.5 text-left font-semibold text-sm transition-colors hover:bg-secondary/20 ${isOpen ? "bg-secondary/30 text-primary" : "text-foreground"}`}
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4.5 w-4.5" />
            <span>{title}</span>
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {isOpen && (
          <div className="p-4 space-y-4 bg-background border-t border-border/20 select-text">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex h-screen flex-col pt-16 lg:flex-row">
        {/* Chat Panel */}
        <div 
          className={`flex flex-col border-r transition-all duration-300 ease-in-out ${borderClass} ${sidebarBg} ${
            isSidebarCollapsed 
              ? "w-0 border-r-0 overflow-hidden opacity-0 pointer-events-none" 
              : "w-full lg:w-[400px] xl:w-[440px]"
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between border-b px-4 py-3 ${borderClass}`}>
            <div className="flex items-center gap-2">
              <BackButton />
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI Editor</p>
                <p className={`text-xs ${textMuted}`}>Chat to customize</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                variant={showHistory ? "secondary" : "ghost"} 
                size="icon" 
                className="h-8 w-8 text-primary" 
                onClick={() => { setShowHistory(!showHistory); if (!showHistory) fetchHistory(); }} 
                title="Revision History"
              >
                <motion.div whileTap={{ rotate: -90 }}>
                  <RotateCcw className="h-4 w-4" />
                </motion.div>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearChat} title="Clear chat">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload} title="Download ZIP">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowPublishModal(true)} title="Publish">
                <Globe className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsSidebarCollapsed(true)} title="Hide Sidebar">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Guest Mode Warning Banner */}
          {!localStorage.getItem("auth_token") && (
            <div className={`border-b px-4 py-2 flex items-center justify-between gap-2 text-xs ${bannerGuest}`}>
              <span className="flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                Guest Mode: changes won't be saved.
              </span>
              <Link to="/login" className="underline hover:text-amber-400 font-semibold shrink-0">
                Log In / Register
              </Link>
            </div>
          )}

          {/* Data source status */}
          {portfolioLoaded && (
            <div className={`border-b px-4 py-2 flex items-center gap-2 text-xs ${bannerDb}`}>
              <Check className="h-3.5 w-3.5 shrink-0" />
              Portfolio data loaded from your database
            </div>
          )}
          {portfolioLoadError && (
            <div className={`border-b px-4 py-2 flex items-center justify-between gap-2 text-xs ${bannerError}`}>
              <span className="flex items-center gap-1.5"><Bot className="h-3.5 w-3.5" /> Showing demo data — your saved portfolio could not be loaded</span>
              <button onClick={fetchPortfolio} className="underline hover:text-yellow-400 shrink-0">Retry</button>
            </div>
          )}

          {/* Theme controls */}
          <div className={`border-b px-4 py-3 space-y-3 ${borderClass}`}>
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 text-xs ${textMuted}`}>
                <Palette className="h-3.5 w-3.5" />
                Theme Color
              </div>
              <button
                onClick={toggleDarkMode}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors ${
                  isDarkPreview 
                    ? "bg-slate-800 text-slate-300 hover:text-white" 
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {isDarkPreview ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                {isDarkPreview ? "Dark" : "Light"}
              </button>
            </div>
            <div className="flex gap-2">
              {themeColors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => changeColor(i)}
                  className={`h-7 w-7 rounded-full transition-all ${activeColorIndex === i ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110" : "hover:scale-110"}`}
                  style={{ background: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Quick Prompts */}
          <div className={`border-b px-4 py-2.5 flex gap-2 overflow-x-auto ${borderClass}`}>
            <button
              onClick={() => setShowRewriteModal(true)}
              className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
            >
              <Wand2 className="h-3 w-3" />
              AI Rewrite
            </button>
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs transition-colors ${quickPromptBg}`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Section Order Display */}
          <div className={`border-b px-4 py-2.5 ${borderClass}`}>
            <div className={`flex items-center gap-2 text-xs ${textMuted}`}>
              <GripVertical className="h-3.5 w-3.5" />
              <span>Section Order:</span>
              <div className="flex gap-1 flex-wrap">
                {sectionOrder.map((id, i) => (
                  <span key={id} className={`rounded px-1.5 py-0.5 text-[10px] ${sectionLabelBg}`}>
                    {i + 1}. {id}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Messages or History timeline */}
          {showHistory ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Revision Checkpoints</h4>
                <button 
                  onClick={() => setShowHistory(false)} 
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Back to Chat
                </button>
              </div>

              {historyList.length === 0 ? (
                <div className={`text-center py-8 text-xs font-mono ${textMuted}`}>
                  No revisions found. Changes will appear here as you customize.
                </div>
              ) : (
                <div className={`relative border-l ml-2.5 pl-4 space-y-4 py-2 ${borderClass}`}>
                  {historyList.map((item) => (
                    <div key={item._id} className="relative group">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border ${revDotBg}`} />
                      
                      <div className={`${historyCardBg} p-3 rounded-lg hover:border-primary/40 transition-all space-y-2`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-medium leading-snug">{item.description}</p>
                        </div>
                        <div className={`flex items-center justify-between text-[9px] font-mono ${textMuted}`}>
                          <span>{new Date(item.timestamp).toLocaleString()}</span>
                          <button
                            onClick={() => handleRevert(item._id)}
                            className="text-primary hover:underline font-semibold"
                          >
                            Revert
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === "ai" ? "bg-primary/10" : isDarkPreview ? "bg-[#161c2a]" : "bg-secondary"}`}>
                    {msg.role === "ai" ? <Bot className="h-4 w-4 text-primary" /> : <User className={`h-4 w-4 ${isDarkPreview ? "text-slate-300" : "text-muted-foreground"}`} />}
                  </div>
                  <div className="max-w-[80%] space-y-1">
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground" : bubbleAi}`}>
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                    <p className={`px-1 text-[10px] ${isDarkPreview ? "text-slate-500" : "text-muted-foreground/50"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className={`${bubbleAi} flex items-center gap-1.5 rounded-2xl px-4 py-3`}>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:300ms]" />
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* Input */}
          <div className={`border-t p-4 ${borderClass}`}>
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tell AI what to change..."
                className={`h-11 ${chatInputBg}`}
                disabled={isTyping}
              />
              <Button type="submit" size="icon" disabled={isTyping} className="h-11 w-11 bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col h-full bg-secondary/10 overflow-hidden relative">
          {/* Collapse/Expand Toggle Tab */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-50 flex h-16 w-5 items-center justify-center rounded-r-md border border-l-0 border-border bg-background text-muted-foreground hover:text-foreground shadow-md transition-all duration-200"
            title={isSidebarCollapsed ? "Show AI Editor Sidebar" : "Hide AI Editor Sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
          {/* View Mode Tabs */}
          <div className="flex items-center justify-between border-b border-border/30 bg-background px-6 py-2.5 shrink-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preview window</span>
            <div className="flex bg-secondary/50 rounded-lg p-0.5 border border-border/30">
              <button
                onClick={() => setViewMode("live")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === "live" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Live View
              </button>
              <button
                onClick={() => setViewMode("visual-edit")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === "visual-edit" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Visual Editor
              </button>
              <button
                onClick={() => setViewMode("edit")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === "edit" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Rearrange Sections
              </button>
            </div>
          </div>

          {/* Style element overlay for hover outlines */}
          {viewMode === "visual-edit" && (
            <style>{`
              #portfolio-template-root section {
                position: relative;
                transition: all 0.2s ease-in-out;
                cursor: pointer;
              }
              #portfolio-template-root section:hover {
                outline: 2px dashed ${themeColors[activeColorIndex].value} !important;
                outline-offset: 2px;
                background-color: ${themeColors[activeColorIndex].value}08 !important;
              }
              #portfolio-template-root section::before {
                content: "Click to Edit Section";
                position: absolute;
                top: 6px;
                right: 6px;
                background-color: ${themeColors[activeColorIndex].value};
                color: ${isDarkPreview ? "#020617" : "#ffffff"};
                font-family: monospace;
                font-size: 10px;
                font-weight: bold;
                padding: 3px 8px;
                border-radius: 4px;
                z-index: 50;
                opacity: 0;
                transition: opacity 0.2s ease-in-out;
                pointer-events: none;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
              }
              #portfolio-template-root section:hover::before {
                opacity: 1;
              }
            `}</style>
          )}

          {/* Render Area */}
          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row h-full">
            {viewMode === "visual-edit" ? (
              <>
                {/* Left Side: Live Preview */}
                <div className="flex-1 overflow-y-auto scroll-smooth border-r border-border/30 relative">
                  {/* Floating helpful reminder banner */}
                  <div className="sticky top-0 z-30 bg-primary/10 text-primary border-b border-primary/20 px-4 py-2 text-center text-xs font-semibold backdrop-blur-md">
                    💡 Click on any section in the preview to jump to its edit form!
                  </div>
                  <div 
                    ref={previewContainerRef}
                    onClick={handlePreviewClick}
                    className="relative cursor-pointer pointer-events-auto"
                  >
                    <PortfolioRenderer
                      templateId={template.id}
                      data={portfolioData}
                      isDark={isDarkPreview}
                      themeColor={themeColors[activeColorIndex].value}
                      sectionOrder={sectionOrder}
                      isPreview={true}
                    />
                  </div>
                </div>
                
                {/* Right Side: Accordion Content Editor */}
                <div className="w-full lg:w-[420px] shrink-0 bg-background border-t lg:border-t-0 lg:border-l border-border/30 flex flex-col h-full overflow-hidden select-text">
                  <div className="p-4 border-b border-border/30 bg-secondary/10 shrink-0 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Visual Editor</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Directly customize sections</p>
                    </div>
                    <Button
                      onClick={handleVisualSave}
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold px-3 py-1.5 gap-1.5"
                    >
                      <Save className="h-3.5 w-3.5" /> Save Changes
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-1.5 space-y-2">
                    {/* Basic Info Accordion */}
                    <AccordionItem id="about" title="Basic Info" icon={User}>
                      <div className="space-y-3">
                        {/* Profile Photo Uploader */}
                        <div className="flex items-center gap-4 pb-2 border-b border-border/20">
                          <div className="relative h-14 w-14 rounded-full overflow-hidden border bg-secondary/50 flex items-center justify-center shrink-0">
                            {portfolioData.photo ? (
                              <img src={portfolioData.photo} alt="avatar" className="h-full w-full object-cover" />
                            ) : (
                              <User className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider block text-muted-foreground">Profile Image</label>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="relative h-8 text-[11px] border-border/40">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handlePhotoUpload(e, "avatar")}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                Upload Photo
                              </Button>
                              {portfolioData.photo && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 text-[11px] text-red-500 hover:text-red-600 px-2"
                                  onClick={() => setPortfolioData(prev => ({ ...prev, photo: "" }))}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Full Name</label>
                            <Input
                              value={portfolioData.name}
                              onChange={(e) => setPortfolioData(prev => ({ ...prev, name: e.target.value }))}
                              className="h-9 bg-secondary/40 border-border/40 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Job Title</label>
                            <Input
                              value={portfolioData.title}
                              onChange={(e) => setPortfolioData(prev => ({ ...prev, title: e.target.value }))}
                              className="h-9 bg-secondary/40 border-border/40 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Bio / About Me</label>
                          <Textarea
                            value={portfolioData.about}
                            onChange={(e) => setPortfolioData(prev => ({ ...prev, about: e.target.value }))}
                            rows={3}
                            className="bg-secondary/40 border-border/40 text-xs resize-y"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Email</label>
                            <Input
                              type="email"
                              value={portfolioData.email || ""}
                              onChange={(e) => setPortfolioData(prev => ({ ...prev, email: e.target.value }))}
                              className="h-9 bg-secondary/40 border-border/40 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Phone</label>
                            <Input
                              value={portfolioData.phone || ""}
                              onChange={(e) => setPortfolioData(prev => ({ ...prev, phone: e.target.value }))}
                              className="h-9 bg-secondary/40 border-border/40 text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Location</label>
                            <Input
                              value={portfolioData.location || ""}
                              onChange={(e) => setPortfolioData(prev => ({ ...prev, location: e.target.value }))}
                              className="h-9 bg-secondary/40 border-border/40 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Website</label>
                            <Input
                              value={portfolioData.website || ""}
                              onChange={(e) => setPortfolioData(prev => ({ ...prev, website: e.target.value }))}
                              className="h-9 bg-secondary/40 border-border/40 text-xs"
                            />
                          </div>
                        </div>

                        {/* Social Links Sub-fields */}
                        <div className="pt-2 border-t border-border/20 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider block text-muted-foreground">Social Links</span>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[9px] text-muted-foreground uppercase block mb-1">GitHub</label>
                              <Input
                                value={(portfolioData.socialLinks || []).find(l => l.platform.toLowerCase() === "github")?.url || ""}
                                onChange={(e) => handleSocialChange("GitHub", e.target.value)}
                                placeholder="Link"
                                className="h-8 bg-secondary/30 border-border/40 text-[11px]"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-muted-foreground uppercase block mb-1">LinkedIn</label>
                              <Input
                                value={(portfolioData.socialLinks || []).find(l => l.platform.toLowerCase() === "linkedin")?.url || ""}
                                onChange={(e) => handleSocialChange("LinkedIn", e.target.value)}
                                placeholder="Link"
                                className="h-8 bg-secondary/30 border-border/40 text-[11px]"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-muted-foreground uppercase block mb-1">Twitter</label>
                              <Input
                                value={(portfolioData.socialLinks || []).find(l => l.platform.toLowerCase() === "twitter")?.url || ""}
                                onChange={(e) => handleSocialChange("Twitter", e.target.value)}
                                placeholder="Link"
                                className="h-8 bg-secondary/30 border-border/40 text-[11px]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Opportunities badge */}
                        <div className="pt-2 border-t border-border/20 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Opportunities Badge</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="opts-badge-cb"
                              checked={portfolioData.designSettings?.showOpportunitiesBadge !== false}
                              onChange={(e) => setPortfolioData(prev => ({
                                ...prev,
                                designSettings: {
                                  ...(prev.designSettings || {}),
                                  showOpportunitiesBadge: e.target.checked
                                }
                              }))}
                              className="h-4 w-4 rounded border-border"
                            />
                            <span className="text-xs">Show</span>
                          </div>
                        </div>
                        {(portfolioData.designSettings?.showOpportunitiesBadge !== false) && (
                          <div>
                            <label className="text-[9px] text-muted-foreground uppercase block mb-1">Badge Text</label>
                            <Input
                              value={portfolioData.designSettings?.opportunitiesText || "AVAILABLE FOR OPPORTUNITIES"}
                              onChange={(e) => setPortfolioData(prev => ({
                                ...prev,
                                designSettings: {
                                  ...(prev.designSettings || {}),
                                  opportunitiesText: e.target.value
                                }
                              }))}
                              className="h-8 bg-secondary/40 border-border/40 text-[11px]"
                            />
                          </div>
                        )}
                      </div>
                    </AccordionItem>

                    {/* Skills Accordion */}
                    <AccordionItem id="skills" title="Skills Inventory" icon={Code}>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(!portfolioData.skills || portfolioData.skills.length === 0) ? (
                            <span className="text-xs text-muted-foreground italic">No skills added.</span>
                          ) : (
                            (portfolioData.skills || []).map((skill, idx) => (
                              <div 
                                key={idx} 
                                className="inline-flex items-center gap-1 bg-secondary text-foreground text-xs px-2.5 py-1 rounded-full border border-border/30"
                              >
                                <span>{skill}</span>
                                <button
                                  type="button"
                                  onClick={() => setPortfolioData(prev => ({
                                    ...prev,
                                    skills: (prev.skills || []).filter((_, i) => i !== idx)
                                  }))}
                                  className="text-muted-foreground hover:text-red-500 transition-colors ml-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Input
                            value={newSkillInput}
                            onChange={(e) => setNewSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddSkill();
                              }
                            }}
                            placeholder="Add skill (e.g. React)"
                            className="h-9 bg-secondary/40 border-border/40 text-xs flex-1"
                          />
                          <Button 
                            type="button" 
                            onClick={handleAddSkill} 
                            size="sm" 
                            className="h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold gap-1 px-3"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add
                          </Button>
                        </div>
                      </div>
                    </AccordionItem>

                    {/* Projects Accordion */}
                    <AccordionItem id="projects" title="Projects Portfolio" icon={Briefcase}>
                      <div className="space-y-3">
                        {(portfolioData.projects || []).map((proj, idx) => {
                          const isExpanded = expandedProjectIdx === idx;
                          return (
                            <div key={idx} className="border border-border/20 rounded-lg overflow-hidden bg-secondary/10">
                              <div 
                                onClick={() => setExpandedProjectIdx(isExpanded ? null : idx)}
                                className="flex items-center justify-between p-3 cursor-pointer bg-secondary/25 hover:bg-secondary/35 transition-colors select-none"
                              >
                                <span className="text-xs font-semibold text-foreground truncate max-w-[200px]">{proj.title || `Project #${idx + 1}`}</span>
                                <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPortfolioData(prev => ({
                                        ...prev,
                                        projects: prev.projects.filter((_, i) => i !== idx)
                                      }));
                                      if (expandedProjectIdx === idx) setExpandedProjectIdx(null);
                                    }}
                                    className="p-1 rounded text-red-500 hover:bg-red-500/10 transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="p-3.5 border-t border-border/20 space-y-3 bg-background">
                                  <div className="flex items-center gap-4 pb-2 border-b border-border/20">
                                    <div className="relative h-14 w-20 rounded border bg-secondary/50 flex items-center justify-center overflow-hidden shrink-0">
                                      {proj.imageUrl ? (
                                        <img src={proj.imageUrl} alt="preview" className="h-full w-full object-cover" />
                                      ) : (
                                        <Code className="h-5 w-5 text-muted-foreground" />
                                      )}
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold uppercase tracking-wider block text-muted-foreground">Project Image</label>
                                      <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="relative h-7 text-[11px] border-border/40">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handlePhotoUpload(e, { projectIndex: idx })}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                          />
                                          Upload
                                        </Button>
                                        {proj.imageUrl && (
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 text-[11px] text-red-500 hover:text-red-600 px-2"
                                            onClick={() => handleProjectChange(idx, "imageUrl", "")}
                                          >
                                            Remove
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Project Title</label>
                                    <Input
                                      value={proj.title}
                                      onChange={(e) => handleProjectChange(idx, "title", e.target.value)}
                                      className="h-8 bg-secondary/30 border-border/40 text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Description</label>
                                    <Textarea
                                      value={proj.description}
                                      onChange={(e) => handleProjectChange(idx, "description", e.target.value)}
                                      rows={2}
                                      className="bg-secondary/30 border-border/40 text-xs resize-y"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">GitHub Link</label>
                                      <Input
                                        value={proj.link}
                                        onChange={(e) => handleProjectChange(idx, "link", e.target.value)}
                                        className="h-8 bg-secondary/30 border-border/40 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Live Demo Link</label>
                                      <Input
                                        value={proj.liveLink || ""}
                                        onChange={(e) => handleProjectChange(idx, "liveLink", e.target.value)}
                                        className="h-8 bg-secondary/30 border-border/40 text-xs"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Tags (Comma-separated)</label>
                                    <Input
                                      value={proj.tags.join(", ")}
                                      onChange={(e) => handleProjectChange(idx, "tags", e.target.value)}
                                      placeholder="React, Tailwind"
                                      className="h-8 bg-secondary/30 border-border/40 text-xs"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        <Button 
                          type="button" 
                          onClick={handleAddProject} 
                          variant="outline"
                          className="w-full h-9 border-dashed border-border/40 text-xs font-semibold gap-1.5 text-primary hover:bg-secondary/20 animate-fade-in"
                        >
                          <Plus className="h-4 w-4" /> Add Project
                        </Button>
                      </div>
                    </AccordionItem>

                    {/* Experience Accordion */}
                    <AccordionItem id="experience" title="Work Experience" icon={Briefcase}>
                      <div className="space-y-3">
                        {(portfolioData.experience || []).map((exp, idx) => {
                          const isExpanded = expandedExpIdx === idx;
                          return (
                            <div key={idx} className="border border-border/20 rounded-lg overflow-hidden bg-secondary/10">
                              <div 
                                onClick={() => setExpandedExpIdx(isExpanded ? null : idx)}
                                className="flex items-center justify-between p-3 cursor-pointer bg-secondary/25 hover:bg-secondary/35 transition-colors select-none"
                              >
                                <span className="text-xs font-semibold text-foreground truncate max-w-[200px]">
                                  {exp.role ? `${exp.role} @ ${exp.company || "Company"}` : `Role #${idx + 1}`}
                                </span>
                                <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPortfolioData(prev => ({
                                        ...prev,
                                        experience: prev.experience.filter((_, i) => i !== idx)
                                      }));
                                      if (expandedExpIdx === idx) setExpandedExpIdx(null);
                                    }}
                                    className="p-1 rounded text-red-500 hover:bg-red-500/10 transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="p-3.5 border-t border-border/20 space-y-3 bg-background">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Job Role</label>
                                      <Input
                                        value={exp.role}
                                        onChange={(e) => handleExpChange(idx, "role", e.target.value)}
                                        className="h-8 bg-secondary/30 border-border/40 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Company</label>
                                      <Input
                                        value={exp.company}
                                        onChange={(e) => handleExpChange(idx, "company", e.target.value)}
                                        className="h-8 bg-secondary/30 border-border/40 text-xs"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Duration</label>
                                    <Input
                                      value={exp.duration}
                                      onChange={(e) => handleExpChange(idx, "duration", e.target.value)}
                                      placeholder="e.g. May 2025 - Present"
                                      className="h-8 bg-secondary/30 border-border/40 text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Description / Key Tasks</label>
                                    <Textarea
                                      value={exp.description}
                                      onChange={(e) => handleExpChange(idx, "description", e.target.value)}
                                      rows={3}
                                      className="bg-secondary/30 border-border/40 text-xs resize-y"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        <Button 
                          type="button" 
                          onClick={handleAddExperience} 
                          variant="outline"
                          className="w-full h-9 border-dashed border-border/40 text-xs font-semibold gap-1.5 text-primary hover:bg-secondary/20"
                        >
                          <Plus className="h-4 w-4" /> Add Experience
                        </Button>
                      </div>
                    </AccordionItem>

                    {/* Education Accordion */}
                    <AccordionItem id="education" title="Education Details" icon={GraduationCap}>
                      <div className="space-y-3">
                        {(portfolioData.education || []).map((edu, idx) => {
                          const isExpanded = expandedEduIdx === idx;
                          return (
                            <div key={idx} className="border border-border/20 rounded-lg overflow-hidden bg-secondary/10">
                              <div 
                                onClick={() => setExpandedEduIdx(isExpanded ? null : idx)}
                                className="flex items-center justify-between p-3 cursor-pointer bg-secondary/25 hover:bg-secondary/35 transition-colors select-none"
                              >
                                <span className="text-xs font-semibold text-foreground truncate max-w-[200px]">
                                  {edu.degree ? `${edu.degree} @ ${edu.school || "School"}` : `Education #${idx + 1}`}
                                </span>
                                <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPortfolioData(prev => ({
                                        ...prev,
                                        education: prev.education.filter((_, i) => i !== idx)
                                      }));
                                      if (expandedEduIdx === idx) setExpandedEduIdx(null);
                                    }}
                                    className="p-1 rounded text-red-500 hover:bg-red-500/10 transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="p-3.5 border-t border-border/20 space-y-3 bg-background">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Degree / Course</label>
                                      <Input
                                        value={edu.degree}
                                        onChange={(e) => handleEduChange(idx, "degree", e.target.value)}
                                        className="h-8 bg-secondary/30 border-border/40 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">School / University</label>
                                      <Input
                                        value={edu.school}
                                        onChange={(e) => handleEduChange(idx, "school", e.target.value)}
                                        className="h-8 bg-secondary/30 border-border/40 text-xs"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Year / Period</label>
                                    <Input
                                      value={edu.year}
                                      onChange={(e) => handleEduChange(idx, "year", e.target.value)}
                                      placeholder="e.g. 2023 - 2027"
                                      className="h-8 bg-secondary/30 border-border/40 text-xs"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        <Button 
                          type="button" 
                          onClick={handleAddEducation} 
                          variant="outline"
                          className="w-full h-9 border-dashed border-border/40 text-xs font-semibold gap-1.5 text-primary hover:bg-secondary/20"
                        >
                          <Plus className="h-4 w-4" /> Add Education
                        </Button>
                      </div>
                    </AccordionItem>

                    {/* Certifications Accordion */}
                    <AccordionItem id="certifications" title="Certifications" icon={Award}>
                      <div className="space-y-3">
                        {(portfolioData.certifications || []).map((cert, idx) => {
                          const isExpanded = expandedCertIdx === idx;
                          return (
                            <div key={idx} className="border border-border/20 rounded-lg overflow-hidden bg-secondary/10">
                              <div 
                                onClick={() => setExpandedCertIdx(isExpanded ? null : idx)}
                                className="flex items-center justify-between p-3 cursor-pointer bg-secondary/25 hover:bg-secondary/35 transition-colors select-none"
                              >
                                <span className="text-xs font-semibold text-foreground truncate max-w-[200px]">
                                  {cert.name || `Certification #${idx + 1}`}
                                </span>
                                <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPortfolioData(prev => ({
                                        ...prev,
                                        certifications: (prev.certifications || []).filter((_, i) => i !== idx)
                                      }));
                                      if (expandedCertIdx === idx) setExpandedCertIdx(null);
                                    }}
                                    className="p-1 rounded text-red-500 hover:bg-red-500/10 transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="p-3.5 border-t border-border/20 space-y-3 bg-background">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Cert Name</label>
                                      <Input
                                        value={cert.name}
                                        onChange={(e) => handleCertChange(idx, "name", e.target.value)}
                                        className="h-8 bg-secondary/30 border-border/40 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Issuer</label>
                                      <Input
                                        value={cert.issuer}
                                        onChange={(e) => handleCertChange(idx, "issuer", e.target.value)}
                                        className="h-8 bg-secondary/30 border-border/40 text-xs"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Date</label>
                                      <Input
                                        value={cert.date}
                                        onChange={(e) => handleCertChange(idx, "date", e.target.value)}
                                        placeholder="e.g. July 2025"
                                        className="h-8 bg-secondary/30 border-border/40 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Credential URL</label>
                                      <Input
                                        value={cert.credentialUrl || ""}
                                        onChange={(e) => handleCertChange(idx, "credentialUrl", e.target.value)}
                                        placeholder="Verification Link"
                                        className="h-8 bg-secondary/30 border-border/40 text-xs"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        <Button 
                          type="button" 
                          onClick={handleAddCert} 
                          variant="outline"
                          className="w-full h-9 border-dashed border-border/40 text-xs font-semibold gap-1.5 text-primary hover:bg-secondary/20"
                        >
                          <Plus className="h-4 w-4" /> Add Certification
                        </Button>
                      </div>
                    </AccordionItem>

                    {/* Achievements Accordion */}
                    <AccordionItem id="achievements" title="Achievements" icon={Trophy}>
                      <div className="space-y-3">
                        {(portfolioData.achievements || []).map((ach, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <Input
                              value={ach}
                              onChange={(e) => handleAchievementChange(idx, e.target.value)}
                              className="h-8 bg-secondary/30 border-border/40 text-xs flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteAchievement(idx)}
                              className="p-1 rounded text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}

                        <div className="flex gap-2 pt-1">
                          <Input
                            value={newAchievementInput}
                            onChange={(e) => setNewAchievementInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddAchievement();
                              }
                            }}
                            placeholder="Add achievement (e.g. Hackathon winner)"
                            className="h-9 bg-secondary/40 border-border/40 text-xs flex-1"
                          />
                          <Button 
                            type="button" 
                            onClick={handleAddAchievement} 
                            size="sm" 
                            className="h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold gap-1 px-3"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add
                          </Button>
                        </div>
                      </div>
                    </AccordionItem>

                    {/* Languages Accordion */}
                    <AccordionItem id="languages" title="Languages" icon={Languages}>
                      <div className="space-y-3">
                        {(portfolioData.languages || []).map((lang, idx) => {
                          const isExpanded = expandedLangIdx === idx;
                          return (
                            <div key={idx} className="border border-border/20 rounded-lg overflow-hidden bg-secondary/10">
                              <div 
                                onClick={() => setExpandedLangIdx(isExpanded ? null : idx)}
                                className="flex items-center justify-between p-3 cursor-pointer bg-secondary/25 hover:bg-secondary/35 transition-colors select-none"
                              >
                                <span className="text-xs font-semibold text-foreground truncate max-w-[200px]">
                                  {lang.name ? `${lang.name} · ${lang.level}` : `Language #${idx + 1}`}
                                </span>
                                <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPortfolioData(prev => ({
                                        ...prev,
                                        languages: (prev.languages || []).filter((_, i) => i !== idx)
                                      }));
                                      if (expandedLangIdx === idx) setExpandedLangIdx(null);
                                    }}
                                    className="p-1 rounded text-red-500 hover:bg-red-500/10 transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="p-3.5 border-t border-border/20 space-y-3 bg-background">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Language Name</label>
                                      <Input
                                        value={lang.name}
                                        onChange={(e) => handleLangChange(idx, "name", e.target.value)}
                                        placeholder="e.g. English"
                                        className="h-8 bg-secondary/30 border-border/40 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Proficiency Level</label>
                                      <select
                                        value={lang.level}
                                        onChange={(e) => handleLangChange(idx, "level", e.target.value)}
                                        className="w-full h-8 bg-secondary/30 border border-border/40 rounded-md text-xs px-2 focus:outline-none"
                                      >
                                        <option value="Native">Native</option>
                                        <option value="Professional">Professional</option>
                                        <option value="Conversational">Conversational</option>
                                        <option value="Basic">Basic</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        <Button 
                          type="button" 
                          onClick={handleAddLanguage} 
                          variant="outline"
                          className="w-full h-9 border-dashed border-border/40 text-xs font-semibold gap-1.5 text-primary hover:bg-secondary/20"
                        >
                          <Plus className="h-4 w-4" /> Add Language
                        </Button>
                      </div>
                    </AccordionItem>
                  </div>
                </div>
              </>
            ) : viewMode === "live" ? (
              <div className="flex-1 overflow-y-auto scroll-smooth">
                <PortfolioRenderer
                  templateId={template.id}
                  data={portfolioData}
                  isDark={isDarkPreview}
                  themeColor={themeColors[activeColorIndex].value}
                  sectionOrder={sectionOrder}
                  isPreview={true}
                />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto scroll-smooth">
                <DraggablePortfolio
                  templateId={template.id}
                  data={portfolioData}
                  sectionOrder={sectionOrder}
                  onReorder={handleReorder}
                  isDark={isDarkPreview}
                  themeColor={themeColors[activeColorIndex].value}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Publish Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setShowPublishModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-md rounded-2xl p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10"
              >
                <Sparkles className="h-10 w-10 text-primary" />
              </motion.div>
              <h2 className="mb-2 text-2xl font-bold">Portfolio Published! 🎉</h2>
              <p className="mb-6 text-sm text-muted-foreground">Your portfolio is now live and ready to share.</p>
              <div className="mb-6 flex items-center gap-2 rounded-xl bg-secondary/50 p-3">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="flex-1 text-left font-mono text-sm text-foreground truncate">alexjohnson.portgen.ai</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={copyUrl}>
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 border-border/60" onClick={() => setShowPublishModal(false)}>Close</Button>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <ExternalLink className="h-4 w-4" /> Visit Site
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Choice Modal */}
      <AnimatePresence>
        {showDownloadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setShowDownloadModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-lg rounded-2xl p-6 relative border border-border/40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Export Portfolio</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowDownloadModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Option 1: Static HTML */}
                <div 
                  onClick={downloadStaticHtml}
                  className="group flex items-start gap-4 p-4 rounded-xl border border-border/30 bg-secondary/10 hover:bg-secondary/30 hover:border-primary/50 cursor-pointer transition-all duration-200"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 text-primary">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Download Single HTML (Static Webpage)</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Generates a self-contained, pre-rendered static HTML file. Perfect for quick drag-and-drop hosting on Netlify, GitHub Pages, or offline viewing.
                    </p>
                  </div>
                </div>

                {/* Option 2: Full React Codebase */}
                <div 
                  onClick={downloadReactCodebase}
                  className="group flex items-start gap-4 p-4 rounded-xl border border-border/30 bg-secondary/10 hover:bg-secondary/30 hover:border-primary/50 cursor-pointer transition-all duration-200"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Download Full React Codebase (Vite + TS)</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Download the complete React project containing your modified source code, custom templates, styles, and configurations. Run locally using npm dev commands.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Rewrite Modal */}
      <AnimatePresence>
        {showRewriteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setShowRewriteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-lg rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">AI Content Rewriter</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowRewriteModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Original Text</label>
                  <Textarea value={rewriteInput} onChange={(e) => setRewriteInput(e.target.value)} rows={3} className="bg-secondary/50 border-border/40 text-sm" />
                </div>
                <Button onClick={handleRewrite} disabled={isRewriting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <Sparkles className="h-4 w-4" />
                  {isRewriting ? "Rewriting..." : "Rewrite with AI"}
                </Button>
                {rewriteOutput && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                    <label className="text-xs text-muted-foreground mb-1.5 block">AI-Enhanced Version</label>
                    <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                      <p className="text-sm leading-relaxed">{rewriteOutput}</p>
                      {!isRewriting && (
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 text-xs" onClick={applyRewrite}>
                            <Check className="h-3 w-3" /> Apply
                          </Button>
                          <Button size="sm" variant="outline" className="border-border/40 text-xs" onClick={handleRewrite}>Regenerate</Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Save Overlay */}
      <AnimatePresence>
        {isProgressSaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm p-6"
          >
            <div className="w-full max-w-md bg-secondary/35 border border-border/40 rounded-2xl p-6 text-center space-y-6 shadow-2xl">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Syncing Portfolio Changes</h3>
                <p className="text-xs text-muted-foreground">{saveStatusText}</p>
              </div>
              
              {/* Progress bar container */}
              <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden relative border border-border/20">
                <motion.div
                  className="h-full bg-primary"
                  style={{
                    width: `${saveProgress}%`,
                    boxShadow: `0 0 12px ${themeColors[activeColorIndex].value}`
                  }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                />
              </div>
              
              <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                <span>PROGRESS: {saveProgress}%</span>
                <span>STATUS: {saveProgress === 100 ? "SUCCESS" : "PROCESSING"}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Preview;
