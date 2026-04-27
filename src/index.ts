import AgentAPI from "apminsight";
AgentAPI.config();
import express from "express";
import { PORT, FRONTEND_URL } from "./config/env.js";
import { SubjectRouter } from "./routes/subject.js";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import {auth} from "./lib/auth.js"
import securityMiddleware from "./middleware/security.js"
import usersRouter from "./routes/users.js";
import classesRouter from "./routes/classes.js"

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use(securityMiddleware);

app.use("/api/users", usersRouter);
app.use("/api/subjects", SubjectRouter);
app.use("/api/classes", classesRouter); 

app.use("/", (req, res) => {
  res.send("Welcome to the Classroom Management API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
