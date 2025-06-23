const express = require('express');
const userRouter = require('./user.routes.js'); // Import the user routes
const postRouter = require('./post.routes.js'); // Import the post routes
const requestRouter = require('./request.routes.js');
const router = express.Router();

router.use('/posts', postRouter);
router.use('/users', userRouter);
router.use('/requests', requestRouter);

module.exports = router;