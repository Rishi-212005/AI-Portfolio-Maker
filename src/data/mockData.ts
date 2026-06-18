import { UserRound } from "lucide-react";

export interface PortfolioData {
  name: string;
  title: string;
  about: string;
  skills: string[];
  projects: { title: string; description: string; tags: string[]; link: string }[];
  experience: { role: string; company: string; duration: string; description: string }[];
  education: { degree: string; school: string; year: string }[];
  socialLinks: { platform: string; url: string }[];
}

export const defaultPortfolioData: PortfolioData = {
  name: "Alex Johnson",
  title: "Full-Stack Developer & UI Designer",
  about: "Passionate developer with 5+ years of experience building modern web applications. I specialize in React, TypeScript, and Node.js, crafting elegant solutions that bridge design and engineering.",
  skills: ["React", "TypeScript", "Node.js", "Python", "Figma", "AWS", "GraphQL", "TailwindCSS", "Docker", "PostgreSQL"],
  projects: [
    {
      title: "CloudSync Dashboard",
      description: "A real-time data visualization dashboard for cloud infrastructure monitoring with live metrics and alerts.",
      tags: ["React", "D3.js", "WebSocket"],
      link: "#",
    },
    {
      title: "AI Content Studio",
      description: "An AI-powered content creation platform that generates, edits, and optimizes marketing copy.",
      tags: ["Next.js", "OpenAI", "Prisma"],
      link: "#",
    },
    {
      title: "FinTrack Mobile",
      description: "A personal finance tracker with budget analytics, spending insights, and bank integration.",
      tags: ["React Native", "Firebase", "Plaid"],
      link: "#",
    },
    {
      title: "DevCollab",
      description: "A collaborative code editor with real-time pair programming, video chat, and version control.",
      tags: ["WebRTC", "Monaco", "Socket.io"],
      link: "#",
    },
  ],
  experience: [
    {
      role: "Senior Frontend Engineer",
      company: "TechCorp Inc.",
      duration: "2022 - Present",
      description: "Leading the frontend architecture for a SaaS platform serving 50K+ users.",
    },
    {
      role: "Full-Stack Developer",
      company: "StartupXYZ",
      duration: "2020 - 2022",
      description: "Built and maintained multiple client-facing applications using React and Node.js.",
    },
    {
      role: "Junior Developer",
      company: "WebAgency",
      duration: "2018 - 2020",
      description: "Developed responsive websites and web applications for various clients.",
    },
  ],
  education: [
    { degree: "B.S. Computer Science", school: "MIT", year: "2018" },
    { degree: "Full-Stack Bootcamp", school: "Codecademy", year: "2017" },
  ],
  socialLinks: [
    { platform: "GitHub", url: "https://github.com" },
    { platform: "LinkedIn", url: "https://linkedin.com" },
    { platform: "Twitter", url: "https://twitter.com" },
  ],
};

export const templateList = [
  {
    id: "tech-minimalist",
    name: "Tech Minimalist",
    description: "Ultra-clean dark layout with grid boarders, monospace details, and neon indicators.",
    preview: "Dark gray grid, cyan highlights, active status node",
    color: "hsl(190 95% 55%)",
    categories: ["Dark", "Modern"],
  },
  {
    id: "retro-terminal",
    name: "Retro Terminal",
    description: "A functional CLI-themed portfolio emulator with custom type prompts and retro font.",
    preview: "Terminal console style, green phosphor, command cursor",
    color: "hsl(120 100% 45%)",
    categories: ["Dark", "Creative"],
  },
  {
    id: "glass-aurora",
    name: "Glassmorphic Aurora",
    description: "Frosted translucent sheets overlaid on animated moving aurora gradient layers.",
    preview: "Frosted glass panels, moving aurora backing, micro-shadows",
    color: "hsl(280 70% 60%)",
    categories: ["Dark", "Modern", "Creative"],
  },
  {
    id: "cyberpunk-glitch",
    name: "Cyberpunk Glitch",
    description: "Stark matrix styling, scanline overlays, neon pink/green accents, and glitch text effects.",
    preview: "Neon lines, scanlines, digital glitch effects",
    color: "hsl(330 100% 60%)",
    categories: ["Dark", "Creative"],
  },
  {
    id: "neobrutalist-bold",
    name: "Neobrutalist Bold",
    description: "Stark flat colors, high-impact heavy borders, and solid retro drop shadow boxes.",
    preview: "Heavy 4px borders, offset shadows, stark primary background",
    color: "hsl(0 0% 10%)",
    categories: ["Light", "Creative"],
  },
  {
    id: "elegant-serif",
    name: "Elegant Editorial",
    description: "Sophisticated serif typography with elegant line separators and editorial magazine layout.",
    preview: "Classic serif typography, newspaper style grids, clean ivory background",
    color: "hsl(35 90% 45%)",
    categories: ["Light", "Modern"],
  },
  {
    id: "gradient-spotlight",
    name: "Creative Spotlight",
    description: "Clean modern design with massive typography and mouse-interactive lighting effects.",
    preview: "Interactive glow focus, large headlines, radial color bleed",
    color: "hsl(220 90% 56%)",
    categories: ["Dark", "Creative", "Modern"],
  },
  {
    id: "interactive-timeline",
    name: "Product Timeline",
    description: "Interactive horizontal or vertical timeline layouts with connected roadmap nodes.",
    preview: "Connected roadmaps, experience branches, step animations",
    color: "hsl(150 80% 45%)",
    categories: ["Light", "Modern"],
  },
  {
    id: "card-deck",
    name: "3D Card Stack",
    description: "Visual split screen featuring stacked interactive floating details panels.",
    preview: "Perspective card layering, parallax hover depth, page transitions",
    color: "hsl(270 80% 65%)",
    categories: ["Dark", "Creative"],
  },
  {
    id: "dashboard-saas",
    name: "SaaS Developer",
    description: "Metrics-inspired modern layout utilizing mock graphs and modular developer dashboard cards.",
    preview: "Modular dashboard tabs, mini metrics, tech badges",
    color: "hsl(210 90% 50%)",
    categories: ["Dark", "Modern"],
  },
];

export const mockChatResponses: Record<string, string> = {
  "dark mode": "✨ Done! I've switched your portfolio to dark mode. The background is now a deep navy with light text for better contrast.",
  "blue": "🎨 Theme color updated to blue! All accent elements now use a vibrant blue tone.",
  "about": "✍️ I've rewritten your about section with a more professional tone. Check the preview!",
  "animation": "🎬 Added smooth fade-in animations to your skills section. Each skill card now enters with a staggered delay.",
  "default": "🤖 Got it! I've made the changes to your portfolio. Take a look at the preview to see the updates.",
};
