const Post = require("../models/Post");

async function getPostsByAuthor(userId) {
    return Post.find({ author: userId }).populate('author', 'firstName lastName');
}

module.exports = {
    getPostsByAuthor,
}