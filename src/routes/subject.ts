import express from "express";
import { prisma } from "../config/prisma";

const SubjectRouter = express.Router();

// get all subjects with optional search , filtering and pagination
SubjectRouter.get("/", async (req, res) => {
  try {
    console.log("Getting subjects with query:", req.query);

    const { search  , department, page = "1", limit = "10" } = req.query;

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

    if (department) {
      whereClause.department = {
        name: { contains: String(department), mode: "insensitive" },
      };
    }
    const [result, count] = await Promise.all([
      prisma.subjects.findMany({
        where: whereClause,
        skip: offset,
        take: limitPerPage,
        orderBy: { createdAt: "desc" },
        include: { department: true },
      }),
      prisma.subjects.count({
        where: whereClause,
      }),
    ]);

    const totalcount = count ? count : 0;

    res.status(200).json({
      message: "Subjects retrieved successfully",
      data: result,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalcount,
        totalPages: Math.ceil(totalcount / limitPerPage),
      },
    });
  } catch (error) {
    console.error("Error getting subjects:", error);
    res.status(400).json({ message: "Failed to get subjects", error });
  }
});

export { SubjectRouter };
