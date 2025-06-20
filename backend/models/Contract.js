const { Schema, model } = require("mongoose");

const contractSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    landlord: {
      type: Schema.Types.ObjectId,
      ref: "User", // thường là admin
      required: true,
    },
    house_address: {
      type: String,
      required: true,
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    price: { type: Number, required: true },

    deposit: {
      amount: { type: Number, required: true },
      paymentDate: { type: Date, required: true },
      status: {
        type: String,
        enum: ["paid", "pending", "refunded"],
        default: "pending",
      },
    },

    file: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, required: true },
      },
    ],

    house_service: [
      {
        type: Schema.Types.ObjectId,
        ref: "HouseService",
      },
    ],

    terms: { type: String, required: true },

    createBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // người tạo: staff
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "active", "terminated", "renewed"],
      default: "draft", // sẽ được admin duyệt để chuyển "active"
    },

    terminationReason: String,
    terminatedAt: Date,
  },
  {
    timestamps: true,
    collection: "contracts",
    versionKey: false,
  }
);

const Contract = model("Contract", contractSchema);
module.exports = Contract;