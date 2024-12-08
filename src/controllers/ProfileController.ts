import { Response, Request, RequestHandler } from "express";
import Profile from "../models/ProfileModel.js";
import { z } from "zod";

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
): Promise<any> => {};

export const deleteProfile: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {};
