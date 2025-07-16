const User = require('../models/User.js');
const Room = require('../models/Room.js');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate({
                path: 'rooms',
                select: 'roomNumber floor status', // Chọn các trường cần hiển thị
                model: 'Room' // Ràng buộc với Model Room
            });

        if (!user) return res.status(404).json({ message: 'User not found' });

        console.log('Dữ liệu sau populate:', JSON.stringify(user.rooms, null, 2));
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getListStaff = async (req, res) => {
    try {
        const users = await User.find({
            role: "staff"
        })
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const editUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    deleteUserById,
    getListStaff,
    editUserById
};