const Request = require("../models/Request");

const createRequest = async (req, res) => {
  try {
    const newRequest = await Request.create(req.body)
    res.status(201).json(newRequest)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getListRequest = async (req, res) => {
  try {
    const requests = await Request
      .find()
      .populate("createdBy", ["_id", "fullname"])
      .populate("room", ["_id", "roomNumber"])
    res.status(200).json(requests)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const changeRequestStatus = async (req, res) => {
  try {
    const { assignedTo, approval, requestId, statusHistory, status } = req.body
    const request = await Request.findOneAndUpdate(
      { _id: requestId },
      {
        status,
        approval: approval,
        assignedTo,
        $push: {
          statusHistory
        }
      },
      {
        new: true
      }
    )
    return res.status(200).json(request)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getListRequestByStaff = async (req, res) => {
  try {
    const userId = req.userID
    const requests = await Request
      .find({
        assignedTo: userId
      })
      .populate("createdBy", ["_id", "fullname"])
      .populate("room", ["_id", "roomNumber"])
    res.status(200).json(requests)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getListRequestByUser = async (req, res) => {
  try {
    const userId = req.userID
    const requests = await Request
      .find({
        createdBy: userId
      })
      .populate("room", ["_id", "roomNumber"])
    res.status(200).json(requests)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createRequest,
  getListRequest,
  changeRequestStatus,
  getListRequestByStaff,
  getListRequestByUser
}