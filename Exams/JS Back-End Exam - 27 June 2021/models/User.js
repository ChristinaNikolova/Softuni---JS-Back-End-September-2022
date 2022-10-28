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
        required: true,
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['male', 'female'],
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