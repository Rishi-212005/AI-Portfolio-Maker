import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Target, Users, Lightbulb, Code2, AlertTriangle, Rocket,
  ArrowRight, ArrowDown, Database, Globe, Brain, Server,
  Layers, GitBranch, Shield, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const CaseStudy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 pt-24 pb-20">
        <BackButton />
        {/* Header */}
        <motion.div {...fadeIn} className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Target className="h-4 w-4" />
            Case Study
          </span>
          <h1 className="mb-4 text-4xl font-extrabold sm:text-5xl">
            Building <span className="gradient-text">PortGen AI</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            How I designed and built an AI-powered portfolio generator that turns resumes into professional websites in seconds.
          </p>
        </motion.div>

        <div className="space-y-16">
          {/* Problem Statement */}
          <Section icon={AlertTriangle} title="Problem Statement" color="destructive">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Developers and professionals spend <strong className="text-foreground">hours to days</strong> building portfolio websites from scratch. Many end up with outdated templates or abandon the process entirely.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { stat: "73%", label: "of developers have no portfolio" },
                { stat: "8+ hrs", label: "average time to build one" },
                { stat: "60%", label: "abandon halfway through" },
              ].map((item) => (
                <div key={item.label} className="glass-card rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{item.stat}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Market Gap */}
          <Section icon={Lightbulb} title="Market Gap" color="accent">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Existing solutions fall into two categories: <strong className="text-foreground">too simple</strong> (limited customization) or <strong className="text-foreground">too complex</strong> (requires coding knowledge). There's no middle ground that combines AI-powered automation with deep customization through natural language.
            </p>
            <div className="glass-card rounded-xl p-5">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="font-semibold text-destructive mb-1">Basic Builders</p>
                  <p className="text-xs text-muted-foreground">Limited templates, no AI, cookie-cutter output</p>
                </div>
                <div className="border-x border-border/30 px-4">
                  <p className="font-semibold text-primary mb-1">PortGen AI ✨</p>
                  <p className="text-xs text-muted-foreground">AI-powered, chat editing, production-ready</p>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground mb-1">Code From Scratch</p>
                  <p className="text-xs text-muted-foreground">Full control but requires dev skills & time</p>
                </div>
              </div>
            </div>
          </Section>

          {/* User Persona */}
          <Section icon={Users} title="User Persona" color="primary">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  name: "Fresh Graduate Dev",
                  needs: "Needs a portfolio fast for job applications. Has projects but no time to build a site.",
                  pain: "Can code but doesn't want to spend a week on a portfolio.",
                },
                {
                  name: "Freelance Designer",
                  needs: "Wants a visually stunning portfolio that reflects their creative style.",
                  pain: "Existing builders look generic and don't capture their brand.",
                },
              ].map((persona) => (
                <div key={persona.name} className="glass-card rounded-xl p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="mb-1 font-semibold">{persona.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{persona.needs}</p>
                  <p className="text-xs text-primary/80 italic">Pain: {persona.pain}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Design Decisions */}
          <Section icon={Layers} title="Design Decisions" color="primary">
            <div className="space-y-4">
              {[
                { decision: "Dark-first design system", reason: "Developers prefer dark themes. HSL-based CSS variables enable seamless theme switching." },
                { decision: "Chat-based AI editing", reason: "Natural language is the most intuitive interface. Users describe changes in plain English." },
                { decision: "Split-screen preview", reason: "Real-time feedback loop reduces iteration time and builds user confidence." },
                { decision: "Multi-step form wizard", reason: "Reduces cognitive load. Users focus on one section at a time instead of a long form." },
              ].map((d, i) => (
                <motion.div
                  key={d.decision}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{d.decision}</p>
                    <p className="text-sm text-muted-foreground">{d.reason}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* System Architecture */}
          <Section icon={GitBranch} title="System Architecture" color="primary">
            <div className="glass-card rounded-2xl p-8">
              <div className="flex flex-col items-center gap-3">
                {[
                  { icon: Globe, label: "Frontend (React + Tailwind)", sub: "Component-based SPA with design system" },
                  { icon: Server, label: "State Management", sub: "React hooks + Context for global state" },
                  { icon: Brain, label: "AI Processing Layer", sub: "NLP-powered chat commands → UI mutations" },
                  { icon: Database, label: "Data Layer", sub: "Portfolio schema, templates, user preferences" },
                ].map((layer, i, arr) => (
                  <motion.div
                    key={layer.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="w-full max-w-md"
                  >
                    <div className="flex items-center gap-4 rounded-xl bg-secondary/50 p-4 border border-border/30">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <layer.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{layer.label}</p>
                        <p className="text-xs text-muted-foreground">{layer.sub}</p>
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex justify-center py-1">
                        <ArrowDown className="h-4 w-4 text-primary/40" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>

          {/* Tech Stack */}
          <Section icon={Code2} title="Tech Stack" color="primary">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "React 18", role: "UI Framework", detail: "Concurrent features, Suspense" },
                { name: "TypeScript", role: "Type Safety", detail: "End-to-end type coverage" },
                { name: "Tailwind CSS", role: "Styling", detail: "Utility-first, design tokens" },
                { name: "Framer Motion", role: "Animations", detail: "Spring-based, layout animations" },
                { name: "React Router", role: "Navigation", detail: "Client-side routing, lazy loading" },
                { name: "Shadcn/ui", role: "Components", detail: "Accessible, customizable primitives" },
              ].map((tech) => (
                <div key={tech.name} className="glass-card rounded-xl p-4 hover-glow transition-all hover:border-primary/30">
                  <p className="font-semibold text-sm">{tech.name}</p>
                  <p className="text-xs text-primary">{tech.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tech.detail}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Challenges */}
          <Section icon={Shield} title="Challenges Faced" color="destructive">
            <div className="space-y-4">
              {[
                { challenge: "Theme system complexity", solution: "Built HSL-based CSS variable system with semantic tokens. All colors derive from a single config, enabling instant theme switching." },
                { challenge: "AI chat simulation realism", solution: "Implemented keyword matching with typing delays, loading states, and contextual responses to simulate real AI behavior." },
                { challenge: "Responsive split-screen preview", solution: "Used CSS Grid with breakpoint-aware stacking. On mobile, the layout converts to a tabbed interface." },
              ].map((c, i) => (
                <div key={c.challenge} className="glass-card rounded-xl p-5">
                  <p className="font-semibold text-sm mb-2 text-destructive/80">⚡ {c.challenge}</p>
                  <p className="text-sm text-muted-foreground">{c.solution}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Future Scope */}
          <Section icon={Rocket} title="Future Scope" color="primary">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Real AI integration (OpenAI API for content generation)",
                "Backend with auth, database, and user accounts",
                "PDF resume parsing with OCR",
                "Custom domain mapping for published portfolios",
                "Analytics dashboard with real visitor tracking",
                "Collaborative editing for teams",
              ].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 rounded-lg bg-secondary/30 p-3"
                >
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* CTA */}
          <motion.div {...fadeIn} className="text-center pt-8">
            <Link to="/dashboard">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8 h-12">
                Try PortGen AI
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ icon: Icon, title, color, children }: { icon: any; title: string; color: string; children: React.ReactNode }) => (
  <motion.section {...fadeIn}>
    <div className="mb-6 flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${color}/10`}>
        <Icon className={`h-5 w-5 text-${color}`} />
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
    {children}
  </motion.section>
);

export default CaseStudy;
