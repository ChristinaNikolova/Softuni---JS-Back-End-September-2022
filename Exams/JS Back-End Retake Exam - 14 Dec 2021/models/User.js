const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [4, 'Username should be at least 4 characters long'],
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        maxlength: [20, 'Address should be maximal 20 characters long'],
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