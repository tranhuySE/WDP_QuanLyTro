const express = require('express');
const userRouter = require('./user.routes.js'); // Import the user routes
const postRouter = require('./post.routes.js'); // Import the post routes
const router = express.Router();

router.use('/users', userRouter);
router.use('/posts', postRouter);

module.exports = router;