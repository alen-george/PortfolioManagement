const { verifyToken } = require("../utils/auth");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    // Verify user exists
    const user = await prisma.userDetail.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    // Check if session is still valid
    const session = await prisma.session.findUnique({
      where: { sessionId: decoded.sessionId },
    });

    if (!session || !session.isValid || session.expiresAt < new Date()) {
      return res.status(403).json({ error: "Session expired or invalid" });
    }

    // Add user info to request
    req.user = {
      id: user.id,
      email: user.email,
      sessionId: decoded.sessionId,
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = {
  authenticateToken,
};
