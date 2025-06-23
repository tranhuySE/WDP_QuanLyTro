const Post = require('../models/Post.js');

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'fullname role');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updatePost = async (req, res) => {
    const { id } = req.params;
    const { content, tag, author } = req.body;

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {
                content,
                tag,
                author, // cập nhật người sửa bài viết
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


module.exports = {
    getAllPosts,
    updatePost
};