const express = require('express');
const userRouter = require('./user.routes.js'); // Import the user routes
const postRouter = require('./post.routes.js'); // Import the post routes
const requestRouter = require('./request.routes.js');
const authRouter = require('./auth.routes.js'); // Import the auth routes
const roomRouter = require('./room.routes.js');
const contractRouter = require('./contract.routes.js');
const router = express.Router();

router.use('/auth', authRouter); // Use the auth routes
router.use('/posts', postRouter);
router.use('/users', userRouter);
router.use('/requests', requestRouter);
router.use('/rooms', roomRouter);
router.use('/contracts', contractRouter);

module.exports = router;
