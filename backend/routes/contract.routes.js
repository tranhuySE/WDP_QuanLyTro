const express = require('express');
const {
    getContract,
    createContract,
    updateContractStatus,
} = require('../controllers/contract.controller');
const upload = require('../middlewares/upload');

const contractRouter = express.Router();
contractRouter.get('/', getContract);
contractRouter.post('/create', upload.array('file', 5), createContract);
contractRouter.put('/update/:id', updateContractStatus);

module.exports = contractRouter;
