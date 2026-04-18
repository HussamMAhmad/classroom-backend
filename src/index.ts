import express from "express";
import { PORT} from "./config/env";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`The database URL is`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
