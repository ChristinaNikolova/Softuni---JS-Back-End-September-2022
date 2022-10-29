const { Schema, model, Types: { ObjectId } } = require('mongoose');

const URL_PATTERN = /^https?:\/\/(.+)$/;

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [4, 'Title should be at least 4 characters long'],
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [20, 'Description should be at least 20 characters long'],
        maxlength: [50, 'Description should be maximal 50 characters long'],
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        match: [URL_PATTERN, 'Url should start with http or https'],
    },
    duration: {
        type: String,
        required: [true, 'Duration is required'],
    },
    creator: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    students: {
        type: [ObjectId],
        ref: 'User',
        default: [],
    },
    studentsCount: {
        type: Number,
        default: 0,
    },
},
    {
        timestamps: true,
    }
);

courseSchema.index({ title: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2,
    }
});

const Course = model('Course', courseSchema);

module.exports = Course;