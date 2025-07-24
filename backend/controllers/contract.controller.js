const Contract = require('../models/Contract');
const Room = require('../models/Room');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

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
            tenant,
            landlord,
            house_address,
            startDate,
            endDate,
            price,
            terms,
            createBy,
            status = 'draft',
        } = req.body;

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

        const newContract = new Contract({
            roomId,
            tenant,
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

        const user = await User.findById(tenant);
        user.rooms.push(roomId);
        await user.save();

        const room = await Room.findById(roomId);
        room.tenant.push(tenant);
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
            const user = await User.findById(contract.tenant);
            user.rooms = [];
            await user.save();

            const room = await Room.findById(contract.roomId);
            room.tenant = [];
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

module.exports = { getContract, createContract, updateContractStatus, getContractUserId };
