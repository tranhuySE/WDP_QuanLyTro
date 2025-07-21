const { default: mongoose } = require("mongoose");
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
    const { _id, role } = req.user
    const { fullname, roomNumber, status } = req.query
    let query = role === 'admin'
      ? {}
      : { assignedTo: new mongoose.Types.ObjectId(`${_id}`) }
    let joinQuery = {}
    if (!!status) {
      query.status = status
    }
    if (!!fullname) {
      joinQuery['createdBy.fullname'] = { $regex: fullname, $options: 'i' }
    }
    if (!!roomNumber) {
      joinQuery['room.roomNumber'] = roomNumber
    }
    const requests = await Request.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
          pipeline: [
            {
              $project: {
                _id: 1,
                fullname: 1
              }
            }
          ]
        }
      },
      { $unwind: '$createdBy' },
      {
        $lookup: {
          from: 'rooms',
          localField: 'room',
          foreignField: '_id',
          as: 'room',
          pipeline: [
            {
              $project: {
                _id: 1,
                roomNumber: 1
              }
            }
          ]
        }
      },
      { $unwind: '$room' },
      {
        $match: joinQuery
      },
      {
        $sort: { 'updatedAt': -1 }
      }
    ])
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

const getListRequestByUser = async (req, res) => {
  try {
    const { _id } = req.user
    const requests = await Request
      .find({
        createdBy: _id
      })
      .populate("room", ["_id", "roomNumber"])
      .sort({ 'updatedAt': -1 })
    res.status(200).json(requests)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createRequest,
  getListRequest,
  changeRequestStatus,
  getListRequestByUser
}