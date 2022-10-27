const { Schema, model, Types: { ObjectId } } = require('mongoose');

const URL_PATTERN = /^https?:\/\/(.+)$/;

const bookSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [2, 'Title should be at least 2 characters long'],
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        minlength: [5, 'Author should be at least 5 characters long'],
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        match: [URL_PATTERN, 'Image should start with http or https'],
    },
    review: {
        type: String,
        required: [true, 'Review is required'],
        minlength: [10, 'Review should be at least 10 characters long'],
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        minlength: [3, 'Genre should be at least 3 characters long'],
    },
    stars: {
        type: Number,
        required: [true, 'Stars are required'],
        min: [1, 'Stars should be between 1 and 5'],
        max: [5, 'Stars should be between 1 and 5'],
    },
    wishingList: {
        type: [ObjectId],
        ref: 'User',
        default: []
    },
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
});

const Book = model('Book', bookSchema);

module.exports = Book;