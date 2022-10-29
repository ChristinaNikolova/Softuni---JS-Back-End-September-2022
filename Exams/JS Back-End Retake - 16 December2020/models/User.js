const { Schema, model } = require('mongoose');

const EMAIL_PATTERN = /^([a-zA-Z1-9]+)@([a-zA-Z1-9]+)\.([a-zA-Z]+)$/;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [EMAIL_PATTERN, 'Email should contain only english letters and digits'],
        unique: true,
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
});

userSchema.index({ email: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2,
    }
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