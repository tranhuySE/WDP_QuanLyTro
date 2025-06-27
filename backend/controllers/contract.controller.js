const Contract = require('../models/Contract');
const Room = require('../models/Room');
const User = require('../models/User');

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
            deposit,
            file,
            house_service,
            terms,
            createBy,
            status,
        } = req.body;

        const newContract = new Contract({
            roomId,
            tenant,
            landlord,
            house_address,
            startDate,
            endDate,
            price,
            deposit,
            file: file || [],
            house_service,
            terms,
            createBy,
            status: status || 'draft',
        });

        const savedContract = await newContract.save();
        return res.status(201).json({
            message: 'Contract created successfully',
            data: savedContract,
        });
    } catch (error) {
        console.error('Error creating contract:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

const updateContract = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedContract = await Contract.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updatedContract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        return res.status(200).json({
            message: 'Contract updated successfully',
            data: updatedContract,
        });
    } catch (error) {
        console.error('Error updating contract:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

module.exports = { getContract, createContract, updateContract };
