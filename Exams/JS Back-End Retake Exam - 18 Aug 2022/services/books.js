const Book = require('../models/Book');

async function getAll() {
    return Book.find({});
}

async function create(book) {
    const result = new Book(book);
    await result.save();

    return result;
}

async function getById(id) {
    return Book.findById(id);
}

async function wish(bookId, userId) {
    const book = await Book.findById(bookId);

    if (book.wishingList.includes(userId)) {
        throw new Error('User has already wished this book');
    }

    book.wishingList.push(userId);
    await book.save();
}

async function deleteById(id) {
    return Book.findByIdAndDelete(id);
}

async function edit(id, updatedBook) {
    const book = await Book.findById(id);

    book.title = updatedBook.title;
    book.author = updatedBook.author;
    book.genre = updatedBook.genre;
    book.stars = updatedBook.stars;
    book.image = updatedBook.image;
    book.review = updatedBook.review;

    await book.save();
}

module.exports = {
    getAll,
    create,
    getById,
    wish,
    deleteById,
    edit,
};
