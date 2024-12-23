import mongoose from "mongoose";
import { z } from "zod";

const profileSchema: mongoose.Schema = new mongoose.Schema(
  {
    github: {
      type: String,
      required: false,
      validate: {
        validator: (github: string): boolean => {
          const v = z.string().url();
          return v.safeParse(github).success;
        },
        message: "Invalid Github!",
      },
    },
    expInYears: {
      type: String,
      required: false,
      enum: {
        values: ["0", "1", "2", "3", "4"],
        message: "Value is not supported!",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: ["true", "User is required!"],
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
