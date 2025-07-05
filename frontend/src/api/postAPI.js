import axiosInstance from "./axiosInstance";

export const getAllPosts = () => {
    return axiosInstance.get('/posts'); // Fetch all posts
}

export const updatePost = (id, postData) => {
    return axiosInstance.put(`/posts/${id}`, postData); // Update a specific post by ID
};

export const createPost = (postData) => {
    return axiosInstance.post('/posts', postData); // Create a new post
};

export const deletePost = (id) => {
    return axiosInstance.delete(`/posts/${id}`); // Delete a specific post by ID
};

export const getAllTags = () => {
    return axiosInstance.get('/posts/tags'); // Fetch all unique tags from posts
};