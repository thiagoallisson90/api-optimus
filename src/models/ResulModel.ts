import mongoose from "mongoose";

export interface IResultModel extends mongoose.Document {
  metrics: any;
  data: any;
  imgs: any;
  simulation: any;
  createdAt: any;
  updatedAt: any;
}

const resultSchema: mongoose.Schema = new mongoose.Schema<IResultModel>(
  {
    metrics: {
      type: [String],
      required: [true, "Metrics are required!"],
    },
    data: {
      type: [String],
      required: [true, "Data are required!"],
    },
    imgs: {
      type: [String],
      required: [true, "Images are required!"],
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
