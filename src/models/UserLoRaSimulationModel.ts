import mongoose from "mongoose";

interface IUserLoRaSimModel extends mongoose.Document {
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
  user: mongoose.Schema.Types.ObjectId;
}

const userLoRaSimulationSchema: mongoose.Schema =
  new mongoose.Schema<IUserLoRaSimModel>(
    {
      title: {
        type: String,
        required: [true, "Title is required!"],
        validate: {
          validator: (name: string): boolean => {
            return name.length >= 3;
          },
          message: "Title must contain at least 3 or more characters.",
        },
      },
      description: {
        type: String,
        required: false,
        validate: {
          validator: (description: string): boolean => {
            return description.length >= 3;
          },
          message: "Description must contain at least 3 or more characters.",
        },
      },
      simArea: {
        type: String,
        required: [true, "Simulation area is required!"],
      },
      simTime: {
        type: Number,
        required: [true, "Simulation time is required!"],
      },
      gatewayCount: {
        type: Number,
        required: [true, "Number of Gateways is required!"],
        validate: {
          validator: (numGWs: number): boolean => {
            return numGWs > 0;
          },
          message: "Number of gateways must be greater than 0!",
        },
      },
      bandwidth: {
        type: Number,
        required: [true, "Bandwidth is required!"],
      },
      frequency: {
        type: Number,
        required: [true, "Frequency is required!"],
      },
      edCount: {
        type: Number,
        required: [true, "Number of EDs is required!"],
        validate: {
          validator: (numEDs: number): boolean => {
            return numEDs > 0;
          },
          message: "Number of EDs must be greater than 0!",
        },
      },
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
          values: ["okumura", "log"],
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
      appType: {
        type: String,
        required: true,
        enum: {
          values: ["one", "uniform", "poisson"],
          message: "Application is not supported!",
        },
      },
      appPayload: {
        type: Number,
        required: [true, "Application Payload is required!"],
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
