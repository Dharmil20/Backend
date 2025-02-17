import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  cancelSubscription,
  createSubscription,
  deleteSubscription,
  getSubscription,
  getSubscriptions,
  getUpcomingRenewals,
  getUserSubscriptions,
  updateSubscription,
} from "../controller/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/subscriptions", getSubscriptions);

subscriptionRouter.get("/:id", getSubscription);

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", authorize, updateSubscription);

subscriptionRouter.delete("/:id", authorize, deleteSubscription);

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

subscriptionRouter.put("/:id/cancel", authorize, cancelSubscription);

subscriptionRouter.get("/", authorize, getUpcomingRenewals);

export default subscriptionRouter;
