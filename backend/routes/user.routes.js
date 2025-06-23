const express = require('express');
const { getAllUsers, getUserById, deleteUserById } = require('../controllers/user.controller.js');

const userRouter = express.Router();

// Define the route to get all users
userRouter.get('/', getAllUsers);
// Define the route to get a user by ID
userRouter.get('/:id',  getUserById)
// Define the route to delete a user by ID
userRouter.delete('/:id', deleteUserById);

// Export the userRouter
module.exports = userRouter;