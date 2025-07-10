const Invoice = require('../models/Invoice');
const Room = require('../models/Room');
const now = new Date();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getDashboardStats = async (req, res) => {
    try {
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const startOfThisMonth = new Date(currentYear, currentMonth, 1);
        const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
        const endOfLastMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

        const invoices = await Invoice.find();

        // Revenue
        let totalRevenue = 0;
        let thisMonthRevenue = 0;
        let lastMonthRevenue = 0;

        // Debt
        let totalDebt = 0;
        let overdueDebt = 0;

        // Monthly revenue stats
        const monthlyRevenue = Array(12).fill(0);

        // Recent payments
        const recentPayments = [];

        for (const inv of invoices) {
            const createdAt = new Date(inv.createdAt);
            const monthIndex = createdAt.getMonth();

            // Tính tổng revenue
            if (inv.payment_status === 'paid') {
                totalRevenue += inv.total_amount;
                monthlyRevenue[monthIndex] += inv.total_amount;

                if (createdAt >= startOfThisMonth) thisMonthRevenue += inv.total_amount;
                if (createdAt >= startOfLastMonth && createdAt <= endOfLastMonth)
                    lastMonthRevenue += inv.total_amount;

                // Recent payments
                recentPayments.push({
                    id: inv._id,
                    room: inv.for_room_id?.roomName || 'N/A', // Nếu có populate room name
                    tenant: inv.create_by?.name || 'Người thuê', // Nếu có populate user
                    amount: inv.total_amount,
                    date: new Date(inv.createdAt).toLocaleDateString('vi-VN'),
                    status: 'paid',
                });
            }

            // Debt
            if (inv.payment_status === 'pending') {
                totalDebt += inv.total_amount;

                const noteText = inv.note?.text || '';
                const match = noteText.match(/(?:by|due)\s+([A-Za-z]+\s+\d{1,2},\s*\d{4})/i);
                if (match) {
                    const dueDate = new Date(match[1]);
                    if (dueDate < now) {
                        overdueDebt += inv.total_amount;
                    }
                }
            }
        }

        // Sắp xếp recentPayments theo ngày giảm dần
        recentPayments.sort((a, b) => new Date(b.date) - new Date(a.date));
        const limitedRecent = recentPayments.slice(0, 4);

        // Tính trend
        const revenueTrend = lastMonthRevenue
            ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0;

        const debtTrend = -5.2; // Nếu bạn có lịch sử, tính toán được

        // Tính occupancy (giả định có Room model với field isOccupied)
        const totalRooms = await Room.countDocuments();
        const occupied = await Room.countDocuments({ status: 'occupied' });
        const occupancyRate = totalRooms ? Math.round((occupied / totalRooms) * 100) : 0;
        const occupancyTrend = 2.5; // Nếu cần tính từ trước

        // Dạng ["Tháng 1", ..., "Tháng 6"]
        const monthlyRevenueFormatted = monthlyRevenue.map((val, idx) => ({
            month: `Tháng ${idx + 1}`,
            revenue: val,
        }));

        // Tổng hợp
        const result = {
            revenue: {
                total: totalRevenue,
                thisMonth: thisMonthRevenue,
                lastMonth: lastMonthRevenue,
                trend: +revenueTrend.toFixed(2),
            },
            debt: {
                total: totalDebt,
                overdue: overdueDebt,
                trend: debtTrend,
            },
            occupancy: {
                totalRooms,
                occupied,
                rate: occupancyRate,
                trend: occupancyTrend,
            },
            recentPayments: limitedRecent,
            monthlyRevenue: monthlyRevenueFormatted.slice(0, currentMonth + 1),
        };

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate('for_room_id', 'roomNumber -_id')
            .populate('create_by', 'fullname -_id');
        res.json(invoices);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const extractPublicId = (url) => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const [publicId] = filename.split('.');
    return `invoices/${publicId}`;
};

const createInvoice = async (req, res) => {
    try {
        const { invoiceData } = req.body;
        const parsedData = typeof invoiceData === 'string' ? JSON.parse(invoiceData) : invoiceData;

        const uploadedImages = [];
        for (const file of req.files || []) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'invoices',
            });
            uploadedImages.push({ url: result.secure_url, public_id: result.public_id });
            fs.unlinkSync(file.path);
        }

        parsedData.note = parsedData.note || {};
        parsedData.note.img = uploadedImages;

        const newInvoice = new Invoice(parsedData);
        await newInvoice.save();

        res.status(201).json({ message: 'Tạo hóa đơn thành công', invoice: newInvoice });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi tạo hóa đơn', error: err.message });
    }
};

const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { invoiceData, oldImages = '[]', deletedImages = '[]' } = req.body;

        const parsedData = typeof invoiceData === 'string' ? JSON.parse(invoiceData) : invoiceData;
        const parsedOldImages = JSON.parse(oldImages);
        const parsedDeletedImages = JSON.parse(deletedImages);

        const newUploadedImages = [];
        for (const file of req.files || []) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'invoices',
            });
            newUploadedImages.push({ url: result.secure_url, public_id: result.public_id });
            fs.unlinkSync(file.path);
        }

        for (const url of parsedDeletedImages) {
            const publicId = extractPublicId(url);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        parsedData.note = parsedData.note || {};
        parsedData.note.img = [...parsedOldImages, ...newUploadedImages];

        const updatedInvoice = await Invoice.findByIdAndUpdate(id, parsedData, { new: true });

        res.status(200).json({ message: 'Cập nhật hóa đơn thành công', invoice: updatedInvoice });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi cập nhật hóa đơn', error: err.message });
    }
};

module.exports = {
    getDashboardStats,
    getInvoices,
    createInvoice,
    updateInvoice,
};
