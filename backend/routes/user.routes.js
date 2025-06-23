const express = require('express');
const { getAllUsers, getUserById } = require('../controllers/user.controller.js');

const userRouter = express.Router();

// Define the route to get all users
userRouter.get('/', getAllUsers);
// Define the route to get a user by ID
userRouter.get('/:id',  getUserById)

// Export the userRouter
module.exports = userRouter;