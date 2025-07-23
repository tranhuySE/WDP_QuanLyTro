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

invoiceRouter.get('/stats', getDashboardStats);
invoiceRouter.get('/user/:id', getInvoicesByUserId);
invoiceRouter.post('/create-payment', createPayment);
invoiceRouter.post('/payos-webhook', express.json(), receivePayOSWebhook);
invoiceRouter.get('/:invoiceId/:userId/payment-status', checkPaymentStatus);
invoiceRouter.get('/', getInvoices);
invoiceRouter.post('/', createInvoice);
invoiceRouter.put('/:id', updateInvoice);

module.exports = invoiceRouter;
