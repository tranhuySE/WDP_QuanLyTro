const express = require('express');
const {
    getContract,
    createContract,
    updateContract,
} = require('../controllers/contract.controller');

const contractRouter = express.Router();
contractRouter.get('/', getContract);
contractRouter.post('/create', createContract);
contractRouter.put('/update/:id', updateContract);

module.exports = contractRouter;
