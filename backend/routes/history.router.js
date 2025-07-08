const express = require("express");
const {
  getInvoiceHistory,
  getSingleInvoice,
  downloadInvoice,
} = require("../controllers/history.controller");

const historyRouter = express.Router();

// GET / -> Tra cứu danh sách hoá đơn
// Ví dụ: /history?status=paid&page=1
historyRouter.get("/", getInvoiceHistory);

// GET /:id -> Lấy chi tiết một hoá đơn bằng ID
historyRouter.get("/:id", getSingleInvoice);

// GET /:id/download -> Tải file PDF của hoá đơn
historyRouter.get("/:id/download", downloadInvoice);

module.exports = historyRouter;
