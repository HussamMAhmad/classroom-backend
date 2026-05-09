import express from "express";
import { prisma } from "../config/prisma.js";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  try {
    const { name, search, role, page = "1", limit = "10" } = req.query;
    console.log("name is : ", name);
    const currentPage = Number(page);
    const requestLimit = Number(limit);

    if (
      !Number.isInteger(currentPage) ||
      currentPage < 1 ||
      !Number.isInteger(requestLimit) ||
      requestLimit < 1
    ) {
      return res
        .status(403)
        .json({ message: "page and limit must be postive intger" });
    }

    const limitPerPage = Math.min(requestLimit, 100);

    const offset = (currentPage - 1) * limitPerPage;

    let whereClause: any = {
      AND: [],
    };

    if (search) {
      const searchQuery = String(search);
      whereClause.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { email: { contains: searchQuery, mode: "insensitive" } },
      ];
    }
    if (role) {
      whereClause.AND.push({ role: String(role) });
    }

    if (name) {
      const nameQuery = String(name);
      whereClause.AND.push({
        name: { contains: nameQuery, mode: "insensitive" },
      });
    }

    const [result, count] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limitPerPage,
      }),
      prisma.user.count({
        where: whereClause,
      }),
    ]);

    const totalcount = count ?? 0;

    res.status(201).json({
      message: "users retrived sucssfully",
      data: result,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalcount,
        totalPages: Math.ceil(totalcount / limitPerPage),
      },
    });
  } catch (e) {
    console.log("error with fetch data user : ", e);
    res.status(500).json({
      message: "faild to get data user",
      error: e,
    });
  }
});

export default usersRouter;
