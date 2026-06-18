# 🚀 PortGen AI - Dynamic Portfolio Maker

PortGen AI is a premium, AI-powered developer portfolio builder that allows users to generate, customize, and deploy stunning personal portfolio websites in seconds. 

Whether uploading a resume for automatic parsing or using natural language commands with the integrated AI Editor, developers can dynamically adapt their digital presence.

---

## ✨ Key Features

*   **📄 AI Resume Parser:** Drag-and-drop your resume (PDF, DOCX, or TXT) to instantly parse and auto-fill your profile details, skills, experiences, projects, and certifications.
*   **💬 Interactive AI Editor:** Powered by **Google Gemini**, the chat customizer lets you modify background layouts, change colors, adjust copy, and add sections using simple conversational prompts.
*   **🎨 10 Curated Design Templates:** Switch layouts on the fly:
    1.  *Tech Minimalist:* Monospace grid styling with neon indicators.
    2.  *Retro Terminal:* Command-line interface theme with interactive prompts.
    3.  *Glassmorphic Aurora:* Translucent sheet overlays on moving aurora layers.
    4.  *Cyberpunk Glitch:* Scanline filters, matrix vibes, and digital glitch text.
    5.  *Neobrutalist Bold:* Heavy 4px borders, hard offset shadows, and flat solid colors.
    6.  *Elegant Editorial:* Magazine serif editorial layouts.
    7.  *Creative Spotlight:* Large headlines with radial interactive cursor-spotlights.
    8.  *Product Timeline:* Roadmap nodes linking professional nodes.
    9.  *3D Card Stack:* Parallax perspective layering with custom depth.
    10. *SaaS Developer:* Metric dashboard tiles and modular tab cards.
*   **📐 Drag-and-Drop Reordering:** Rearrange section layouts (About, Skills, Experience, Education, Certifications, Contact) with instant preview updates.
*   **📦 Standalone ZIP Export:** Download your fully custom, pre-rendered site bundle. Uploaded photos, certificates, and screenshots are encoded as inline base64 data-URLs, providing a zero-dependency, single-page website that works instantly offline and online.
*   **⚙️ Seamless Local Demo Fallback:** Works in local-only demo mode even without a configured Gemini key, ensuring accessibility out of the box.

---

## 🛠️ Technology Stack

### Frontend (Client)
*   **Core:** React (v18) + TypeScript + Vite
*   **Styling:** Tailwind CSS + Vanilla CSS (Aesthetics-focused custom classes)
*   **Animations:** Framer Motion + Lucide React Icons
*   **State Management:** TanStack React Query

### Backend (Server)
*   **Server Framework:** Node.js + Express
*   **Database:** MongoDB Atlas (Mongoose ORM)
*   **AI Integration:** Google Generative AI SDK (Gemini 2.5-flash)
*   **Authentication:** JWT + bcryptjs

---

## 🚀 Setup & Installation

Follow these steps to run PortGen AI locally on your system:

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/Rishi-212005/AI-Portfolio-Maker.git
cd AI-Portfolio-Maker

# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment Variables & Safety Settings

To ensure security, all environment configuration files are ignored by Git (configured in `.gitignore`). Collaborators must create their own local configuration files.

#### A. Backend Configuration (with Gemini API Key)
Create a `.env` file inside the `server/` directory:
```env
PORT=4000
JWT_SECRET=your-super-secret-key-change-me
MONGODB_URI=your-mongodb-atlas-connection-string
GEMINI_API_KEY=your-gemini-api-key-here
```
*Note: If `GEMINI_API_KEY` is not provided, the server automatically defaults to an offline demo mode so collaborators can still test layouts locally.*

#### B. Frontend Connection Configuration (Vite Backend URL)
By default, the React frontend connects to the backend API at `http://localhost:4000`. 

If your backend is hosted online, or you/your collaborators run it on a different port, you can configure it safely using one of these options:
1.  **Vite Environment Variables (Recommended):** Create a `.env` file in the root folder of the project:
    ```env
    VITE_API_URL=https://your-hosted-backend-api.com
    ```
2.  **Config Customization:** Alternatively, view and modify the default fallback directly in [src/config.ts](file:///e:/MY-PROJECTS/AI-Portfolio-Maker/src/config.ts):
    ```typescript
    export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
    ```
    *This configuration file centralizes the connection string for collaborators to easily discover and configure.*

### 3. Start Dev Servers
You can run both client and server development processes in parallel from the root folder:
```bash
# Start frontend (usually runs on http://localhost:8080 or 8081)
npm run dev

# Start backend server in a separate terminal (runs on http://localhost:4000)
npm run server
```

---

## 📦 Deploying Exported Portfolios

Once you download the ZIP file representing your customized portfolio:
1.  **Extract the ZIP archive** to get `index.html` and `README.md`.
2.  **Host for Free:**
    *   **Netlify Drop (Simplest):** Drag and drop your `index.html` directly onto [Netlify Drop](https://drop.netlify.com/).
    *   **Vercel:** Open a terminal in the folder and type `vercel` (requires Vercel CLI).
    *   **GitHub Pages:** Push the file into a GitHub repository and enable GitHub Pages in Settings.

---
Created with 💻 and 🤖 by Rishi-212005.
