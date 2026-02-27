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
    id: "minimal-dark",
    name: "Minimal Developer",
    description: "Clean dark theme perfect for developers who let their code speak.",
    preview: "Dark background, monospace accents, subtle animations",
    color: "hsl(190 95% 55%)",
    categories: ["Dark", "Modern"],
  },
  {
    id: "creative-colorful",
    name: "Creative Designer",
    description: "Bold colors and playful animations for creative professionals.",
    preview: "Vibrant gradients, animated sections, dynamic layout",
    color: "hsl(330 80% 60%)",
    categories: ["Creative", "Dark"],
  },
  {
    id: "corporate-clean",
    name: "Corporate Professional",
    description: "Elegant white layout for business-oriented portfolios.",
    preview: "Clean white, structured sections, professional typography",
    color: "hsl(220 60% 50%)",
    categories: ["Light", "Modern"],
  },
  {
    id: "glassmorphism",
    name: "Modern Glass",
    description: "Frosted glass aesthetic with depth and modern flair.",
    preview: "Glass cards, blur effects, gradient backgrounds",
    color: "hsl(270 80% 65%)",
    categories: ["Modern", "Creative", "Dark"],
  },
  {
    id: "neon-cyberpunk",
    name: "Neon Cyberpunk",
    description: "Futuristic neon-lit design with glowing accents and bold typography.",
    preview: "Neon glows, dark grid, cyberpunk aesthetic",
    color: "hsl(160 100% 50%)",
    categories: ["Dark", "Creative"],
  },
  {
    id: "elegant-serif",
    name: "Elegant Editorial",
    description: "Sophisticated serif typography with a magazine-style layout.",
    preview: "Serif fonts, editorial layout, warm tones",
    color: "hsl(35 90% 55%)",
    categories: ["Light", "Modern"],
  },
  {
    id: "gradient-aurora",
    name: "Aurora Gradient",
    description: "Mesmerizing aurora-inspired gradients with smooth flowing sections.",
    preview: "Aurora gradients, smooth transitions, ethereal feel",
    color: "hsl(280 70% 60%)",
    categories: ["Dark", "Creative"],
  },
  {
    id: "brutalist-bold",
    name: "Brutalist Bold",
    description: "Raw, unapologetic design with heavy borders and stark contrasts.",
    preview: "Heavy borders, monospace, raw aesthetic",
    color: "hsl(0 0% 85%)",
    categories: ["Light", "Creative"],
  },
];

export const mockChatResponses: Record<string, string> = {
  "dark mode": "✨ Done! I've switched your portfolio to dark mode. The background is now a deep navy with light text for better contrast.",
  "blue": "🎨 Theme color updated to blue! All accent elements now use a vibrant blue tone.",
  "about": "✍️ I've rewritten your about section with a more professional tone. Check the preview!",
  "animation": "🎬 Added smooth fade-in animations to your skills section. Each skill card now enters with a staggered delay.",
  "default": "🤖 Got it! I've made the changes to your portfolio. Take a look at the preview to see the updates.",
};
