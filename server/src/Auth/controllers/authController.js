const { PrismaClient } = require("@prisma/client");
const {
  hashPassword,
  verifyPassword,
  generateToken,
  generateSessionId,
  getTokenExpirationTime,
} = require("../../utils/auth");
const { logAction, logUserLogin, logUserLogout } = require("../../services/auditService");

const prisma = new PrismaClient();

// POST /auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const userDetail = await prisma.userDetail.findUnique({
      where: { email: email },
    });

    if (!userDetail) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, userDetail.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate session ID and token
    const sessionId = generateSessionId();
    const token = generateToken({
      userId: userDetail.id,
      email: userDetail.email,
      sessionId: sessionId,
    });

    // Create session record
    const expiresAt = getTokenExpirationTime();
    await prisma.session.create({
      data: {
        userId: userDetail.id,
        sessionId: sessionId,
        expiresAt: expiresAt,
      },
    });

    // Create audit log
    await logUserLogin({
      userId: userDetail.id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      succeeded: true,
    });

    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: userDetail.id,
        firstName: userDetail.firstName,
        lastName: userDetail.lastName,
        email: userDetail.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /auth/logout
const logout = async (req, res) => {
  try {
    // Invalidate the current session
    await prisma.session.updateMany({
      where: {
        sessionId: req.user.sessionId,
        userId: req.user.id,
      },
      data: {
        isValid: false,
        invalidatedAt: new Date(),
      },
    });

    // Create audit log for logout
    await logUserLogout({
      userId: req.user.id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /auth/logout-all-devices
const logoutFromAllDevices = async (req, res) => {
  try {
    // Invalidate all sessions for the current user
    const result = await prisma.session.updateMany({
      where: {
        userId: req.user.id,
        isValid: true,
      },
      data: {
        isValid: false,
        invalidatedAt: new Date(),
      },
    });

    await logAction({
      userId: req.user.id,
      action: "LOGOUT_ALL_DEVICES",
      metadata: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        sessionsInvalidated: result.count,
      },
    });

    res.json({
      message: "Logged out from all devices successfully",
      sessionsInvalidated: result.count,
    });
  } catch (error) {
    console.error("Logout from all devices error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /audit/login
const getLoginAudit = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (userId) {
      whereClause.userId = parseInt(userId);
    }

    const [auditLogs, totalCount] = await Promise.all([
      prisma.auditAction.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: parseInt(limit),
      }),
      prisma.auditAction.count({ where: whereClause }),
    ]);

    res.json({
      data: auditLogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Get audit logs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /auth/register
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        error: "First name, last name, email, and password are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password strength (minimum 8 characters)
    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long",
      });
    }

    // Check if email already exists
    const existingUser = await prisma.userDetail.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Email address already registered" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user detail
      const userDetail = await tx.userDetail.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
      });

      // Create default account for the user
      const accountDetail = await tx.accountDetail.create({
        data: {
          userId: userDetail.id,
          balance: 10000.0, // Default starting balance
        },
      });

      return { userDetail, accountDetail };
    });

    // Create audit log
    await logAction({
      userId: result.userDetail.id,
      action: `NEW_USER_REGISTERED`,
      metadata: {
        email: result.userDetail.email,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: result.userDetail.id,
        firstName: result.userDetail.firstName,
        lastName: result.userDetail.lastName,
        email: result.userDetail.email,
        createdAt: result.userDetail.createdAt,
      },
    });
  } catch (error) {
    console.error("User registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  login,
  logout,
  logoutFromAllDevices,
  getLoginAudit,
  register,
};
