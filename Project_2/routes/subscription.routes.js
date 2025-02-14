import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.json({ message: "GET all subscriptions" });
});
subscriptionRouter.get("/:id", (req, res) => {
  res.json({ message: "GET subscription details" });
});
subscriptionRouter.post("/", (req, res) => {
  res.json({ message: "CREATE subscription" });
});
subscriptionRouter.put("/:id", (req, res) => {
  res.json({ message: "UPDATE subscription" });
});
subscriptionRouter.delete("/:id", (req, res) => {
  res.json({ message: "DELETE subscription" });
});
subscriptionRouter.get("/user/:id", (req, res) => {
  res.json({ message: "GET all user subscriptions" });
});
subscriptionRouter.put("/:id/cancel", (req, res) => {
  res.json({ message: "CANCEL user subscription" });
});
subscriptionRouter.get("/upcoming-renewals", (req, res) => {
  res.json({ message: "GET upcoming renewals" });
});

export default subscriptionRouter;
