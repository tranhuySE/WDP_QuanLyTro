const express = require('express');
const houseServiceRouter = express.Router();
const controller = require('../controllers/houseService.controller');

houseServiceRouter.post('/', controller.createHouseService);
houseServiceRouter.get('/', controller.getAllHouseServices);
houseServiceRouter.get('/:id', controller.getHouseServiceById);
houseServiceRouter.put('/:id', controller.updateHouseService);
houseServiceRouter.delete('/:id', controller.deleteHouseService);

module.exports = houseServiceRouter;
