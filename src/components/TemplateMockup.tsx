/**
 * Renders a unique mini-preview mockup for each template style.
 * Converted to strictly professional, premium light-theme styling.
 */
const TemplateMockup = ({ id, color }: { id: string; color: string }) => {
  switch (id) {
    case "tech-minimalist":
      return (
        <div className="absolute inset-0 p-4 flex flex-col justify-between" style={{ background: "hsl(210 40% 98%)" }}>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              <div className="h-1.5 w-16 bg-slate-900/10 rounded" />
            </div>
            <div className="h-3.5 w-36 rounded bg-slate-900/15 mb-2" />
            <div className="h-2 w-48 rounded bg-slate-900/8" />
            <div className="mt-1 h-2 w-36 rounded bg-slate-900/6" />
          </div>
          <div className="flex gap-2">
            {["React", "TypeScript", "Node"].map((t) => (
              <span key={t} className="rounded px-2 py-0.5 text-[8px] font-mono" style={{ background: `hsl(221.2 83.2% 53.3% / 0.08)`, color: "hsl(221.2 83.2% 53.3%)", border: `1px solid hsl(221.2 83.2% 53.3% / 0.15)` }}>{t}</span>
            ))}
          </div>
        </div>
      );

    case "retro-terminal":
      return (
        <div className="absolute inset-0 p-4 flex flex-col justify-between" style={{ background: "hsl(210 20% 96%)", border: "1px solid hsl(214.3 31.8% 90%)" }}>
          <div className="font-mono text-emerald-800 text-[8px] space-y-1.5">
            <p>&gt; whoami</p>
            <p className="text-emerald-900 font-bold">DEVELOPER_CONSOLE</p>
            <p>&gt; cat about.txt</p>
            <p className="text-emerald-950/70">Building next-gen web app solutions...</p>
          </div>
          <div className="flex gap-2 font-mono text-[7px] text-emerald-800/80">
            <span>[ABOUT]</span>
            <span>[SKILLS]</span>
            <span>[WORK]</span>
          </div>
        </div>
      );

    case "glass-aurora":
      return (
        <div className="absolute inset-0" style={{ background: "hsl(260 40% 98%)" }}>
          <div className="absolute top-4 left-1/4 h-16 w-28 rounded-full blur-[30px]" style={{ background: "hsl(280 70% 60% / 0.12)" }} />
          <div className="absolute bottom-6 right-1/4 h-12 w-24 rounded-full blur-[25px]" style={{ background: "hsl(190 95% 55% / 0.08)" }} />
          <div className="absolute inset-4 flex flex-col justify-between">
            <div className="backdrop-blur-xl bg-white/60 border border-slate-200 rounded-xl p-2.5 shadow-sm">
              <div className="h-3 w-24 rounded bg-slate-800/20 mb-1.5" />
              <div className="h-1.5 w-full bg-slate-800/8 rounded mb-1" />
              <div className="h-1.5 w-3/4 bg-slate-800/5 rounded" />
            </div>
            <div className="flex gap-2">
              {[1, 2].map((n) => (
                <div key={n} className="h-4 w-12 rounded bg-white border border-slate-200 shadow-sm" />
              ))}
            </div>
          </div>
        </div>
      );

    case "cyberpunk-glitch":
      return (
        <div className="absolute inset-0" style={{ background: "hsl(330 30% 98%)" }}>
          <div className="absolute inset-0 opacity-8" style={{ backgroundSize: "18px 18px", backgroundImage: `linear-gradient(hsl(330 100% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(330 100% 60%) 1px, transparent 1px)` }} />
          <div className="absolute inset-4 flex flex-col justify-between">
            <div className="border-l-2 border-fuchsia-500 pl-2">
              <div className="h-3.5 w-28 bg-fuchsia-500/80 rounded-sm" />
              <div className="h-1.5 w-20 bg-slate-900/10 mt-1.5" />
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-4 w-12 border border-fuchsia-500/25 bg-fuchsia-500/5" />
              ))}
            </div>
          </div>
        </div>
      );

    case "neobrutalist-bold":
      return (
        <div className="absolute inset-0 p-4 flex flex-col justify-between" style={{ background: "hsl(45 100% 93%)" }}>
          <div className="border-2 border-black bg-white p-2.5 shadow-[3px_3px_0px_#000] space-y-1.5">
            <div className="h-3 w-28 bg-black/80 rounded-none" />
            <div className="h-1.5 w-20 bg-black/30 rounded-none" />
          </div>
          <div className="flex gap-2">
            {[1, 2].map((n) => (
              <div key={n} className="h-4 w-14 bg-cyan-200 border-2 border-black text-[7px] font-bold text-center leading-3 shadow-[1.5px_1.5px_0px_#000]">LINK</div>
            ))}
          </div>
        </div>
      );

    case "elegant-serif":
      return (
        <div className="absolute inset-0 p-4 flex flex-col justify-between" style={{ background: "hsl(35 30% 96%)" }}>
          <div className="text-center space-y-2">
            <div className="h-4 w-32 mx-auto rounded bg-black/20 mb-1" />
            <div className="h-px w-12 mx-auto" style={{ background: "hsl(35 90% 45%)" }} />
            <div className="h-1.5 w-full bg-black/6 rounded" />
            <div className="h-1.5 w-4/5 mx-auto bg-black/5 rounded" />
          </div>
          <div className="flex justify-center gap-4 text-[7px] italic text-stone-500 font-serif">
            <span>about</span>
            <span>projects</span>
            <span>contact</span>
          </div>
        </div>
      );

    case "gradient-spotlight":
      return (
        <div className="absolute inset-0 p-4 overflow-hidden flex flex-col justify-between" style={{ background: "hsl(220 30% 98%)" }}>
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-blue-600/5 rounded-full blur-[40px] pointer-events-none" />
          <div className="relative">
            <div className="h-5 w-40 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent rounded" />
            <div className="mt-1 h-3.5 w-32 bg-slate-900/10 rounded" />
            <div className="mt-2 h-1.5 w-full bg-slate-900/5 rounded" />
            <div className="mt-1 h-1.5 w-3/4 bg-slate-900/4 rounded" />
          </div>
          <div className="flex gap-2">
            {[1, 2].map((n) => (
              <div key={n} className="h-4 w-16 bg-white border border-slate-200 rounded-lg shadow-sm" />
            ))}
          </div>
        </div>
      );

    case "interactive-timeline":
      return (
        <div className="absolute inset-0 p-4 flex gap-3" style={{ background: "hsl(210 20% 98%)" }}>
          <div className="w-1 relative border-l border-emerald-500/40 ml-1.5 my-1">
            <div className="absolute -left-[3px] top-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <div className="absolute -left-[3px] top-10 w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <div className="h-3 w-20 bg-emerald-700/80 rounded" />
              <div className="h-1.5 w-28 bg-black/10 rounded" />
            </div>
            <div className="space-y-1">
              <div className="h-3 w-16 bg-emerald-700/80 rounded" />
              <div className="h-1.5 w-24 bg-black/10 rounded" />
            </div>
          </div>
        </div>
      );

    case "card-deck":
      return (
        <div className="absolute inset-0 p-4 flex flex-col justify-between" style={{ background: "hsl(210 40% 97%)" }}>
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm">
            <div className="h-3 w-20 bg-indigo-600/80 rounded mb-1.5" />
            <div className="h-1.5 w-full bg-slate-900/5 rounded" />
          </div>
          <div className="flex gap-2 overflow-hidden">
            {[1, 2].map((n) => (
              <div key={n} className="h-14 w-28 bg-white border border-slate-200 rounded-xl p-2 shrink-0 shadow-sm">
                <div className="h-2 w-14 bg-slate-800/10 rounded mb-1" />
                <div className="h-1 w-16 bg-slate-900/5 rounded" />
              </div>
            ))}
          </div>
        </div>
      );

    case "dashboard-saas":
      return (
        <div className="absolute inset-0 p-3 flex flex-col justify-between font-mono" style={{ background: "hsl(210 40% 98%)" }}>
          <div className="flex items-center justify-between border-b border-slate-200 pb-1 text-[5px] text-slate-500">
            <span>DEV_CONSOLE // ACTIVE</span>
            <span className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <div className="grid grid-cols-3 gap-1.5 my-1.5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-slate-200 p-1.5 rounded-lg text-center shadow-sm">
                <div className="h-2 w-2 mx-auto bg-emerald-500/20 rounded" />
                <div className="mt-1 h-1 w-4 mx-auto bg-slate-400/40 rounded" />
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-200 p-2 rounded-lg shadow-sm">
            <div className="h-1.5 w-full bg-slate-900/5 rounded" />
          </div>
        </div>
      );

    default:
      return (
        <div className="absolute inset-0 p-4 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}10, hsl(210 40% 96%))` }}>
          <div className="h-3 w-24 rounded bg-slate-900/10" />
        </div>
      );
  }
};

export default TemplateMockup;
