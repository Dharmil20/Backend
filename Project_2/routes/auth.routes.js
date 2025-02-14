import { Router } from "express";

const authRouter = Router();

authRouter.post("/sign-up", (req, res) => {
  res.json({ message: "This is Sign Up endpoint" });
});

authRouter.post("/sign-in", (req, res) => {
  res.json({ message: "This is Sign In endpoint" });
});

authRouter.post("/sign-out", (req, res) => {
  res.json({ message: "This is Sign Out endpoint" });
});

export default authRouter;
