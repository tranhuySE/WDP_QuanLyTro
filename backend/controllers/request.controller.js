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
      .populate("room", ["_id", "fullname"])
    res.status(200).json(requests)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const assigneeRequest = async (req, res) => {
  try {
    const { assignedTo, approval, requestId, statusHistory } = req.body
    const request = await Request.findOneAndUpdate(
      { _id: requestId },
      {
        status: "ASSIGNED",
        assignedTo: assignedTo,
        approval: approval,
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

const rejectRequest = async (req, res) => {
  try {
    const { requestId, approval, reasonReject, statusHistory } = req.body
    const request = await Request.findOneAndUpdate(
      { _id: requestId },
      {
        status: "REJECTED",
        approval: approval,
        reasonReject,
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

module.exports = {
  createRequest,
  getListRequest,
  assigneeRequest,
  rejectRequest
}