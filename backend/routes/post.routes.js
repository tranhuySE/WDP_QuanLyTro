const express = require('express');
const { getAllPosts , updatePost} = require('../controllers/post.controller.js');

const postRouter = express.Router();

// Define the route to get all posts
postRouter.get('/', getAllPosts);
// Define the route to update a post
postRouter.put('/:id', updatePost);

module.exports = postRouter;