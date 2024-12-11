import { Response, Request, RequestHandler } from "express";
import { z } from "zod";
import UserLoRaSimApp from "../models/UserLoRaSimAppModel.js";
import mongoose from "mongoose";

const userLoRaSimAppSchema = z.object({
  app: z.enum(["OneShot", "Periodic", "Poisson"], {
    required_error: "Application is required!",
    message: "Application type is not supported!",
  }),
  userLoRaSim: z.string({
    required_error: "UserLoRaSim is required!",
  }),
});

interface IUserLoRaSimAppController {
  app: string;
  userLoRaSim: string;
}

export const getApps: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const apps = await UserLoRaSimApp.find({});
    return res.status(200).json({ success: true, data: apps });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.log("Error in Fetching Apps:", error.message);
    }
    return res
      .status(500)
      .json({ success: false, message: "Server Error in Fetching Users" });
  }
};

export const getAppByLoRaSimId: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid LoRa Sim Id!" });
    }

    const apps = await UserLoRaSimApp.find({
      userLoRaSim: id,
    });
    return res.status(200).json({ success: true, data: apps });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.log("Error in Fetching Apps:", error.message);
    }
    return res
      .status(500)
      .json({ success: false, message: "Server Error in Fetching Users" });
  }
};

export const createApp: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const app = req.body as IUserLoRaSimAppController;

    const parse = userLoRaSimAppSchema.safeParse(app);
    if (!parse.success) {
      return res
        .status(404)
        .json({ success: false, message: parse.error.errors });
    }

    if (!mongoose.Types.ObjectId.isValid(app.userLoRaSim)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid LoRa Sim Id!" });
    }

    const newApp = await new UserLoRaSimApp(app).save();
    return res.status(201).json({ success: true, data: newApp._id });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error in Create App:", error.message);
    }

    return res.status(500).json({
      success: false,
      message: "Error in Create App!",
    });
  }
};

export const updateApp: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const app = req.body as IUserLoRaSimAppController;

    const parse = userLoRaSimAppSchema.safeParse(app);
    if (!parse.success) {
      return res.status(404).json({
        errors: parse.error.errors,
      });
    }

    const idErrors = [
      !mongoose.Types.ObjectId.isValid(id),
      !mongoose.Types.ObjectId.isValid(app.userLoRaSim),
    ];
    if (idErrors[0] || idErrors[1]) {
      return res.status(404).json({
        success: false,
        message: `Invalid ${idErrors[0] ? "App Id" : ""}${
          idErrors[0] && idErrors[1] ? " and " : ""
        }${idErrors[1] ? "LoRa Sim Id" : ""}!`,
      });
    }

    await UserLoRaSimApp.findByIdAndUpdate(id, app, { new: true });

    return res.status(200).json({ success: true, data: "App Updated!" });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error(error.message);
    }
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
