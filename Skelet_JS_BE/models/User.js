const { Schema, model, Types: { ObjectId } } = require('mongoose');

// TODO VALIDATIONS
const FIRSTNAME_PATTERN = /^[a-zA-z]{3,}$/;
const LASTNAME_PATTERN = /^[a-zA-z]{5,}$/;
const EMAIL_PATTERN = /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [3, 'First name should be at least 3 characters long'],
        validate: {
            validator(value) {
                return FIRSTNAME_PATTERN.test(value);
            },
            message: 'First name should contain only english letters',
        },
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: [5, 'Last name should be at least 5 characters long'],
        validate: {
            validator(value) {
                return LASTNAME_PATTERN.test(value);
            },
            message: 'Last name should contain only english letters',
        },
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [EMAIL_PATTERN, 'Email should contain only english letters'],
    },
    hashedPassword: {
        type: String,
        required: true
    },
    posts: {
        type: [ObjectId],
        ref: 'Post',
        default: []
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