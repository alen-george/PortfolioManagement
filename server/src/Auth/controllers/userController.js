const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../../utils/auth");
const { logAction } = require("../../services/auditService");
const prisma = new PrismaClient();

// GET /user/profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userDetail = await prisma.userDetail.findUnique({
      where: { id: userId },
    });

    if (!userDetail) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: userDetail.id,
        firstName: userDetail.firstName,
        lastName: userDetail.lastName,
        email: userDetail.email,
        createdAt: userDetail.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /user/profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName } = req.body;

    // Validate input
    if (!firstName && !lastName) {
      return res
        .status(400)
        .json({ error: "At least one field to update is required" });
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    const updatedUser = await prisma.userDetail.update({
      where: { id: userId },
      data: updateData,
    });

    // Create audit log
    await logAction({
      userId: userId,
      action: `UPDATE_USER_PROFILE`,
      metadata: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      },
    });

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Update user profile error:", error);
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

module.exports = {
  getUserProfile,
  updateUserProfile,
  getLoginAudit,
};
