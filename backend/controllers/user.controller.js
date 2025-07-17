const User = require('../models/User.js');
const cloudinary = require('cloudinary').v2;
const Room = require('../models/Room.js');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
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
        // Prevent username and email from being updated
        delete req.body.username;
        delete req.body.email;
        // If avatar is a base64 string, upload to Cloudinary
        if (req.body.avatar && typeof req.body.avatar === 'string' && req.body.avatar.startsWith('data:image')) {
            const result = await cloudinary.uploader.upload(req.body.avatar, {
                folder: 'users'
            });
            req.body.avatar = result.secure_url;
        }
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (error) {
        console.log("🚀 ~ editUserById ~ error:", error)
        res.status(500).json({ message: error.message });
    }
}

const changePassword = async (req, res) => {
    console.log("🚀 ~ changePassword ~ req:", req.body)
    // Only update the password field
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
          if (user.password !== req.body.oldPassword) {
            return res.status(400).json({ message: "Mật khẩu hiện tại không đúng." });
        }
        // Check if new password is the same as current password
        if (user.password === req.body.password) {
            return res.status(400).json({ message: 'Mật khẩu mới không được trùng với mật khẩu cũ.' });
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { password: req.body.password },
            { new: true }   
        );
        res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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
    editUserById,
    changePassword
};