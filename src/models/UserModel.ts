import mongoose from "mongoose";
import { z } from "zod";

export interface IUserModel extends mongoose.Document {
  name: any;
  email: any;
  password: any;
  userType: any;
}

const userSchema: mongoose.Schema = new mongoose.Schema<IUserModel>(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      validate: {
        validator: (name: string): boolean => {
          return name.length >= 2;
        },
        message: "Name must contain at least 2 or more characters each.",
      },
    },
    email: {
      type: String,
      required: [true, "E-mail is required!"],
      unique: [true, "E-mail must be unique!"],
      validate: {
        validator: (email: string): boolean => {
          const v = z.string().email();
          return v.safeParse(email).success;
        },
        message: "Invalid e-mail format!",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      validate: {
        validator: (password: string): boolean => {
          return password.length >= 8;
        },
        message: "Password must be at least 8 characters long!",
      },
    },
    userType: {
      type: String,
      enum: {
        values: ["Admin", "Member"],
        message: "{VALUE} User type is not supported!",
      },
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  }
);

const User = mongoose.model<IUserModel>("User", userSchema);

export default User;
