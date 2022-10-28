const { Schema, model } = require('mongoose');

const NAME_PATTERN = /^([A-Z][a-z]+)([ ])([A-Z][a-z]+)$/;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        match: [NAME_PATTERN, 'Name should contain first name and last name'],
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [5, 'Username should be at least 5 characters long'],
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
});

userSchema.index({ username: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2,
    }
});

const User = model('User', userSchema);

module.exports = User;