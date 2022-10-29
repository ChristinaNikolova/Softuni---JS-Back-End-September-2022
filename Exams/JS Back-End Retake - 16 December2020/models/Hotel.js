const { Schema, model, Types: { ObjectId } } = require('mongoose');

const URL_PATTERN = /^https?:\/\/(.+)$/;

const hotelSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [4, 'Name should be at least 4 characters long'],
        unique: true,
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        minlength: [3, 'City should be at least 3 characters long'],
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        match: [URL_PATTERN, 'Url should start with http or https'],
    },
    rooms: {
        type: Number,
        required: [true, 'Rooms are required'],
        min: [1, 'Rooms should be between 1 and 100'],
        max: [100, 'Rooms should be between 1 and 100'],
    },
    freeRooms: {
        type: Number,
        default: 0,
    },
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    guests: {
        type: [ObjectId],
        ref: 'User',
        default: []
    },
});

hotelSchema.index({ name: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2,
    }
});

const Hotel = model('Hotel', hotelSchema);

module.exports = Hotel;