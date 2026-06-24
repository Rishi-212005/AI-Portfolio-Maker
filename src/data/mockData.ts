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
    name: string;
    issuer: string;
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
  "name": "Aditya Ballari Nallari",
  "title": "Aspiring AI and Data Science Engineer",
  "about": "Aspiring AI and Data Science Engineer with foundamentals in Python, Machine Learning, and Data Analysis. Skilled in TensorFlow, Pandas, and Scikit-learn for building intelligent systems and extracting insights from data. Experienced in full-stack development and developing scalable, real-world applications using modern technologies. Passionate about solving real-world problems using data-driven approaches.",
  "photo": "",
  "email": "adityabn24@gmail.com",
  "phone": "+91 9502849549",
  "location": "",
  "website": "",
  "skills": [
    "Java",
    "Python",
    "SQL",
    "HTML",
    "CSS",
    "TensorFlow",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "Matplotlib",
    "React",
    "Spring Boot",
    "MongoDB",
    "MySQL",
    "Oracle XE",
    "REST APIs",
    "JWT Authentication",
    "Flyway Migrations",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Full-Stack Development"
  ],
  "projects": [
    {
      "title": "Data Science Assistant using Generative AI",
      "description": "Developed an AI-powered assistant to automate end-to-end data science workflows including data cleaning, analysis, visualization, and model generation. Integrated Generative AI models to generate insights, Python code, statistical summaries, and predictive models from natural language inputs. Implemented natural language processing to interpret both technical and non-technical queries and generate context-aware outputs. Automated exploratory data analysis (EDA) including missing value detection, correlation analysis, and feature importance identification. Generated dynamic visualizations using Matplotlib to improve interpretability of datasets and model outputs.",
      "tags": [
        "Generative AI",
        "Natural Language Processing",
        "Data Science",
        "Matplotlib",
        "Python"
      ],
      "link": "",
      "liveLink": "",
      "imageUrl": "",
      "_id": "6a3a82df52a4a535e8752683"
    },
    {
      "title": "Helmet Detection System for Motorcycle Safety Enforcement",
      "description": "Developed a computer vision-based system to automatically detect helmet usage in images for road and workplace safety compliance. Built a preprocessing pipeline to extract Regions of Interest (ROI) from XML-annotated datasets, resize images, and convert them into grayscale feature vectors. Trained a Random Forest Classifier on structured image features to classify helmet vs non-helmet cases. Designed and implemented an interactive Tkinter GUI for dataset upload, preprocessing, model training, and real-time prediction. Displayed prediction outputs with confidence scores to enhance interpretability and user trust.",
      "tags": [
        "Computer Vision",
        "Random Forest Classifier",
        "Tkinter",
        "Python"
      ],
      "link": "",
      "liveLink": "",
      "imageUrl": "",
      "_id": "6a3a82df52a4a535e8752684"
    }
  ],
  "experience": [
    {
      "role": "Software Development Intern",
      "company": "DRDL, DRDO (Government of India)",
      "duration": "Jan 2026 – Mar 2026",
      "description": "Designed and developed a full-stack GPF Loan Management System to digitize General Provident Fund operations, eliminating manual paperwork. Built scalable backend services using Spring Boot and integrated RESTful APIs for seamless communi- cation between frontend and backend. Developed responsive UI using React, improving usability and accessibility for internal users. Implemented secure authentication and authorization using JWT, ensuring role-based access control. Applied Flyway migrations for version-controlled database schema management. Collaborated with team members in an agile environment to deliver features within deadlines. Tech Stack: React, Spring Boot, Oracle XE, JWT, REST API, Flyway",
      "_id": "6a3a82df52a4a535e8752682"
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Technology (Artificial Intelligence Data Science Engineering)",
      "school": "JNTUH",
      "year": "2022 – 2026",
      "_id": "6a3a82df52a4a535e875267f"
    },
    {
      "degree": "Intermediate",
      "school": "",
      "year": "2020 – 2022",
      "_id": "6a3a82df52a4a535e8752680"
    },
    {
      "degree": "SSC",
      "school": "",
      "year": "2020",
      "_id": "6a3a82df52a4a535e8752681"
    }
  ],
  "socialLinks": [
    {
      "platform": "GitHub",
      "url": "",
      "_id": "6a3a82df52a4a535e875267d"
    },
    {
      "platform": "LinkedIn",
      "url": "",
      "_id": "6a3a82df52a4a535e875267e"
    }
  ],
  "certifications": [],
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
    "_id": "6a3a82df52a4a535e875267c"
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
