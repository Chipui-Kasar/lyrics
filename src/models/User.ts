import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      unique: [true, "Email already exists."],
      required: [true, "Email is required."],
    },
    password: {
      type: String,
      required: false, // Optional for Google OAuth users
    },
    authProvider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Only unique if present
    },
    image: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const User = models.User || model("User", UserSchema);

console.log("User model collection name:", User.collection.name);

export default User;
