import { JWT_SECRET } from "../config/env";
import User from "../models/user.model";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { z } = require("zod");
// const cookieParser = require("cookie-parser");
require("dotenv").config();

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const requiredBody = z.object({
      email: z.string().min(3).max(30).email(),
      name: z.string().min(3).max(30),
      password: z
        .string()
        .min(8)
        .max(30)
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d@$!%*?&]{8,30}$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
    });

    const parsedData = requiredBody.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Incorrect Format",
        error: parsedData.error.errors,
      });
    }

    const { name, email, password } = parsedData.data;

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    const newUser = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Send success response
    res.status(201).json({
      message: "User signed up successfully",
      token: token,
    });
  } catch (error) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    next(error); // Pass the error to the error-handling middleware
  }
};

export const signIn = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = User.findOne({ email: email });

  if (!user) {
    res.json({
      message: "User not Signed Up",
    });
  }

  const passwordMatched = await bcrypt.compare(user.password, password);

  if (!passwordMatched) {
    res.json({
      message: "Invalid Credentials",
    });
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
    },
    JWT_SECRET
  );

  res.json({
    message: "Logged in Successfully",
    token: token,
  });
};
export const signOut = async (req, res) => {};
