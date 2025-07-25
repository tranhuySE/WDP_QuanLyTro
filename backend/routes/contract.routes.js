const express = require('express');
const {
    getContract,
    createContract,
    updateContractStatus,
    getContractUserId,
    downloadContractPdf,
    AddUserInContract,
} = require('../controllers/contract.controller');
const upload = require('../middlewares/upload');

const contractRouter = express.Router();
contractRouter.get('/', getContract);
contractRouter.get('/:id/pdf', downloadContractPdf);
contractRouter.get('/detail/:userId', getContractUserId);
contractRouter.post('/create', upload.array('file', 5), createContract);
contractRouter.post('/add-user/:roomId', AddUserInContract);
contractRouter.put('/update/:id', updateContractStatus);

module.exports = contractRouter;
