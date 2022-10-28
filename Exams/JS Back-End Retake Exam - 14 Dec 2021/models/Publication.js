const { Schema, model, Types: { ObjectId } } = require('mongoose');

const URL_PATTERN = /^https?:\/\/(.+)$/;

const publicationSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [6, 'Title should be at least 6 characters long'],
    },
    technique: {
        type: String,
        required: [true, 'Technique is required'],
        maxlength: [15, 'Technique should be maximal 15 characters long'],
    },
    picture: {
        type: String,
        required: [true, 'Picture is required'],
        match: [URL_PATTERN, 'Url should start with http or https'],
    },
    certificate: {
        type: String,
        required: [true, 'Certificate is required'],
        enum: ['yes', 'no'],
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
});

const Publication = model('Publication', publicationSchema);

module.exports = Publication;