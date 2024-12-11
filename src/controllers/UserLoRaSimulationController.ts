import { Response, Request, RequestHandler } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import UserLoRaSimulation from "../models/UserLoRaSimulationModel.js";
import { createFolder, delCoords, saveCoords } from "../utils/file.js";

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
    /*edCoords: z.string({
      required_error: "ED's coordinates are required!",
    }),*/
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
    numRep: z.coerce.number({
      required_error: "Number of Repetitions is required!",
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
  /*.refine(
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
  )*/
  .refine((data) => data.ackPerc + data.nackPerc === 100, {
    message: "The sum of ackPerc and nackPerc must be equal to 100%",
    path: ["opMode"],
  });

interface IUserLoRaSimController {
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
  //edCoords: string;
  edClass: string;
  opMode: string;
  nackPerc: number;
  ackPerc: number;
  lossModel: string;
  shadowingModel: boolean;
  user: string;
  numRep: number;
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
    const { user } = req.params;

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(404).json({
        success: false,
        message: "User is invalid!",
      });
    }

    const userLoRaSimulation = await UserLoRaSimulation.find({
      user,
    });
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

export const createUserLoRaSim: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userLoRaSim = req.body as IUserLoRaSimController;

    const parse = userLoRaSimSchema.safeParse(userLoRaSim);
    if (!parse.success) {
      return res
        .status(404)
        .json({ success: false, message: parse.error.errors });
    }

    createFolder("files");

    userLoRaSim.gwCoords = saveCoords(userLoRaSim.gwCoords, "gwCoords");
    //userLoRaSim.edCoords = saveCoords(userLoRaSim.edCoords, "edCoords");

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

    if (userLoRaSim.gwCoords) {
      userLoRaSim.gwCoords = saveCoords(userLoRaSim.gwCoords, "gwCoords");
      if (document) {
        delCoords(document.gwCoords);
      }
    }

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
