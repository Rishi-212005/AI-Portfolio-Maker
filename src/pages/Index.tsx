import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Layout, MessageSquare, Eye, Layers, Upload, Wand2, Globe, Star, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { templateList } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import TemplateMockup from "@/components/TemplateMockup";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Generation",
    description: "Upload your resume and watch as AI transforms it into a stunning portfolio in seconds.",
  },
  {
    icon: Layout,
    title: "Beautiful Templates",
    description: "Choose from professionally designed templates that make your work stand out.",
  },
  {
    icon: MessageSquare,
    title: "Chat-Based Editing",
    description: "Customize your portfolio using natural language — just tell the AI what to change.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "See every change in real-time with our split-screen editor and live preview.",
  },
];

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Resume",
    description: "Drop your PDF or DOCX resume — our AI extracts all the details automatically.",
  },
  {
    icon: Wand2,
    step: "02",
    title: "Customize with AI",
    description: "Chat with AI to tweak your theme, layout, content, and animations instantly.",
  },
  {
    icon: Globe,
    step: "03",
    title: "Publish Instantly",
    description: "Get a live portfolio URL and share it with recruiters, clients, or the world.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Frontend Developer at Stripe",
    content: "PortGen AI saved me hours. I uploaded my resume and had a polished portfolio live in under 5 minutes. The AI chat editor is mind-blowing.",
    rating: 5,
  },
  {
    name: "Marcus Rivera",
    role: "UX Designer, Freelance",
    content: "The templates are gorgeous and the customization is so intuitive. I just told the AI to 'make it more creative' and it delivered perfectly.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Product Manager at Google",
    content: "I've tried every portfolio builder out there. PortGen AI is the first one that actually feels like a premium product. Highly recommend.",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["1 Portfolio", "3 Templates", "Basic AI Editing", "PortGen Subdomain", "Community Support"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For professionals who want more",
    features: ["Unlimited Portfolios", "All Templates", "Advanced AI Editing", "Custom Domain", "Priority Support", "Analytics Dashboard", "Remove Branding"],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For teams and agencies",
    features: ["Everything in Pro", "Team Collaboration", "White-label Option", "API Access", "Dedicated Support", "Custom Templates", "SSO Authentication"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="grid-pattern absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />

        <div className="container relative mx-auto flex min-h-[90vh] flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Portfolio Generator
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Turn Your Resume into a{" "}
            <br />
            <span
              style={{
                backgroundImage: "linear-gradient(to right, #22d3ee, #3b82f6, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Stunning Portfolio
            </span>{" "}
            in Seconds
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10 max-w-2xl text-lg text-foreground/70 sm:text-xl"
          >
            Upload your resume, pick a template, and let AI build your professional portfolio. Customize everything with simple chat commands.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Link to="/dashboard">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 h-12 gap-2">
                Create Portfolio
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/templates">
              <Button size="lg" variant="outline" className="border-border/60 text-foreground hover:bg-secondary text-base px-8 h-12 gap-2">
                <Layers className="h-4 w-4" />
                View Templates
              </Button>
            </Link>
          </motion.div>

          {/* Preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 w-full max-w-5xl"
          >
            <div className="glass-card overflow-hidden rounded-2xl border border-border/30 p-1 shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">portgen.ai/preview</span>
              </div>
              <div className="bg-background/60 p-6 sm:p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {templateList.slice(0, 3).map((t) => (
                    <div key={t.id} className="rounded-xl overflow-hidden border border-border/40">
                      <div className="relative h-32">
                        <TemplateMockup id={t.id} color={t.color} />
                      </div>
                      <div className="p-3 space-y-1.5 border-t border-border/30 bg-background/80">
                        <div className="h-3 w-3/4 rounded bg-foreground/15" />
                        <div className="h-2 w-full rounded bg-muted-foreground/10" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 border-t border-border/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Trusted by <span className="text-foreground font-bold">2,000+</span> creators worldwide</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
              {["Google", "Meta", "Stripe", "Vercel", "Netflix", "Spotify"].map((brand) => (
                <span key={brand} className="text-lg font-bold tracking-wider text-muted-foreground">{brand}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Everything You Need to <span className="gradient-text">Stand Out</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Build a professional portfolio without writing a single line of code.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card hover-glow group rounded-2xl p-6 transition-all hover:border-primary/30"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Three simple steps to your professional portfolio.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                {i < steps.length - 1 && (
                  <div className="absolute top-12 left-[60%] hidden h-px w-[80%] bg-gradient-to-r from-primary/30 to-transparent md:block" />
                )}
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/5 border border-primary/10">
                  <s.icon className="h-10 w-10 text-primary" />
                </div>
                <span className="mb-2 block font-mono text-xs text-primary">{s.step}</span>
                <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Loved by <span className="gradient-text">Creators</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              See what professionals are saying about PortGen AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card hover-glow rounded-2xl p-6 transition-all hover:border-primary/30"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Pick Your <span className="gradient-text">Perfect Template</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Choose from stunning, production-ready portfolio templates.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {templateList.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/preview/${t.id}`} className="group block">
                  <div className="glass-card hover-glow overflow-hidden rounded-2xl transition-all hover:border-primary/30">
                    <div className="relative h-48 w-full overflow-hidden transition-transform duration-500 group-hover:scale-105">
                      <TemplateMockup id={t.id} color={t.color} />
                    </div>
                    <div className="p-5">
                      <h3 className="mb-1 font-semibold group-hover:text-primary transition-colors">{t.name}</h3>
                      <p className="text-sm text-muted-foreground">{t.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/templates">
              <Button variant="outline" size="lg" className="border-border/60 gap-2">
                View All Templates
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Start free. Upgrade when you're ready.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-6 transition-all ${
                  plan.highlighted
                    ? "glass-card border-primary/40 shadow-[0_0_30px_hsl(190_95%_55%/0.1)]"
                    : "glass-card hover-glow hover:border-primary/20"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="mb-1 text-lg font-semibold">{plan.name}</h3>
                <p className="mb-4 text-xs text-muted-foreground">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/dashboard">
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card mx-auto max-w-3xl rounded-3xl p-12"
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Ready to Build Your <span className="gradient-text">Portfolio</span>?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Join thousands of professionals who've created stunning portfolios with PortGen AI.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 gap-2">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-bold">PortGen AI</span>
              </div>
              <p className="text-xs text-muted-foreground">Turn your resume into a stunning portfolio in seconds.</p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Product</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link to="/templates" className="hover:text-foreground transition-colors">Templates</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><span className="cursor-default">Pricing</span></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Company</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><span className="cursor-default">About</span></li>
                <li><span className="cursor-default">Blog</span></li>
                <li><span className="cursor-default">Careers</span></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Legal</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><span className="cursor-default">Privacy</span></li>
                <li><span className="cursor-default">Terms</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/30 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <span>© 2026 PortGen AI. All rights reserved.</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-primary text-[11px] font-medium">
              ✓ WCAG 2.1 Compliant
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
