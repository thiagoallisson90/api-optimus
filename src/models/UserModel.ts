import mongoose from "mongoose";
import validator from "validator";

const userSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      validate: {
        validator: (name: string): boolean => {
          return /^[a-zA-ZÀ-ÿ]{2,}\s[a-zA-ZÀ-ÿ]{2,}$/.test(name);
        },
        message:
          "Name must contain at least two words with 2 or more characters each.",
      },
    },
    email: {
      type: String,
      required: [true, "E-mail is required!"],
      unique: [true, "E-mail must be unique!"],
      validate: {
        validator: (email: string): boolean => {
          return validator.isEmail(email);
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

const User = mongoose.model("User", userSchema);

export default User;
