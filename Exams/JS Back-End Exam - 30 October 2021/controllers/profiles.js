const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { getPostsByAuthor } = require('../services/profiles');
const { postViewModel } = require('../utils/mappers');

router.get('/profile', isUser(), async (req, res) => {
    const userId = req.session.user._id;
    const posts = (await getPostsByAuthor(userId)).map(postViewModel);

    res.render('profile', { title: 'Profile Page', posts });
});

module.exports = router;