const { Schema, model } = require('mongoose');

const invoiceSchema = new Schema(
    {
        create_by: { type: Schema.Types.ObjectId, ref: 'User' },
        for_room_id: { type: Schema.Types.ObjectId, ref: 'Room' },
        content: { type: String, require: true },
        createdAt: { type: Date, default: Date.now },
        invoice_type: {
            type: String,
            enum: ['service', 'penalty', 'repair', 'other'],
            default: 'service',
        },
        items: [
            {
                name: { type: String, default: '' },
                unit: { type: String, default: '' },
                quantity: { type: Number, default: 1 },
                price_unit: { type: Number, default: 0 },
                subTotal: { type: Number, default: 0 },
            },
        ],
        total_amount: { type: Number },
        notify_status: {
            type: String,
            enum: [''],
            default: '',
        },
        note: {
            img: [{ type: String, default: '' }],
            text: {
                type: String,
                default: '',
            },
        },
        payment_type: {
            type: String,
            enum: ['e-banking', 'Cash'],
            default: 'e-banking',
        },
        payment_status: {
            type: String,
            enum: ['pending', 'paid', 'overdue'],
            default: 'pending',
        },
        paid_date: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        collection: 'invoices',
    },
);

const Invoice = model('Invoice', invoiceSchema);
module.exports = Invoice;
