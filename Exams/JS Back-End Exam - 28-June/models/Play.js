const { Schema, model, Types: { ObjectId } } = require('mongoose');

const playSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [50, 'Description should be maximal 50 characters long'],
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    creator: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    likes: {
        type: [ObjectId],
        ref: 'User',
        default: [],
    },
    likesCount: {
        type: Number,
        default: 0,
    },
},
    {
        timestamps: true,
    }
);

playSchema.index({ title: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2,
    }
});

const Play = model('Play', playSchema);

module.exports = Play;