import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    citizen_id: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dqj0v4x5g/image/upload/v1698231234/avt_default.png",
    },
    role: {
      type: String,
      enum: ["user", "admin", "staff"],
    },
    address: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    contactEmergency: {
      name: {
        type: String,
      },
      relationship: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    collection: "users",
    versionKey: false,
  }
);

const User = model("User", userSchema);
export default User;
