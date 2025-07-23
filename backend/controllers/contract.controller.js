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
        const { status, terminationReason } = req.body;
        const validStatuses = ['draft', 'active', 'terminated'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const updates = { status };

        const contract = await Contract.findById(id);
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        if (status === 'terminated' && contract.status !== 'terminated') {
            updates.terminationReason = terminationReason || '';
            updates.terminatedAt = new Date();
            const user = await User.findById(contract.tenant);
            user.rooms.push(contract.roomId);
            await user.save();
            const room = await Room.findById(contract.roomId);
            room.tenant.push(contract.tenant);
            await room.save();
        } else {
            return res.status(400).json({ message: 'Hợp đồng đã chấm dứt!' });
        }
        const updatedContract = await Contract.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updatedContract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        return res.status(200).json({
            message: 'Contract status updated successfully',
            data: updatedContract,
        });
    } catch (error) {
        console.error('Error updating contract status:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

module.exports = { getContract, createContract, updateContractStatus };
