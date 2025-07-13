// routes/history.router.js
const express = require("express");
const {
  getInvoiceHistory,
  getSingleInvoice,
  downloadInvoice,
} = require("../controllers/history.controller");

const { verifyToken } = require("../middlewares/authMiddleware");

const historyRouter = express.Router();

// === CÁCH ÁP DỤNG MIDDLEWARE MỚI ===
// Áp dụng verifyToken riêng lẻ cho từng route để tránh xung đột

historyRouter.get("/", verifyToken, getInvoiceHistory);
historyRouter.get("/:id", verifyToken, getSingleInvoice);
historyRouter.get("/:id/download", verifyToken, downloadInvoice);

module.exports = historyRouter;
