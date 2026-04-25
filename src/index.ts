import express from "express";
import { PORT, FRONTEND_URL } from "./config/env";
import { SubjectRouter } from "./routes/subject";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import {auth} from "./auth"
import securityMiddleware from "./middleware/security"

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(securityMiddleware)

app.use("/api/subjects", SubjectRouter);
app.get("/", (req, res) => {
  res.send("Welcome to the Classroom Management API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
