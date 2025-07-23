const { Schema, model } = require('mongoose');

const houseServiceSchema = new Schema(
    {
        name: { type: String, required: true }, // tên dịch vụ
        unit: { type: String, required: true }, // đơn vị tính: "kWh", "m3", "month"...
        price: { type: Number, required: true }, // giá dịch vụ
    },
    {
        timestamps: true, // tự động thêm createdAt, updatedAt
        collection: 'house_services', // khớp với tên collection trong MongoDB
        versionKey: false, // loại bỏ __v
    },
);

const HouseService = model('HouseService', houseServiceSchema); // trùng với ref trong Room schema
module.exports = HouseService;
