const Invoice = require("../models/Invoice");
const PDFDocument = require("pdfkit");


const getInvoiceHistory = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      roomId,
      startDate,
      endDate,
    } = req.query;

    const filter = {};
    if (status) filter.payment_status = status;
    if (roomId) filter.for_room_id = roomId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Set to end of day
        filter.createdAt.$lte = end;
      }
    }

    const invoices = await Invoice.find(filter)
      .populate("for_room_id", "roomNumber floor")
      .populate("create_by", "fullname email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalInvoices = await Invoice.countDocuments(filter);

    res.json({
      invoices,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalInvoices / limit),
      totalItems: totalInvoices,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @description Lấy thông tin chi tiết của một hoá đơn
 * @route GET /api/history/:id
 * @access Private/Admin
 */
const getSingleInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("for_room_id", "roomNumber floor")
      .populate("create_by", "fullname email phoneNumber address");

    if (!invoice) {
      return res.status(404).json({ message: "Không tìm thấy hoá đơn" });
    }

    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @description Tạo và tải file PDF của một hoá đơn
 * @route GET /api/history/:id/download
 * @access Private/Admin
 */
const downloadInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("for_room_id", "roomNumber")
      .populate("create_by", "fullname");

    if (!invoice) {
      return res.status(404).json({ message: "Không tìm thấy hoá đơn" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=hoa-don-${invoice._id}.pdf`
    );
    doc.pipe(res);

    // --- Nội dung PDF ---
    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("HOÁ ĐƠN THANH TOÁN", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text(`Số hoá đơn: ${invoice._id}`, { align: "right" });
    doc.text(
      `Ngày tạo: ${new Date(invoice.createdAt).toLocaleDateString("vi-VN")}`,
      { align: "right" }
    );
    doc.moveDown();
    doc.fontSize(12).text("Thông tin thanh toán", { underline: true });
    doc.moveDown(0.5);
    doc.font("Helvetica");
    doc.text(`Người thuê: ${invoice.create_by.fullname}`);
    doc.text(`Phòng: ${invoice.for_room_id.roomNumber}`);
    doc.text(`Nội dung: ${invoice.content}`);
    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .text("Chi tiết các khoản phí:", { underline: true });
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const itemX = 50;
    const unitX = 250;
    const priceX = 350;
    const totalX = 450;
    doc.fontSize(10);
    doc.text("Hạng mục", itemX);
    doc.text("Đơn vị", unitX);
    doc.text("Đơn giá", priceX, { width: 90, align: "right" });
    doc.text("Thành tiền", totalX, { width: 90, align: "right" });
    doc.moveTo(itemX, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    doc.font("Helvetica");
    for (const item of invoice.items) {
      doc.text(item.name, itemX);
      doc.text(item.unit || "N/A", unitX);
      doc.text(item.price_unit.toLocaleString("vi-VN") + " VNĐ", priceX, {
        width: 90,
        align: "right",
      });
      doc.text(item.subTotal.toLocaleString("vi-VN") + " VNĐ", totalX, {
        width: 90,
        align: "right",
      });
      doc.moveDown(0.5);
    }

    doc.moveTo(itemX, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(14);
    doc.text(`TỔNG CỘNG:`, 300, doc.y, { align: "left" });
    doc.text(
      `${invoice.total_amount.toLocaleString("vi-VN")} VNĐ`,
      totalX,
      doc.y - 14,
      { width: 90, align: "right" }
    );
    doc.moveDown();

    doc.font("Helvetica").fontSize(10);
    doc.text(
      `Trạng thái thanh toán: ${
        invoice.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"
      }`
    );
    if (invoice.payment_status === "paid") {
      doc.text(
        `Ngày thanh toán: ${new Date(invoice.paid_date).toLocaleDateString(
          "vi-VN"
        )}`
      );
      doc.text(
        `Hình thức: ${
          invoice.payment_type === "Cash" ? "Tiền mặt" : "Chuyển khoản"
        }`
      );
    }

    doc.text("Cảm ơn quý khách!", 50, 750, { align: "center", width: 500 });
    // --- Kết thúc PDF ---
    doc.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getInvoiceHistory,
  getSingleInvoice,
  downloadInvoice,
};
