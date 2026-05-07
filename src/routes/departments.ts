import express from "express";
import { prisma } from "../config/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const departments = await prisma.departments.findMany();
    const total = await prisma.departments.count();
    res.setHeader("x-total-count", total);
    res.setHeader("Access-Control-Expose-Headers", "x-total-count");
    res
      .status(200)
      .json({ message: "Successfully fetch data", data: departments });
  } catch (e) {
    console.log("faild to fetch data");
    res.status(500).json({ message: "Something went wrong", error: e });
  }
});
export default router;
