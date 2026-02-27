import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";

const dbHost = process.env.DB_HOST || "localhost";
const dbPort = Number(process.env.DB_PORT || 3306);
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "";
const dbName = process.env.DB_NAME || "ai_portfolio";

const poolPromise = (async () => {
  const connection = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    multipleStatements: true,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  await connection.end();

  const pool = mysql.createPool({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS portfolios (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL UNIQUE,
      data_json LONGTEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_portfolios_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  return pool;
})();

app.use(cors());
app.use(express.json());

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
    const pool = await poolPromise;

    const [existingRows] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email.toLowerCase()]
    );

    if (Array.isArray(existingRows) && existingRows.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email.toLowerCase(), passwordHash]
    );

    const insertedId = result.insertId;

    const user = {
      id: insertedId,
      name,
      email: email.toLowerCase(),
    };

    const token = generateToken(user);

    return res.status(201).json({ user, token });
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
    const pool = await poolPromise;

    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email.toLowerCase()]
    );

    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
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
    const pool = await poolPromise;
    const [rows] = await pool.execute(
      "SELECT data_json FROM portfolios WHERE user_id = ?",
      [userId]
    );

    const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!row) {
      return res.status(404).json({ message: "No portfolio found for user" });
    }

    try {
      const data = JSON.parse(row.data_json);
      return res.json({ data });
    } catch {
      return res.status(500).json({ message: "Failed to parse portfolio data" });
    }
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

  const dataJson = JSON.stringify(data);

  try {
    const pool = await poolPromise;

    await pool.execute(
      `INSERT INTO portfolios (user_id, data_json, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE
         data_json = VALUES(data_json),
         updated_at = CURRENT_TIMESTAMP`,
      [userId, dataJson]
    );

    return res.status(200).json({ message: "Portfolio saved" });
  } catch (err) {
    console.error("Save portfolio error", err);
    return res.status(500).json({ message: "Failed to save portfolio" });
  }
});

app.listen(port, () => {
  console.log(`Auth server running on http://localhost:${port}`);
});

