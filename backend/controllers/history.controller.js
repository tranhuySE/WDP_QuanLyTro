const Invoice = require("../models/Invoice");
const Room = require("../models/Room");
const PDFDocument = require("pdfkit");
const path = require("path");

// Các hàm getInvoiceHistory và getSingleInvoice không thay đổi
const getInvoiceHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User is not authenticated." });
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
      const userRooms = await Room.find({ tenant: req.user._id }).select("_id");
      const userRoomIds = userRooms.map((room) => room._id);
      if (userRoomIds.length === 0) {
        return res.json({
          invoices: [],
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
        });
      }
      filter.for_room_id = { $in: userRoomIds };
    }
    if (status) filter.payment_status = status;
    if (roomId && req.user.role === "admin") filter.for_room_id = roomId;
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
      .populate({
        path: "for_room_id",
        select: "roomNumber floor tenant",
        populate: { path: "tenant", select: "fullname email phoneNumber" },
      })
      .populate("create_by", "fullname email");
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// ===================================================================
// === TOÀN BỘ LOGIC TẠO PDF ĐƯỢC THIẾT KẾ LẠI ========================
// ===================================================================

const downloadInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate({
        path: "for_room_id",
        select: "roomNumber tenant address", // Thêm address của phòng nếu có
        populate: {
          path: "tenant",
          select: "fullname email address phoneNumber",
        },
      })
      .populate("create_by", "fullname");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    // Đăng ký font
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
      `attachment; filename=invoice-${
        invoice.for_room_id?.roomNumber || "NA"
      }-${invoice._id.toString().slice(-6)}.pdf`
    );

    doc.pipe(res);

    // Bắt đầu vẽ nội dung
    generateHeader(doc, invoice);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();
  } catch (err) {
    console.error("Error creating PDF:", err);
    res.status(500).send("Server Error: Could not generate PDF.");
  }
};

const brandColor = "#0D6EFD"; // Màu nhấn chính
const lightGrey = "#F0F0F0";
const darkGrey = "#555555";
const textGrey = "#777777";

function generateHeader(doc, invoice) {
  // Vẽ nền header
  doc.rect(0, 0, 595.28, 120).fill(brandColor);

  // Logo (nếu có)
  const logoPath = path.join(__dirname, "..", "assets", "logo.png");
  const fs = require("fs");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 40, 30, { width: 60 });
  }

  // Tiêu đề
  doc
    .font("Roboto-Bold")
    .fillColor("#FFFFFF")
    .fontSize(28)
    .text("INVOICE", 40, 45, { align: "right" });
  doc
    .font("Roboto")
    .fontSize(10)
    .text(`Invoice ID: ${invoice._id.toString()}`, { align: "right" });
  doc.text(
    `Issue Date: ${new Date(invoice.createdAt).toLocaleDateString("en-US")}`,
    { align: "right" }
  );

  doc.moveDown(4);
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor(darkGrey).font("Roboto-Bold").fontSize(12);
  doc.text("Billed From:", 40, 150);
  generateHr(doc, 170);
  doc.font("Roboto").fontSize(10);
  doc.text("ABC Boarding House Management", 40, 175);
  doc.text("123 XYZ Street, District 1, HCMC", 40, 190);
  doc.text("contact@abcboardinghouse.com", 40, 205);

  doc.font("Roboto-Bold").fontSize(12);
  doc.text("Billed To:", 320, 150);
  generateHr(doc, 170, 320);
  doc.font("Roboto").fontSize(10);

  const tenantNames = invoice.for_room_id.tenant
    .map((t) => t.fullname)
    .join(", ");
  const tenantAddress = invoice.for_room_id.tenant[0]?.address || "N/A";
  const tenantEmail = invoice.for_room_id.tenant[0]?.email || "N/A";

  doc.text(tenantNames, 320, 175);
  doc.text(tenantAddress, 320, 190);
  doc.text(tenantEmail, 320, 205);

  doc.moveDown(5);
}

function generateInvoiceTable(doc, invoice) {
  const tableTop = 270;
  doc.font("Roboto-Bold");

  // Header của bảng
  generateTableRow(
    doc,
    tableTop,
    "Item",
    "Unit Price",
    "Quantity",
    "Total",
    true
  );

  doc.font("Roboto");
  let position = tableTop + 25; // Vị trí dòng đầu tiên

  invoice.items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    generateTableRow(
      doc,
      position,
      item.name,
      formatCurrency(item.price_unit),
      item.quantity || 1,
      formatCurrency(item.subTotal),
      isEven
    );
    position += 25;
  });

  // Phần tổng cộng
  const subtotal = invoice.total_amount;
  const paid = invoice.payment_status === "paid" ? invoice.total_amount : 0;
  const due = subtotal - paid;

  const totalsTop = position + 20;
  doc.font("Roboto").fontSize(10);
  doc.text("Subtotal:", 350, totalsTop, { align: "right", width: 100 });
  doc.text(formatCurrency(subtotal), 460, totalsTop, { align: "right" });

  doc.text("Amount Paid:", 350, totalsTop + 20, { align: "right", width: 100 });
  doc.text(formatCurrency(paid), 460, totalsTop + 20, { align: "right" });

  generateHr(doc, totalsTop + 45, 350);

  doc.font("Roboto-Bold").fillColor(brandColor);
  doc.text("Amount Due:", 350, totalsTop + 55, { align: "right", width: 100 });
  doc.text(formatCurrency(due), 460, totalsTop + 55, { align: "right" });
  doc.fillColor(darkGrey); // Reset màu
}

function generateTableRow(
  doc,
  y,
  item,
  unitCost,
  quantity,
  lineTotal,
  isHeader = false
) {
  if (isHeader) {
    doc.rect(40, y - 5, 515, 20).fill(lightGrey);
    doc.fillColor(darkGrey);
  } else {
    doc.fillColor(darkGrey);
  }

  doc
    .fontSize(10)
    .font(isHeader ? "Roboto-Bold" : "Roboto")
    .text(item, 50, y)
    .text(String(unitCost), 250, y, { width: 100, align: "right" })
    .text(String(quantity), 350, y, { width: 100, align: "right" })
    .text(String(lineTotal), 450, y, { width: 100, align: "right" });

  if (isHeader) {
    doc.fillColor(darkGrey); // Reset fill color
  }
}

function generateFooter(doc) {
  generateHr(doc, 750);
  doc
    .fontSize(9)
    .font("Roboto")
    .fillColor(textGrey)
    .text("Notes & Terms", 40, 760)
    .fontSize(8)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      40,
      775
    )
    .text("www.abcboardinghouse.com", 40, 790, {
      link: "http://www.abcboardinghouse.com",
      underline: true,
    });
}

function generateHr(doc, y, startX = 40, endX = 555) {
  doc
    .strokeColor("#E0E0E0")
    .lineWidth(0.5)
    .moveTo(startX, y)
    .lineTo(endX, y)
    .stroke();
}

function formatCurrency(amount) {
  if (typeof amount !== "number") return "0 VND";
  return new Intl.NumberFormat("en-US").format(amount) + " VND";
}

module.exports = {
  getInvoiceHistory,
  getSingleInvoice,
  downloadInvoice,
};
