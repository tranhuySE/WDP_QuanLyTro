const express = require('express');
const userRouter = require('./user.routes.js'); // Import the user routes
const postRouter = require('./post.routes.js'); // Import the post routes
const requestRouter = require('./request.routes.js');
const authRouter = require('./auth.routes.js'); // Import the auth routes
const roomRouter = require('./room.routes.js');
const contractRouter = require('./contract.routes.js');
const invoiceRouter = require('./invoice.routes.js');
const router = express.Router();
const historyRouter = require('./history.router.js'); // Import the history router
const houseServiceRouter = require('./houseService.route.js');
router.use('/auth', authRouter); // Use the auth routes
router.use('/posts', postRouter);
router.use('/users', userRouter);
router.use('/requests', requestRouter);
router.use('/rooms', roomRouter);
router.use('/contracts', contractRouter);
router.use('/invoices', invoiceRouter);
router.use('/house-services', houseServiceRouter);
// Log này sẽ chạy khi yêu cầu được chuyển đến historyRouter
router.use(
    '/history',
    (req, res, next) => {
        console.log(`[index.js]  --> Yêu cầu được chuyển tiếp đến historyRouter`);
        next();
    },
    historyRouter,
);

module.exports = router;
