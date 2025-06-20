const express = require('express');
const userRouter = require('./user.routes.js'); // Import the user routes
const router = express.Router();

router.use('/users', userRouter);

module.exports = router;