const { Schema, model, Types: { ObjectId } } = require('mongoose');

const adSchema = new Schema({
    headline: {
        type: String,
        required: [true, 'Headline is required'],
        minlength: [4, 'Headline should be at least 4 characters long'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        minlength: [8, 'Location should be at least 8 characters long'],
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        minlength: [3, 'Company name should be at least 3 characters long'],
    },
    companyDescription: {
        type: String,
        required: [true, 'Company description is required'],
        maxlength: [40, 'Company description should be maximal 40 characters long'],
    },
    author: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    users: {
        type: [ObjectId],
        ref: 'User',
        default: []
    },
},
    {
        timestamps: true,
    }
);

const Ad = model('Ad', adSchema);

module.exports = Ad;