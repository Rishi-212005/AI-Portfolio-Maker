const LoadingSkeleton = ({ variant = "card" }: { variant?: "card" | "form" | "preview" }) => {
  if (variant === "form") {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-secondary" />
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-11 rounded-lg bg-secondary" />
            <div className="h-11 rounded-lg bg-secondary" />
          </div>
          <div className="h-28 rounded-lg bg-secondary" />
        </div>
      </div>
    );
  }

  if (variant === "preview") {
    return (
      <div className="flex h-screen animate-pulse">
        <div className="w-[400px] border-r border-border/30 p-4 space-y-4">
          <div className="h-8 w-32 rounded bg-secondary" />
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-secondary" />
                  <div className="h-3 w-1/2 rounded bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-8 space-y-6">
          <div className="h-10 w-64 rounded bg-secondary" />
          <div className="h-6 w-48 rounded bg-secondary" />
          <div className="h-32 rounded-xl bg-secondary" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {[1, 2, 3].map((n) => (
        <div key={n} className="glass-card rounded-2xl overflow-hidden">
          <div className="h-48 bg-secondary" />
          <div className="p-5 space-y-3">
            <div className="h-5 w-3/4 rounded bg-secondary" />
            <div className="h-3 w-full rounded bg-secondary" />
            <div className="h-10 w-full rounded-lg bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
