const { Schema, model } = require("mongoose");

const invoiceSchema = new Schema(
  {
    create_by: { type: Schema.Types.ObjectId, ref: "User" },
    for_room_id: { type: Schema.Types.ObjectId, ref: "Room" },
    content: { type: String, require: true },
    createdAt: { type: Date, default: Date.now },
    invoice_type: {
      type: String,
      enum: ["", ""],
      default: "",
    },
    items: [
      {
        name: { type: String, required: true },
        unit: { type: String },
        price_unit: { type: Number, default: 0 },
        subTotal: { type: Number, default: 0 },
      },
    ],
    total_amount: { type: Number },
    notify_status: {
      type: String,
      enum: [""],
      default: "",
    },
    note: {
      img: [
        {
          url: { type: String },
        },
      ],
      text: {
        type: String,
      },
    },
    payment_type: {
      type: String,
      enum: ["e-banking", "Cash"],
      default: "e-banking",
    },
    payment_status: {
      type: String,
      enum: [""],
      default: "",
    },
    paid_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "invoices",
  }
);

const Invoice = model("Invoice", invoiceSchema);
module.exports = Invoice;