const User = require('../models/User');
const { hash, compare } = require('bcrypt');

// TODO CHECK!!!
async function register(firstName, lastName, email, password) {
    const existing = await getUserByEmail(email);

    if (existing) {
        throw new Error('Email is already taken');
    }

    const hashedPassword = await hash(password, 10);
    const user = new User({
        firstName,
        lastName,
        email,
        hashedPassword,
    });

    await user.save();

    return user;
}

// TODO CHECK!!!
async function login(email, password) {
    const user = await getUserByEmail(email);

    if (!user) {
        throw new Error('Incorrect email or password');
    }

    const hasMatch = await compare(password, user.hashedPassword);

    if (!hasMatch) {
        throw new Error('Incorrect email or password')
    }

    return user;
}

async function getUserByEmail(email) {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    //await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
    return user;
}

// async function getUserByUsername(username) {
//     const user = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });
//     return user;
// }

module.exports = {
    login,
    register,
};