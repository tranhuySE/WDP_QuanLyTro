const Post = require('../models/Post.js');

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate({
                path: 'author',
                select: 'fullname role createdAt'
            })
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updatePost = async (req, res) => {
    const { id } = req.params;
    const {title, content, tag, author } = req.body;

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {
                title,
                content,
                tag,
                author,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPost = async (req, res) => {
    const { content, title, tag } = req.body;

    try {
        const author = req.userID;

        const newPost = new Post({
            content,
            title,
            tag,
            author
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllTags = async (req, res) => {
    try {
        const posts = await Post.find().select('tag').distinct('tag');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllPosts,
    updatePost,
    createPost,
    deletePost,
    getAllTags
};