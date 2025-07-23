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

        res.status(200).json(result);
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
            notify_status,
            note,
            payment_type,
        } = req.body;

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
            items,
            total_amount,
            notify_status,
            note: {
                img: uploadedImages,
                text: note.text || '',
            },
            payment_type,
        });
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

        // 2. Tìm tất cả các hóa đơn có for_room_id nằm trong mảng roomIds
        const invoices = await Invoice.find({ for_room_id: { $in: roomIds } })
            .populate('for_room_id', 'roomNumber -_id') // Lấy roomNumber từ Room
            .populate('create_by', 'fullname -_id'); // Lấy fullname từ User

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

const PAYOS_API_URL = 'https://api-merchant.payos.vn/v2/payment-requests';

// Cache tạm thời để lưu trữ thông tin thanh toán PayOS
// Key: invoiceId, Value: { orderCode: number, qrCode: string, paymentLink: string, timestamp: number }
const paymentCache = {};

// Hàm tạo chữ ký cho request (quan trọng)
const generateSignature = (data, checksumKey) => {
    if (!data || typeof data !== 'string') {
        throw new Error('Dữ liệu phải là một chuỗi hợp lệ.');
    }
    if (!checksumKey || typeof checksumKey !== 'string') {
        throw new Error('Khóa checksum phải là một chuỗi hợp lệ.');
    }

    try {
        // Tạo một đối tượng HMAC với thuật toán SHA256 và khóa bí mật
        const hmac = crypto.createHmac('sha256', checksumKey);

        // Cập nhật dữ liệu vào HMAC
        hmac.update(data);

        // Tính toán và trả về digest (chữ ký) dưới dạng hex
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

// Hàm xác minh chữ ký của Webhook
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

// --- Hàm tạo thanh toán PayOS ---
const createPayment = async (req, res) => {
    try {
        const { invoiceId, userId } = req.body;
        // Lấy userId từ token

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

        // Tạo orderCode duy nhất, liên kết với invoiceId
        // Sử dụng invoiceId làm một phần của orderCode để dễ dàng tìm lại hóa đơn
        const orderCode = randomNumber(); // Kết hợp timestamp và 6 ký tự cuối của invoiceId
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

        // LƯU THÔNG TIN VÀO CACHE TẠM THỜI
        paymentCache[invoiceId] = {
            orderCode: '',
            qrCode: payosResponseData.qrCode,
            paymentLink: payosResponseData.paymentLink,
            timestamp: Date.now(), // Thời điểm tạo cache
            status: 'pending_payos', // Trạng thái của giao dịch PayOS trong cache
        };

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

// --- Hàm xử lý Webhook từ PayOS ---
const receivePayOSWebhook = async (req, res) => {
    try {
        const webhookData = req.body;
        const receivedSignature = req.headers['x-checksum'];

        if (!receivedSignature) {
            console.warn('Webhook: Missing x-checksum header.');
            return res.status(400).json({ error: 'Missing signature header' });
        }

        const isSecure = verifyPayOSWebhookSignature(
            webhookData,
            receivedSignature,
            PAYOS_CHECKSUM_KEY,
        );
        if (!isSecure) {
            console.warn('Webhook signature verification failed!');
            return res.status(400).json({ error: 'Invalid signature' });
        }

        const eventCode = webhookData.code;
        const payosOrderCode = webhookData.data.orderCode; // Mã đơn hàng của PayOS

        // Tìm invoiceId từ cache dựa vào payosOrderCode
        let invoiceIdFromCache = null;
        for (const invId in paymentCache) {
            if (paymentCache[invId].orderCode === payosOrderCode) {
                invoiceIdFromCache = invId;
                break;
            }
        }

        if (!invoiceIdFromCache) {
            console.warn(
                `Webhook: PayOS order code ${payosOrderCode} not found in cache. Cannot find corresponding invoice.`,
            );
            return res.status(200).send('ok'); // Trả về OK để PayOS không retry
        }

        const invoice = await Invoice.findById(invoiceIdFromCache);

        if (!invoice) {
            console.warn(
                `Webhook: Invoice ${invoiceIdFromCache} not found for PayOS order ${payosOrderCode}.`,
            );
            return res.status(200).send('ok');
        }

        if (eventCode === '00') {
            // Thanh toán thành công
            if (invoice.payment_status !== 'paid') {
                invoice.payment_status = 'paid';
                invoice.paid_date = new Date(); // Cập nhật paid_date
                await invoice.save();
                // Cập nhật trạng thái trong cache
                paymentCache[invoiceIdFromCache].status = 'paid';
                console.log(
                    `Invoice ${invoice._id} (PayOS order ${payosOrderCode}) marked as PAID via webhook.`,
                );
            } else {
                console.log(
                    `Webhook: Invoice ${invoice._id} (PayOS order ${payosOrderCode}) already paid.`,
                );
            }
        } else {
            // Xử lý các trạng thái khác (hủy, hết hạn, thất bại)
            if (invoice.payment_status !== 'paid') {
                // Chỉ cập nhật nếu chưa paid
                // Bạn có thể đặt trạng thái khác nếu muốn, ví dụ 'failed_payment'
                // invoice.payment_status = 'failed_payment';
                // await invoice.save();
                paymentCache[invoiceIdFromCache].status = 'failed_or_cancelled';
                console.log(
                    `Webhook: PayOS order ${payosOrderCode} status: ${eventCode}. Invoice ${invoice._id} remains ${invoice.payment_status}.`,
                );
            }
        }

        return res.status(200).send('ok');
    } catch (err) {
        console.error('Error processing PayOS Webhook:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// --- Hàm kiểm tra trạng thái thanh toán (cho Frontend polling) ---
const checkPaymentStatus = async (req, res) => {
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

        // Trả về trạng thái thanh toán hiện tại của hóa đơn từ DB
        return res.status(200).json({ payment_status: invoice.payment_status });
    } catch (err) {
        console.error('Error checking payment status:', err);
        return res
            .status(500)
            .json({ message: 'Failed to check payment status.', error: err.message });
    }
};

module.exports = {
    getDashboardStats,
    getInvoices,
    createInvoice,
    updateInvoice,
    getInvoicesByUserId,
    createPayment,
    receivePayOSWebhook,
    checkPaymentStatus,
};
