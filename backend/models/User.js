const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    citizen_id: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/dqj0v4x5g/image/upload/v1698231234/avt_default.png",
    },
    role: {
      type: String,
      enum: ["user", "staff", "admin"],
      default: "user",
    },
    address: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "inactive",
    },
    contactEmergency: {
      name: String,
      relationship: String,
      phoneNumber: String,
    },
    isVerifiedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "users",
    versionKey: false,
  }
);

const User = model("User", userSchema);
module.exports = User;