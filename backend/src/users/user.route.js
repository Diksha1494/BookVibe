const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./user.model");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

console.log("[AUTH_ROUTER] user.route.js loaded");

const signUserToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

const serializeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  displayName: user.username,
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const trimmedUsername = username.trim();

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: trimmedUsername }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const user = await User.create({
      username: trimmedUsername,
      email: normalizedEmail,
      password,
      role: "user",
    });

    const token = signUserToken(user);

    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("[USER_REGISTER] Failed:", error);
    return res.status(500).json({ message: "Registration failed." });
  }
});

router.post("/login", async (req, res) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "Server configuration error." });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail, role: "user" });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signUserToken(user);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("[USER_LOGIN] Failed:", error);
    return res.status(500).json({ message: "Login failed." });
  }
});

router.post("/google", async (req, res) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "Server configuration error." });
    }

    const { email, username } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Google account email is required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const safeUsername = (username || normalizedEmail.split("@")[0] || "googleuser").trim();

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const existingUsername = await User.findOne({ username: safeUsername });
      const fallbackUsername = existingUsername ? `${safeUsername}-${Date.now().toString().slice(-5)}` : safeUsername;

      user = await User.create({
        username: fallbackUsername,
        email: normalizedEmail,
        password: `google-oauth-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: "user",
      });
    }

    const token = signUserToken(user);

    return res.status(200).json({
      message: "Google authentication successful.",
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("[GOOGLE_AUTH] Failed:", error);
    return res.status(500).json({ message: "Google authentication failed." });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("[USER_ME] Failed:", error);
    return res.status(500).json({ message: "Failed to fetch profile." });
  }
});

router.post("/admin", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!JWT_SECRET) {
      console.error("[ADMIN_LOGIN] Missing JWT_SECRET_KEY in environment");
      return res.status(500).send({ message: "Server configuration error" });
    }

    if (!email || !password) {
      console.warn("[ADMIN_LOGIN] Missing email or password", {
        hasEmail: Boolean(email),
        hasPassword: Boolean(password),
      });
      return res.status(400).send({ message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log("[ADMIN_LOGIN] Attempt received", { email: normalizedEmail });

    const admin = await User.findOne({
      email: normalizedEmail,
      role: "admin",
    });

    if (!admin) {
      console.warn("[ADMIN_LOGIN] Admin not found", { email: normalizedEmail });
      return res.status(404).send({ message: "Admin not found!" });
    }

    console.log("[ADMIN_LOGIN] Admin record found", {
      id: admin._id.toString(),
      username: admin.username,
      email: admin.email,
      role: admin.role,
      hasPasswordHash: Boolean(admin.password),
    });

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      console.warn("[ADMIN_LOGIN] Password mismatch", { email: normalizedEmail });
      return res.status(401).send({ message: "Invalid password!" });
    }

    console.log("[ADMIN_LOGIN] Password matched", { email: normalizedEmail });

    const token = jwt.sign(
      { id: admin._id, username: admin.username, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("[ADMIN_LOGIN] JWT generated", {
      email: normalizedEmail,
      role: admin.role,
      tokenCreated: Boolean(token),
    });

    return res.status(200).json({
      message: "Authentication successful",
      token,
      user: {
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("[ADMIN_LOGIN] Failed to login as admin", {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).send({ message: "Admin login failed." });
  }
});

module.exports = router;
