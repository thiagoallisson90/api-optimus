import { Response, Request, RequestHandler } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import UserLoRaSimulation from "../models/UserLoRaSimulationModel.js";
import fs from "node:fs";
import path from "path";

const __dirname = path.resolve();

const makeFileName = (file: string, ext = "csv") => {
  const now = new Date();
  const formattedDateTime = `${now.getDate().toString().padStart(2, "0")}-${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${now.getFullYear()}_${now
    .getHours()
    .toString()
    .padStart(2, "0")}-${now.getMinutes().toString().padStart(2, "0")}-${now
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
  return `files/${file}_${formattedDateTime}.${ext}`;
};

class FileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "File Error";
  }
}

const saveCoords = (content: string, file: string): string => {
  const fileName = path.join(__dirname, makeFileName(file));

  try {
    fs.writeFileSync(fileName, content); //  NodeJS.ErrnoException
  } catch (error: any) {
    throw new FileError(error.message);
  }

  return fileName;
};

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
    name: z.string({
      required_error: "Name is required!",
    }),
    description: z
      .string({
        required_error: "Description is required!",
      })
      .optional(),
    xDim: z.coerce
      .number({
        required_error: "X-dimension is required!",
      })
      .gt(0, {
        message: "X-dimension must be greater than 0!",
      }),
    yDim: z.coerce
      .number({
        required_error: "Y-dimension is required!",
      })
      .gt(0, {
        message: "Y-dimension be greater than 0!",
      }),
    simTime: z.coerce
      .number({
        required_error: "Simulation Time is required!",
      })
      .gt(0, {
        message: "Simulation time must be greater than 0!",
      }),
    numGWs: z.coerce
      .number({
        required_error: "Number of Gateways is required!",
      })
      .int()
      .gt(0, {
        message: "Number of Gateways must be greater than 0!",
      }),
    gwCoords: z.string({
      required_error: "Gateway's coordinates are required!",
    }),
    bw: z.coerce.number({
      required_error: "Bandwidth is required!",
    }),
    freq: z.coerce.number({
      required_error: "Frequency is required!",
    }),
    numEDs: z.coerce
      .number({
        required_error: "Number of EDs is required!",
      })
      .int()
      .gt(0, {
        message: "Number of EDs must be greater than 0!",
      }),
    edCoords: z.string({
      required_error: "ED's coordinates are required!",
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
    lossModel: z.enum(["Okumura-Hata", "LogDistance"], {
      required_error: "Loss Propagation Model is required!",
      message: "Loss Propagation model is not supported!",
    }),
    shadowingModel: z.boolean({
      required_error: "Shadowing Model is required!",
    }),
    user: z.string({
      required_error: "User is required!",
    }),
  })
  .refine(
    (data) => {
      const coords: string[] = data.gwCoords.split(";");
      if (coords.length < data.numGWs) {
        return false;
      }

      return verifyCoords(coords);
    },
    {
      message: "GW's coordinates are invalid!",
      path: ["gwCoords"],
    }
  )
  .refine(
    (data) => {
      const coords: string[] = data.edCoords.split(";");
      if (coords.length < data.numEDs) {
        return false;
      }

      return verifyCoords(coords);
    },
    {
      message: "ED's coordinates are invalid!",
      path: ["edCoords"],
    }
  )
  .refine((data) => data.ackPerc + data.nackPerc == 100, {
    message: "The sum of ackPerc and nackPerc must be equal to 100%",
    path: ["opMode"],
  });

interface IUserLoRaSimulation {
  name: string;
  description?: string;
  xDim: number;
  yDim: number;
  simTime: number;
  numGWs: number;
  gwCoords: string;
  bw: number;
  freq: number;
  numEDs: number;
  edCoords: string;
  edClass: string;
  opMode: string;
  nackPerc: number;
  ackPerc: number;
  lossModel: string;
  shadowingModel: boolean;
  user: string;
}

export const getUserLoRaSim: RequestHandler = async (
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

export const createUserLoRaSim: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userLoRaSim = req.body as IUserLoRaSimulation;

    const parse = userLoRaSimSchema.safeParse(userLoRaSim);
    if (!parse.success) {
      return res
        .status(404)
        .json({ success: false, message: parse.error.errors });
    }

    userLoRaSim.gwCoords = saveCoords(userLoRaSim.gwCoords, "gwCoords");
    userLoRaSim.edCoords = saveCoords(userLoRaSim.edCoords, "edCoords");

    const newSim = await new UserLoRaSimulation(userLoRaSim).save();
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
  try {
    const { id } = req.params;
    const userLoRaSim = req.body as {
      name: string;
      email: string;
      password: string;
      confirmPassword?: string;
      userType: string;
    };

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

    await UserLoRaSimulation.findByIdAndUpdate(id, userLoRaSim, {
      new: true,
    });
    return res
      .status(200)
      .json({ success: true, data: "LoRa Simulation Updated!" });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error(error.message);
    }
    return res.status(500).json({ success: false, message: "Server Error" });
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
        .json({ success: false, message: "Invalid User Id" });
    }

    const delUser = await UserLoRaSimulation.findByIdAndDelete(id);
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
