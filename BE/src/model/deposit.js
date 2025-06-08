const { Schema, model } = require("mongoose");

const depositSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    deposit_type: {
      type: String,
      enum: ["keep_room", "all_room"],
    },
    name: { type: String, require: true },
    phone: { type: String, require: true },
    amount: { type: String, require: true },
    file: [
      {
        url: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["paid", "refunded"],
      default: "paid",
    },
  },
  {
    timestamps: true,
    collection: "deposits",
  }
);

const Deposit = model("Deposit", depositSchema);
export default Deposit;
