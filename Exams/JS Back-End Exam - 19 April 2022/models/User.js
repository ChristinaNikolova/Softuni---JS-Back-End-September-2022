const { Schema, model } = require('mongoose');

const EMAIL_PATTERN = /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [EMAIL_PATTERN, 'Email should contain only english letters'],
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [1, 'First name should be at least 1 characters long'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: [1, 'Last name should be at least 1 characters long'],
    },
});

userSchema.index({ email: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2,
    }
});

const User = model('User', userSchema);

module.exports = User;