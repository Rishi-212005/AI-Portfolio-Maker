import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { templateList } from "@/data/mockData";
import TemplateMockup from "@/components/TemplateMockup";

const categories = ["All", "Dark", "Light", "Modern", "Creative"];

const Templates = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? templateList
    : templateList.filter((t) => t.categories?.includes(activeFilter));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <BackButton />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">
            Choose Your <span className="gradient-text">Template</span>
          </h1>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Select a template to get started. You can customize everything later with AI chat.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-2"
        >
          <Filter className="h-4 w-4 text-muted-foreground mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeFilter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              layout
            >
              <div className="glass-card hover-glow group overflow-hidden rounded-2xl transition-all hover:border-primary/30">
                <div
                  className="relative h-56 w-full overflow-hidden"
                  style={{
                    background: ["corporate-clean", "elegant-serif", "brutalist-bold"].includes(t.id)
                      ? `linear-gradient(135deg, hsl(0 0% 96%), hsl(0 0% 90%))`
                      : `linear-gradient(135deg, ${t.color}15, hsl(222 47% 8%))`
                  }}
                >
                  <TemplateMockup id={t.id} color={t.color} />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <Link to={`/preview/${t.id}`}>
                      <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                        <Eye className="h-4 w-4" />
                        Live Demo
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{t.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-primary" />
                      Responsive
                    </div>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{t.description}</p>
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {t.categories?.map((cat) => (
                      <span key={cat} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">{cat}</span>
                    ))}
                  </div>
                  <Link to={`/preview/${t.id}`}>
                    <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                      Use Template
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;
