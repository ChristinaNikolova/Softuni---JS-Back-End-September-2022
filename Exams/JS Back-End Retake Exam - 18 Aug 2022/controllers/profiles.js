const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { getWishedBooksByUserId } = require('../services/profiles');
const { bookViewModel } = require('../utils/mappers');

router.get('/profile', isUser(), async (req, res) => {
    const userId = req.session.user._id;
    const books = (await getWishedBooksByUserId(userId))
        .map(bookViewModel)
        .map((b) => Object.assign({ hasUser: true }, b));

    res.render('profile', { title: 'Profile Page', books });
});

module.exports = router;