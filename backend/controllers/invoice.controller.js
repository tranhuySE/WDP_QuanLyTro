const Invoice = require('../models/Invoice');
const Room = require('../models/Room');
const now = new Date();

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

module.exports = {
    getDashboardStats,
};
