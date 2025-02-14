import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.json({ message: "Get all users" });
});
userRouter.get("/:id", (req, res) => {
  res.json({ message: "Get user details" });
});
userRouter.post("/", (req, res) => {
  res.json({ message: "Create new user" });
});
userRouter.put("/:id", (req, res) => {
  res.json({ message: "Update user" });
});
userRouter.delete("/:id", (req, res) => {
  res.json({ message: "Delete user" });
});

export default userRouter;
