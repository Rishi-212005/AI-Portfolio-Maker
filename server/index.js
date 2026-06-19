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

const portfolioSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  data_json: { type: mongoose.Schema.Types.Mixed, required: true },
  updated_at: { type: Date, default: Date.now }
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

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
    const portfolio = await Portfolio.findOne({ user_id: userId });

    if (!portfolio) {
      return res.status(404).json({ message: "No portfolio found for user" });
    }

    let data = portfolio.data_json;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        return res.status(500).json({ message: "Failed to parse portfolio data" });
      }
    }

    return res.json({ data });
  } catch (err) {
    console.error("Get portfolio error", err);
    return res.status(500).json({ message: "Failed to load portfolio" });
  }
});

app.post("/api/portfolio", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ message: "Portfolio data is required" });
  }

  try {
    const result = await Portfolio.findOneAndUpdate(
      { user_id: userId },
      { data_json: data, updated_at: new Date() },
      { upsert: true, new: true }
    );

    console.log(`[Portfolio] Saved for user ${userId} — keys: ${Object.keys(data).join(", ")}`);
    return res.status(200).json({ message: "Portfolio saved", id: result._id });
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
    } else if (lower.includes("color") || lower.includes("theme")) {
      explanation = `🎨 Local offline edit: I see you want to change colors. You can use the quick theme color buttons at the top of the AI Editor panel!`;
    }

    return res.json({ updatedData, explanation });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    // ── Compact payload for AI (saves tokens) ──────────────────────────────
    // We strip imageUrls (base64 = huge!) and truncate long text fields.
    // IMPORTANT: after getting the AI response we merge it back with the
    // original data so nothing the AI didn't touch ever gets lost.
    const compactData = {
      ...portfolioData,
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

Current portfolio data:
${JSON.stringify(compactData, null, 2)}

User instruction: "${message}"

Respond with raw JSON only.`;

    let result;
    let retries = 3;
    let delayMs = 2000;
    while (retries > 0) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (err) {
        if (err.status === 429 && retries > 1) {
          console.warn(`[Gemini API] 429 rate limit. Retrying in ${delayMs}ms... (${retries - 1} retries left)`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          retries--;
          delayMs *= 2;
        } else {
          throw err;
        }
      }
    }
    let responseText = result.response.text().trim();

    // Strip markdown code fences if model wraps response
    if (responseText.startsWith("```")) {
      responseText = responseText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    }

    const parsed = JSON.parse(responseText);

    if (!parsed.updatedData || !parsed.explanation) {
      throw new Error("Invalid AI response structure — missing updatedData or explanation.");
    }

    // ── Merge AI response back with original to restore stripped fields ──────
    // The AI worked on compact data (no imageUrls, truncated text).
    // We must restore: photo, project imageUrls, cert imageUrls.
    const aiData = parsed.updatedData;

    const restoredData = {
      ...aiData,

      // Always restore photo — AI never had the actual base64
      photo: portfolioData.photo || aiData.photo || "",

      // Restore imageUrl for projects by matching on title (AI may reorder/add/remove)
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

      // Restore imageUrl for certifications by matching on name
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

    return res.json({
      updatedData: restoredData,
      explanation: parsed.explanation
    });
  } catch (err) {
    console.error("Gemini edit error:", err);

    // Give specific, user-friendly error messages
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

app.listen(port, () => {
  console.log(`Auth server running on http://localhost:${port}`);
});

