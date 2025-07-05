const express = require('express');
const { getAllPosts, updatePost, createPost, deletePost, getAllTags } = require('../controllers/post.controller.js');
const { verifyToken } = require('../middlewares/authMiddleware.js');

const postRouter = express.Router();
// Public routes
postRouter.get('/', getAllPosts);
postRouter.get('/tags', getAllTags);

// Protected routes
postRouter.post('/', verifyToken, createPost);
postRouter.put('/:id', verifyToken, updatePost);
postRouter.delete('/:id', verifyToken, deletePost);

module.exports = postRouter;