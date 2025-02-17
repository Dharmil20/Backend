import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  getSubscriptions,
  getUserSubscriptions,
} from "../controller/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", getSubscriptions);

subscriptionRouter.get("/:id", authorize);

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", (req, res) => {
  res.json({ message: "UPDATE subscription" });
});

subscriptionRouter.delete("/:id", (req, res) => {
  res.json({ message: "DELETE subscription" });
});

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

subscriptionRouter.put("/:id/cancel", (req, res) => {
  res.json({ message: "CANCEL user subscription" });
});
subscriptionRouter.get("/upcoming-renewals", (req, res) => {
  res.json({ message: "GET upcoming renewals" });
});

export default subscriptionRouter;
