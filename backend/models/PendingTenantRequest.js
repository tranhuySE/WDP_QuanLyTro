const { Schema, model } = require("mongoose");

const pendingTenantRequestSchema = new Schema(
    {
        fullname: { type: String, required: true },
        email: { type: String, required: true },
        citizen_id: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        address: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        contactEmergency: {
            name: String,
            relationship: String,
            phoneNumber: String,
        },

        roomId: {
            type: Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        price: { type: Number, required: true },

        deposit: {
            amount: Number,
            paymentDate: Date,
        },

        terms: { type: String, required: true },

        house_address: { type: String, required: true },

        staffId: {
            type: Schema.Types.ObjectId,
            ref: "User", // người tạo yêu cầu (nhân viên)
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
        collection: "pending_requests",
        versionKey: false,
    }
);

const PendingTenantRequest = model("PendingTenantRequest", pendingTenantRequestSchema);
module.exports = PendingTenantRequest;