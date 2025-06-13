const { Schema, model } = require("mongoose");

const requestsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      max_length: 255,
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
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      userType: {
        type: String,
        enum: ["ADMIN", "STAFF", "TENANT"],
        required: true,
      },
      userName: String,
      userEmail: String,
    },
    assignedTo: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
      userType: {
        type: String,
        enum: ["STAFF", "ADMIN"],
      },
      userName: String,
      assignedAt: Date,
    },
    room: {
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
      roomNumber: String,
      floor: String,
    },
    approval: {
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
      approvedByName: String,
      approvedAt: Date,
      note: String,
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
          ref: "Account",
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
          ref: "Account",
          required: true,
        },
        changedByName: String,
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
export default Request;
