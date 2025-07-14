const Invoice = require("../models/Invoice");
const PDFDocument = require("pdfkit");
const path = require("path");

const getInvoiceHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Người dùng không được xác thực." });
    }
    const {
      page = 1,
      limit = 10,
      status,
      roomId,
      startDate,
      endDate,
    } = req.query;

    const filter = {};
    if (req.user.role !== "admin") {
      filter.create_by = req.user._id;
    }
    if (status) filter.payment_status = status;
    if (roomId) filter.for_room_id = roomId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
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

const downloadInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("for_room_id", "roomNumber floor")
      .populate("create_by", "fullname email phoneNumber");

    // --- KIỂM TRA DỮ LIỆU AN TOÀN ---
    if (!invoice) {
      return res.status(404).json({ message: "Không tìm thấy hoá đơn." });
    }
    if (!invoice.create_by || !invoice.for_room_id) {
      return res.status(404).json({
        message:
          "Dữ liệu liên quan đến hóa đơn (phòng hoặc người tạo) không còn tồn tại.",
      });
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    const regularFontPath = path.join(
      __dirname,
      "..",
      "fonts",
      "Roboto-Regular.ttf"
    );
    const boldFontPath = path.join(__dirname, "..", "fonts", "Roboto-Bold.ttf");
    doc.registerFont("Roboto", regularFontPath);
    doc.registerFont("Roboto-Bold", boldFontPath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=hoa-don-${
        invoice.for_room_id?.roomNumber || "DELETED-ROOM"
      }-${invoice._id.toString().slice(-6)}.pdf`
    );

    doc.pipe(res);

    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();
  } catch (err) {
    console.error("Lỗi khi tạo PDF:", err);
    res.status(500).send("Server Error: Could not generate PDF.");
  }
};

function generateHeader(doc) {
  const logoPath = path.join(__dirname, "..", "assets", "logo.png");
  const fs = require("fs");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 45, { width: 50 });
  }
  doc
    .fillColor("#444444")
    .font("Roboto-Bold")
    .fontSize(20)
    .text("HOÁ ĐƠN DỊCH VỤ", 110, 57)
    .fontSize(10)
    .font("Roboto")
    .text("Công ty TNHH Quản lý Nhà trọ ABC", 200, 65, { align: "right" })
    .text("123 Đường XYZ, Quận 1, TP. HCM", 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#444444").fontSize(20).text("Thông tin", 50, 160);
  generateHr(doc, 185);
  const customerInformationTop = 200;
  doc
    .fontSize(10)
    .font("Roboto-Bold")
    .text("Mã hóa đơn:", 50, customerInformationTop)
    .font("Roboto")
    .text(invoice._id.toString(), 150, customerInformationTop)
    .font("Roboto-Bold")
    .text("Ngày tạo:", 50, customerInformationTop + 15)
    .font("Roboto")
    .text(
      new Date(invoice.createdAt).toLocaleDateString("vi-VN"),
      150,
      customerInformationTop + 15
    )
    .font("Roboto-Bold")
    .text("Người thuê:", 300, customerInformationTop)
    .font("Roboto")
    .text(invoice.create_by?.fullname || "N/A", 400, customerInformationTop)
    .font("Roboto-Bold")
    .text("Phòng:", 300, customerInformationTop + 15)
    .font("Roboto")
    .text(
      invoice.for_room_id?.roomNumber || "N/A",
      400,
      customerInformationTop + 15
    )
    .moveDown();
  generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
  const invoiceTableTop = 330;
  doc.font("Roboto-Bold");
  generateTableRow(doc, invoiceTableTop, "Hạng mục", "Đơn giá", "Thành tiền");
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Roboto");

  let position = invoiceTableTop + 30;
  for (const item of invoice.items) {
    generateTableRow(
      doc,
      position,
      item.name,
      formatCurrency(item.price_unit),
      formatCurrency(item.subTotal)
    );
    generateHr(doc, position + 20);
    position += 30;
  }

  const subtotalPosition = position;
  doc.font("Roboto-Bold");
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "Tổng cộng",
    formatCurrency(invoice.total_amount)
  );
  doc.font("Roboto");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .font("Roboto")
    .text(
      "Cảm ơn quý khách đã sử dụng dịch vụ. Vui lòng thanh toán đúng hạn.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents) {
  if (typeof cents !== "number") return "N/A";
  return cents.toLocaleString("vi-VN") + " VNĐ";
}

function generateTableRow(doc, y, item, unitCost, lineTotal) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

module.exports = {
  getInvoiceHistory,
  getSingleInvoice,
  downloadInvoice,
};
