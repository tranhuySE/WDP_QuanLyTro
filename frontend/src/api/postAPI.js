import axiosInstance from "./axiosInstance";

export const getAllPosts = () => {
    return axiosInstance.get('/posts'); // Fetch all posts
}

export const updatePost = (id, postData) => {
    return axiosInstance.put(`/posts/${id}`, postData); // Update a specific post by ID
};