import { Router } from "express";
import { signIn, signOut, signUp } from "../controller/auth.controller";

const authRouter = Router();

authRouter.post("/sign-up", signUp); //Path: /api/v1/auth/sign-up

authRouter.post("/sign-in", signIn);  //Path: /api/v1/auth/sign-in

authRouter.post("/sign-out", signOut);  //Path: /api/v1/auth/sign-out

export default authRouter;
