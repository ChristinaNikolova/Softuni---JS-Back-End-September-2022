const { Schema, model, Types: { ObjectId } } = require('mongoose');

const URL_PATTERN = /^https?:\/\/(.+)$/;

const housingSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [6, 'Name should be at least 6 characters long'],
    },
    type: {
        type: String,
        required: [true, 'Type is required'],
        enum: ['apartment', 'villa', 'house'],
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: [1850, 'Year should be between 1850 and 2021'],
        max: [2021, 'Year should be between 1850 and 2021'],
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        minlength: [4, 'City should be at least 4 characters long'],
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        match: [URL_PATTERN, 'Url should start with http or https'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [60, 'City should be maximal 60 characters long'],
    },
    pieces: {
        type: Number,
        required: [true, 'Pieces are required'],
        min: [0, 'Pieces should be between 0 and 10'],
        max: [10, 'Pieces should be between 0 and 10'],
    },
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    renters: {
        type: [ObjectId],
        ref: 'User',
        default: [],
    },
},
    {
        timestamps: true,
    }
);

const Housing = model('Housing', housingSchema);

module.exports = Housing;