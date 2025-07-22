const { Schema, model } = require("mongoose");
const roomSchema = new Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    floor: { type: Number, required: true },
    area: { type: Number, required: true },
    price: { type: Number, required: true },

    tenant: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    maxOccupants: { type: Number, required: true },

    status: {
      type: String,
      enum: ["available", "occupied", "under_maintenance"],
      default: "available",
    },

    room_service: [
      {
        type: Schema.Types.ObjectId,
        ref: "HouseService",
      },
    ],

    description: { type: String, default: "" },
    images: { type: [String], default: [] },

    amenities: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        status: {
          type: String,
          enum: ["available", "unavailable"],
          default: "available",
        },
      },
    ],

    assets: [
      {
        type: {
          type: String,
          enum: ["motorbike", "car", "bicycle", "other"],
          required: true,
        },
        description: { type: String, default: "" },
        quantity: { type: Number, default: 1 },
        licensePlate: { type: String },
      },
    ],
  },
  {
    timestamps: true,
    collection: "rooms",
    versionKey: false,
  }
);

const Room = model("Room", roomSchema);
module.exports = Room;
