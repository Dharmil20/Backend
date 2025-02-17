import { workflowClient } from "../config/upstash.js";
import Subscriptions from "../models/subscription.model.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscriptions.create({
      ...req.body,
      user: req.user._id,
    });

    const workflowRunId = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subcriptionId: subscription.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });

    res
      .status(201)
      .json({ success: true, data: { subscription, workflowRunId } });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.statusCode = 401;
      throw error;
    }

    const subscriptions = await Subscriptions.find({ user: req.params.id });

    if (!subscriptions) {
      const error = new Error("No Subscription Added");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscriptions.findById(req.params.id);

    if (!subscription) {
      const error = new Error("No Subscription Added");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscriptions.find();

    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const updatedSubscription = await Subscriptions.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSubscription) {
      const error = new Error("No Subscription found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Subscription updated successfully",
      data: updatedSubscription,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscriptions.findByIdAndDelete(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json({ message: "Subscription deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscriptions.findById(req.params.id);

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    const updatedSubscription = await Subscriptions.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled", endDate: subscription.endDate },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Subscription cancelled successfully",
      data: updatedSubscription,
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const upcomingRenewals = await Subscriptions.find({
      status: "active", // Only active subscriptions
    });

    if (upcomingRenewals.length === 0) {
      // Check for empty array
      const error = new Error("No active subscriptions found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Upcoming subscription renewals",
      count: upcomingRenewals.length,
      data: upcomingRenewals,
    });
  } catch (error) {
    next(error);
  }
};
