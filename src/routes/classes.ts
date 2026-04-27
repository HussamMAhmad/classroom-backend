import express from "express";
import { prisma } from "../config/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { ...classe } = req.body;
    console.log('classes is : ' , classe);
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

export default router;
