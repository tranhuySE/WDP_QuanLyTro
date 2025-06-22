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
    const requests = await Request.find()
    res.status(200).json(requests)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const assigneeRequest = async (req, res) => {
  try {
    const { user, requestId } = req.body
    const request = await Request.findOneAndUpdate(
      { _id: requestId },
      {
        assignedTo: {
          userId: user._id,
          userType: "STAFF",
          userName: user.username,
          assignedAtL: Date.now()
        },
        approval: {
          action: "APPROVED",
          approvedBy: "6857be773214e3862ae61d8b",
          approvedByName: "admin_master",
          approvedAt: Date.now()
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
    const { requestId, note } = req.body
    const request = await Request.findOneAndUpdate(
      { _id: requestId },
      {
        approval: {
          action: "REJECTED",
          note: note,
          approvedBy: "6857be773214e3862ae61d8b",
          approvedByName: "admin_master",
          approvedAt: Date.now()
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