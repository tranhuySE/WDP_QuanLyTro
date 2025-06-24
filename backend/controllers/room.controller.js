const Room = require("../models/Room");
const HouseService = require("../models/HouseService")
// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("tenant", "-password") // bỏ mật khẩu nếu có
      .populate("room_service");
    res.status(200).json(rooms);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch rooms", error: err.message });
  }
};

// Add new room
const addRoom = async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (err) {
    res.status(400).json({ message: "Failed to add room", error: err.message });
  }
};

// Edit room by ID
const updateRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRoom = await Room.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(updatedRoom);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update room", error: err.message });
  }
};

// Delete room by ID
const deleteRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRoom = await Room.findByIdAndDelete(id);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete room", error: err.message });
  }
};

module.exports = {
  getAllRooms,
  addRoom,
  updateRoomById,
  deleteRoomById,
};
