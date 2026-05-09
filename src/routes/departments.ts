import express from "express";
import { prisma } from "../config/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { name, search, limit = "10", page = "1" } = req.query;

    const currentPage = Number(page);
    const requestedLimit = Number(limit);

    if (
      !Number.isInteger(currentPage) ||
      currentPage < 1 ||
      !Number.isInteger(requestedLimit) ||
      requestedLimit < 1
    ) {
      return res
        .status(400)
        .json({ message: "page and limit must be positive integers" });
    }

    const limitPerPage = Math.min(requestedLimit, 100);
    const offset = (currentPage - 1) * limitPerPage;
    let whereClause: any = {};

    if (search) {
      const searchQuery = String(search);
      whereClause.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { code: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    if (name) {
      const nameQuery = String(name);
      whereClause.AND.push = {
        name: { contains: String(nameQuery), mode: "insensitive" },
      };
    }

    const [result, count] = await Promise.all([
      prisma.departments.findMany({
        where: whereClause,
        skip: offset,
        take: limitPerPage,
        orderBy: { createdAt: "desc" },
        include: { subjects: true },
      }),
      prisma.subjects.count({
        where: whereClause,
      }),
    ]);

    const totalcount = count ? count : 0;
    res.status(200).json({
      message: "Departments retrieved successfully",
      data: result,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalcount,
        totalPages: Math.ceil(totalcount / limitPerPage),
      },
    });
  } catch (e) {
    console.log("faild to fetch data");
    res.status(500).json({ message: "Something went wrong", error: e });
  }
});
export default router;