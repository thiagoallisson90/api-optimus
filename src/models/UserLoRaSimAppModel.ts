import mongoose from "mongoose";

interface IUserLoRaSimAppModel extends mongoose.Document {
  app: string;
  userLoRaSim: mongoose.Schema.Types.ObjectId;
}

const userLoRaSimAppSchema: mongoose.Schema =
  new mongoose.Schema<IUserLoRaSimAppModel>({
    app: {
      type: String,
      required: true,
      enum: {
        values: ["OneShot", "Periodic", "Poisson"],
        message: "Value not supported!",
      },
    },
    userLoRaSim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserLoRaSim is required!"],
    },
  });

const UserLoRaSimApp = mongoose.model<IUserLoRaSimAppModel>(
  "UserLoRaSimApp",
  userLoRaSimAppSchema
);

export default UserLoRaSimApp;
