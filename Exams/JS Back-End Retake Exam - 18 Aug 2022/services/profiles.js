const Book = require("../models/Book");

async function getWishedBooksByUserId(userId) {
    return (await Book.find({})).filter((b) => b.wishingList.includes(userId));
}

module.exports = {
    getWishedBooksByUserId,
};