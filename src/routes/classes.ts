import express from "express";
import { prisma } from "../config/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { ...classe } = req.body;
    console.log("classes is : ", classe);
    const classeCreate = await prisma.classes.create({
      data: {
        name: classe.name,
        bannerCldPublic: classe.bannerCldPubId,
        bannerUrl: classe.bannerUrl,
        description: classe.description,
        capacity: classe.capacity,
        status: classe.status,
        subjectId: classe.subjectId,
        teacherId: classe.teacherId,
        inviteCode: Math.random().toString(36).substring(2, 9),
        schedules: [],
      },
    });

    if (!classeCreate) {
      throw Error;
    }

    res.status(201).json({
      message: "Class created succesfully",
      data: classeCreate,
    });
  } catch (e) {
    console.log("fail to create a new class", e);
    res
      .status(500)
      .json({ message: "somthing wrong with create a new class", error: e });
  }
});

router.get("/", async (req, res) => {
  try {
    const { search, subject, teacher, limit = "10", page = "1" } = req.query;

    const currentLimit = Number(limit);
    const currentPage = Number(page);

    console.log("the limit is : ", currentLimit);
    console.log("the page is : ", currentPage);

    if (
      currentPage < 1 ||
      !Number.isInteger(currentPage) ||
      currentLimit < 1 ||
      !Number.isInteger(currentLimit)
    ) {
      return res.status(403).json({
        message: "page and limit must be positive integer",
      });
    }

    const limitPerPage = Math.min(currentLimit);

    const offSet = (currentPage - 1) * limitPerPage;

    let whereClause: any = {};

    console.log("serch is : " , search) ; 
    console.log("subject is : " , subject) ;
    console.log("teacher is : " , teacher) ;

    if (search) {
      const searchQuery = String(search);
      whereClause.OR = [
        {name: { contains: searchQuery, mode: "insensitive" }},
        {inviteCode: { contains: searchQuery }},
      ];
    }

    if (subject) {
      const subjectQuery = String(subject);
      whereClause.subject = {
        name: { contains: subjectQuery, mode: "insensitive" },
      };
    }
    if (teacher) {
      const teacherQuery = String(teacher);
      whereClause.teacher = {
        name: { contains: teacherQuery, mode: "insensitive" },
      };
    }
    const [result, count] = await Promise.all([
      prisma.classes.findMany({
        where: whereClause,
        skip: offSet,
        take: limitPerPage,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          subject: {
            include: {
              department: true,
            },
          },
          teacher: true,
        },
      }),
      prisma.classes.count({
        where: whereClause,
      }),
    ]);

    const totalCount = count ? count : 0;

    res.status(200).json({
      message: "Classes retrieved successfully",
      data: result,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        pageSize: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (e) {
    console.log("faild to get data : ", e);
    res.status(403).json({
      message: "something went wrong with getting classes",
      errore: e,
    });
  }
});

export default router;
