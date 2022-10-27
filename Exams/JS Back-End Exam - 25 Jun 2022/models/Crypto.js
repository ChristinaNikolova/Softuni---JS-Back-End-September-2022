const { Schema, model, Types: { ObjectId } } = require('mongoose');

const URL_PATTERN = /^https?:\/\/(.+)$/;

const cryptoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [2, 'Name should be at least 2 characters long'],
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        match: [URL_PATTERN, 'Image should start with HTTP or HTTPS'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price should be a positive number'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'Description should be at least 10 characters long'],
    },
    payment: {
        type: String,
        required: [true, 'Payment is required'],
        enum: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal'],
    },
    buyers: {
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

const Crypto = model('Crypto', cryptoSchema);

module.exports = Crypto;