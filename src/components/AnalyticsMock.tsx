import { motion } from "framer-motion";
import { TrendingUp, Eye, MousePointerClick, BarChart3 } from "lucide-react";

const mockViewsData = [
  { day: "Mon", views: 45 },
  { day: "Tue", views: 62 },
  { day: "Wed", views: 78 },
  { day: "Thu", views: 95 },
  { day: "Fri", views: 110 },
  { day: "Sat", views: 88 },
  { day: "Sun", views: 130 },
];

const maxViews = Math.max(...mockViewsData.map((d) => d.views));

const AnalyticsMock = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Portfolio Analytics</h3>
        <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary font-medium">Live</span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Eye, label: "Total Views", value: "2,847", change: "+12.5%" },
          { icon: MousePointerClick, label: "Click Rate", value: "4.2%", change: "+2.1%" },
          { icon: TrendingUp, label: "Conversions", value: "186", change: "+8.3%" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl font-bold">{stat.value}</p>
            <span className="text-xs text-primary font-medium">{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card rounded-xl p-5">
        <p className="text-xs text-muted-foreground mb-4">Views this week</p>
        <div className="flex items-end gap-2 h-32">
          {mockViewsData.map((d, i) => (
            <motion.div
              key={d.day}
              initial={{ height: 0 }}
              whileInView={{ height: `${(d.views / maxViews) * 100}%` }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className="w-full rounded-t-md bg-primary/60 hover:bg-primary transition-colors cursor-default"
                style={{ height: "100%" }}
              />
              <span className="text-[10px] text-muted-foreground">{d.day}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Template Usage */}
      <div className="glass-card rounded-xl p-5">
        <p className="text-xs text-muted-foreground mb-3">Template Usage</p>
        <div className="space-y-2.5">
          {[
            { name: "Minimal Developer", pct: 42 },
            { name: "Modern Glass", pct: 28 },
            { name: "Creative Designer", pct: 18 },
            { name: "Corporate Clean", pct: 12 },
          ].map((t) => (
            <div key={t.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">{t.name}</span>
                <span className="font-medium">{t.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${t.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full bg-primary/70"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsMock;
