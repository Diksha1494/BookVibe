const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const aiRoutes = require("./routes/ai.js");
const bookRoutes = require("./src/books/book.route.js");
const orderRoutes = require("./src/orders/order.route.js");
const userRoutes = require("./src/users/user.route.js");
const adminRoutes = require("./src/stats/admin.stats.js");
const borrowRoutes = require("./src/borrow/borrow.route.js");
const exchangeRoutes = require("./src/exchange/exchange.route.js");

const app = express();
const port = process.env.PORT || 5000;
const isVercel = Boolean(process.env.VERCEL);

console.log("[BOOT] Backend starting", {
  isVercel,
  cwd: process.cwd(),
  hasDbUrl: Boolean(process.env.DB_URL),
  hasJwtSecret: Boolean(process.env.JWT_SECRET_KEY),
});

const allowedOrigins = [
  "http://localhost:5173",
  "https://book-vibe-csl15stxi-dikshas-projects-d57d6445.vercel.app",
  "https://book-vibe-nu.vercel.app",
];

const allowedOriginPatterns = [
  /^https:\/\/book-vibe(?:-[a-z0-9-]+)?\.vercel\.app$/,
];


let cachedConnection = null;

const connectToDatabase = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.DB_URL) {
    throw new Error("DB_URL is not configured");
  }

  cachedConnection = mongoose.connect(process.env.DB_URL);
  await cachedConnection;
  return cachedConnection;
};

app.use(
  cors({
    origin(origin, callback) {
      const isAllowedPattern = allowedOriginPatterns.some((pattern) =>
        pattern.test(origin || "")
      );

      if (!origin || allowedOrigins.includes(origin) || isAllowedPattern) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "BookVibe backend is running" });
});

app.use("/api/ai", aiRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/exchange", exchangeRoutes);
app.use("/api/auth", (req, res, next) => {
  console.log("[AUTH_ROUTE] Request reached /api/auth", {
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl,
  });
  next();
});
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

console.log("[BOOT] Routes mounted", {
  ai: "/api/ai",
  books: "/api/books",
  orders: "/api/orders",
  borrow: "/api/borrow",
  exchange: "/api/exchange",
  auth: "/api/auth",
  admin: "/api/admin",
});

if (!isVercel) {
  connectToDatabase()
    .then(() => {
      console.log("MongoDB connected successfully");
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
}

module.exports = app;
