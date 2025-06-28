const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


const getPortfolioSummary = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    whereClause.createdBy = parseInt(1);

    const [portfolioSummary, totalCount] = await Promise.all([
      prisma.orderDetail.findMany({
        where: whereClause,
            select: {
              id: true,
              name: true,
              price: true,
        },
        orderBy: {
          createdON: "desc",
        },
        skip: offset,
        take: parseInt(limit),
      }),
      prisma.orderDetail.count({ where: whereClause }),
    ]);
    res.json({
      data: portfolioSummary,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  }
  catch(error) {
    console.error("Get Portfolio summary error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}
 
module.exports = {
  getPortfolioSummary,
};