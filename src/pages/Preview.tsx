import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Download, ExternalLink, Trash2, Moon, Sun, Palette, Copy, Check, X, Globe, Wand2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { defaultPortfolioData, mockChatResponses, templateList } from "@/data/mockData";
import DraggablePortfolio, { type SectionId } from "@/components/DraggablePortfolio";

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

const defaultSectionOrder: SectionId[] = ["about", "skills", "projects", "experience", "education", "contact"];

const Preview = () => {
  const { templateId } = useParams();
  const template = templateList.find((t) => t.id === templateId) || templateList[0];
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", content: `🎉 Your portfolio is ready using the "${template.name}" template! Try:\n\n• Chat commands to customize content\n• Drag sections on the right to reorder\n• Use theme controls above\n• Click "AI Rewrite" to polish text`, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkPreview, setIsDarkPreview] = useState(true);
  const [selectedColor, setSelectedColor] = useState(0);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRewriteModal, setShowRewriteModal] = useState(false);
  const [rewriteInput, setRewriteInput] = useState("Passionate developer with 5+ years of experience building modern web applications.");
  const [rewriteOutput, setRewriteOutput] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>(defaultSectionOrder);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text?: string) => {
    const userMsg = (text || input).trim();
    if (!userMsg) return;
    setMessages((prev) => [...prev, { role: "user", content: userMsg, timestamp: new Date() }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let response = mockChatResponses.default;
      for (const key of Object.keys(mockChatResponses)) {
        if (lower.includes(key)) {
          response = mockChatResponses[key];
          break;
        }
      }
      setMessages((prev) => [...prev, { role: "ai", content: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
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

  const handleReorder = (newOrder: SectionId[]) => {
    setSectionOrder(newOrder);
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
        <div className="flex w-full flex-col border-r border-border/30 lg:w-[400px] xl:w-[440px]">
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
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearChat} title="Clear chat">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" title="Download">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowPublishModal(true)} title="Publish">
                <Globe className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Theme controls */}
          <div className="border-b border-border/30 px-4 py-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Palette className="h-3.5 w-3.5" />
                Theme Color
              </div>
              <button
                onClick={() => setIsDarkPreview(!isDarkPreview)}
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
                  onClick={() => setSelectedColor(i)}
                  className={`h-7 w-7 rounded-full transition-all ${selectedColor === i ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110" : "hover:scale-110"}`}
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

          {/* Messages */}
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
        <div className="flex-1 overflow-y-auto bg-secondary/20">
          <DraggablePortfolio
            templateId={template.id}
            data={defaultPortfolioData}
            sectionOrder={sectionOrder}
            onReorder={handleReorder}
          />
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
                          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 text-xs" onClick={() => { sendMessage("Apply the rewritten about section"); setShowRewriteModal(false); }}>
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
