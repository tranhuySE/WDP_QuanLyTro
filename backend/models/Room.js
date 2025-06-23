const { Schema, model } = require("mongoose");

const roomSchema = new Schema(
  {
    roomNumber: { type: String, required: true },
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

    description: String,
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

    assets: [
      {
        type: {
          type: String,
          enum: ["motorbike", "car", "bicycle", "other"],
          required: true,
        },
        description: String,
        quantity: { type: Number, default: 1 },
        licensePlate: String,
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