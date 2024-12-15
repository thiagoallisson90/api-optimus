import mongoose from "mongoose";

export interface IResultModel extends mongoose.Document {
  data: any;
  simulation: any;
  createdAt: any;
  updatedAt: any;
}

const resultSchema: mongoose.Schema = new mongoose.Schema<IResultModel>(
  {
    data: {
      type: [String],
      required: [true, "Data is required!"],
    },
    simulation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserLoRaSimulation",
      required: [true, "Simulation reference is required!"],
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  }
);

const Result = mongoose.model<IResultModel>("Result", resultSchema);

export default Result;
