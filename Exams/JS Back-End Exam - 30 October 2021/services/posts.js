const Post = require('../models/Post');

async function getAll() {
    return Post.find({});
}

async function create(post) {
    const result = new Post(post);
    await result.save();

    return result;
}

async function getById(id) {
    return Post.findById(id).populate('author', 'firstName lastName').populate('votes', 'email');
}

async function vote(postId, userId, value) {
    const post = await Post.findById(postId);

    if (post.votes.includes(userId)) {
        throw new Error('User has already voted');
    }

    post.votes.push(userId);
    post.rating += value;
    await post.save();
}

async function deleteById(id) {
    return Post.findByIdAndDelete(id);
}

async function edit(id, updatedPost) {
    const post = await Post.findById(id);

    post.title = updatedPost.title;
    post.keyword = updatedPost.keyword;
    post.location = updatedPost.location;
    post.date = updatedPost.date;
    post.image = updatedPost.image;
    post.description = updatedPost.description;

    await post.save();
}

module.exports = {
    getAll,
    create,
    getById,
    vote,
    deleteById,
    edit,
};
