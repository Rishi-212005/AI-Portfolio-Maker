/**
 * Renders a unique mini-preview mockup for each template style.
 * Used on landing page template cards and Templates page.
 */
const TemplateMockup = ({ id, color }: { id: string; color: string }) => {
  switch (id) {
    case "minimal-dark":
      return (
        <div className="absolute inset-0 p-4 flex flex-col justify-between" style={{ background: "hsl(222 47% 6%)" }}>
          <div>
            <div className="h-2 w-14 rounded-full mb-2" style={{ background: color }} />
            <div className="h-3.5 w-36 rounded bg-white/15 mb-2" />
            <div className="h-2 w-48 rounded bg-white/8" />
            <div className="mt-1 h-2 w-36 rounded bg-white/6" />
          </div>
          <div className="flex gap-2">
            {["React", "TypeScript", "Node"].map((t) => (
              <span key={t} className="rounded px-2 py-0.5 text-[8px] font-mono" style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>{t}</span>
            ))}
          </div>
        </div>
      );

    case "creative-colorful":
      return (
        <div className="absolute inset-0 p-4 flex flex-col items-center justify-center text-center" style={{ background: "hsl(330 30% 8%)" }}>
          <div className="h-10 w-10 rounded-full mb-2" style={{ background: `linear-gradient(135deg, ${color}, hsl(40 90% 60%))` }} />
          <div className="h-3.5 w-28 rounded mb-1" style={{ background: `linear-gradient(90deg, ${color}, hsl(40 90% 60%))`, opacity: 0.8 }} />
          <div className="h-2 w-36 rounded bg-white/10 mb-3" />
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-10 w-14 rounded-lg" style={{ background: `hsl(${330 + n * 40} 60% 15%)`, border: `1px solid hsl(${330 + n * 40} 60% 30%)` }}>
                <div className="m-1.5 h-1.5 w-7 rounded bg-white/15" />
                <div className="mx-1.5 h-1 w-5 rounded bg-white/8" />
              </div>
            ))}
          </div>
        </div>
      );

    case "corporate-clean":
      return (
        <div className="absolute inset-0 p-4 flex gap-3" style={{ background: "hsl(0 0% 97%)" }}>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 rounded bg-black/20" />
            <div className="h-2 w-16 rounded" style={{ background: color, opacity: 0.6 }} />
            <div className="mt-3 h-px w-full bg-black/10" />
            <div className="h-2 w-full rounded bg-black/8" />
            <div className="h-2 w-3/4 rounded bg-black/6" />
            <div className="h-2 w-5/6 rounded bg-black/5" />
          </div>
          <div className="w-16 space-y-1.5">
            {["Skills", "Work", "About"].map((s) => (
              <div key={s} className="rounded px-1.5 py-0.5 text-[7px] text-center" style={{ background: `${color}15`, color }}>{s}</div>
            ))}
          </div>
        </div>
      );

    case "glassmorphism":
      return (
        <div className="absolute inset-0 p-4 flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(270 40% 12%), hsl(222 47% 8%))" }}>
          <div className="h-3.5 w-32 rounded bg-white/15 mb-2" />
          <div className="h-2 w-24 rounded bg-white/8 mb-3" />
          <div className="flex gap-2">
            {[1, 2].map((n) => (
              <div key={n} className="h-14 w-24 rounded-xl p-2" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                <div className="mb-1 h-2 w-12 rounded" style={{ background: `${color}40` }} />
                <div className="h-1.5 w-16 rounded bg-white/8" />
                <div className="mt-1 h-1.5 w-12 rounded bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      );

    case "neon-cyberpunk":
      return (
        <div className="absolute inset-0" style={{ background: "hsl(222 47% 4%)" }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundSize: "18px 18px", backgroundImage: `linear-gradient(${color}30 1px, transparent 1px), linear-gradient(90deg, ${color}30 1px, transparent 1px)` }} />
          <div className="absolute inset-4 flex flex-col justify-between">
            <div>
              <div className="h-4 w-28 rounded" style={{ background: color, boxShadow: `0 0 16px ${color}80` }} />
              <div className="h-2 w-40 rounded bg-white/10 mt-2" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-8 w-16 rounded border p-1.5" style={{ borderColor: `${color}40`, boxShadow: `inset 0 0 8px ${color}10` }}>
                  <div className="h-1.5 w-10 rounded" style={{ background: `${color}60` }} />
                  <div className="mt-1 h-1 w-7 rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "elegant-serif":
      return (
        <div className="absolute inset-0 p-4 flex flex-col justify-between" style={{ background: "hsl(35 30% 95%)" }}>
          <div>
            <div className="h-4 w-36 rounded bg-black/25 mb-2" />
            <div className="h-px w-14 rounded" style={{ background: color }} />
            <div className="mt-3 h-2 w-full rounded bg-black/8" />
            <div className="mt-1 h-2 w-4/5 rounded bg-black/6" />
            <div className="mt-1 h-2 w-3/5 rounded bg-black/5" />
          </div>
          <div className="flex gap-2">
            {[1, 2].map((n) => (
              <div key={n} className="h-12 w-20 rounded-lg overflow-hidden" style={{ background: `${color}15` }}>
                <div className="h-7 w-full" style={{ background: `${color}20` }} />
                <div className="m-1 h-1.5 w-14 rounded bg-black/10" />
              </div>
            ))}
          </div>
        </div>
      );

    case "gradient-aurora":
      return (
        <div className="absolute inset-0" style={{ background: "hsl(260 40% 8%)" }}>
          <div className="absolute top-4 left-1/4 h-16 w-28 rounded-full blur-[30px]" style={{ background: "hsl(280 70% 60% / 0.4)" }} />
          <div className="absolute bottom-6 right-1/4 h-12 w-24 rounded-full blur-[25px]" style={{ background: "hsl(190 95% 55% / 0.3)" }} />
          <div className="absolute inset-4 flex flex-col items-center justify-center text-center">
            <div className="h-4 w-32 rounded mb-2" style={{ background: "linear-gradient(90deg, hsl(280 70% 70%), hsl(190 95% 60%))", opacity: 0.8 }} />
            <div className="h-2 w-40 rounded bg-white/10 mb-3" />
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-10 w-16 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="m-1.5 h-1.5 rounded" style={{ background: `hsl(${250 + n * 30} 70% 65% / 0.5)`, width: `${50 + n * 8}%` }} />
                  <div className="mx-1.5 h-1 w-3/4 rounded bg-white/6" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "brutalist-bold":
      return (
        <div className="absolute inset-0 p-4 flex flex-col justify-between" style={{ background: "hsl(0 0% 93%)" }}>
          <div>
            <div className="h-5 w-40 rounded-none bg-black/80 mb-1" />
            <div className="h-2.5 w-28 rounded-none bg-black/40" />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 w-20 border-2 border-black/60 p-1.5">
                <div className="mb-1 h-2 w-14 bg-black/30" />
                <div className="h-1.5 w-10 bg-black/15" />
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="absolute inset-0 p-4 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}20, hsl(222 47% 8%))` }}>
          <div className="h-3 w-24 rounded bg-white/15" />
        </div>
      );
  }
};

export default TemplateMockup;
