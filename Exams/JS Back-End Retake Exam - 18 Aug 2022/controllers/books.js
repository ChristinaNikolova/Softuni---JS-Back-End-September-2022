const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { trimBody } = require('../middleware/trimBody');
const { getAll, create, getById, wish, deleteById, edit } = require('../services/books');
const { mapErrors, bookViewModel } = require('../utils/mappers');

router.get('/books', async (req, res) => {
    const books = (await getAll()).map(bookViewModel);
    res.render('books', { title: 'All Books', books });
});

router.get('/create', isUser(), (req, res) => {
    res.render('create', { title: 'Create Book' });
});

router.post('/create', isUser(), trimBody(), async (req, res) => {
    const userId = req.session.user._id;
    const book = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        stars: Number(req.body.stars),
        image: req.body.image,
        review: req.body.review,
        owner: userId,
    };

    try {
        await create(book);
        res.redirect('/books');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('create', { title: 'Create Book', book, errors })
    }
});

router.get('/books/:id', async (req, res) => {
    const bookId = req.params.id;
    const book = bookViewModel(await getById(bookId));

    if (req.session.user) {
        const userId = req.session.user._id;
        book.hasUser = true;

        if (userId === book.owner._id.toString()) {
            book.isOwner = true;
        } else {
            book.isWished = book.wishingList.map((u) => u._id.toString()).includes(userId);
        }
    }

    res.render('details', { title: book.title, book });
});

router.get('/wish/:id', isUser(), async (req, res) => {
    const bookId = req.params.id;
    const book = bookViewModel(await getById(bookId));
    const userId = req.session.user._id;

    try {
        if (userId === book.owner._id.toString()) {
            throw new Error('Owner can not wish this book');
        }

        await wish(bookId, userId);
        res.redirect('/books/' + bookId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const books = (await getAll()).map(bookViewModel);
        res.render('books', { title: 'All Books', books, errors });
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    const bookId = req.params.id;
    const book = bookViewModel(await getById(bookId));
    const userId = req.session.user._id;

    try {
        if (userId !== book.owner._id.toString()) {
            throw new Error('Only owner can delete this book');
        }

        await deleteById(bookId);
        res.redirect('/books')
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const books = (await getAll()).map(bookViewModel);
        res.render('books', { title: 'All Books', books, errors });
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    const bookId = req.params.id;
    const book = bookViewModel(await getById(bookId));
    const userId = req.session.user._id;

    if (userId !== book.owner._id.toString()) {
        return res.redirect('/books/' + bookId);
    }

    res.render('edit', { title: 'Edit Book', book });
});

router.post('/edit/:id', isUser(), trimBody(), async (req, res) => {
    const bookId = req.params.id;
    const dbBook = bookViewModel(await getById(bookId));
    const userId = req.session.user._id;

    const book = {
        _id: dbBook._id,
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        stars: Number(req.body.stars),
        image: req.body.image,
        review: req.body.review,
    };

    try {
        if (userId !== dbBook.owner._id.toString()) {
            throw new Error('Only owner can edit this book');
        }

        await edit(bookId, book);
        res.redirect('/books/' + bookId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('edit', { title: 'Edit Book', book, errors });
    }
});

module.exports = router;