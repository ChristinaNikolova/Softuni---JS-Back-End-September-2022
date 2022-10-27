function mapErrors(err) {
    if (Array.isArray(err)) {
        return err;
    } else if (err.name == 'ValidationError') {
        return Object.values(err.errors).map(e => ({ msg: e.message }));
    } else if (typeof err.message == 'string') {
        return [{ msg: err.message }];
    } else {
        return [{ msg: 'Request error' }];
    }
}

function bookViewModel(book) {
    return {
        _id: book._id,
        title: book.title,
        author: book.author,
        image: book.image,
        review: book.review,
        genre: book.genre,
        stars: book.stars,
        wishingList: book.wishingList,
        owner: book.owner,
    }
}

module.exports = {
    mapErrors,
    bookViewModel,
};