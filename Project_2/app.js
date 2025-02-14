import express from "express";
import { PORT } from "./config/env.js";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Welcome To Subcription Tracker!" });
});

app.listen(PORT, () => {
  console.log(`app.js is running on http://localhost:${PORT}`);
});

export default app;