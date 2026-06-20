import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";
const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  console.error("MONGODB_URI is not defined in environment variables!");
  process.exit(1);
}

// Connect to MongoDB Atlas
mongoose.connect(mongodbUri)
  .then(() => console.log("Connected to MongoDB Atlas successfully!"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

// Define Schemas & Models
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  tags: { type: [String], default: [] },
  link: { type: String, default: "" },
  liveLink: { type: String, default: "" },
  imageUrl: { type: String, default: "" }
});

const experienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, default: "" },
  description: { type: String, default: "" }
});

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  school: { type: String, required: true },
  year: { type: String, default: "" }
});

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true }
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  credentialUrl: { type: String, default: "" }
});

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, default: "" }
});

const designSettingsSchema = new mongoose.Schema({
  themeMode: { type: String, default: "dark" },
  accentColor: { type: String, default: "hsl(190 95% 55%)" },
  animationsEnabled: { type: Boolean, default: true },
  scanlinesEnabled: { type: Boolean, default: true },
  showOpportunitiesBadge: { type: Boolean, default: true },
  opportunitiesText: { type: String, default: "AVAILABLE FOR OPPORTUNITIES" },
  customCss: { type: String, default: "" }
});

const portfolioSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  template_id: { type: String, default: "tech-minimalist" },
  section_order: { 
    type: [String], 
    default: ["about", "skills", "projects", "experience", "education", "certifications", "contact"] 
  },
  name: { type: String, required: true },
  title: { type: String, required: true },
  about: { type: String, default: "" },
  photo: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  location: { type: String, default: "" },
  website: { type: String, default: "" },
  skills: { type: [String], default: [] },
  projects: { type: [projectSchema], default: [] },
  experience: { type: [experienceSchema], default: [] },
  education: { type: [educationSchema], default: [] },
  socialLinks: { type: [socialLinkSchema], default: [] },
  certifications: { type: [certificationSchema], default: [] },
  achievements: { type: [String], default: [] },
  languages: { type: [languageSchema], default: [] },
  designSettings: { type: designSettingsSchema, default: () => ({}) },
  chat_history: { type: [mongoose.Schema.Types.Mixed], default: [] },
  updated_at: { type: Date, default: Date.now }
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

const portfolioHistorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  portfolio_data: { type: mongoose.Schema.Types.Mixed, required: true },
  chat_history: { type: [mongoose.Schema.Types.Mixed], default: [] },
  description: { type: String, default: "Manual Save" },
  timestamp: { type: Date, default: Date.now }
});

const PortfolioHistory = mongoose.model("PortfolioHistory", portfolioHistorySchema);

function mapPortfolioToMongoose(data) {
  if (!data) return {};
  const updateFields = {
    name: data.name,
    title: data.title,
    about: data.about || "",
    photo: data.photo || "",
    email: data.email || "",
    phone: data.phone || "",
    location: data.location || "",
    website: data.website || "",
    skills: Array.isArray(data.skills) ? data.skills : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    experience: Array.isArray(data.experience) ? data.experience : [],
    education: Array.isArray(data.education) ? data.education : [],
    socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
    achievements: Array.isArray(data.achievements) ? data.achievements : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
    designSettings: data.designSettings || {},
    updated_at: new Date()
  };

  if (data.templateId) {
    updateFields.template_id = data.templateId;
  }
  if (data.sectionOrder) {
    updateFields.section_order = data.sectionOrder;
  }
  return updateFields;
}

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    jwtSecret,
    { expiresIn: "7d" }
  );
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password_hash: passwordHash
    });

    await newUser.save();

    const userObj = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
    };

    const token = generateToken(userObj);

    return res.status(201).json({ user: userObj, token });
  } catch (err) {
    console.error("Register error", err);
    return res.status(500).json({ message: "Failed to register user" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userObj = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    const token = generateToken(userObj);

    return res.json({ user: userObj, token });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Failed to login" });
  }
});

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, jwtSecret);
    return res.json({ user: payload });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

app.get("/api/portfolio", requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    let portfolio = await Portfolio.findOne({ user_id: userId });

    if (!portfolio) {
      return res.status(404).json({ message: "No portfolio found for user" });
    }

    // Dynamic legacy data self-healing migration
    if (!portfolio.name && portfolio.get("data_json")) {
      console.log(`[Migration] Migrating legacy portfolio for user ${userId} to structured root fields...`);
      let legacyData = portfolio.get("data_json");
      if (typeof legacyData === "string") {
        try {
          legacyData = JSON.parse(legacyData);
        } catch (e) {
          console.error("[Migration] Failed to parse legacy data_json string:", e);
        }
      }
      
      if (legacyData && typeof legacyData === "object") {
        const updateFields = mapPortfolioToMongoose(legacyData);
        // Clear data_json so we don't migrate again
        await Portfolio.updateOne(
          { _id: portfolio._id },
          { $set: updateFields, $unset: { data_json: "" } }
        );
        // Reload mutated document
        portfolio = await Portfolio.findOne({ _id: portfolio._id });
      }
    }

    // Map database structured fields to data object expected by frontend
    const data = {
      name: portfolio.name || "",
      title: portfolio.title || "",
      about: portfolio.about || "",
      photo: portfolio.photo || "",
      email: portfolio.email || "",
      phone: portfolio.phone || "",
      location: portfolio.location || "",
      website: portfolio.website || "",
      skills: portfolio.skills || [],
      projects: portfolio.projects || [],
      experience: portfolio.experience || [],
      education: portfolio.education || [],
      socialLinks: portfolio.socialLinks || [],
      certifications: portfolio.certifications || [],
      achievements: portfolio.achievements || [],
      languages: portfolio.languages || [],
      designSettings: portfolio.designSettings || {},
      templateId: portfolio.template_id || "tech-minimalist",
      sectionOrder: portfolio.section_order || ["about", "skills", "projects", "experience", "education", "certifications", "contact"]
    };

    return res.json({ 
      data,
      chatHistory: portfolio.chat_history || []
    });
  } catch (err) {
    console.error("Get portfolio error", err);
    return res.status(500).json({ message: "Failed to load portfolio" });
  }
});

app.post("/api/portfolio", requireAuth, async (req, res) => {
  const userId = req.user.id;
  
  let data = req.body;
  let chatHistory = [];
  let description = "Manual Save";

  if (req.body && req.body.data && typeof req.body.data === "object") {
    data = req.body.data;
    chatHistory = req.body.chatHistory || [];
    description = req.body.description || "Manual Save";
  }

  if (!data || typeof data !== "object") {
    return res.status(400).json({ message: "Portfolio data is required" });
  }

  try {
    const updateFields = mapPortfolioToMongoose(data);

    if (req.body.chatHistory) {
      updateFields.chat_history = chatHistory;
    }

    const result = await Portfolio.findOneAndUpdate(
      { user_id: userId },
      { $set: updateFields },
      { upsert: true, new: true }
    );

    // Save a history checkpoint
    const historyEntry = new PortfolioHistory({
      user_id: userId,
      portfolio_data: data,
      chat_history: result.chat_history || [],
      description: description
    });
    await historyEntry.save();

    console.log(`[Portfolio] Saved and snapshot created for user ${userId} — keys: ${Object.keys(data).join(", ")}`);
    return res.status(200).json({ 
      message: "Portfolio saved", 
      id: result._id,
      historyId: historyEntry._id
    });
  } catch (err) {
    console.error("Save portfolio error", err);
    return res.status(500).json({ message: "Failed to save portfolio", error: err.message });
  }
});

app.post("/api/ai/edit", async (req, res) => {
  const { portfolioData, message } = req.body;
  if (!portfolioData || !message) {
    return res.status(400).json({ message: "portfolioData and message are required" });
  }

  // Parse token if present
  const authHeader = req.headers.authorization;
  let userId = null;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice("Bearer ".length);
      const payload = jwt.verify(token, jwtSecret);
      userId = payload.id;
    } catch (e) {
      console.warn("Invalid token in AI edit:", e.message);
    }
  }

  // Intercept Revert / Undo requests
  const lowerMsg = message.toLowerCase().trim();
  if (lowerMsg === "revert" || lowerMsg === "undo" || lowerMsg === "revert changes" || lowerMsg === "revert the changes" || lowerMsg.includes("undo the last change")) {
    if (userId) {
      const historyItems = await PortfolioHistory.find({ user_id: userId })
        .sort({ timestamp: -1 })
        .limit(2);
      
      if (historyItems && historyItems.length > 1) {
        const targetItem = historyItems[1]; // retrieve second-to-last item (revert point)

        let updatedChatHistory = [];
        if (req.body.chatHistory) {
          updatedChatHistory = [
            ...req.body.chatHistory,
            { role: "user", content: message, timestamp: new Date() },
            { role: "ai", content: `🔄 Reverted successfully to: "${targetItem.description}"`, timestamp: new Date() }
          ];
        }

        const updateFields = mapPortfolioToMongoose(targetItem.portfolio_data);
        updateFields.chat_history = updatedChatHistory;

        await Portfolio.findOneAndUpdate(
          { user_id: userId },
          { $set: updateFields },
          { new: true }
        );

        const revertCheckpoint = new PortfolioHistory({
          user_id: userId,
          portfolio_data: targetItem.portfolio_data,
          chat_history: updatedChatHistory,
          description: `Reverted to: ${targetItem.description}`
        });
        await revertCheckpoint.save();

        return res.json({
          updatedData: targetItem.portfolio_data,
          explanation: `🔄 Reverted successfully to: "${targetItem.description}"`,
          chatHistory: updatedChatHistory
        });
      } else {
        const explanation = "⚠️ I couldn't revert because there are no previous saved checkpoints in your history timeline.";
        let updatedChatHistory = [];
        if (req.body.chatHistory) {
          updatedChatHistory = [
            ...req.body.chatHistory,
            { role: "user", content: message, timestamp: new Date() },
            { role: "ai", content: explanation, timestamp: new Date() }
          ];
        }
        return res.json({
          updatedData: portfolioData,
          explanation,
          chatHistory: updatedChatHistory
        });
      }
    } else {
      const explanation = "⚠️ Revert history is only available when logged in with a database connection. Please register or log in first!";
      let updatedChatHistory = [];
      if (req.body.chatHistory) {
        updatedChatHistory = [
          ...req.body.chatHistory,
          { role: "user", content: message, timestamp: new Date() },
          { role: "ai", content: explanation, timestamp: new Date() }
        ];
      }
      return res.json({
        updatedData: portfolioData,
        explanation,
        chatHistory: updatedChatHistory
      });
    }
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const isDemoKey = !apiKey || apiKey === "your-gemini-api-key-here" || apiKey.trim() === "";

  if (isDemoKey) {
    // Return a friendly fallback response
    let updatedData = JSON.parse(JSON.stringify(portfolioData));
    let explanation = "⚠️ PortGen AI is running in local offline demo mode because GEMINI_API_KEY is not configured in your server's .env file. Please add your key to enable fully dynamic AI portfolio updates!";

    const lower = message.toLowerCase();
    if (lower.includes("name to")) {
      const match = message.match(/name to\s+([a-zA-Z0-9\s]+)/i);
      if (match && match[1]) {
        updatedData.name = match[1].trim();
        explanation = `👤 Local offline edit: Updated name to "${updatedData.name}". Set up GEMINI_API_KEY to unlock full AI capability!`;
      }
    } else if (lower.includes("about") || lower.includes("bio") || lower.includes("rewrite")) {
      updatedData.about = "Innovative full-stack engineer specializing in developing premium animated web systems, high-performance secure backends, and responsive UI components. (Offline demo rewrite)";
      explanation = `📝 Local offline edit: Rewrote biography/about section. Set up GEMINI_API_KEY to unlock full AI capability!`;
    } else if (lower.includes("skill")) {
      const skillMatch = message.match(/add skill\s+([a-zA-Z0-9\s#\+\.\-]+)/i) || message.match(/skill\s+([a-zA-Z0-9\s#\+\.\-]+)/i);
      if (skillMatch && skillMatch[1]) {
        const newSkill = skillMatch[1].trim();
        if (!updatedData.skills.includes(newSkill)) {
          updatedData.skills = [...updatedData.skills, newSkill];
        }
        explanation = `🛠️ Local offline edit: Added skill "${newSkill}". Set up GEMINI_API_KEY to unlock full AI capability!`;
      }
    } else if (lower.includes("remove opportunities badge") || lower.includes("hide opportunities badge") || lower.includes("opportunities badge")) {
      if (!updatedData.designSettings) updatedData.designSettings = {};
      updatedData.designSettings.showOpportunitiesBadge = false;
      explanation = "🎯 Local offline edit: Hidden the 'Available for Opportunities' badge. Set up GEMINI_API_KEY to unlock full AI capability!";
    } else if (lower.includes("show opportunities badge") || lower.includes("enable opportunities badge")) {
      if (!updatedData.designSettings) updatedData.designSettings = {};
      updatedData.designSettings.showOpportunitiesBadge = true;
      explanation = "🎯 Local offline edit: Shown the 'Available for Opportunities' badge. Set up GEMINI_API_KEY to unlock full AI capability!";
    } else if (lower.includes("opportunities text to") || lower.includes("opportunities badge text")) {
      const match = message.match(/opportunities (?:badge )?text to\s+([a-zA-Z0-9\s!@#\$%\^&\*\(\)\-_\+=\[\]\{\};':",\.\/\\<>?|`~]+)/i);
      if (match && match[1]) {
        if (!updatedData.designSettings) updatedData.designSettings = {};
        updatedData.designSettings.opportunitiesText = match[1].trim();
        explanation = `🎯 Local offline edit: Updated opportunities badge text to "${updatedData.designSettings.opportunitiesText}".`;
      }
    } else if (lower.includes("disable animation") || lower.includes("turn off animation") || lower.includes("remove animation")) {
      if (!updatedData.designSettings) updatedData.designSettings = {};
      updatedData.designSettings.animationsEnabled = false;
      explanation = "🎬 Local offline edit: Disabled transitions and animations in template. Set up GEMINI_API_KEY to unlock full AI capability!";
    } else if (lower.includes("enable animation") || lower.includes("turn on animation")) {
      if (!updatedData.designSettings) updatedData.designSettings = {};
      updatedData.designSettings.animationsEnabled = true;
      explanation = "🎬 Local offline edit: Enabled transitions and animations in template. Set up GEMINI_API_KEY to unlock full AI capability!";
    } else if (lower.includes("disable scanline") || lower.includes("turn off scanline") || lower.includes("remove scanline")) {
      if (!updatedData.designSettings) updatedData.designSettings = {};
      updatedData.designSettings.scanlinesEnabled = false;
      explanation = "📺 Local offline edit: Removed scanlines and CRT grid effects. Set up GEMINI_API_KEY to unlock full AI capability!";
    } else if (lower.includes("enable scanline") || lower.includes("turn on scanline")) {
      if (!updatedData.designSettings) updatedData.designSettings = {};
      updatedData.designSettings.scanlinesEnabled = true;
      explanation = "📺 Local offline edit: Restored scanlines and CRT grid effects. Set up GEMINI_API_KEY to unlock full AI capability!";
    } else if (lower.includes("color") || lower.includes("theme")) {
      explanation = `🎨 Local offline edit: I see you want to change colors. You can use the quick theme color buttons at the top of the AI Editor panel!`;
    }

    let updatedChatHistory = [];
    if (req.body.chatHistory) {
      updatedChatHistory = [
        ...req.body.chatHistory,
        { role: "user", content: message, timestamp: new Date() },
        { role: "ai", content: explanation, timestamp: new Date() }
      ];
    }

    if (userId) {
      const updateFields = mapPortfolioToMongoose(updatedData);
      updateFields.chat_history = updatedChatHistory;

      await Portfolio.findOneAndUpdate(
        { user_id: userId },
        { $set: updateFields },
        { upsert: true }
      );

      const historyEntry = new PortfolioHistory({
        user_id: userId,
        portfolio_data: updatedData,
        chat_history: updatedChatHistory,
        description: `Local Edit: ${explanation.slice(0, 100)}`
      });
      await historyEntry.save();
    }

    return res.json({ 
      updatedData, 
      explanation,
      chatHistory: updatedChatHistory
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // ── Compact payload for AI (saves tokens) ──────────────────────────────
    // We strip imageUrls (base64 = huge!) and truncate long text fields.
    // IMPORTANT: after getting the AI response we merge it back with the
    // original data so nothing the AI didn't touch ever gets lost.
    const compactData = {
      ...portfolioData,
      designSettings: {
        themeMode: portfolioData.designSettings?.themeMode || "dark",
        accentColor: portfolioData.designSettings?.accentColor || "hsl(190 95% 55%)",
        animationsEnabled: portfolioData.designSettings?.animationsEnabled !== false,
        scanlinesEnabled: portfolioData.designSettings?.scanlinesEnabled !== false,
        showOpportunitiesBadge: portfolioData.designSettings?.showOpportunitiesBadge !== false,
        opportunitiesText: portfolioData.designSettings?.opportunitiesText || "AVAILABLE FOR OPPORTUNITIES",
        customCss: portfolioData.designSettings?.customCss || ""
      },
      photo: portfolioData.photo ? "[profile-photo-preserved]" : "",
      about: portfolioData.about?.slice(0, 400),
      projects: (portfolioData.projects || []).map((p, i) => ({
        _idx: i,                            // keep index so we can merge back
        title: p.title,
        description: p.description?.slice(0, 200),
        tags: p.tags,
        link: p.link,
        liveLink: p.liveLink
        // imageUrl intentionally omitted — restored after AI response
      })),
      certifications: (portfolioData.certifications || []).map((c, i) => ({
        _idx: i,
        name: c.name,
        issuer: c.issuer,
        date: c.date,
        credentialUrl: c.credentialUrl
        // imageUrl intentionally omitted — restored after AI response
      })),
      experience: (portfolioData.experience || []).map(e => ({
        role: e.role,
        company: e.company,
        duration: e.duration,
        description: e.description?.slice(0, 200)
      }))
    };

    const prompt = `You are PortGen AI, a professional portfolio editing assistant.

Given the current portfolio JSON data and a user instruction, return ONLY a valid JSON object (no markdown, no code fences) with exactly these two fields:
- "updatedData": the complete updated portfolio object (same structure as the input, with requested changes applied, all other fields preserved exactly). Do NOT include "_idx" fields in your response.
- "explanation": a short friendly string describing what you changed

Within the "updatedData" object, you have a "designSettings" field that controls the visual presentation, animations, and templates of the portfolio:
- "themeMode": "dark" | "light" (Changes dark/light visual style)
- "accentColor": string (Accent color, e.g., "hsl(190 95% 55%)", "hsl(270 80% 65%)", "hsl(220 90% 56%)", "hsl(150 80% 45%)", "hsl(25 95% 55%)" or custom hex codes)
- "animationsEnabled": boolean (Set to false if user wants to stop/disable animations)
- "scanlinesEnabled": boolean (Set to false if user wants to remove or toggle off scanlines/CRT lines)
- "showOpportunitiesBadge": boolean (Set to false if user wants to remove the "Available for Opportunities" badge/pill)
- "opportunitiesText": string (Custom text for the opportunities badge, e.g. "Available for Freelance", "Ready to Code", etc.)
- "customCss": string (A string containing CSS overrides to apply custom styles like background colors, borders, font weights, custom animations, hover states, or color updates to section containers or titles. Keep it clean and valid CSS).

CRITICAL INSTRUCTIONS:
- You MUST NEVER respond that you cannot edit layouts, visual designs, or add animations/hover effects. 
- You can fully customize and animate the portfolio by writing CSS rules into the "customCss" field of "designSettings".
- To add animations (like float, slide, fade, rotate) or hover effects, write CSS class overrides in "customCss".
  Example: ".glass-card:hover { transform: translateY(-6px); box-shadow: 0 10px 25px rgba(255,255,255,0.1); transition: all 0.4s ease; }" or keyframes styling.
- To fulfill styling instructions ("make it look premium", "add shadows", "neon colors", "interactive hovering animations"), write elegant CSS overrides in "customCss".

Current portfolio data:
${JSON.stringify(compactData, null, 2)}

User instruction: "${message}"

Respond with raw JSON only.`;

    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-1.0-pro"
    ];

    let result = null;
    let successModel = "";
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[Gemini API] Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
          }
        });

        let retries = 3;
        let delayMs = 1500;
        while (retries > 0) {
          try {
            result = await model.generateContent(prompt);
            break;
          } catch (err) {
            if ((err.status === 429 || err.message?.includes("429")) && retries > 1) {
              console.warn(`[Gemini API] 429 rate limit on ${modelName}. Retrying in ${delayMs}ms...`);
              await new Promise(resolve => setTimeout(resolve, delayMs));
              retries--;
              delayMs *= 2;
            } else {
              throw err;
            }
          }
        }
        
        if (result) {
          successModel = modelName;
          break;
        }
      } catch (err) {
        console.error(`[Gemini API] Model ${modelName} failed:`, err.message);
        lastError = err;
      }
    }

    if (!result) {
      throw lastError || new Error("All fallback models failed.");
    }

    console.log(`[Gemini API] Generated successfully using model: ${successModel}`);
    let responseText = result.response.text().trim();

    if (responseText.startsWith("```")) {
      responseText = responseText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    }

    const parsed = JSON.parse(responseText);

    if (!parsed.updatedData || !parsed.explanation) {
      throw new Error("Invalid AI response structure — missing updatedData or explanation.");
    }

    const aiData = parsed.updatedData;

    const restoredData = {
      ...aiData,
      photo: portfolioData.photo || aiData.photo || "",
      projects: (aiData.projects || []).map(aiProj => {
        const origMatch = (portfolioData.projects || []).find(
          op => op.title === aiProj.title
        );
        return {
          ...aiProj,
          imageUrl: aiProj.imageUrl && aiProj.imageUrl !== "[preserved]"
            ? aiProj.imageUrl
            : (origMatch?.imageUrl || "")
        };
      }),
      certifications: (aiData.certifications || []).map(aiCert => {
        const origMatch = (portfolioData.certifications || []).find(
          oc => oc.name === aiCert.name
        );
        return {
          ...aiCert,
          imageUrl: aiCert.imageUrl && aiCert.imageUrl !== "[preserved]"
            ? aiCert.imageUrl
            : (origMatch?.imageUrl || "")
        };
      })
    };

    let updatedChatHistory = [];
    if (req.body.chatHistory) {
      updatedChatHistory = [
        ...req.body.chatHistory,
        { role: "user", content: message, timestamp: new Date() },
        { role: "ai", content: parsed.explanation, timestamp: new Date() }
      ];
    }

    if (userId) {
      const updateFields = mapPortfolioToMongoose(restoredData);
      updateFields.chat_history = updatedChatHistory;

      await Portfolio.findOneAndUpdate(
        { user_id: userId },
        { $set: updateFields },
        { upsert: true }
      );

      const historyEntry = new PortfolioHistory({
        user_id: userId,
        portfolio_data: restoredData,
        chat_history: updatedChatHistory,
        description: `AI: ${parsed.explanation}`
      });
      await historyEntry.save();
    }

    return res.json({
      updatedData: restoredData,
      explanation: parsed.explanation,
      chatHistory: updatedChatHistory
    });
  } catch (err) {
    console.error("Gemini edit error:", err);

    let userMessage = "AI customizer failed. Please try again.";
    if (err.status === 429) {
      userMessage = "⏳ Rate limit reached — please wait a few seconds and try again. (Gemini free-tier limit)";
    } else if (err.status === 400 || err.status === 403) {
      userMessage = "❌ Invalid Gemini API key. Please check GEMINI_API_KEY in server/.env and restart the server.";
    } else if (err.status === 404) {
      userMessage = "❌ Gemini model not found. Please check server/index.js for the correct model name.";
    }

    return res.status(err.status === 429 ? 429 : 500).json({
      message: userMessage,
      error: err.message
    });
  }
});

app.get("/api/portfolio/history", requireAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    const history = await PortfolioHistory.find({ user_id: userId })
      .select("_id description timestamp")
      .sort({ timestamp: -1 })
      .limit(50);

    return res.json({ history });
  } catch (err) {
    console.error("Get portfolio history error", err);
    return res.status(500).json({ message: "Failed to load portfolio history" });
  }
});

app.post("/api/portfolio/history/revert", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { historyId } = req.body;

  if (!historyId) {
    return res.status(400).json({ message: "historyId is required to revert" });
  }

  try {
    const historyItem = await PortfolioHistory.findOne({ _id: historyId, user_id: userId });

    if (!historyItem) {
      return res.status(404).json({ message: "History checkpoint not found" });
    }

    const updateFields = mapPortfolioToMongoose(historyItem.portfolio_data);
    updateFields.chat_history = historyItem.chat_history;

    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { user_id: userId },
      { $set: updateFields },
      { new: true }
    );

    const revertCheckpoint = new PortfolioHistory({
      user_id: userId,
      portfolio_data: historyItem.portfolio_data,
      chat_history: historyItem.chat_history,
      description: `Reverted to checkpoint: ${historyItem.description}`
    });
    await revertCheckpoint.save();

    return res.json({
      message: "Reverted successfully",
      data: historyItem.portfolio_data,
      chatHistory: historyItem.chat_history
    });
  } catch (err) {
    console.error("Revert portfolio error", err);
    return res.status(500).json({ message: "Failed to revert portfolio" });
  }
});

app.listen(port, () => {
  console.log(`Auth server running on http://localhost:${port}`);
});

