const Blog = require('../models/Blog');

async function getBlogsByOwner(userId) {
    return Blog.find({ owner: userId });
}

async function getBlogsByFollower(userId) {
    return (await Blog.find({})).filter((b) => b.followList.includes(userId));
}

module.exports = {
    getBlogsByOwner,
    getBlogsByFollower,
}