const Contract = require('../models/Contract');
const Room = require('../models/Room');
const HouseService = require('../models/HouseService');

// Get all rooms
const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find()
            .populate('tenant', '-password') // bỏ mật khẩu nếu có
            .populate('room_service');
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch rooms', error: err.message });
    }
};

// Get a single room by ID
const getRoomById = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await Room.findById(id)
            .populate('tenant', '-password')
            .populate('room_service');
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json(room);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch room', error: err.message });
    }
};

// Add new room
const addRoom = async (req, res) => {
    try {
        // Kiểm tra xem roomNumber đã tồn tại chưa
        const existingRoom = await Room.findOne({
            roomNumber: req.body.roomNumber,
        });
        if (existingRoom) {
            return res.status(409).json({
                message: `Room with number ${req.body.roomNumber} already exists.`,
            });
        }

        const newRoom = new Room(req.body);
        const savedRoom = await newRoom.save();
        res.status(201).json(savedRoom);
    } catch (err) {
        res.status(500).json({ message: 'Failed to add room', error: err.message });
    }
};

// Edit room by ID
const updateRoomById = async (req, res) => {
    const { id } = req.params;
    try {
        // Nếu có cập nhật roomNumber, kiểm tra xem nó có bị trùng với phòng khác không
        if (req.body.roomNumber) {
            const existingRoom = await Room.findOne({
                roomNumber: req.body.roomNumber,
                _id: { $ne: id },
            });
            if (existingRoom) {
                return res.status(409).json({
                    message: `Room with number ${req.body.roomNumber} already exists.`,
                });
            }
        }

        const updatedRoom = await Room.findByIdAndUpdate(id, req.body, {
            new: true, // Trả về tài liệu đã được cập nhật
            runValidators: true, // Chạy trình xác thực của Mongoose
        });
        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json(updatedRoom);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update room', error: err.message });
    }
};

// Delete room by ID
const deleteRoomById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete room', error: err.message });
    }
};

const getMyRoomInfo = async (req, res) => {
    try {
        const { userId } = req.params;

        const room = await Room.findOne({ tenant: { $in: [userId] } })
            .populate('tenant')
            .populate('room_service');

        res.status(200).json(room);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// room.controller.js
const getAvailableRooms = async (req, res) => {
    try {
        // Lấy các phòng có status available và còn chỗ trống
        const availableRooms = await Room.find({
            status: 'available',
            $expr: { $lt: [{ $size: '$tenant' }, '$maxOccupants'] },
        })
            .select('roomNumber floor area price maxOccupants description images amenities tenant')
            .populate('amenities', 'name quantity status')
            .lean();

        // Format lại dữ liệu trả về
        const formattedRooms = availableRooms.map((room) => ({
            id: room._id,
            roomNumber: room.roomNumber,
            floor: room.floor,
            area: room.area,
            price: room.price,
            availableSlots: room.maxOccupants - room.tenant.length,
            description: room.description,
            images: room.images,
            amenities: room.amenities.map((a) => ({
                name: a.name,
                quantity: a.quantity,
                status: a.status,
            })),
        }));

        res.status(200).json({
            success: true,
            count: formattedRooms.length,
            data: formattedRooms,
        });
    } catch (error) {
        console.error('Error fetching available rooms:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách phòng',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

const getOccupiedRooms = async (req, res) => {
    try {
        // Lấy các phòng có ít nhất 1 tenant
        const occupiedRooms = await Room.find({
            $expr: { $gte: [{ $size: '$tenant' }, 1] },
        })
            .select('roomNumber floor area price maxOccupants description images amenities tenant')
            .populate('amenities', 'name quantity status')
            .lean();

        // Format lại dữ liệu trả về
        const formattedRooms = occupiedRooms.map((room) => ({
            _id: room._id,
            roomNumber: room.roomNumber,
            floor: room.floor,
            area: room.area,
            price: room.price,
            occupiedSlots: room.tenant.length,
            maxOccupants: room.maxOccupants,
            description: room.description,
            images: room.images,
            amenities: room.amenities.map((a) => ({
                name: a.name,
                quantity: a.quantity,
                status: a.status,
            })),
        }));

        res.status(200).json({
            success: true,
            count: formattedRooms.length,
            data: formattedRooms,
        });
    } catch (error) {
        console.error('Error fetching occupied rooms:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách phòng đã có khách',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

module.exports = {
    getAllRooms,
    getRoomById,
    addRoom,
    updateRoomById,
    deleteRoomById,
    getMyRoomInfo,
    getAvailableRooms,
    getOccupiedRooms,
};
