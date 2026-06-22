import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Download, ExternalLink, Trash2, Moon, Sun, Palette, Copy, Check, X, Globe, Wand2, GripVertical, RotateCcw, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [viewMode, setViewMode] = useState<"live" | "edit">("live");
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
    const newMode = isDarkPreview ? "light" : "dark";
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
      const res = await fetch(`${API_URL}/api/portfolio/codebase-files`);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex h-screen flex-col pt-16 lg:flex-row">
        {/* Chat Panel */}
        <div 
          className={`flex flex-col border-r border-border/30 transition-all duration-300 ease-in-out ${
            isSidebarCollapsed 
              ? "w-0 border-r-0 overflow-hidden opacity-0 pointer-events-none" 
              : "w-full lg:w-[400px] xl:w-[440px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <BackButton />
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI Editor</p>
                <p className="text-xs text-muted-foreground">Chat to customize</p>
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
            <div className="border-b border-border/30 px-4 py-2 flex items-center justify-between gap-2 text-xs text-amber-500 bg-amber-500/5">
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
            <div className="border-b border-border/30 px-4 py-2 flex items-center gap-2 text-xs text-green-500 bg-green-500/5">
              <Check className="h-3.5 w-3.5 shrink-0" />
              Portfolio data loaded from your database
            </div>
          )}
          {portfolioLoadError && (
            <div className="border-b border-border/30 px-4 py-2 flex items-center justify-between gap-2 text-xs text-yellow-500 bg-yellow-500/5">
              <span className="flex items-center gap-1.5"><Bot className="h-3.5 w-3.5" /> Showing demo data — your saved portfolio could not be loaded</span>
              <button onClick={fetchPortfolio} className="underline hover:text-yellow-400 shrink-0">Retry</button>
            </div>
          )}

          {/* Theme controls */}
          <div className="border-b border-border/30 px-4 py-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Palette className="h-3.5 w-3.5" />
                Theme Color
              </div>
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
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
          <div className="border-b border-border/30 px-4 py-2.5 flex gap-2 overflow-x-auto">
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
                className="shrink-0 rounded-full bg-secondary/50 px-3 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Section Order Display */}
          <div className="border-b border-border/30 px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <GripVertical className="h-3.5 w-3.5" />
              <span>Section Order:</span>
              <div className="flex gap-1 flex-wrap">
                {sectionOrder.map((id, i) => (
                  <span key={id} className="rounded bg-secondary/60 px-1.5 py-0.5 text-[10px]">
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
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Revision Checkpoints</h4>
                <button 
                  onClick={() => setShowHistory(false)} 
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Back to Chat
                </button>
              </div>

              {historyList.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground font-mono">
                  No revisions found. Changes will appear here as you customize.
                </div>
              ) : (
                <div className="relative border-l border-border/30 ml-2.5 pl-4 space-y-4 py-2">
                  {historyList.map((item) => (
                    <div key={item._id} className="relative group">
                      {/* Timeline dot */}
                      <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border bg-background border-primary" />
                      
                      <div className="glass-card p-3 rounded-lg hover:border-primary/40 transition-all space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-medium text-foreground leading-snug">{item.description}</p>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-muted-foreground font-mono">
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
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === "ai" ? "bg-primary/10" : "bg-secondary"}`}>
                    {msg.role === "ai" ? <Bot className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="max-w-[80%] space-y-1">
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground" : "glass-card"}`}>
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                    <p className="px-1 text-[10px] text-muted-foreground/50">
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
                  <div className="glass-card flex items-center gap-1.5 rounded-2xl px-4 py-3">
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
          <div className="border-t border-border/30 p-4">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tell AI what to change..."
                className="h-11 bg-secondary/50 border-border/40"
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
                onClick={() => setViewMode("edit")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === "edit" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Rearrange Sections
              </button>
            </div>
          </div>

          {/* Render Area */}
          <div className="flex-1 overflow-y-auto scroll-smooth">
            {viewMode === "live" ? (
              <PortfolioRenderer
                templateId={template.id}
                data={portfolioData}
                isDark={isDarkPreview}
                themeColor={themeColors[activeColorIndex].value}
                sectionOrder={sectionOrder}
                isPreview={true}
              />
            ) : (
              <DraggablePortfolio
                templateId={template.id}
                data={portfolioData}
                sectionOrder={sectionOrder}
                onReorder={handleReorder}
                isDark={isDarkPreview}
                themeColor={themeColors[activeColorIndex].value}
              />
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
    </div>
  );
};

export default Preview;
