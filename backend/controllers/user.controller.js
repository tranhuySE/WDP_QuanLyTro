const User = require('../models/User.js');
const cloudinary = require('cloudinary').v2;
const Room = require('../models/Room.js');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const EmailService = require('../services/emailService.js');

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
                select: 'roomNumber floor status',
                model: 'Room'
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
        console.log("editUserById error:", error)
        res.status(500).json({ message: error.message });
    }
}

const changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.password !== req.body.oldPassword) {
            return res.status(400).json({ message: "Mật khẩu hiện tại không đúng." });
        }
        // kiểm tra password
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

const editUserInfo = async (req, res) => {
    try {
        const { email, username, phoneNumber, citizen_id } = req.body;
        const userId = req.params.id;

        // kiểm tra email 
        if (email) {
            const emailExists = await User.findOne({
                email,
                _id: { $ne: userId }
            });
            if (emailExists) {
                return res.status(400).json({ message: 'Email đã được sử dụng' });
            }
        }

        // kiểm tra username
        if (username) {
            const usernameExists = await User.findOne({
                username,
                _id: { $ne: userId }
            });
            if (usernameExists) {
                return res.status(400).json({ message: 'Username đã được sử dụng' });
            }
        }

        // kiểm tra phone
        if (phoneNumber) {
            const phoneExists = await User.findOne({
                phoneNumber,
                _id: { $ne: userId }
            });
            if (phoneExists) {
                return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' });
            }
        }

        // 4. Kiểm tra số CCCD đã tồn tại chưa (trừ user hiện tại)
        if (citizen_id) {
            const citizenIdExists = await User.findOne({
                citizen_id,
                _id: { $ne: userId }
            });
            if (citizenIdExists) {
                return res.status(400).json({ message: 'Số CCCD đã được sử dụng' });
            }
        }

        // cập nhật user
        const user = await User.findByIdAndUpdate(userId, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const verifyTenant = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password } = req.body;

        // validate
        if (!username || !password) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ username và password" });
        }

        // check id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "ID không hợp lệ",
                receivedId: id
            });
        }

        // Tìm tenant
        const tenant = await User.findById(id);
        if (!tenant) {
            return res.status(404).json({ message: "Không tìm thấy tenant" });
        }
        if (tenant.isVerifiedByAdmin) {
            return res.status(400).json({ message: "Tenant đã được xác thực" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== id) {
            return res.status(400).json({ message: "Username đã được sử dụng" });
        }

        // Cập nhật info
        tenant.username = username;
        tenant.password = await bcrypt.hash(password, 10);
        tenant.isVerifiedByAdmin = true;
        tenant.status = "active";
        await tenant.save();

        const emailResult = await EmailService.sendTenantAccountEmail(
            tenant,
            username,
            password
        );

        res.status(200).json({
            message: "Xác thực thành công và đã gửi thông tin đăng nhập",
            tenant: {
                _id: tenant._id,
                email: tenant.email,
                fullname: tenant.fullname,
                username: tenant.username
            },
            emailStatus: {
                sentTo: emailResult.emailSent,
                messageId: emailResult.messageId
            }
        });

    } catch (error) {
        console.error('Verify tenant error:', error);
        res.status(500).json({
            message: error.message,
            errorDetails: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const createUserByAdmin = async (req, res) => {
    try {
        const {
            email,
            fullname,
            citizen_id,
            phoneNumber,
            dateOfBirth,
            address,
            role = 'user',
            roomId,
            contactEmergency,
            status = 'active',
            username,
            password,
            isVerifiedByAdmin
        } = req.body;

        // validate role
        if (!['user', 'staff', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Vai trò không hợp lệ' });
        }

        // check mail tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        let generatedPassword = '';
        let hashedPassword;
        if (!password) {
            generatedPassword = Math.random().toString(36).slice(-8);
            hashedPassword = await bcrypt.hash(generatedPassword, 10);
        } else {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // tạo data user
        const userData = {
            username: username || email.split('@')[0] + Math.floor(Math.random() * 1000),
            email,
            fullname,
            citizen_id,
            phoneNumber,
            password: hashedPassword,
            dateOfBirth: new Date(dateOfBirth),
            address,
            role,
            status,
            isVerifiedByAdmin: role !== 'user' ? true : isVerifiedByAdmin,
            contactEmergency
        };

        const newUser = await User.create(userData);

        // gửi mail
        if (newUser.isVerifiedByAdmin && role !== 'admin') {
            await EmailService.sendTenantAccountEmail(
                newUser,
                newUser.username,
                password || generatedPassword
            );
        }

        const userResponse = newUser.toObject();
        delete userResponse.password;
        delete userResponse.resetToken;
        delete userResponse.resetTokenExpire;

        res.status(201).json({
            message: `Tạo ${role} thành công`,
            user: userResponse,
            emailSent: newUser.isVerifiedByAdmin && role !== 'admin'
        });

    } catch (error) {
        console.error('Error creating user by admin:', error);
        res.status(500).json({
            message: 'Lỗi khi tạo user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    deleteUserById,
    getListStaff,
    editUserById,
    changePassword,
    editUserInfo,
    verifyTenant,
    createUserByAdmin
};