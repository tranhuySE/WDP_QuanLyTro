const express = require('express');
const userRouter = require('./user.routes.js'); // Import the user routes
const requestRouter = require('./request.routes.js');
const router = express.Router();

router.use('/users', userRouter);
router.use('/requests', requestRouter);

module.exports = router;