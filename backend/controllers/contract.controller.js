const Contract = require('../models/Contract');
const Room = require('../models/Room');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getContract = async (req, res) => {
    try {
        const data = await Contract.find()
            .populate('roomId')
            .populate('tenant')
            .populate('house_service');

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: 'Loi server!' });
    }
};

const createContract = async (req, res) => {
    try {
        const {
            roomId,
            landlord,
            house_address,
            startDate,
            endDate,
            price,
            terms,
            createBy,
            status = 'draft',
        } = req.body;

        const tenant = req.body.tenant || [];
        const house_service = req.body.house_service || [];
        const deposit = {
            amount: req.body['deposit.amount'],
            paymentDate: req.body['deposit.paymentDate'],
            status: req.body['deposit.status'] || 'pending',
        };

        if (!deposit.amount || !deposit.paymentDate) {
            return res.status(400).json({
                message: 'Missing deposit.amount or deposit.paymentDate',
            });
        }

        let uploadedImages = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map((file) =>
                cloudinary.uploader.upload(file.path, {
                    folder: 'contracts',
                }),
            );
            const results = await Promise.all(uploadPromises);
            uploadedImages = results.map((result) => result.secure_url);
        }

        const tenantArray = Array.isArray(tenant) ? tenant : [tenant];

        const newContract = new Contract({
            roomId,
            tenant: tenantArray[0],
            landlord,
            house_address,
            startDate,
            endDate,
            price,
            deposit,
            file: uploadedImages,
            house_service: Array.isArray(house_service) ? house_service : [house_service],
            terms,
            createBy,
            status,
        });

        await Promise.all(
            tenantArray.map(async (userId) => {
                const user = await User.findById(userId);
                if (user && !user.rooms.includes(roomId)) {
                    user.rooms.push(roomId);
                    await user.save();
                }
            }),
        );

        const room = await Room.findById(roomId);
        room.tenant = tenantArray;
        room.status = 'occupied';
        await room.save();

        const savedContract = await newContract.save();

        res.status(201).json({
            message: 'Contract created successfully',
            data: savedContract,
        });
    } catch (error) {
        console.error('Error creating contract:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

const updateContractStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, terminationReason, terminatedAt } = req.body;
        const validStatuses = ['draft', 'active', 'terminated'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }

        const contract = await Contract.findById(id);
        if (!contract) {
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        }

        if (contract.status === 'terminated') {
            return res.status(400).json({ message: 'Hợp đồng đã bị chấm dứt trước đó' });
        }
        if (status === 'terminated') {
            const room = await Room.findById(contract.roomId);
            await Promise.all(
                room.tenant.map(async (userId) => {
                    const user = await User.findById(userId);
                    user.rooms = [];
                    await user.save();
                }),
            );
            room.tenant = [];
            room.status = 'available';
            await room.save();

            contract.terminationReason = terminationReason || '';
            contract.terminatedAt = terminatedAt;
        }

        contract.status = status;
        const updatedContract = await contract.save();

        return res.status(200).json({
            message: 'Cập nhật trạng thái hợp đồng thành công',
            data: updatedContract,
        });
    } catch (error) {
        console.error('Lỗi cập nhật trạng thái hợp đồng:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ nội bộ',
            error: error.message,
        });
    }
};

const AddUserInContract = async (req, res) => {
    try {
        const { roomId } = req.params;
        const tenant = req.body.tenant || [];
        const tenantArray = Array.isArray(tenant) ? tenant : [tenant];
        const data = await Room.findById(roomId);

        if (!data) return res.status(404).json({ message: 'Room not found' });

        tenantArray.forEach((userId) => {
            if (!data.tenant.includes(userId)) {
                data.tenant.push(userId);
            }
        });
        await data.save();

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi máy chủ nội bộ',
            error: error.message,
        });
    }
};

const getContractUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await Contract.findOne({ tenant: userId })
            .populate('roomId')
            .populate('tenant')
            .populate('house_service');

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: 'Loi server!' });
    }
};

const downloadContractPdf = async (req, res) => {
    try {
        const { id } = req.params;
        const contract = await Contract.findById(id)
            .populate('roomId')
            .populate('tenant')
            .populate('house_service');

        if (!contract) {
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        }

        const doc = new PDFDocument({ size: 'A4', margin: 40 });

        doc.registerFont('Roboto', path.join(__dirname, '../fonts/Roboto-Regular.ttf'));

        let filename = `hop-dong-${contract._id}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        doc.pipe(res);

        doc.font('Roboto')
            .fontSize(18)
            .text('HỢP ĐỒNG THUÊ PHÒNG', { align: 'center' })
            .moveDown(1.5);

        doc.fontSize(12);
        doc.text(`Mã hợp đồng: ${contract._id}`);
        doc.text(`Người thuê: ${contract.tenant.fullname}`);
        doc.text(`Số điện thoại: ${contract.tenant.phoneNumber}`);
        doc.text(`Phòng: ${contract.roomId.roomNumber} - Tầng ${contract.roomId.floor}`);
        doc.text(`Địa chỉ: ${contract.house_address}`);
        doc.text(`Giá thuê: ${contract.price.toLocaleString()} VNĐ`);
        doc.text(
            `Thời hạn: từ ${new Date(contract.startDate).toLocaleDateString()} đến ${new Date(
                contract.endDate,
            ).toLocaleDateString()}`,
        );
        doc.text(
            `Tiền đặt cọc: ${contract.deposit.amount.toLocaleString()} VNĐ (${
                contract.deposit.status
            })`,
        );

        doc.moveDown().text('Các dịch vụ sử dụng:', { underline: true });
        contract.house_service.forEach((s, i) => {
            doc.text(`  • ${s.name}: ${s.price.toLocaleString()} VNĐ / ${s.unit}`);
        });

        doc.moveDown().text(`Ghi chú: ${contract.terms || 'Không có'}`);

        doc.moveDown().text(`Trạng thái: ${contract.status}`);
        if (contract.status === 'terminated') {
            doc.text(`Lý do chấm dứt: ${contract.terminationReason || 'Không ghi rõ'}`);
            doc.text(`Ngày chấm dứt: ${new Date(contract.terminatedAt).toLocaleDateString()}`);
        }

        doc.end();
    } catch (error) {
        console.error('Lỗi tạo PDF:', error);
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    getContract,
    createContract,
    updateContractStatus,
    AddUserInContract,
    getContractUserId,
    downloadContractPdf,
};
