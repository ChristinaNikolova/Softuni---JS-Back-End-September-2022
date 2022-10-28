const { Schema, model, Types: { ObjectId } } = require('mongoose');

const URL_PATTERN = /^https?:\/\/(.+)$/;

const tripSchema = new Schema({
    start: {
        type: String,
        required: [true, 'Start is required'],
        minlength: [4, 'Start should be at least 4 characters long'],
    },
    end: {
        type: String,
        required: [true, 'End is required'],
        minlength: [4, 'End should be at least 4 characters long'],
    },
    date: {
        type: String,
        required: [true, 'Date is required'],
    },
    time: {
        type: String,
        required: [true, 'Time is required'],
    },
    carImage: {
        type: String,
        required: [true, 'Image is required'],
        match: [URL_PATTERN, 'Url should start with http or https'],
    },
    carBrand: {
        type: String,
        required: [true, 'Brand is required'],
        minlength: [4, 'Brand should be at least 4 characters long'],
    },
    seats: {
        type: Number,
        required: [true, 'Seats are required'],
        min: [0, 'Seats should be between 0 and 4'],
        max: [4, 'Seats should be between 0 and 4'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [1, 'Price should be between 1 and 50'],
        max: [50, 'Price should be between 1 and 50'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'Description should be at least 10 characters long'],
    },
    creator: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    buddies: {
        type: [ObjectId],
        ref: 'User',
        default: []
    },
});

const Trip = model('Trip', tripSchema);

module.exports = Trip;