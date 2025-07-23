const express = require('express');
const {
    getDashboardStats,
    getInvoices,
    createInvoice,
    updateInvoice,
    getInvoicesByUserId,
    createPayment,
    receivePayOSWebhook,
    checkPaymentStatus,
} = require('../controllers/invoice.controller');
const invoiceRouter = express.Router();
const upload = require('../middlewares/upload');

invoiceRouter.get('/stats', getDashboardStats);
invoiceRouter.get('/user/:id', getInvoicesByUserId);
invoiceRouter.post('/create-payment', createPayment);
invoiceRouter.post('/payos-webhook', express.json(), receivePayOSWebhook);
invoiceRouter.get('/:invoiceId/:userId/payment-status', checkPaymentStatus);
invoiceRouter.get('/', getInvoices);
invoiceRouter.post('/', upload.array('img', 5), createInvoice);
invoiceRouter.put('/:id', upload.array('img', 5), updateInvoice);

module.exports = invoiceRouter;
