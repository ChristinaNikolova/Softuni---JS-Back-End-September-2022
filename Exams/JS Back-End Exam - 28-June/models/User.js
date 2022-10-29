const { Schema, model } = require('mongoose');

const USERNAME_PATTERN = /^[a-zA-z0-9]{3,}$/;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [3, 'Username should be at least 3 characters long'],
        match: [USERNAME_PATTERN, 'Username should contain only english letters and digits'],
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