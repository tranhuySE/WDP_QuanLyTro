const express = require('express');
const { getDashboardStats, getInvoices } = require('../controllers/invoice.controller');

const invoiceRouter = express.Router();
invoiceRouter.get('/stats', getDashboardStats);
invoiceRouter.get('/', getInvoices);

module.exports = invoiceRouter;
