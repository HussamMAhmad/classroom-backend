import express from "express";
import { prisma } from "../config/prisma.js";
import { includes } from "better-auth";

const router = express.Router();

// get all subjects with optional search , filtering and pagination
router.get("/", async (req, res) => {
  try {
    const { search, department, page = "1", limit = "10" } = req.query;
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

router.get("/:id", async (req, res) => {
  try {
    const subjectId = Number(req.params.id);
    if (!Number.isFinite(subjectId))
      return res.status(400).json({ error: "No class found." });
    const subject = await prisma.subjects.findFirst({
      where: {
        id: subjectId,
      },
      include: {
        classes: true,
      },
    });

    if (!subject) throw Error;
    res.status(200).json({ message: "successfully fetch data", data: subject });
  } catch (e) {
    console.log("faild to fetch data", e);
    res.status(500).json({ message: "Something went wrong", error: e });
  }
});

router.post("/", async (req, res) => {
  try {
    const { ...subject } = req.body;
    console.log("req body for subject : ", req.body);
    const subjectCreate = await prisma.subjects.create({
      data: {
        name: subject.name,
        description: subject.description,
        departmentId: subject.department,
        classes: {
          connect: subject.className.map((id: number) => ({ id: id })),
        },
        code: Math.random().toString(36).substring(2, 9),
      },
    });
    if (!subjectCreate) {
      throw Error;
    }
    res
      .status(200)
      .json({ message: "Successfully fetch data", data: subjectCreate });
  } catch (e) {
    console.log("faild to fetch data", e);
    res.status(500).json({ message: "Something went wrong", error: e });
  }
});
export default router;
