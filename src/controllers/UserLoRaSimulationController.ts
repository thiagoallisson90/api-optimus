import { Response, Request, RequestHandler } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import UserLoRaSimulation from "../models/UserLoRaSimulationModel.js";
import { createFolder, delCoords, saveCoords } from "../utils/file.js";
import User from "../models/UserModel.js";
import path from "path";

const verifyCoords = (coords: string[]): boolean => {
  const test: boolean[] = coords.map((coord) => {
    const pos = coord.trim().split(",");

    return (
      pos.length === 3 &&
      pos
        .map((p, index) => {
          if (index < 2) {
            const v = z.coerce.number();
            return v.safeParse(p).success;
          }
          const v = z.coerce.number().positive();
          return v.safeParse(p).success;
        })
        .every((v) => v)
    );
  });

  for (const t of test) {
    if (!t) {
      return false;
    }
  }
  return true;
};

const userLoRaSimSchema = z
  .object({
    title: z.string({
      required_error: "Title is required!",
    }),
    description: z
      .string({
        required_error: "Description is required!",
      })
      .optional(),
    simArea: z.string({
      required_error: "Simulation area is required!",
    }),
    simTime: z.coerce
      .number({
        required_error: "Simulation Time is required!",
      })
      .gt(0, {
        message: "Simulation time must be greater than 0!",
      }),
    gatewayCount: z.coerce
      .number({
        required_error: "Number of Gateways is required!",
      })
      .int()
      .gt(0, {
        message: "Number of Gateways must be greater than 0!",
      }),
    bandwidth: z.coerce.number({
      required_error: "Bandwidth is required!",
    }),
    frequency: z.coerce.number({
      required_error: "Frequency is required!",
    }),
    edCount: z.coerce
      .number({
        required_error: "Number of EDs is required!",
      })
      .int()
      .gt(0, {
        message: "Number of EDs must be greater than 0!",
      }),
    edClass: z.enum(["A", "B", "C"], {
      required_error: "ED's Class is required!",
      message: "ED Class is not supported!",
    }),
    opMode: z.enum(["ACK", "NACK", "Mixed"], {
      required_error: "Operation Mode is required!",
      message: "Operation mode is not supported!",
    }),
    nackPerc: z.coerce
      .number({
        required_error: "NACK Percentage is required!",
      })
      .gte(0),
    ackPerc: z.coerce
      .number({
        required_error: "ACK Percentage is required!",
      })
      .gte(0),
    lossModel: z.enum(["okumura", "log"], {
      required_error: "Loss Propagation Model is required!",
      message: "Loss Propagation model is not supported!",
    }),
    shadowingModel: z.boolean({
      required_error: "Shadowing Model is required!",
    }),
    user: z.string({
      required_error: "User is required!",
    }),
    appType: z.enum(["one", "uniform", "poisson"], {
      required_error: "Application is required!",
      message: "Application is not supported!",
    }),
    appPayload: z.coerce.number({
      required_error: "Application payload is required!",
    }),
  })
  .refine((data) => data.ackPerc + data.nackPerc === 100, {
    message: "The sum of ackPerc and nackPerc must be equal to 100%",
    path: ["opMode"],
  });

interface IUserLoRaSimController {
  email: string;
  data: {
    ackPerc: number;
    appPayload: number;
    appType: string;
    bandwidth: number;
    description: string;
    edClass: string;
    edCount: number;
    frequency: number;
    gatewayCount: number;
    lossModel: string;
    nackPerc: number;
    opMode: string;
    shadowingModel: string | boolean;
    simArea: string;
    simTime: number;
    title: string;
    user?: string | object;
  };
}

export const getUserLoRaSims: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userLoRaSimulations = await UserLoRaSimulation.find({});
    return res.status(200).json({ success: true, data: userLoRaSimulations });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.log("Error in Fetching User LoRa Simulation:", error.message);
    }
    return res.status(500).json({
      success: false,
      message: "Server Error in Fetching User LoRa Simulation",
    });
  }
};

export const getUserLoRaSimById: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "User LoRa Sim is invalid!",
      });
    }

    const userLoRaSimulation = await UserLoRaSimulation.findById(id);
    return res.status(200).json({ success: true, data: userLoRaSimulation });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.log("Error in Fetching User LoRa Simulation:", error.message);
    }
    return res.status(500).json({
      success: false,
      message: "Server Error in Fetching User LoRa Simulation",
    });
  }
};

export const getUserLoRaSimByUser: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.params;

    const schema = z.string().email();

    if (!schema.safeParse(email).success) {
      return res.status(404).json({
        ok: false,
        message: "E-mail is invalid!",
      });
    }

    const userLoRaSimulation = await UserLoRaSimulation.find({
      email,
    });
    return res.status(200).json({ ok: true, message: userLoRaSimulation });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.log("Error in Fetching User LoRa Simulation:", error.message);
    }
    return res.status(500).json({
      ok: false,
      message: "Server Error in Fetching User LoRa Simulation",
    });
  }
};

export const createUserLoRaSim: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userLoRaSim = req.body as IUserLoRaSimController;

    const { email, data } = userLoRaSim;

    data.shadowingModel = userLoRaSim.data.shadowingModel != "";
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }

    data.user = user.id;
    const parse = userLoRaSimSchema.safeParse(data);
    if (!parse.success) {
      console.log(parse.error.errors);
      return res
        .status(400)
        .json({ success: false, message: parse.error.errors });
    }

    const newSim = await new UserLoRaSimulation(data).save();

    const folder1 = `files${path.sep}${user.id}`;
    createFolder(folder1);
    const folder2 = `${folder1}${path.sep}${newSim.id}`;
    createFolder(folder2);
    const folder3 = `${folder2}${path.sep}imgs`;
    createFolder(folder3);
    const folder4 = `${folder2}${path.sep}data`;
    createFolder(folder4);

    return res.status(201).json({ success: true, data: newSim._id });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error in Create User Simulation LoRa:", error.message);
    }

    return res.status(500).json({
      success: false,
      message: "Error in Create User Simulation LoRa!",
    });
  }
};

export const updateUserLoRaSim: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  let session: mongoose.ClientSession | null = null;

  try {
    const { id } = req.params;
    const userLoRaSim = req.body as IUserLoRaSimController;

    const parse = userLoRaSimSchema.safeParse(userLoRaSim);
    if (!parse.success) {
      return res.status(404).json({
        errors: parse.error.errors,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid LoRa Simulation Id!" });
    }

    session = await UserLoRaSimulation.startSession();
    session.startTransaction();

    const document = await UserLoRaSimulation.findById(id).exec();

    /*if (userLoRaSim.gwCoords) {
      userLoRaSim.gwCoords = saveCoords(userLoRaSim.gwCoords, "gwCoords");
      if (document) {
        delCoords(document.gwCoords);
      }
    }*/

    /*if (userLoRaSim.edCoords) {
      userLoRaSim.edCoords = saveCoords(userLoRaSim.edCoords, "edCoords");
      if (document) {
        delCoords(document.edCoords);
      }
    }*/

    await UserLoRaSimulation.findByIdAndUpdate(id, userLoRaSim, { new: true });
    session.commitTransaction();

    return res
      .status(200)
      .json({ success: true, data: "LoRa Simulation Updated!" });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error(error.message);
    }
    return res.status(500).json({ success: false, message: "Server Error" });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

export const deleteUserLoRaSim: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid User LoRa Simulation Id" });
    }

    const delUserLoRaSim = await UserLoRaSimulation.findByIdAndDelete(id);
    if (delUserLoRaSim) {
      return res.status(200).json({
        success: true,
        message: `User LoRa Simulation ${delUserLoRaSim._id} deleted!`,
      });
    } else {
      return res
        .status(404)
        .json({ success: true, message: "User LoRa Simulation not found!" });
    }
  } catch (error: any) {
    if (process.env.NODE_ENV) {
      console.log("error in deleting user:", error.message);
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
