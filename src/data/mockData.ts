export interface PortfolioData {
  id?: string;
  // Basic Info
  name: string;
  title: string;
  about: string;
  photo?: string;          // base64 data-URL or hosted URL
  email?: string;
  phone?: string;
  location?: string;
  website?: string;

  // Professional
  skills: string[];
  projects: {
    title: string;
    description: string;
    tags: string[];
    link: string;
    liveLink?: string;
    imageUrl?: string;     // project preview image (base64 or URL)
  }[];
  experience: {
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
  }[];

  // Extras
  socialLinks: { platform: string; url: string }[];
  certifications?: {
    name: string;
    issuer: string;
    date: string;
    imageUrl?: string;      // certificate image/badge (base64 or URL)
    credentialUrl?: string; // verify link
  }[];
  achievements?: string[];
  languages?: { name: string; level: string }[];

  // Custom Design Customize Settings
  designSettings?: {
    themeMode?: "dark" | "light";
    accentColor?: string;
    animationsEnabled?: boolean;
    scanlinesEnabled?: boolean;
    showOpportunitiesBadge?: boolean;
    opportunitiesText?: string;
    customCss?: string;
  };
}

export const defaultPortfolioData: PortfolioData = {
  name: "Rishi",
  title: "Full-Stack Developer & Cybersecurity Enthusiast",
  about:
    "Passionate developer with experience building secure, scalable web applications and e-governance portals. I specialize in full-stack engineering, secure software development, and modern cloud database architectures.",
  email: "sairishikumarvedi@gmail.com",
  phone: "+91 98765 43210",
  location: "Ananthapuramu, Andhra Pradesh, India",
  website: "https://rishi-212005.github.io/Personel-Portfolio/",
  designSettings: {
    themeMode: "dark",
    accentColor: "hsl(190 95% 55%)",
    animationsEnabled: true,
    scanlinesEnabled: true,
    showOpportunitiesBadge: true,
    opportunitiesText: "AVAILABLE FOR OPPORTUNITIES",
    customCss: ""
  },
  skills: [
    "React", "TypeScript", "JavaScript",
    "Node.js", "Express", "PHP", "Python",
    "MySQL", "MongoDB",
    "TailwindCSS", "Git", "Linux",
  ],
  projects: [
    {
      title: "Academia Authenticator",
      description:
        "An AI-powered academic verification system with OCR data extraction and secure credential parsing. Reduces manual verification time by 80%.",
      tags: ["Python", "OCR", "FastAPI", "MongoDB"],
      link: "https://github.com/Rishi-212005/Academia-Authenticator",
      liveLink: "https://rishi-212005.github.io/Personel-Portfolio/",
      imageUrl: "",
    },
    {
      title: "AI Raw Material Marketplace",
      description:
        "A secure B2B full-stack marketplace connecting manufacturers with verified raw material suppliers using AI-driven matching.",
      tags: ["React", "Node.js", "Express", "MySQL"],
      link: "https://github.com/Rishi-212005/AI-Marketplace",
      liveLink: "https://rishi-212005.github.io/Personel-Portfolio/",
      imageUrl: "",
    },
    {
      title: "InternConnect Campus Portal",
      description:
        "A centralized platform to streamline internship application workflows, evaluations, and certifications for 500+ students.",
      tags: ["PHP", "MySQL", "Bootstrap", "JS"],
      link: "https://github.com/Rishi-212005/InternConnect",
      liveLink: "https://rishi-212005.github.io/Personel-Portfolio/",
      imageUrl: "",
    },
  ],
  experience: [
    {
      role: "Software Engineer Intern",
      company: "National Informatics Centre (NIC)",
      duration: "May 2025 – Jul 2025",
      description:
        "Designed e-governance system workflows, implemented RBAC authentication modules, and optimized secure backend queries in PHP/MySQL. Collaborated with senior engineers on production-grade government portals.",
    },
  ],
  education: [
    {
      degree: "B.Tech Computer Science & Engineering",
      school: "JNTU Anantapur",
      year: "2023 – 2027",
    },
    {
      degree: "Intermediate – MPC (Science)",
      school: "Narayana Junior College",
      year: "2021 – 2023",
    },
  ],
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/Rishi-212005" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/sairishikumarvedi" },
    { platform: "Twitter", url: "https://twitter.com" },
  ],
  certifications: [
    {
      name: "NIC e-Governance Internship Certificate",
      issuer: "National Informatics Centre",
      date: "July 2025",
      imageUrl: "",
      credentialUrl: "",
    },
    {
      name: "Cybersecurity Fundamentals",
      issuer: "Infosys Springboard",
      date: "November 2024",
      imageUrl: "",
      credentialUrl: "",
    },
    {
      name: "Responsive Web Design",
      issuer: "freeCodeCamp",
      date: "August 2024",
      imageUrl: "",
      credentialUrl: "",
    },
  ],
  achievements: [
    "🏆 Top performer in JNTU Hackathon 2024 – secured 2nd place among 120 teams",
    "📜 Completed NIC e-Governance internship with distinction",
    "🎯 Built 3 full-stack projects used by 500+ real users",
    "🔒 Completed Ethical Hacking course with hands-on CTF challenges",
  ],
  languages: [
    { name: "Telugu", level: "Native" },
    { name: "English", level: "Professional" },
    { name: "Hindi", level: "Conversational" },
  ],
};

export const templateList = [
  {
    id: "tech-minimalist",
    name: "Tech Minimalist",
    description: "Ultra-clean dark layout with grid borders, monospace details, and neon indicators.",
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
