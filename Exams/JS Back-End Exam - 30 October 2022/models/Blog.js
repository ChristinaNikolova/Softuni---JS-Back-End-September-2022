const { Schema, model, Types: { ObjectId } } = require('mongoose');

const URL_PATTERN = /^https?:\/\/(.+)$/;

const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [5, 'Title should be at least 5 characters long'],
        maxlength: [50, 'Title should be maximal 50 characters long'],
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        match: [URL_PATTERN, 'Image url should start with http or https'],
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        minlength: [10, 'Content should be at least 10 characters long'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        minlength: [3, 'Category should be at least 3 characters long'],
    },
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    followList: {
        type: [ObjectId],
        ref: 'User',
        default: [],
    },
},
    {
        timestamps: true,
    }
);

const Blog = model('Blog', blogSchema);

module.exports = Blog;