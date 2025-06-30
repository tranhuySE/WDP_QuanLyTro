const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const requestsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 255,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "MAINTENANCE",
        "CLEANING",
        "COMPLAINT",
        "TASK_ASSIGNMENT",
        "ROOM_ISSUE",
        "PAYMENT_ISSUE",
        "OTHER",
      ],
      required: true,
      default: "OTHER",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      required: true,
      default: "MEDIUM",
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "ASSIGNED",
        "IN_PROGRESS",
        "COMPLETED",
        "REJECTED",
        "CANCELLED",
      ],
      required: true,
      default: "PENDING",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    approval: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reasonReject: {
      type: String
    },
    completion: {
      completedAt: Date,
      note: String,
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      feedback: String,
    },
    attachments: [
      {
        fileName: {
          type: String,
          required: true,
        },
        filePath: {
          type: String,
          required: true,
        },
        fileType: {
          type: String,
          required: true,
        },
        fileSize: {
          type: Number,
          required: true,
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    statusHistory: [
      {
        oldStatus: String,
        newStatus: {
          type: String,
          required: true,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        note: String,
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    dueDate: Date,
  },
  {
    timestamps: true,
    collection: "requests",
  }
);

const Request = model("Request", requestsSchema);
module.exports = Request;