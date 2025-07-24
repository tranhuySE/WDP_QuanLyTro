const Invoice = require('../models/Invoice');
const Room = require('../models/Room');
const now = new Date();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const startOfThisMonth = new Date(currentYear, currentMonth, 1);
        const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
        const endOfLastMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

        const invoices = await Invoice.find()
            .populate('for_room_id', 'roomNumber')
            .populate('create_by', 'fullname');

        let totalRevenue = 0;
        let thisMonthRevenue = 0;
        let lastMonthRevenue = 0;
        let totalDebt = 0;
        let overdueDebt = 0;

        const monthlyRevenue = Array(12).fill(0);
        const recentPayments = [];

        for (const inv of invoices) {
            const createdAt = new Date(inv.createdAt);
            const monthIndex = createdAt.getMonth();

            if (inv.payment_status === 'paid') {
                totalRevenue += inv.total_amount || 0;
                monthlyRevenue[monthIndex] += inv.total_amount || 0;

                if (createdAt >= startOfThisMonth) thisMonthRevenue += inv.total_amount;
                if (createdAt >= startOfLastMonth && createdAt <= endOfLastMonth)
                    lastMonthRevenue += inv.total_amount;

                recentPayments.push({
                    id: inv._id,
                    room: inv.for_room_id?.roomNumber || 'N/A',
                    tenant: inv.create_by?.fullname || 'Người thuê',
                    amount: inv.total_amount,
                    date: createdAt.toLocaleDateString('vi-VN'),
                    status: 'paid',
                });
            }

            if (inv.payment_status === 'pending') {
                totalDebt += inv.total_amount || 0;

                const noteText = inv.note?.text || '';
                const match = noteText.match(/\b(\d{1,2})[^\d](\d{1,2})[^\d](\d{4})\b/); // Tìm dạng dd/mm/yyyy hoặc dd-mm-yyyy
                if (match) {
                    const [_, day, month, year] = match;
                    const dueDate = new Date(`${year}-${month}-${day}`);
                    if (dueDate < now) {
                        overdueDebt += inv.total_amount || 0;
                    }
                }
            }
        }

        recentPayments.sort((a, b) => new Date(b.date) - new Date(a.date));
        const limitedRecent = recentPayments.slice(0, 4);

        const revenueTrend = lastMonthRevenue
            ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0;

        const totalRooms = await Room.countDocuments();
        const occupiedRooms = await Room.countDocuments({ status: 'occupied' });
        const occupancyRate = totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

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
                trend: 0,
            },
            occupancy: {
                totalRooms,
                occupied: occupiedRooms,
                rate: occupancyRate,
                trend: 0,
            },
            recentPayments: limitedRecent,
            monthlyRevenue: monthlyRevenue
                .map((revenue, index) => ({
                    month: `Tháng ${index + 1}`,
                    revenue,
                }))
                .slice(0, currentMonth + 1),
        };

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};

const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate('for_room_id', 'roomNumber _id')
            .populate('create_by', 'fullname _id');

        res.status(200).json(invoices);
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
        const {
            create_by,
            for_room_id,
            content,
            items,
            total_amount,
            invoice_type,
            notify_status,
            note,
            payment_type,
            payment_status,
        } = req.body;

        if (items.length === 0) {
            return res.status(400).json({ message: 'Hóa đơn phải có ít nhất một mặt hàng.' });
        }

        if (!total_amount || Number(total_amount) <= 0) {
            return res.status(400).json({ message: 'Tổng tiền phải lớn hơn 0.' });
        }

        const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
        const parsedNote = typeof note === 'string' ? JSON.parse(note) : note;
        const uploadedImages = [];
        for (const file of req.files || []) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'invoices',
            });
            uploadedImages.push(result.secure_url);
            fs.unlinkSync(file.path);
        }

        const newInvoice = new Invoice({
            create_by,
            for_room_id,
            content,
            items: parsedItems,
            total_amount,
            invoice_type,
            notify_status,
            note: {
                img: uploadedImages,
                text: parsedNote?.text || '',
            },
            payment_type,
            payment_status,
        });

        await newInvoice.save();
        res.status(201).json({ message: 'Tạo hóa đơn thành công', invoice: newInvoice });
    } catch (err) {
        console.error('Lỗi khi tạo hóa đơn:', err);
        res.status(500).json({ message: 'Lỗi tạo hóa đơn', error: err.message });
    }
};

const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            create_by,
            for_room_id,
            content,
            items,
            total_amount,
            notify_status,
            note,
            invoice_type,
            payment_type,
            payment_status,
            oldImages,
            deleteImages,
        } = req.body;
        const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
        const parsedNote = typeof note === 'string' ? JSON.parse(note) : note;
        const parsedOldImages = typeof oldImages === 'string' ? JSON.parse(oldImages) : oldImages;
        const parsedDeletedImages =
            typeof deleteImages === 'string' ? JSON.parse(deleteImages) : deleteImages;

        const newUploadedImages = [];
        for (const file of req.files || []) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'invoices',
            });
            newUploadedImages.push(result.secure_url);
            fs.unlinkSync(file.path);
        }

        for (const url of parsedDeletedImages) {
            const publicId = extractPublicId(url);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }
        const updatedData = {
            create_by,
            for_room_id,
            content,
            items: parsedItems,
            total_amount,
            notify_status,
            invoice_type,
            payment_type,
            payment_status,
            note: {
                ...parsedNote,
                img: [...parsedOldImages, ...newUploadedImages],
            },
        };

        const updatedInvoice = await Invoice.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json({ message: 'Cập nhật hóa đơn thành công', invoice: updatedInvoice });
    } catch (err) {
        console.error('❌ updateInvoice error:', err);
        res.status(500).json({ message: 'Lỗi cập nhật hóa đơn', error: err.message });
    }
};

const getInvoicesByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User ID not found in token.' });
        }

        const rooms = await Room.find({ tenant: { $in: [userId] } });

        const roomIds = rooms.map((room) => room._id);

        if (roomIds.length === 0) {
            return res.status(200).json([]);
        }

        const invoices = await Invoice.find({ for_room_id: { $in: roomIds } })
            .populate('for_room_id', 'roomNumber -_id')
            .populate('create_by', 'fullname -_id');

        return res.status(200).json(invoices);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

// Khai báo các biến từ môi trường
const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID;
const PAYOS_API_KEY = process.env.PAYOS_API_KEY;
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;

const paymentCache = {};

const generateSignature = (data, checksumKey) => {
    if (!data || typeof data !== 'string') {
        throw new Error('Dữ liệu phải là một chuỗi hợp lệ.');
    }
    if (!checksumKey || typeof checksumKey !== 'string') {
        throw new Error('Khóa checksum phải là một chuỗi hợp lệ.');
    }

    try {
        const hmac = crypto.createHmac('sha256', checksumKey);
        hmac.update(data);
        return hmac.digest('hex');
    } catch (error) {
        console.error('Lỗi khi tạo chữ ký:', error);
        throw new Error('Không thể tạo chữ ký. Vui lòng kiểm tra lại dữ liệu và khóa.');
    }
};

const randomNumber = () => {
    const min = 100000;
    const max = 999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
};

const verifyPayOSWebhookSignature = (webhookData, receivedSignature, checksumKey) => {
    const sortedData = {};
    Object.keys(webhookData)
        .sort()
        .forEach((key) => {
            sortedData[key] = webhookData[key];
        });

    const queryString = Object.entries(sortedData)
        .map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                return `${key}=${JSON.stringify(value)}`;
            }
            return `${key}=${value}`;
        })
        .join('&');

    const calculatedSignature = crypto
        .createHmac('sha256', checksumKey)
        .update(queryString)
        .digest('hex');

    return calculatedSignature === receivedSignature;
};

const createPayment = async (req, res) => {
    try {
        const { invoiceId, userId } = req.body;
        if (!invoiceId || !userId) {
            return res.status(400).json({ message: 'Invoice ID and User ID are required.' });
        }

        const invoice = await Invoice.findById(invoiceId).populate(
            'for_room_id',
            'roomNumber tenant',
        );

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found.' });
        }

        if (!invoice.for_room_id.tenant.includes(userId)) {
            return res
                .status(403)
                .json({ message: 'Forbidden: You are not authorized to pay this invoice.' });
        }

        if (invoice.payment_status === 'paid') {
            return res.status(400).json({ message: 'Invoice is already paid.' });
        }
        const orderCode = randomNumber();
        const amount = invoice.total_amount;
        const description = `Thanh toan hoa don`;
        const returnUrl = `${FRONTEND_URL}/payment-success`;
        const cancelUrl = `${FRONTEND_URL}/payment-cancel`;

        const paymentData = {
            orderCode: orderCode,
            amount: amount,
            description: description,
            cancelUrl: cancelUrl,
            returnUrl: returnUrl,
        };

        const data = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
        const response = await axios.post(
            'https://api-merchant.payos.vn/v2/payment-requests',
            {
                ...paymentData,
                signature: generateSignature(data, PAYOS_CHECKSUM_KEY),
            },
            {
                headers: {
                    'x-client-id': PAYOS_CLIENT_ID,
                    'x-api-key': PAYOS_API_KEY,
                },
            },
        );

        const payosResponseData = response.data.data;

        return res.status(200).json({
            qrCode: payosResponseData.qrCode,
            paymentLink: payosResponseData.checkoutUrl,
        });
    } catch (err) {
        console.error(
            'Error creating PayOS payment:',
            err.response ? err.response.data : err.message,
        );
        return res.status(500).json({
            message: 'Failed to create payment.',
            error: err.response ? err.response.data : err.message,
        });
    }
};

const updatePaymentStatus = async (req, res) => {
    try {
        const { invoiceId, userId } = req.params;

        const invoice = await Invoice.findById(invoiceId).populate(
            'for_room_id',
            'roomNumber tenant',
        );
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found.' });
        }
        if (!invoice.for_room_id.tenant.includes(userId)) {
            return res.status(403).json({
                message: 'Forbidden: You are not authorized to view this invoice status.',
            });
        }

        invoice.payment_status = 'paid';
        invoice.paid_date = new Date();
        await invoice.save();

        return res.status(200).json({ payment_status: invoice.payment_status });
    } catch (err) {
        console.error('Error checking payment status:', err);
        return res
            .status(500)
            .json({ message: 'Failed to check payment status.', error: err.message });
    }
};

const getElectricWaterStats = async (req, res) => {
    try {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const invoices = await Invoice.find({
            payment_status: 'paid',
            invoice_type: 'service',
        })
            .populate('for_room_id', 'roomNumber _id')
            .populate('create_by', 'fullname _id');

        const statsByMonth = Array.from({ length: 12 }, (_, i) => ({
            month: `Tháng ${i + 1}`,
            electricity: 0,
            water: 0,
        }));

        let current = { electricity: 0, water: 0 };
        let last = { electricity: 0, water: 0 };

        for (const invoice of invoices) {
            const created = new Date(invoice.createdAt);
            const month = created.getMonth();
            const year = created.getFullYear();

            if (!invoice.items || !Array.isArray(invoice.items)) continue;

            for (const item of invoice.items) {
                const name = typeof item.name === 'string' ? item.name.toLowerCase() : '';
                const quantity = item.quantity || 0;
                const unitPrice = item.price_unit || 0;
                const subTotal = item.subTotal || quantity * unitPrice;

                const isCurrentYear = year === currentYear;
                const isCurrentMonth = isCurrentYear && month === currentMonth;
                const isLastMonth = isCurrentYear && month === currentMonth - 1;

                if (name.includes('điện')) {
                    statsByMonth[month].electricity += subTotal;
                    if (isCurrentMonth) current.electricity += subTotal;
                    if (isLastMonth) last.electricity += subTotal;
                }

                if (name.includes('nước')) {
                    statsByMonth[month].water += subTotal;
                    if (isCurrentMonth) current.water += subTotal;
                    if (isLastMonth) last.water += subTotal;
                }
            }
        }

        const trend = {
            electricity: last.electricity
                ? +(((current.electricity - last.electricity) / last.electricity) * 100).toFixed(2)
                : 0,
            water: last.water ? +(((current.water - last.water) / last.water) * 100).toFixed(2) : 0,
        };

        return res.status(200).json({
            year: currentYear,
            current,
            last,
            trend,
            monthly: statsByMonth,
        });
    } catch (error) {
        console.error('Error getting electricity & water stats:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi thống kê điện nước.',
            error: error.message,
        });
    }
};

module.exports = {
    getDashboardStats,
    getElectricWaterStats,
    getInvoices,
    createInvoice,
    updateInvoice,
    getInvoicesByUserId,
    createPayment,
    updatePaymentStatus,
};
