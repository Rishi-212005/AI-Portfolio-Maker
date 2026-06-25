export interface PortfolioData {
  id?: string;
  name: string;
  title: string;
  about: string;
  photo?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  skills: string[];
  projects: {
    _id?: string;
    title: string;
    description: string;
    tags: string[];
    link: string;
    liveLink?: string;
    imageUrl?: string;
  }[];
  experience: {
    _id?: string;
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    _id?: string;
    degree: string;
    school: string;
    year: string;
  }[];
  socialLinks: { _id?: string; platform: string; url: string }[];
  certifications?: {
    _id?: string;
    name?: string;
    issuer?: string;
    date: string;
    imageUrl?: string;
    credentialUrl?: string;
  }[];
  achievements?: string[];
  languages?: { _id?: string; name: string; level: string }[];
  designSettings?: {
    _id?: string;
    themeMode?: "dark" | "light";
    accentColor?: string;
    animationsEnabled?: boolean;
    scanlinesEnabled?: boolean;
    showOpportunitiesBadge?: boolean;
    opportunitiesText?: string;
    customCss?: string;
  };
  templateId?: string;
  sectionOrder?: string[];
}

export const defaultPortfolioData: PortfolioData = {
  "id": "6a36901eb0d497b2bdbcecb8",
  "name": "SAI RISHI KUMAR VEDI",
  "title": "Full-stack and AI/ML Engineering Student",
  "about": "Full-stack and AI/ML engineering student with hands-on experience building production-grade web applications, REST APIs, and machine learning pipelines. Deployed AI models at an EdTech startup, interned with the Government of India on live e-Governance systems, and shipped a multi-modal deep learning solution. Skilled end-to-end across model training, scalable backend development, and real-world deployment.",
  "photo": "",
  "email": "sairishikumar.2005@gmail.com",
  "phone": "+91 9390455681",
  "location": "Anantapur, India",
  "website": "",
  "skills": [
    "JavaScript",
    "Python",
    "PHP",
    "SQL",
    "TypeScript",
    "React.js",
    "HTML5",
    "CSS3",
    "Tailwind CSS",
    "Bootstrap",
    "Node.js",
    "Express.js",
    "FastAPI",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "REST APIs",
    "Machine Learning",
    "Deep Learning",
    "Computer Vision",
    "Natural Language Processing",
    "TensorFlow",
    "Scikit-learn",
    "EfficientNetB0",
    "TF-IDF",
    "OCR",
    "Model Training",
    "Feature Engineering",
    "Data Preprocessing",
    "Hyperparameter Tuning",
    "Git",
    "GitHub",
    "CI/CD",
    "VS Code",
    "Scalable Architecture",
    "System Reliability",
    "Agile Development",
    "Stakeholder Collaboration"
  ],
  "projects": [
    {
      "title": "Academic Authenticator - AI Certificate Verification",
      "description": "Built an AI-driven document verification system using OCR and computer vision to detect forged academic certificates, reducing manual verification effort by over 70%. Developed REST APIs for automated fraud detection, enabling data-driven authenticity analysis across 500+ certificate types.",
      "tags": [
        "Python",
        "OCR",
        "Node.js",
        "MySQL",
        "REST APIs"
      ],
      "link": "https://github.com/Rishi-212005/ACADEMIC-AUTHENTICATOR",
      "liveLink": "https://academicauthenticator.free.nf",
      "imageUrl": "",
      "_id": "6a3b8380eefa5034645d524e"
    },
    {
      "title": "ML Smart Price Prediction - Hybrid Image and Text Model",
      "description": "Designed a multi-modal deep learning model fusing EfficientNetB0 (computer vision) and NLP-based TF-IDF embeddings to predict product prices across 10,000+ listings with low MAE. Engineered end-to-end ML pipelines for parallel image processing, text vectorization, and feature serialization, significantly reducing inference overhead.",
      "tags": [
        "Python",
        "TensorFlow",
        "Deep Learning",
        "EfficientNetB0",
        "TF-IDF",
        "FastAPI"
      ],
      "link": "https://github.com/Rishi-212005/ML-Smart-Price-Prediction",
      "liveLink": "",
      "imageUrl": "",
      "_id": "6a3b8380eefa5034645d524f"
    },
    {
      "title": "Campus Internship and Placement Portal",
      "description": "Architected a full-stack platform with five role-based dashboards and Supabase Realtime integration for live application tracking and automated notifications across user roles.",
      "tags": [
        "React 18",
        "TypeScript",
        "Tailwind CSS",
        "Supabase",
        "REST APIs"
      ],
      "link": "https://github.com/Rishi-212005/InternConnect-Campus-Portal",
      "liveLink": "",
      "imageUrl": "",
      "_id": "6a3b8380eefa5034645d5250"
    }
  ],
  "experience": [
    {
      "role": "AI/ML Intern",
      "company": "Saral Vidhya",
      "duration": "May 2026 - Jul 2026",
      "description": "Trained machine learning and deep learning models for three EdTech products - Saral Vidhya (adaptive learning), Nirnayah (AI-powered academic grading), and Bodhana (intelligent tutoring assistant). Built FastAPI backend with JWT authentication and CRUD operations for model inference; deployed saralvidhya.com (React) with real-time student performance analytics.",
      "_id": "6a3b8380eefa5034645d524c"
    },
    {
      "role": "Web Development Intern",
      "company": "National Informatics Centre (NIC), Govt. of India",
      "duration": "May 2025 - Jul 2025",
      "description": "Developed CRUD modules for a live e-Governance platform using PHP, MySQL, and JavaScript; enforced role-based authentication following government security standards. Structured REST APIs and backend validation logic, improving system efficiency and maintainability across cross-functional teams.",
      "_id": "6a3b8380eefa5034645d524d"
    }
  ],
  "education": [
    {
      "degree": "B.Tech Computer Science",
      "school": "JNTU Anantapur",
      "year": "2023 – 2027",
      "_id": "6a3b8380eefa5034645d524b"
    }
  ],
  "socialLinks": [
    {
      "platform": "GitHub",
      "url": "",
      "_id": "6a3b8380eefa5034645d5249"
    },
    {
      "platform": "LinkedIn",
      "url": "",
      "_id": "6a3b8380eefa5034645d524a"
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": "",
      "imageUrl": "",
      "credentialUrl": "",
      "_id": "6a3b8380eefa5034645d5246"
    },
    {
      "name": "",
      "issuer": "",
      "date": "",
      "imageUrl": "",
      "credentialUrl": "",
      "_id": "6a3b8380eefa5034645d5247"
    },
    {
      "name": "",
      "issuer": "",
      "date": "",
      "imageUrl": "",
      "credentialUrl": "",
      "_id": "6a3b8380eefa5034645d5248"
    }
  ],
  "achievements": [],
  "languages": [],
  "designSettings": {
    "themeMode": "dark",
    "accentColor": "hsl(190 95% 55%)",
    "animationsEnabled": true,
    "scanlinesEnabled": true,
    "showOpportunitiesBadge": true,
    "opportunitiesText": "AVAILABLE FOR OPPORTUNITIES",
    "customCss": "",
    "_id": "6a3b8380eefa5034645d5245"
  },
  "templateId": "retro-terminal",
  "sectionOrder": [
    "about",
    "skills",
    "projects",
    "experience",
    "education",
    "certifications",
    "contact"
  ]
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
