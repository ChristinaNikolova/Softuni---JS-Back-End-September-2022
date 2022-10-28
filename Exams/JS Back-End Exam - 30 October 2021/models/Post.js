const { Schema, model, Types: { ObjectId } } = require('mongoose');

const DATE_PATTERN = /^[0-9]{2}.[0-9]{2}.[0-9]{4}$/;
const URL_PATTERN = /^https?:\/\/(.+)$/;

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [6, 'Title should be at least 6 characters long'],
    },
    keyword: {
        type: String,
        required: [true, 'Keyword is required'],
        minlength: [6, 'Keyword should be at least 6 characters long'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        maxlength: [15, 'Location should be maximal 15 characters long'],
    },
    date: {
        type: String,
        required: [true, 'Date is required'],
        match: [DATE_PATTERN, 'Date should be in format dd.mm.yyyy'],
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        match: [URL_PATTERN, 'Url should start with http or https'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [8, 'Description should be at least 8 characters long'],
    },
    author: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    votes: {
        type: [ObjectId],
        ref: 'User',
        default: [],
    },
    rating: {
        type: Number,
        default: 0,
    },
});

const Post = model('Post', postSchema);

module.exports = Post;