import mongoose from "mongoose";

interface IRefreshTokenModel extends mongoose.Document {
  expiresIn: any;
  user: any;
  //userId: any;
}

const refreshTokenSchema: mongoose.Schema =
  new mongoose.Schema<IRefreshTokenModel>({
    expiresIn: {
      type: Number,
      required: [true, "Expires In is required!"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: ["true", "User is required!"],
    },
    /*userId: {
      type: String,
      required: ["true", "User id is required!"],
    },*/
  });

const RefreshToken = mongoose.model<IRefreshTokenModel>(
  "RefreshToken",
  refreshTokenSchema
);

export default RefreshToken;
