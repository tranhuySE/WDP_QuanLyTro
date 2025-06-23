const express = require("express");
const {
  getAllRooms,
  addRoom,
  updateRoomById,
  deleteRoomById,
} = require("../controllers/room.controller");

const roomRouter = express.Router();

roomRouter.get("/", getAllRooms);
roomRouter.post("/", addRoom);
roomRouter.put("/:id", updateRoomById);
roomRouter.delete("/:id", deleteRoomById);

module.exports = roomRouter;
