import { Router } from "express";
import { deleteUser, getUser, getUsers, updateUser } from "../controller/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", authorize, getUser);
// userRouter.post("/", (req, res) => {
//   res.json({ message: "Create new user" });
// });
userRouter.put("/:id", authorize, updateUser);

userRouter.delete("/:id", authorize, deleteUser);

export default userRouter;
