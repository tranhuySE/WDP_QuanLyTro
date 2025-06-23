const express = require('express');
const {
  createRequest,
  getListRequest,
  assigneeRequest,
  rejectRequest
} = require('../controllers/request.controller');


const requestRouter = express.Router()

requestRouter.post('/createRequest', createRequest)
requestRouter.get('/getListRequest', getListRequest)
requestRouter.post('/assigneeRequest', assigneeRequest)
requestRouter.post('/rejectRequest', rejectRequest)

module.exports = requestRouter