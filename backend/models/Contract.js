import { Schema, model } from "mongoose";

const contractSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    house_address: { type: String, required: true },
    landlord: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    tenant: {
      fullName: { type: String, required: true },
      citizenId: { type: String, required: true },
      issueDate: { type: Date, required: true },
      issuePlace: { type: String, required: true },
      permanentAddress: { type: String, required: true },
      phone: { type: String, required: true },
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
      type: Number,
      required: true,
    },
    deposit: {
      amount: {
        type: Number,
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
          required: true,
        },
      },
    ],
    house_service: [
      {
        type: Schema.Types.ObjectId,
        ref: "HouseService",
        required: true,
      },
    ],
    //điều khoản hợp đồng
    terms: {
      type: String,
      required: true,
    },
    createBy: {
      type: Schema.Types.ObjectId,
      ref: "Account",
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
