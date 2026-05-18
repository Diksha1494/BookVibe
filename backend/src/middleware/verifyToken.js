const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  if (!JWT_SECRET) {
    console.error("[AUTH] JWT_SECRET_KEY is not configured.");
    return res.status(500).json({ message: "Server authentication is not configured." });
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    console.warn("[AUTH] JWT verification failed", {
      path: req.originalUrl,
      reason: error.message,
    });
    return res.status(403).json({ message: "Invalid credentials." });
  }
};

module.exports = verifyToken;
