const { Schema, model } = require("mongoose");

const assignSchema = new Schema(
  {
    create_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: { type: String },
    assign_for: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    for_room_id: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    assign_type: {
      type: String,
      enum: ["maintenance", "cleaning", "repair", "other"],
      default: "maintenance",
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    due_date: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "assigns",
  }
);

const Assign = model("Assign", assignSchema);
module.exports = Assign;