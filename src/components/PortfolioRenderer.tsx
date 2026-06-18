import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Activity } from "lucide-react";
import type { PortfolioData } from "@/data/mockData";

interface Props {
  templateId: string;
  data: PortfolioData;
}

const PortfolioRenderer = ({ templateId, data }: Props) => {
  switch (templateId) {
    case "tech-minimalist":
      return <TechMinimalist data={data} />;
    case "retro-terminal":
      return <RetroTerminal data={data} />;
    case "glass-aurora":
      return <GlassAurora data={data} />;
    case "cyberpunk-glitch":
      return <CyberpunkGlitch data={data} />;
    case "neobrutalist-bold":
      return <NeobrutalistBold data={data} />;
    case "elegant-serif":
      return <ElegantEditorial data={data} />;
    case "gradient-spotlight":
      return <GradientSpotlight data={data} />;
    case "interactive-timeline":
      return <InteractiveTimeline data={data} />;
    case "card-deck":
      return <CardDeck data={data} />;
    case "dashboard-saas":
      return <DashboardSaas data={data} />;
    default:
      return <TechMinimalist data={data} />;
  }
};

const SocialIcons = ({ links, color }: { links: PortfolioData["socialLinks"]; color: string }) => (
  <div className="flex gap-4">
    {links.map((l) => (
      <a key={l.platform} href={l.url} target="_blank" rel="noreferrer" className="transition-transform hover:scale-110" style={{ color }}>
        {l.platform === "GitHub" && <Github className="h-5 w-5" />}
        {l.platform === "LinkedIn" && <Linkedin className="h-5 w-5" />}
        {l.platform === "Twitter" && <Twitter className="h-5 w-5" />}
      </a>
    ))}
  </div>
);

/* ====== 1. TECH MINIMALIST ====== */
const TechMinimalist = ({ data }: { data: PortfolioData }) => (
  <div className="min-h-screen bg-slate-950 text-slate-100 font-mono bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] py-16">
    <div className="mx-auto max-w-4xl px-6 space-y-12">
      <header className="border-b border-slate-800 pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/20 text-cyan-400 border border-cyan-800/30 text-xs mb-4">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          SYSTEM_STATUS: ONLINE // READY
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">{data.name}</h1>
        <p className="text-cyan-400 text-sm">{data.title}</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-cyan-400 text-xs font-bold uppercase tracking-widest">// ABOUT USER</h2>
        <p className="text-sm leading-relaxed text-slate-400 bg-slate-900/10 border border-slate-900 p-6 rounded-md">{data.about}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-cyan-400 text-xs font-bold uppercase tracking-widest">// SKILL INVENTORY</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((s) => (
            <span key={s} className="bg-cyan-950/20 text-cyan-400 border border-cyan-800/40 rounded-sm px-3 py-1 text-xs">{s}</span>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-cyan-400 text-xs font-bold uppercase tracking-widest">// REPOS / CODE STACK</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.projects.map((p) => (
            <div key={p.title} className="bg-slate-900/30 border border-slate-900 p-5 rounded-md hover:border-cyan-800/50 transition-colors">
              <h3 className="font-bold text-sm text-slate-200 mb-1">{p.title}</h3>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">{p.description}</p>
              <div className="flex flex-wrap gap-1">
                {p.tags.map((tag) => (
                  <span key={tag} className="text-[10px] text-cyan-500/80 bg-cyan-950/10 px-2 py-0.5 rounded-sm">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-cyan-400 text-xs font-bold uppercase tracking-widest">// PROFESSIONAL EXP</h2>
        <div className="space-y-6">
          {data.experience.map((e) => (
            <div key={e.role} className="border-l border-cyan-800/60 pl-6 space-y-1">
              <h3 className="font-bold text-sm text-slate-200">{e.role}</h3>
              <p className="text-xs text-cyan-400">{e.company} · {e.duration}</p>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">{e.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-cyan-400 text-xs font-bold uppercase tracking-widest">// ACADEMICS</h2>
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div key={edu.degree} className="border-l border-slate-800 pl-4 space-y-1">
              <p className="font-bold text-sm text-slate-200">{edu.degree}</p>
              <p className="text-xs text-slate-400">{edu.school} · {edu.year}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-900 pt-8 flex items-center justify-between">
        <SocialIcons links={data.socialLinks} color="hsl(190 95% 55%)" />
        <span className="text-[10px] text-slate-600">CONNECTED // PORTFOLIO</span>
      </footer>
    </div>
  </div>
);

/* ====== 2. RETRO TERMINAL ====== */
const RetroTerminal = ({ data }: { data: PortfolioData }) => (
  <div className="min-h-screen bg-black text-emerald-400 font-mono p-8 md:p-20">
    <div className="max-w-3xl mx-auto space-y-12 select-none border border-emerald-950 bg-black/60 p-6 md:p-10 shadow-2xl relative">
      <div className="absolute top-2 right-4 text-emerald-800 text-[10px]">ttys001 - CLI v1.2</div>
      
      <div className="text-[10px] text-emerald-700 font-mono mb-4">
        Last login: {new Date().toDateString()} on console
      </div>

      <div className="space-y-2">
        <p className="text-xs text-emerald-600">visitor@rishi-portfolio:~$ whoami</p>
        <h1 className="text-3xl font-bold text-emerald-300 uppercase">{data.name}</h1>
        <p className="text-sm text-emerald-400/90">&gt; {data.title}</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-emerald-600">visitor@rishi-portfolio:~$ cat about.txt</p>
        <p className="leading-relaxed text-sm text-emerald-400/80">{data.about}<span className="inline-block w-2.5 h-4 bg-emerald-400 ml-1 animate-pulse" /></p>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-emerald-600">visitor@rishi-portfolio:~$ query-skills</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-emerald-400/80">
          {data.skills.map((s) => (
            <span key={s} className="before:content-['[x]_']">{s}</span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs text-emerald-600">visitor@rishi-portfolio:~$ run get-projects</p>
        <div className="space-y-4">
          {data.projects.map((p) => (
            <div key={p.title} className="border border-emerald-950 p-4 bg-black/40">
              <p className="font-bold text-sm text-emerald-300">&gt; File: {p.title.toLowerCase().replace(/\s+/g, "_")}.conf</p>
              <p className="text-xs mt-1 text-emerald-400/70 leading-relaxed">{p.description}</p>
              <p className="text-[10px] mt-2 text-emerald-600">Tags: {p.tags.join(" / ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs text-emerald-600">visitor@rishi-portfolio:~$ query-career</p>
        <div className="space-y-4">
          {data.experience.map((e) => (
            <div key={e.role} className="space-y-1">
              <p className="text-sm font-semibold text-emerald-300">&gt; {e.role} @ {e.company}</p>
              <p className="text-xs text-emerald-600">{e.duration}</p>
              <p className="text-xs text-emerald-400/70 leading-relaxed">{e.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-emerald-600">visitor@rishi-portfolio:~$ query-education</p>
        {data.education.map((edu) => (
          <p key={edu.degree} className="text-sm">- {edu.degree} ({edu.school}, {edu.year})</p>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs text-emerald-600">visitor@rishi-portfolio:~$ net-socials --print</p>
        <div className="flex gap-4 text-xs font-bold text-emerald-300">
          {data.socialLinks.map((l) => (
            <span key={l.platform}>[{l.platform.toUpperCase()}]</span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ====== 3. GLASSMORPHIC AURORA ====== */
const GlassAurora = ({ data }: { data: PortfolioData }) => (
  <div className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-100 py-20 px-6">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[110px] pointer-events-none" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />
    
    <div className="relative mx-auto max-w-4xl space-y-10">
      <header className="backdrop-blur-xl bg-slate-900/40 border border-slate-700/20 p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 mb-2">{data.name}</h1>
        <p className="text-sm text-cyan-300 tracking-wider font-semibold uppercase">{data.title}</p>
      </header>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="sm:col-span-2 space-y-6">
          <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-700/20 p-6 rounded-2xl shadow-lg">
            <h2 className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-4">About Me</h2>
            <p className="text-slate-300 text-sm leading-relaxed">{data.about}</p>
          </div>

          <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-700/20 p-6 rounded-2xl shadow-lg space-y-4">
            <h2 className="text-purple-400 text-xs font-bold uppercase tracking-widest">Featured Works</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.projects.map((p) => (
                <div key={p.title} className="rounded-xl bg-slate-950/40 border border-slate-800/40 p-4">
                  <h3 className="font-bold text-sm text-slate-200 mb-1">{p.title}</h3>
                  <p className="text-xs text-slate-400 mb-2 leading-relaxed">{p.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {p.tags.map((tag) => (
                      <span key={tag} className="text-[9px] text-cyan-300/80 bg-cyan-950/20 px-1.5 py-0.5 rounded-sm">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-700/20 p-6 rounded-2xl shadow-lg space-y-4">
            <h2 className="text-purple-400 text-xs font-bold uppercase tracking-widest">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s) => (
                <span key={s} className="rounded-full bg-slate-800/40 px-3 py-1.5 text-xs text-purple-300 border border-purple-500/10 shadow-inner">{s}</span>
              ))}
            </div>
          </div>

          <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-700/20 p-6 rounded-2xl shadow-lg space-y-4">
            <h2 className="text-purple-400 text-xs font-bold uppercase tracking-widest">Career Pathway</h2>
            <div className="space-y-4">
              {data.experience.map((e) => (
                <div key={e.role} className="border-l border-purple-800/40 pl-4">
                  <h4 className="font-bold text-xs text-slate-200">{e.role}</h4>
                  <p className="text-[10px] text-cyan-300 mb-1">{e.company}</p>
                  <p className="text-[10px] text-slate-405 leading-relaxed">{e.duration}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-700/20 p-6 rounded-2xl shadow-lg space-y-4">
            <h2 className="text-purple-400 text-xs font-bold uppercase tracking-widest">Credentials</h2>
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.degree}>
                  <p className="font-semibold text-xs text-slate-200">{edu.degree}</p>
                  <p className="text-[10px] text-slate-455">{edu.school} · {edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="flex justify-between items-center border-t border-slate-900 pt-6">
        <SocialIcons links={data.socialLinks} color="hsl(280 70% 70%)" />
        <span className="text-[9px] text-slate-655 uppercase font-bold tracking-widest">Glass & Aurora Design</span>
      </footer>
    </div>
  </div>
);

/* ====== 4. CYBERPUNK GLITCH ====== */
const CyberpunkGlitch = ({ data }: { data: PortfolioData }) => (
  <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono py-20 px-6 relative bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]">
    <div className="mx-auto max-w-4xl space-y-12 border-l-4 border-fuchsia-500 pl-6 md:pl-10">
      <header className="space-y-2">
        <div className="text-[10px] text-fuchsia-500 font-bold uppercase tracking-widest">// SYSTEM DIRECTORY UPLINKED</div>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 uppercase tracking-tighter">{data.name}</h1>
        <p className="text-sm text-cyan-400 font-bold uppercase">// {data.title}</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-black uppercase tracking-[0.2em] text-xs">// OVERVIEW_INFO</h2>
        <p className="leading-relaxed text-sm text-zinc-400 border border-fuchsia-500/10 p-5 bg-zinc-900/30">{data.about}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-black uppercase tracking-[0.2em] text-xs">// SKILL_CHIPS</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((s) => (
            <span key={s} className="border border-fuchsia-500/40 bg-fuchsia-950/10 text-fuchsia-400 px-3 py-1.5 text-xs hover:bg-cyan-950/20 hover:border-cyan-500/40 transition-colors select-none">{s}</span>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-black uppercase tracking-[0.2em] text-xs">// DATA_REPOSITORIES</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.projects.map((p) => (
            <div key={p.title} className="border border-zinc-800 p-5 bg-zinc-900/40 hover:border-fuchsia-500/30 transition-colors">
              <h3 className="font-extrabold text-sm text-cyan-400 uppercase tracking-wide">{p.title}</h3>
              <p className="text-xs mt-1 text-zinc-400 leading-relaxed">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <span key={tag} className="text-[9px] border border-fuchsia-500/20 text-fuchsia-500/80 px-2 py-0.5 rounded-sm">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-black uppercase tracking-[0.2em] text-xs">// WORKPLACE_LOGS</h2>
        <div className="space-y-4">
          {data.experience.map((e) => (
            <div key={e.role} className="border-l border-fuchsia-500/50 pl-4 bg-zinc-900/10 p-4">
              <h3 className="font-semibold text-sm text-cyan-300 uppercase">{e.role}</h3>
              <p className="text-xs text-fuchsia-400 mb-2">{e.company} · {e.duration}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{e.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-black uppercase tracking-[0.2em] text-xs">// ACADEMICS_FILE</h2>
        {data.education.map((edu) => (
          <div key={edu.degree} className="border border-zinc-800 p-3 mb-2 bg-zinc-900/20">
            <p className="font-bold text-sm text-zinc-200">{edu.degree}</p>
            <p className="text-xs text-zinc-400">{edu.school} · {edu.year}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-zinc-900 pt-6 flex items-center justify-between text-xs">
        <SocialIcons links={data.socialLinks} color="hsl(330 100% 60%)" />
        <span className="text-fuchsia-500 uppercase tracking-wider">// CONNECTED_NODE</span>
      </footer>
    </div>
  </div>
);

/* ====== 5. NEOBRUTALIST BOLD ====== */
const NeobrutalistBold = ({ data }: { data: PortfolioData }) => (
  <div className="min-h-screen bg-amber-100 text-zinc-955 font-sans py-20 px-6">
    <div className="mx-auto max-w-3xl space-y-12 border-4 border-black bg-white p-8 md:p-12 shadow-[8px_8px_0px_#000] transition-all relative">
      <header className="border-b-4 border-black pb-8">
        <h1 className="text-5xl font-black uppercase tracking-tight leading-none mb-3">{data.name}</h1>
        <div className="inline-block bg-cyan-200 border-2 border-black px-4 py-1 text-xs font-black tracking-wide uppercase shadow-[2px_2px_0px_#000]">{data.title}</div>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2">WHO I AM</h2>
        <p className="leading-relaxed text-sm bg-yellow-50 border-2 border-black p-5 font-semibold shadow-[4px_4px_0px_#000]">{data.about}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2">MY CAPABILITIES</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((s) => (
            <span key={s} className="bg-violet-300 border-2 border-black px-4 py-2 text-xs font-black shadow-[3px_3px_0px_#000]">{s.toUpperCase()}</span>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2">PROJECT ARCHIVES</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.projects.map((p) => (
            <div key={p.title} className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform">
              <h3 className="font-extrabold text-sm text-black uppercase tracking-wide border-b-2 border-black pb-1 mb-2">{p.title}</h3>
              <p className="text-xs text-zinc-800 font-semibold mb-3 leading-relaxed">{p.description}</p>
              <div className="flex flex-wrap gap-1">
                {p.tags.map((tag) => (
                  <span key={tag} className="text-[9px] bg-emerald-200 border border-black px-2 py-0.5 font-bold uppercase">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2">STATIONS</h2>
        <div className="space-y-4">
          {data.experience.map((e) => (
            <div key={e.role} className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_#000]">
              <h3 className="font-black text-sm text-black uppercase">{e.role}</h3>
              <p className="text-xs font-bold text-violet-600 mb-2">{e.company} / {e.duration}</p>
              <p className="text-xs text-zinc-800 font-semibold leading-relaxed">{e.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2">STUDIES</h2>
        <div className="space-y-2">
          {data.education.map((edu) => (
            <div key={edu.degree} className="bg-white border-2 border-black p-3 mb-2 shadow-[2px_2px_0px_#000]">
              <p className="font-extrabold text-sm text-black">{edu.degree}</p>
              <p className="text-xs text-zinc-700">{edu.school} · {edu.year}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t-4 border-black pt-6 flex items-center justify-between">
        <SocialIcons links={data.socialLinks} color="hsl(0 0% 10%)" />
        <span className="text-xs font-black uppercase">NEOBRUTALIST STYLE</span>
      </footer>
    </div>
  </div>
);

/* ====== 6. ELEGANT EDITORIAL ====== */
const ElegantEditorial = ({ data }: { data: PortfolioData }) => (
  <div className="min-h-screen bg-[#fcfbf9] text-stone-900 font-serif py-24 px-6">
    <div className="max-w-2xl mx-auto space-y-16">
      <header className="text-center space-y-3">
        <h1 className="text-5xl font-normal tracking-tight leading-none mb-1 font-serif">{data.name}</h1>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 font-sans">{data.title}</p>
        <div className="mx-auto w-16 h-px bg-stone-300" />
      </header>

      <section className="text-center">
        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 mb-4 font-sans">Biography</h2>
        <p className="leading-[1.8] text-sm text-stone-700 italic font-serif max-w-xl mx-auto">{data.about}</p>
      </section>

      <section className="text-center">
        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 mb-4 font-sans">Core Skillsets</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {data.skills.map((s) => (
            <span key={s} className="text-stone-700 italic text-sm tracking-wide border border-stone-300/60 rounded-full px-4 py-1.5 bg-[#faf9f6]">{s}</span>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 text-center mb-6 font-sans">Selected Works</h2>
        <div className="space-y-8">
          {data.projects.map((p) => (
            <div key={p.title} className="border-b border-stone-200/60 pb-6 last:border-0">
              <h3 className="font-semibold text-lg text-stone-800 mb-2">{p.title}</h3>
              <p className="text-xs leading-[1.7] text-stone-600 mb-3 font-serif">{p.description}</p>
              <p className="text-[10px] tracking-wider text-stone-400 font-sans uppercase">Stack / {p.tags.join(" / ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 text-center mb-6 font-sans">Career Log</h2>
        <div className="space-y-6">
          {data.experience.map((e) => (
            <div key={e.role} className="space-y-1.5">
              <h3 className="font-bold text-sm text-stone-800">{e.role}</h3>
              <p className="text-xs italic text-stone-500">{e.company} · {e.duration}</p>
              <p className="text-xs text-stone-600 leading-[1.7] font-serif pt-1">{e.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 text-center mb-4 font-sans">Credentials</h2>
        <div className="space-y-2 text-center">
          {data.education.map((edu) => (
            <div key={edu.degree}>
              <p className="font-bold text-xs text-stone-800 font-serif">{edu.degree}</p>
              <p className="text-[10px] text-stone-500 font-sans">{edu.school} · {edu.year}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-stone-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
        <SocialIcons links={data.socialLinks} color="hsl(35 90% 45%)" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">Editorial Edition</span>
      </footer>
    </div>
  </div>
);

/* ====== 7. CREATIVE SPOTLIGHT ====== */
const GradientSpotlight = ({ data }: { data: PortfolioData }) => (
  <div className="min-h-screen bg-zinc-950 text-white font-sans py-24 px-6 relative overflow-hidden">
    <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
    
    <div className="max-w-4xl mx-auto space-y-16 relative z-10">
      <header className="space-y-4">
        <h1 className="text-6xl font-extrabold tracking-tighter bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">{data.name}</h1>
        <p className="text-lg text-zinc-300 max-w-xl leading-relaxed">{data.title}</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-zinc-500 uppercase tracking-widest text-xs font-bold font-mono">// INTRO SYSTEM</h2>
        <p className="text-base text-zinc-300 leading-relaxed font-light">{data.about}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-zinc-500 uppercase tracking-widest text-xs font-bold font-mono">// TOOL INVENTORY</h2>
        <div className="flex flex-wrap gap-2.5">
          {data.skills.map((s) => (
            <span key={s} className="rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2 text-xs font-medium shadow-md hover:border-zinc-700 transition-colors">{s}</span>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-zinc-500 uppercase tracking-widest text-xs font-bold font-mono">// CODE REPOSITORIES</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {data.projects.map((p) => (
            <div key={p.title} className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl hover:border-zinc-700/80 transition-all shadow-md">
              <h3 className="font-bold text-base text-zinc-100 mb-2">{p.title}</h3>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{p.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <span key={tag} className="text-[10px] text-blue-400 bg-blue-950/20 px-2.5 py-0.5 rounded-md font-semibold">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-zinc-500 uppercase tracking-widest text-xs font-bold font-mono">// TIMELINE STATIONS</h2>
        <div className="space-y-4">
          {data.experience.map((e) => (
            <div key={e.role} className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-2xl">
              <h3 className="font-bold text-base text-zinc-100">{e.role}</h3>
              <p className="text-xs text-indigo-400 font-semibold mb-2">{e.company} / {e.duration}</p>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">{e.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-zinc-500 uppercase tracking-widest text-xs font-bold font-mono">// ACADEMICS</h2>
        <div className="space-y-2">
          {data.education.map((edu) => (
            <div key={edu.degree} className="bg-zinc-900/20 p-4 rounded-xl border border-zinc-850">
              <p className="font-bold text-sm text-zinc-200">{edu.degree}</p>
              <p className="text-xs text-zinc-400">{edu.school} · {edu.year}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-900 pt-8 flex items-center justify-between">
        <SocialIcons links={data.socialLinks} color="hsl(220 90% 56%)" />
        <span className="text-xs font-mono text-zinc-600">// ONLINE</span>
      </footer>
    </div>
  </div>
);

/* ====== 8. INTERACTIVE TIMELINE ====== */
const InteractiveTimeline = ({ data }: { data: PortfolioData }) => (
  <div className="min-h-screen bg-slate-50 text-slate-800 py-24 px-6 font-sans">
    <div className="max-w-3xl mx-auto space-y-16 border-l-4 border-emerald-500 pl-6 md:pl-10 relative">
      <header className="space-y-2">
        <div className="absolute -left-[10px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-md" />
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">{data.name}</h1>
        <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">{data.title}</p>
      </header>

      <section className="space-y-4 relative">
        <div className="absolute -left-[30px] md:-left-[46px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
        <h2 className="text-emerald-700 text-base font-bold uppercase tracking-wider">About Me</h2>
        <p className="leading-relaxed text-sm text-slate-600 bg-white p-5 border border-slate-200/80 rounded-xl shadow-xs">{data.about}</p>
      </section>

      <section className="space-y-4 relative">
        <div className="absolute -left-[30px] md:-left-[46px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
        <h2 className="text-emerald-700 text-base font-bold uppercase tracking-wider">Skill Mapping</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((s) => (
            <span key={s} className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300/40 px-3.5 py-1 text-xs font-semibold">{s}</span>
          ))}
        </div>
      </section>

      <section className="space-y-6 relative">
        <div className="absolute -left-[30px] md:-left-[46px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
        <h2 className="text-emerald-700 text-base font-bold uppercase tracking-wider">Code Pipeline</h2>
        <div className="space-y-4">
          {data.projects.map((p) => (
            <div key={p.title} className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-sm text-slate-800">{p.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.description}</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <span key={tag} className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 relative">
        <div className="absolute -left-[30px] md:-left-[46px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
        <h2 className="text-emerald-700 text-base font-bold uppercase tracking-wider">Work Stations</h2>
        <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-[2px] before:bg-slate-200">
          {data.experience.map((e) => (
            <div key={e.role} className="relative pl-6">
              <div className="absolute left-[3px] top-1.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
              <h3 className="font-bold text-sm text-slate-800">{e.role}</h3>
              <p className="text-xs text-emerald-600 font-semibold">{e.company} · {e.duration}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{e.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 relative">
        <div className="absolute -left-[30px] md:-left-[46px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
        <h2 className="text-emerald-700 text-base font-bold uppercase tracking-wider">Studies</h2>
        <div className="space-y-2 pl-6">
          {data.education.map((edu) => (
            <div key={edu.degree}>
              <p className="font-semibold text-sm text-slate-800">{edu.degree}</p>
              <p className="text-xs text-slate-500">{edu.school} · {edu.year}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 pt-6 flex items-center justify-between">
        <SocialIcons links={data.socialLinks} color="hsl(150 80% 45%)" />
        <span className="text-xs font-semibold text-emerald-700">Timeline Engine</span>
      </footer>
    </div>
  </div>
);

/* ====== 9. 3D CARD DECK ====== */
const CardDeck = ({ data }: { data: PortfolioData }) => (
  <div className="min-h-screen bg-slate-900 text-slate-100 py-24 px-6 font-sans">
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="bg-slate-950 border border-slate-800/80 p-8 rounded-2xl shadow-xl space-y-2">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">{data.name}</h1>
        <p className="text-indigo-400 text-sm font-semibold uppercase tracking-wider">{data.title}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-slate-955 border border-slate-800/60 p-6 rounded-2xl shadow-lg hover:border-indigo-500/30 transition-all duration-300">
          <h2 className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">About Me</h2>
          <p className="leading-relaxed text-sm text-slate-300 font-light">{data.about}</p>
        </div>

        <div className="bg-slate-955 border border-slate-800/60 p-6 rounded-2xl shadow-lg hover:border-indigo-500/30 transition-all duration-300">
          <h2 className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Core Competencies</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <span key={s} className="bg-slate-900 text-slate-300 rounded-md px-3.5 py-1.5 text-xs font-semibold shadow-inner border border-slate-800">{s}</span>
            ))}
          </div>
        </div>

        <div className="bg-slate-955 border border-slate-800/60 p-6 rounded-2xl shadow-lg md:col-span-2 hover:border-indigo-500/30 transition-all duration-300 space-y-4">
          <h2 className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Featured Repositories</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.projects.map((p) => (
              <div key={p.title} className="bg-slate-900 border border-slate-800/80 p-5 rounded-xl hover:bg-slate-800/20 transition-colors">
                <h3 className="font-bold text-sm text-slate-200 mb-1">{p.title}</h3>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-indigo-400 bg-indigo-950/20 px-2 py-0.5 rounded-sm">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-955 border border-slate-800/60 p-6 rounded-2xl shadow-lg md:col-span-2 hover:border-indigo-500/30 transition-all duration-300 space-y-4">
          <h2 className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Chronological Pathway</h2>
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.role} className="border-l-2 border-indigo-500 pl-4 bg-slate-900/30 p-3 rounded-r-xl">
                <h3 className="font-bold text-sm text-slate-200">{e.role}</h3>
                <p className="text-xs text-indigo-400 mb-1">{e.company} · {e.duration}</p>
                <p className="text-xs text-slate-400 leading-relaxed font-light">{e.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-955 border border-slate-800/60 p-6 rounded-2xl shadow-lg md:col-span-2 hover:border-indigo-500/30 transition-all duration-300 space-y-4">
          <h2 className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Academics</h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.degree} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <p className="font-semibold text-xs text-slate-200">{edu.degree}</p>
                <p className="text-[10px] text-slate-400">{edu.school} · {edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-800 pt-6 flex items-center justify-between">
        <SocialIcons links={data.socialLinks} color="hsl(270 80% 65%)" />
        <span className="text-xs font-semibold text-slate-600">Card Deck layout</span>
      </footer>
    </div>
  </div>
);

/* ====== 10. SAAS DEVELOPER ====== */
const DashboardSaas = ({ data }: { data: PortfolioData }) => (
  <div className="min-h-screen bg-slate-955 text-slate-200 py-20 px-6 font-sans">
    <div className="max-w-4xl mx-auto space-y-8 border border-slate-800 bg-slate-950 rounded-2xl p-6 md:p-8 shadow-2xl relative">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
          <Activity className="h-4 w-4 text-emerald-400" />
          <span>Active Session // Developer Console</span>
        </div>
        <div className="text-[10px] bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-slate-400 font-mono">
          Atlas DB: Connected
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="sm:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-xl shadow-md space-y-2">
            <h2 className="text-xs font-bold uppercase text-slate-400 tracking-widest font-mono">// OVERVIEW</h2>
            <p className="text-sm leading-relaxed text-slate-400 font-light">{data.about}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-xl shadow-md space-y-4">
            <h2 className="text-xs font-bold uppercase text-slate-400 tracking-widest font-mono">// PIPELINE DEPLOYED</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.projects.map((p) => (
                <div key={p.title} className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-slate-200">{p.title}</h3>
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1 rounded font-mono">Up</span>
                  </div>
                  <p className="text-xs text-slate-450 leading-relaxed mb-3 font-light">{p.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {p.tags.map((tag) => (
                      <span key={tag} className="text-[10px] text-slate-500 font-mono bg-slate-955 px-1.5 py-0.5 rounded border border-slate-800">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-xl shadow-md space-y-3">
            <h2 className="text-xs font-bold uppercase text-slate-400 tracking-widest font-mono">// PACKAGES</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s) => (
                <span key={s} className="bg-slate-955 text-emerald-400 border border-emerald-950 rounded px-2.5 py-1 text-xs font-mono">{s}</span>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-xl shadow-md space-y-3">
            <h2 className="text-xs font-bold uppercase text-slate-400 tracking-widest font-mono">// LOG DETAILS</h2>
            <div className="space-y-3">
              {data.experience.map((e) => (
                <div key={e.role} className="text-xs space-y-1">
                  <h4 className="font-bold text-slate-200">{e.role}</h4>
                  <p className="text-slate-404">{e.company}</p>
                  <p className="text-slate-505 font-mono text-[10px]">{e.duration}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-xl shadow-md space-y-3">
            <h2 className="text-xs font-bold uppercase text-slate-400 tracking-widest font-mono">// DEGREES</h2>
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.degree} className="text-xs space-y-0.5">
                  <p className="font-bold text-slate-200">{edu.degree}</p>
                  <p className="text-[10px] text-slate-505 font-mono">{edu.school} · {edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-800 pt-6 flex items-center justify-between text-xs">
        <SocialIcons links={data.socialLinks} color="hsl(210 90% 50%)" />
        <span className="text-[10px] font-mono text-slate-600">// DASHBOARD END</span>
      </footer>
    </div>
  </div>
);

export default PortfolioRenderer;
