const express = require('express');
const {
  createRequest,
  getListRequest,
  changeRequestStatus,
  getListRequestByStaff,
  getListRequestByUser
} = require('../controllers/request.controller');
const { verifyToken } = require('../middlewares/authMiddleware');


const requestRouter = express.Router()

requestRouter.post('/createRequest', verifyToken, createRequest)
requestRouter.get('/getListRequest', verifyToken, getListRequest)
requestRouter.put('/changeRequestStatus', verifyToken, changeRequestStatus)
requestRouter.get('/getListRequestByStaff', verifyToken, getListRequestByStaff)
requestRouter.get('/getListRequestByUser', verifyToken, getListRequestByUser)

module.exports = requestRouter