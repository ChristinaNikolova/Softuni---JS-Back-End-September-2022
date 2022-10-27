const { Schema, model, Types: { ObjectId } } = require('mongoose');

const auctionSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [4, 'Title should be at least 4 characters long'],
    },
    description: {
        type: String,
        maxlength: [200, 'Description should be maximal 200 characters long'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['vehicles', 'real estate', 'electronics', 'furniture', 'other'],
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price should be a positive number'],
    },
    author: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    bidders: {
        type: [ObjectId],
        ref: 'User',
        default: []
    },
    currentWinner: {
        type: String,
        default: '',
    },
    currentWinnerFullName: {
        type: String,
        default: '',
    },
    isClosed: {
        type: Boolean,
        default: false,
    },
});

const Auction = model('Auction', auctionSchema);

module.exports = Auction;