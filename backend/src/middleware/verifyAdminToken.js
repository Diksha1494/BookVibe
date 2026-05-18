const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyAdminToken = (req, res, next) => {
  if (!JWT_SECRET) {
    console.error("[ADMIN_AUTH] JWT_SECRET_KEY is not configured.");
    return res.status(500).json({ message: "Server authentication is not configured." });
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.warn("[ADMIN_AUTH] JWT verification failed", {
        path: req.originalUrl,
        reason: err.message,
      });
      return res.status(403).json({ message: "Invalid credentials" });
    }

    if (user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.user = user;
    next();
  });
};

module.exports = verifyAdminToken;
