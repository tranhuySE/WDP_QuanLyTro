import { Schema, model } from "mongoose";

const roomSchema = new Schema({
  roomNumber: {
    type: String,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [String],
  amenities: [
    {
      name: String,
      quantity: Number,
      status: {
        type: String,
        enum: ["available", "unavailable"],
        default: "available",
      },
    },
  ],
  maxOccupants: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "occupied", "under_maintenance"],
    default: "available",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Room = model("Room", roomSchema);
export default Room;
