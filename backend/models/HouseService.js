const { Schema, model } = require("mongoose");

const House_ServiceSchema = new Schema(
  {
    name: { type: String, require: true },
    unit: { type: String, require: true },
    price: { type: Number, require: true },
    updateAt: { type: Date },
  },
  {
    timestamps: true,
    collection: "HouseService",
  }
);

const House_Service = model("House_Service", House_ServiceSchema);
module.exports = House_Service;