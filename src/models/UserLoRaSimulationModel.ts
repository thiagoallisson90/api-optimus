import mongoose from "mongoose";

interface IUserLoRaSimModel extends mongoose.Document {
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
  user: mongoose.Schema.Types.ObjectId;
  numRep: number;
}

const userLoRaSimulationSchema: mongoose.Schema =
  new mongoose.Schema<IUserLoRaSimModel>(
    {
      name: {
        type: String,
        required: [true, "Name is required!"],
        validate: {
          validator: (name: string): boolean => {
            return /^[a-zA-ZÀ-ÿ\s']{3,}$/.test(name);
          },
          message: "Name must contain at least 3 or more characters.",
        },
      },
      description: {
        type: String,
        required: false,
        validate: {
          validator: (description: string): boolean => {
            return /^[a-zA-ZÀ-ÿ\s']{3,}$/.test(description);
          },
          message: "Description must contain at least 3 or more characters.",
        },
      },
      xDim: {
        type: Number,
        required: [true, "X-dimension is required!"],
      },
      yDim: {
        type: Number,
        required: [true, "Y-dimension is required!"],
      },
      simTime: {
        type: Number,
        required: [true, "Simulation time is required!"],
      },
      numGWs: {
        type: Number,
        required: [true, "Number of Gateways is required!"],
        validate: {
          validator: (numGWs: number): boolean => {
            return numGWs > 0;
          },
          message: "Number of gateways must be greater than 0!",
        },
      },
      gwCoords: {
        type: String,
        required: [true, "Gateway's coordinates are required!"],
      },
      bw: {
        type: Number,
        required: [true, "Bandwidth is required!"],
      },
      freq: {
        type: Number,
        required: [true, "Frequency is required!"],
      },
      numEDs: {
        type: Number,
        required: [true, "Number of EDs is required!"],
        validate: {
          validator: (numEDs: number): boolean => {
            return numEDs > 0;
          },
          message: "Number of EDs must be greater than 0!",
        },
      },
      /*edCoords: {
        type: String,
        required: [true, "ED's coordinates are required!"],
      },*/
      edClass: {
        type: String,
        required: true,
        enum: {
          values: ["A", "B", "C"],
          message: "ED Class is not supported!",
        },
      },
      opMode: {
        type: String,
        required: true,
        enum: {
          values: ["ACK", "Mixed", "NACK"],
          message: "Operation Mode is not supported!",
        },
      },
      nackPerc: {
        type: Number,
        required: [true, "NACK Percentage is required!"],
      },
      ackPerc: {
        type: Number,
        required: [true, "ACK Percentage is required!"],
      },
      lossModel: {
        type: String,
        required: true,
        enum: {
          values: ["Okumura-Hata", "LogDistance"],
          message: "Path Loss Model is invalid!",
        },
      },
      shadowingModel: {
        type: Boolean,
        required: [true, "Shadowing Model is required!"],
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required!"],
      },
      numRep: {
        type: Number,
        required: [true, "Number of Repetitions is required!"],
      },
    },
    {
      timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    }
  );

const UserLoRaSimulation = mongoose.model<IUserLoRaSimModel>(
  "UserLoRaSimulation",
  userLoRaSimulationSchema
);

export default UserLoRaSimulation;
