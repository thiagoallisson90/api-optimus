import { Response, Request, RequestHandler } from "express";
import Profile from "../models/ProfileModel.js";
import { z } from "zod";
import mongoose from "mongoose";

const profileSchema = z.object({
  github: z
    .string()
    .url({
      message: "Invalid Github!",
    })
    .optional(),
  expInYears: z
    .enum(["0", "1", "2", "3", "4"], {
      message: "Experience in Years is not supported!",
    })
    .optional(),
  user: z.string({
    required_error: "User is required!",
  }),
});

export const getProfiles: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const profiles = await Profile.find();
    return res.status(200).json({ success: true, data: profiles });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error(error.message);
    }
    return res
      .status(500)
      .json({ success: false, message: "Server Error in Fetching Profiles" });
  }
};

export const createProfile: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const profile = req.body as {
      github?: string;
      expInYears?: string;
      user: string;
    };

    const parse = profileSchema.safeParse(profile);
    if (!parse.success) {
      return res
        .status(404)
        .json({ success: false, message: parse.error.errors });
    }

    const newProfile = await new Profile(profile).save();
    return res.status(201).json({ success: true, data: newProfile._id });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error in Create Profile:", error.message);
    }

    return res
      .status(500)
      .json({ success: false, message: "Error in Create Profile!" });
  }
};

export const updateProfile: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const profile = req.body as {
      github: string;
      expInYears: string;
      user: string;
    };

    const parse = profileSchema.safeParse(profile);
    if (!parse.success) {
      return res.status(404).json({
        errors: parse.error.errors,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid User Id!" });
    }

    await Profile.findByIdAndUpdate(id, profile, {
      new: true,
    });
    return res.status(200).json({ success: true, data: "Profile Updated!" });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error(error.message);
    }
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteProfile: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Profile Id" });
    }

    const delProfile = await Profile.findByIdAndDelete(id);
    if (delProfile) {
      return res
        .status(200)
        .json({ success: true, message: "Profile deleted!" });
    } else {
      return res
        .status(404)
        .json({ success: true, message: "Profile not found!" });
    }
  } catch (error: any) {
    if (process.env.NODE_ENV) {
      console.log("error in deleting profile:", error.message);
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
