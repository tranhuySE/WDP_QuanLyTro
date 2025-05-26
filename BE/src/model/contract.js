import { Schema, model } from "mongoose";

const contractSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    tenants: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    price: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
      },
    },
    deposit: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
      },
      paymentDate: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["paid", "pending", "refunded"],
        default: "pending",
      },
    },
    file: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["pdf", "image"],
          required: true,
        },
      },
    ],
    //điều khoản hợp đồng
    terms: {
      type: String,
      required: true,
    },
    createBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "active", "terminated", "renewed"],
      default: "active",
    },
    terminationReason: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    terminatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "contracts",
  }
);

const Contract = model("Contract", contractSchema);
export default Contract;
