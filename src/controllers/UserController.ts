import { Response, Request, RequestHandler } from "express";
import User from "../models/UserModel.js";
import { z } from "zod";
import mongoose from "mongoose";
import { hash } from "node:crypto";

const userSchema = z
  .object({
    name: z.string({
      required_error: "Name is required!",
    }),
    email: z
      .string({
        required_error: "E-mail is required!",
      })
      .email({
        message: "Invalid e-mail address!",
      }),
    password: z
      .string({
        required_error: "Password is required!",
      })
      .min(8, {
        message: "Password must be at least 8 characters long!",
      }),
    confirmPassword: z
      .string({
        required_error: "Confirm Password is required!",
      })
      .min(8, {
        message: "Confirm Password must be at least 8 characters long!",
      }),
    userType: z.enum(["Admin", "Member"], {
      message: "User type is not supported!",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"],
  });

const hashPassword = (password: string): string => {
  return hash("sha256", password);
};

export const getUsers: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const users = await User.find({});
    return res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    console.log("Error in Fetching Users:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server Error in Fetching Users" });
  }
};

export const createUser: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user = req.body as {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
      userType: string;
    };

    const parse = userSchema.safeParse(user);
    if (!parse.success) {
      return res
        .status(404)
        .json({ success: false, message: parse.error.errors });
    }

    user.password = hashPassword(user.password);
    const { confirmPassword, ...userWithoutConfirmPass } = user;

    const newUser = await new User(userWithoutConfirmPass).save();
    return res.status(201).json({ success: true, data: newUser._id });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error in Create User:", error.message);
    }

    return res
      .status(500)
      .json({ success: false, message: "Error in Create User!" });
  }
};

export const updateUser: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const user = req.body as {
      name: string;
      email: string;
      password: string;
      confirmPassword?: string;
      userType: string;
    };
    user.confirmPassword = user.password; // Partial

    const parse = userSchema.safeParse(user);
    if (!parse.success) {
      return res.status(404).json({
        errors: parse.error.errors,
      });
    }

    user.password = hashPassword(user.password);
    const { confirmPassword, ...userWithoutConfirmPass } = user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid User Id!" });
    }

    await User.findByIdAndUpdate(id, userWithoutConfirmPass, {
      new: true,
    });
    return res.status(200).json({ success: true, data: "User Updated!" });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error(error.message);
    }
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteUser: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid User Id" });
    }

    const delUser = await User.findByIdAndDelete(id);
    if (delUser) {
      return res.status(200).json({ success: true, message: "User deleted!" });
    } else {
      return res
        .status(404)
        .json({ success: true, message: "User not found!" });
    }
  } catch (error: any) {
    if (process.env.NODE_ENV) {
      console.log("error in deleting user:", error.message);
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
