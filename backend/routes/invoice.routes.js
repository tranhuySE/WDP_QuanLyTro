const express = require('express');
const { getDashboardStats } = require('../controllers/invoice.controller');

const invoiceRouter = express.Router();
invoiceRouter.get('/stats', getDashboardStats);

module.exports = invoiceRouter;
