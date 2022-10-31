const Blog = require('../models/Blog');

async function getLastThree() {
    return Blog.find({}).sort({ createdAt: -1 }).limit(3);
}

async function getAll() {
    return Blog.find({});
}

async function create(blog) {
    const result = new Blog(blog);
    await result.save();

    return result;
}

async function getById(id) {
    return Blog.findById(id).populate('owner', 'email').populate('followList', 'email');
}

async function follow(blogId, userId) {
    const blog = await Blog.findById(blogId);

    if (blog.followList.includes(userId)) {
        throw new Error('User has already followed this blog');
    }

    blog.followList.push(userId);
    await blog.save();
}

async function deleteById(id) {
    return Blog.findByIdAndDelete(id);
}

async function edit(id, updatedBlog) {
    const blog = await Blog.findById(id);

    blog.title = updatedBlog.title;
    blog.image = updatedBlog.image;
    blog.content = updatedBlog.content;
    blog.category = updatedBlog.category;

    await blog.save();
}

module.exports = {
    getLastThree,
    getAll,
    create,
    getById,
    follow,
    deleteById,
    edit,
};
