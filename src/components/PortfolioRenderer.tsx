import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, ExternalLink } from "lucide-react";
import type { PortfolioData } from "@/data/mockData";

interface Props {
  templateId: string;
  data: PortfolioData;
}

const PortfolioRenderer = ({ templateId, data }: Props) => {
  switch (templateId) {
    case "minimal-dark": return <MinimalDark data={data} />;
    case "creative-colorful": return <CreativeColorful data={data} />;
    case "corporate-clean": return <CorporateClean data={data} />;
    case "glassmorphism": return <GlassMorphism data={data} />;
    case "neon-cyberpunk": return <NeonCyberpunk data={data} />;
    case "elegant-serif": return <ElegantEditorial data={data} />;
    case "gradient-aurora": return <AuroraGradient data={data} />;
    case "brutalist-bold": return <BrutalistBold data={data} />;
    default: return <MinimalDark data={data} />;
  }
};

const SocialIcons = ({ links, color }: { links: PortfolioData["socialLinks"]; color: string }) => (
  <div className="flex gap-4">
    {links.map((l) => (
      <a key={l.platform} href={l.url} className="transition-transform hover:scale-110" style={{ color }}>
        {l.platform === "GitHub" && <Github className="h-5 w-5" />}
        {l.platform === "LinkedIn" && <Linkedin className="h-5 w-5" />}
        {l.platform === "Twitter" && <Twitter className="h-5 w-5" />}
      </a>
    ))}
  </div>
);

/* ====== MINIMAL DARK ====== */
const MinimalDark = ({ data }: { data: PortfolioData }) => (
  <div className="min-h-screen" style={{ background: "hsl(222 47% 5%)", color: "hsl(210 40% 96%)" }}>
    <div className="mx-auto max-w-3xl px-6 py-20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16">
        <p className="mb-2 font-mono text-sm" style={{ color: "hsl(190 95% 55%)" }}>Hello, I'm</p>
        <h1 className="mb-3 text-5xl font-bold">{data.name}</h1>
        <p className="text-xl" style={{ color: "hsl(215 20% 55%)" }}>{data.title}</p>
      </motion.div>
      <section className="mb-16">
        <h2 className="mb-4 font-mono text-sm uppercase tracking-widest" style={{ color: "hsl(190 95% 55%)" }}>About</h2>
        <p className="leading-relaxed" style={{ color: "hsl(215 20% 65%)" }}>{data.about}</p>
      </section>
      <section className="mb-16">
        <h2 className="mb-4 font-mono text-sm uppercase tracking-widest" style={{ color: "hsl(190 95% 55%)" }}>Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((s) => (
            <span key={s} className="rounded-md px-3 py-1 text-sm font-mono" style={{ background: "hsl(222 30% 12%)", color: "hsl(190 95% 55%)" }}>{s}</span>
          ))}
        </div>
      </section>
      <section className="mb-16">
        <h2 className="mb-6 font-mono text-sm uppercase tracking-widest" style={{ color: "hsl(190 95% 55%)" }}>Projects</h2>
        <div className="space-y-6">
          {data.projects.map((p) => (
            <div key={p.title} className="rounded-xl p-5" style={{ background: "hsl(222 30% 9%)", border: "1px solid hsl(222 20% 15%)" }}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">{p.title}</h3>
                <ExternalLink className="h-4 w-4" style={{ color: "hsl(215 20% 55%)" }} />
              </div>
              <p className="mb-3 text-sm" style={{ color: "hsl(215 20% 55%)" }}>{p.description}</p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <span key={tag} className="rounded text-xs px-2 py-0.5 font-mono" style={{ background: "hsl(222 30% 14%)", color: "hsl(215 20% 65%)" }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-16">
        <h2 className="mb-6 font-mono text-sm uppercase tracking-widest" style={{ color: "hsl(190 95% 55%)" }}>Experience</h2>
        <div className="space-y-4">
          {data.experience.map((e) => (
            <div key={e.role + e.company} className="border-l-2 pl-4" style={{ borderColor: "hsl(222 20% 18%)" }}>
              <h3 className="font-semibold">{e.role}</h3>
              <p className="text-sm" style={{ color: "hsl(190 95% 55%)" }}>{e.company} · {e.duration}</p>
              <p className="mt-1 text-sm" style={{ color: "hsl(215 20% 55%)" }}>{e.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-4 font-mono text-sm uppercase tracking-widest" style={{ color: "hsl(190 95% 55%)" }}>Connect</h2>
        <SocialIcons links={data.socialLinks} color="hsl(190 95% 55%)" />
      </section>
    </div>
  </div>
);

/* ====== CREATIVE COLORFUL ====== */
const CreativeColorful = ({ data }: { data: PortfolioData }) => (
  <div className="min-h-screen" style={{ background: "linear-gradient(135deg, hsl(330 60% 8%), hsl(270 40% 8%), hsl(200 40% 8%))", color: "hsl(0 0% 95%)" }}>
    <div className="mx-auto max-w-4xl px-6 py-20">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-20 text-center">
        <div className="mb-6 inline-block rounded-full px-4 py-1 text-sm font-medium" style={{ background: "linear-gradient(135deg, hsl(330 80% 60%), hsl(270 80% 65%))", color: "white" }}>Available for work</div>
        <h1 className="mb-4 text-6xl font-extrabold" style={{ backgroundImage: "linear-gradient(135deg, hsl(330 80% 65%), hsl(40 90% 60%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{data.name}</h1>
        <p className="text-xl" style={{ color: "hsl(0 0% 60%)" }}>{data.title}</p>
      </motion.div>
      <section className="mb-16 text-center">
        <p className="mx-auto max-w-2xl text-lg leading-relaxed" style={{ color: "hsl(0 0% 70%)" }}>{data.about}</p>
      </section>
      <section className="mb-16">
        <h2 className="mb-6 text-center text-2xl font-bold" style={{ backgroundImage: "linear-gradient(135deg, hsl(330 80% 65%), hsl(270 80% 65%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Skills</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {data.skills.map((s, i) => (
            <motion.span key={s} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="rounded-full px-4 py-2 text-sm font-medium" style={{ background: `hsl(${330 + i * 30} 60% 15%)`, border: `1px solid hsl(${330 + i * 30} 60% 25%)`, color: `hsl(${330 + i * 30} 80% 70%)` }}>{s}</motion.span>
          ))}
        </div>
      </section>
      <section className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-bold" style={{ backgroundImage: "linear-gradient(135deg, hsl(330 80% 65%), hsl(270 80% 65%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Projects</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {data.projects.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl p-6" style={{ background: "hsl(0 0% 100% / 0.03)", border: "1px solid hsl(0 0% 100% / 0.08)" }}>
              <h3 className="mb-2 text-lg font-bold">{p.title}</h3>
              <p className="mb-3 text-sm" style={{ color: "hsl(0 0% 60%)" }}>{p.description}</p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <span key={tag} className="rounded-full px-2 py-0.5 text-xs" style={{ background: "hsl(330 80% 60% / 0.15)", color: "hsl(330 80% 65%)" }}>{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="text-center">
        <SocialIcons links={data.socialLinks} color="hsl(330 80% 65%)" />
      </section>
    </div>
  </div>
);

/* ====== CORPORATE CLEAN ====== */
const CorporateClean = ({ data }: { data: PortfolioData }) => (
  <div className="min-h-screen" style={{ background: "hsl(0 0% 98%)", color: "hsl(222 47% 11%)" }}>
    <div className="mx-auto max-w-4xl px-6 py-20">
      <div className="mb-16 border-b pb-12" style={{ borderColor: "hsl(220 13% 91%)" }}>
        <h1 className="mb-2 text-4xl font-bold">{data.name}</h1>
        <p className="text-lg" style={{ color: "hsl(220 60% 50%)" }}>{data.title}</p>
      </div>
      <div className="grid gap-16 md:grid-cols-3">
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: "hsl(220 60% 50%)" }}>About</h2>
            <p className="leading-relaxed" style={{ color: "hsl(215 16% 47%)" }}>{data.about}</p>
          </section>
          <section>
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider" style={{ color: "hsl(220 60% 50%)" }}>Experience</h2>
            <div className="space-y-6">
              {data.experience.map((e) => (
                <div key={e.role + e.company}>
                  <div className="flex items-baseline justify-between"><h3 className="font-semibold">{e.role}</h3><span className="text-sm" style={{ color: "hsl(215 16% 47%)" }}>{e.duration}</span></div>
                  <p className="text-sm font-medium" style={{ color: "hsl(220 60% 50%)" }}>{e.company}</p>
                  <p className="mt-1 text-sm" style={{ color: "hsl(215 16% 47%)" }}>{e.description}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider" style={{ color: "hsl(220 60% 50%)" }}>Projects</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.projects.map((p) => (
                <div key={p.title} className="rounded-lg p-5" style={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 13% 91%)" }}>
                  <h3 className="mb-2 font-semibold">{p.title}</h3>
                  <p className="text-sm" style={{ color: "hsl(215 16% 47%)" }}>{p.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: "hsl(220 60% 50%)" }}>Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s) => (
                <span key={s} className="rounded-md px-3 py-1 text-xs font-medium" style={{ background: "hsl(220 60% 50% / 0.1)", color: "hsl(220 60% 50%)" }}>{s}</span>
              ))}
            </div>
          </section>
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: "hsl(220 60% 50%)" }}>Education</h2>
            {data.education.map((edu) => (
              <div key={edu.degree} className="mb-3">
                <p className="font-medium text-sm">{edu.degree}</p>
                <p className="text-xs" style={{ color: "hsl(215 16% 47%)" }}>{edu.school} · {edu.year}</p>
              </div>
            ))}
          </section>
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: "hsl(220 60% 50%)" }}>Connect</h2>
            <SocialIcons links={data.socialLinks} color="hsl(220 60% 50%)" />
          </section>
        </div>
      </div>
    </div>
  </div>
);

/* ====== GLASSMORPHISM ====== */
const GlassMorphism = ({ data }: { data: PortfolioData }) => (
  <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(240 40% 8%), hsl(270 40% 12%), hsl(220 40% 10%))" }}>
    <div className="absolute top-20 left-20 h-72 w-72 rounded-full blur-[100px]" style={{ background: "hsl(270 80% 50% / 0.2)" }} />
    <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full blur-[100px]" style={{ background: "hsl(190 95% 55% / 0.15)" }} />
    <div className="relative mx-auto max-w-4xl px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center" style={{ color: "hsl(0 0% 95%)" }}>
        <h1 className="mb-3 text-5xl font-bold">{data.name}</h1>
        <p className="text-xl" style={{ color: "hsl(0 0% 60%)" }}>{data.title}</p>
      </motion.div>
      <div className="space-y-8">
        <GlassSection title="About" color="hsl(270 80% 75%)"><p className="leading-relaxed" style={{ color: "hsl(0 0% 70%)" }}>{data.about}</p></GlassSection>
        <GlassSection title="Skills" color="hsl(270 80% 75%)">
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <span key={s} className="rounded-full px-3 py-1.5 text-sm" style={{ background: "hsl(270 80% 65% / 0.15)", border: "1px solid hsl(270 80% 65% / 0.2)", color: "hsl(270 80% 80%)" }}>{s}</span>
            ))}
          </div>
        </GlassSection>
        <GlassSection title="Projects" color="hsl(270 80% 75%)">
          <div className="grid gap-4 md:grid-cols-2">
            {data.projects.map((p) => (
              <div key={p.title} className="rounded-xl p-4" style={{ background: "hsl(0 0% 100% / 0.03)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
                <h3 className="mb-2 font-semibold" style={{ color: "hsl(0 0% 90%)" }}>{p.title}</h3>
                <p className="mb-3 text-sm" style={{ color: "hsl(0 0% 55%)" }}>{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => (
                    <span key={tag} className="rounded text-xs px-2 py-0.5" style={{ background: "hsl(190 95% 55% / 0.1)", color: "hsl(190 95% 65%)" }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassSection>
        <GlassSection title="Experience" color="hsl(270 80% 75%)">
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.role + e.company} className="border-l-2 pl-4" style={{ borderColor: "hsl(270 80% 65% / 0.3)" }}>
                <h3 className="font-semibold" style={{ color: "hsl(0 0% 90%)" }}>{e.role}</h3>
                <p className="text-sm" style={{ color: "hsl(270 80% 75%)" }}>{e.company} · {e.duration}</p>
                <p className="mt-1 text-sm" style={{ color: "hsl(0 0% 55%)" }}>{e.description}</p>
              </div>
            ))}
          </div>
        </GlassSection>
        <div className="text-center pt-8">
          <SocialIcons links={data.socialLinks} color="hsl(270 80% 75%)" />
        </div>
      </div>
    </div>
  </div>
);

const GlassSection = ({ title, color, children }: { title: string; color: string; children: React.ReactNode }) => (
  <div className="rounded-2xl p-6" style={{ background: "hsl(0 0% 100% / 0.05)", backdropFilter: "blur(20px)", border: "1px solid hsl(0 0% 100% / 0.1)" }}>
    <h2 className="mb-4 text-lg font-semibold" style={{ color }}>{title}</h2>
    {children}
  </div>
);

/* ====== NEON CYBERPUNK ====== */
const NeonCyberpunk = ({ data }: { data: PortfolioData }) => {
  const neon = "hsl(160 100% 50%)";
  const neonPink = "hsl(330 100% 60%)";
  return (
    <div className="min-h-screen relative" style={{ background: "hsl(240 20% 4%)", color: "hsl(0 0% 90%)" }}>
      <div className="absolute inset-0 opacity-15" style={{ backgroundSize: "40px 40px", backgroundImage: `linear-gradient(${neon}30 1px, transparent 1px), linear-gradient(90deg, ${neon}30 1px, transparent 1px)` }} />
      <div className="relative mx-auto max-w-4xl px-6 py-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16">
          <h1 className="mb-2 text-6xl font-black uppercase tracking-tight" style={{ color: neon, textShadow: `0 0 40px ${neon}60, 0 0 80px ${neon}30` }}>{data.name}</h1>
          <p className="text-lg font-mono" style={{ color: neonPink }}>{data.title}</p>
        </motion.div>
        <section className="mb-12">
          <h2 className="mb-4 font-mono text-sm uppercase tracking-[0.3em]" style={{ color: neon }}>// ABOUT</h2>
          <p className="leading-relaxed font-mono text-sm" style={{ color: "hsl(0 0% 60%)" }}>{data.about}</p>
        </section>
        <section className="mb-12">
          <h2 className="mb-4 font-mono text-sm uppercase tracking-[0.3em]" style={{ color: neon }}>// SKILLS</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <span key={s} className="rounded px-3 py-1.5 text-xs font-mono font-bold uppercase" style={{ border: `1px solid ${neon}60`, color: neon, boxShadow: `inset 0 0 12px ${neon}15, 0 0 8px ${neon}20` }}>{s}</span>
            ))}
          </div>
        </section>
        <section className="mb-12">
          <h2 className="mb-6 font-mono text-sm uppercase tracking-[0.3em]" style={{ color: neon }}>// PROJECTS</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.projects.map((p) => (
              <div key={p.title} className="rounded-lg p-5" style={{ background: "hsl(240 20% 8%)", border: `1px solid ${neon}25`, boxShadow: `0 0 20px ${neon}08` }}>
                <h3 className="mb-2 font-bold font-mono" style={{ color: neonPink }}>{p.title}</h3>
                <p className="text-sm font-mono" style={{ color: "hsl(0 0% 50%)" }}>{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: `${neonPink}15`, color: neonPink }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-12">
          <h2 className="mb-6 font-mono text-sm uppercase tracking-[0.3em]" style={{ color: neon }}>// EXPERIENCE</h2>
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.role + e.company} className="border-l-2 pl-4" style={{ borderColor: neonPink }}>
                <h3 className="font-bold font-mono">{e.role}</h3>
                <p className="text-sm font-mono" style={{ color: neon }}>{e.company} · {e.duration}</p>
                <p className="mt-1 text-sm font-mono" style={{ color: "hsl(0 0% 50%)" }}>{e.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <SocialIcons links={data.socialLinks} color={neon} />
        </section>
      </div>
    </div>
  );
};

/* ====== ELEGANT EDITORIAL ====== */
const ElegantEditorial = ({ data }: { data: PortfolioData }) => {
  const accent = "hsl(35 90% 45%)";
  return (
    <div className="min-h-screen" style={{ background: "hsl(40 30% 97%)", color: "hsl(30 10% 15%)" }}>
      <div className="mx-auto max-w-3xl px-6 py-24">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-20 text-center">
          <h1 className="mb-3 text-5xl font-bold" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{data.name}</h1>
          <div className="mx-auto mb-4 h-px w-16" style={{ background: accent }} />
          <p className="text-lg italic" style={{ color: "hsl(30 10% 45%)", fontFamily: "Georgia, serif" }}>{data.title}</p>
        </motion.div>
        <section className="mb-16">
          <p className="text-lg leading-[1.9]" style={{ color: "hsl(30 10% 35%)", fontFamily: "Georgia, serif" }}>{data.about}</p>
        </section>
        <section className="mb-16">
          <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>Selected Work</h2>
          <div className="space-y-8">
            {data.projects.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <div className="flex items-baseline justify-between border-b pb-4" style={{ borderColor: "hsl(30 15% 88%)" }}>
                  <div>
                    <h3 className="text-xl font-semibold" style={{ fontFamily: "Georgia, serif" }}>{p.title}</h3>
                    <p className="mt-1 text-sm" style={{ color: "hsl(30 10% 50%)" }}>{p.description}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 ml-4" style={{ color: accent }} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        <section className="mb-16">
          <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>Expertise</h2>
          <div className="flex flex-wrap gap-3">
            {data.skills.map((s) => (
              <span key={s} className="rounded-full px-4 py-1.5 text-sm" style={{ border: `1px solid ${accent}40`, color: accent }}>{s}</span>
            ))}
          </div>
        </section>
        <section className="mb-16">
          <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>Career</h2>
          <div className="space-y-6">
            {data.experience.map((e) => (
              <div key={e.role + e.company}>
                <h3 className="font-semibold" style={{ fontFamily: "Georgia, serif" }}>{e.role}</h3>
                <p className="text-sm" style={{ color: accent }}>{e.company} · {e.duration}</p>
                <p className="mt-1 text-sm" style={{ color: "hsl(30 10% 50%)" }}>{e.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="text-center">
          <SocialIcons links={data.socialLinks} color={accent} />
        </section>
      </div>
    </div>
  );
};

/* ====== AURORA GRADIENT ====== */
const AuroraGradient = ({ data }: { data: PortfolioData }) => (
  <div className="min-h-screen relative overflow-hidden" style={{ background: "hsl(250 30% 6%)", color: "hsl(0 0% 92%)" }}>
    <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full blur-[150px]" style={{ background: "hsl(280 70% 50% / 0.15)" }} />
    <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full blur-[120px]" style={{ background: "hsl(190 95% 50% / 0.12)" }} />
    <div className="absolute top-1/3 right-1/3 h-[300px] w-[300px] rounded-full blur-[100px]" style={{ background: "hsl(330 80% 50% / 0.08)" }} />
    <div className="relative mx-auto max-w-4xl px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20 text-center">
        <h1 className="mb-3 text-6xl font-extrabold" style={{ backgroundImage: "linear-gradient(135deg, hsl(280 70% 70%), hsl(190 95% 60%), hsl(330 80% 65%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{data.name}</h1>
        <p className="text-xl" style={{ color: "hsl(0 0% 55%)" }}>{data.title}</p>
      </motion.div>
      <section className="mb-16 text-center">
        <p className="mx-auto max-w-2xl text-lg leading-relaxed" style={{ color: "hsl(0 0% 65%)" }}>{data.about}</p>
      </section>
      <section className="mb-16">
        <h2 className="mb-6 text-center text-2xl font-bold" style={{ backgroundImage: "linear-gradient(90deg, hsl(280 70% 70%), hsl(190 95% 60%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Skills</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {data.skills.map((s, i) => (
            <span key={s} className="rounded-full px-4 py-2 text-sm" style={{ background: `hsl(${250 + i * 15} 50% 15%)`, border: `1px solid hsl(${250 + i * 15} 60% 30%)`, color: `hsl(${250 + i * 15} 70% 75%)` }}>{s}</span>
          ))}
        </div>
      </section>
      <section className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-bold" style={{ backgroundImage: "linear-gradient(90deg, hsl(280 70% 70%), hsl(190 95% 60%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Projects</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {data.projects.map((p) => (
            <div key={p.title} className="rounded-2xl p-6" style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.08)", backdropFilter: "blur(8px)" }}>
              <h3 className="mb-2 text-lg font-bold">{p.title}</h3>
              <p className="mb-3 text-sm" style={{ color: "hsl(0 0% 55%)" }}>{p.description}</p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <span key={tag} className="rounded-full px-2 py-0.5 text-xs" style={{ background: "hsl(280 70% 60% / 0.15)", color: "hsl(280 70% 75%)" }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-16">
        <h2 className="mb-6 text-center text-2xl font-bold" style={{ backgroundImage: "linear-gradient(90deg, hsl(280 70% 70%), hsl(190 95% 60%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Experience</h2>
        <div className="space-y-4">
          {data.experience.map((e) => (
            <div key={e.role + e.company} className="rounded-xl p-5" style={{ background: "hsl(0 0% 100% / 0.03)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
              <h3 className="font-semibold">{e.role}</h3>
              <p className="text-sm" style={{ backgroundImage: "linear-gradient(90deg, hsl(280 70% 70%), hsl(190 95% 60%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{e.company} · {e.duration}</p>
              <p className="mt-1 text-sm" style={{ color: "hsl(0 0% 50%)" }}>{e.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="text-center">
        <SocialIcons links={data.socialLinks} color="hsl(280 70% 70%)" />
      </section>
    </div>
  </div>
);

/* ====== BRUTALIST BOLD ====== */
const BrutalistBold = ({ data }: { data: PortfolioData }) => (
  <div className="min-h-screen" style={{ background: "hsl(0 0% 95%)", color: "hsl(0 0% 5%)" }}>
    <div className="mx-auto max-w-4xl px-6 py-20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16">
        <h1 className="mb-2 text-7xl font-black uppercase leading-none tracking-tighter">{data.name}</h1>
        <p className="text-xl font-mono uppercase tracking-wide" style={{ color: "hsl(0 0% 40%)" }}>{data.title}</p>
        <div className="mt-4 h-2 w-24 bg-black" />
      </motion.div>
      <section className="mb-16 border-4 border-black p-8">
        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.4em]">About</h2>
        <p className="text-lg leading-relaxed font-mono" style={{ color: "hsl(0 0% 25%)" }}>{data.about}</p>
      </section>
      <section className="mb-16">
        <h2 className="mb-6 text-xs font-black uppercase tracking-[0.4em]">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((s) => (
            <span key={s} className="border-2 border-black px-4 py-2 text-sm font-black uppercase">{s}</span>
          ))}
        </div>
      </section>
      <section className="mb-16">
        <h2 className="mb-6 text-xs font-black uppercase tracking-[0.4em]">Projects</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {data.projects.map((p) => (
            <div key={p.title} className="border-2 border-black p-6 transition-colors hover:bg-black hover:text-white">
              <h3 className="mb-2 text-xl font-black uppercase">{p.title}</h3>
              <p className="text-sm font-mono" style={{ opacity: 0.7 }}>{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <span key={tag} className="border px-2 py-0.5 text-[10px] font-mono uppercase" style={{ borderColor: "currentColor" }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-16">
        <h2 className="mb-6 text-xs font-black uppercase tracking-[0.4em]">Experience</h2>
        <div className="space-y-6">
          {data.experience.map((e) => (
            <div key={e.role + e.company} className="border-l-4 border-black pl-4">
              <h3 className="font-black uppercase">{e.role}</h3>
              <p className="text-sm font-mono">{e.company} · {e.duration}</p>
              <p className="mt-1 text-sm font-mono" style={{ color: "hsl(0 0% 40%)" }}>{e.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <SocialIcons links={data.socialLinks} color="hsl(0 0% 5%)" />
      </section>
    </div>
  </div>
);

export default PortfolioRenderer;
