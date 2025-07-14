const express = require('express');
const { getAllUsers, getUserById, deleteUserById, getListStaff, editUserById } = require('../controllers/user.controller.js');

const userRouter = express.Router();

// Define the route to get all users
userRouter.get('/', getAllUsers);

userRouter.get('/getListStaff', getListStaff)
// Define the route to get a user by ID
userRouter.get('/:id', getUserById)
// Define the route to delete a user by ID
userRouter.delete('/:id', deleteUserById);
// Define the route to edit a user by ID
userRouter.put('/:id', editUserById);


// Export the userRouter
module.exports = userRouter;