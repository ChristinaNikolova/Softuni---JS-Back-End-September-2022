const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { getBlogsByOwner, getBlogsByFollower } = require('../services/profiles');
const { blogViewModel } = require('../utils/mappers');

router.get('/profile', isUser(), async (req, res) => {
    const userId = req.session.user._id;
    const ownerBlogs = (await getBlogsByOwner(userId)).map(blogViewModel);
    const followBlogs = (await getBlogsByFollower(userId)).map(blogViewModel);

    const result = {
        ownerBlogs,
        followBlogs,
    };

    res.render('profile', { title: 'Profile Page', result });
});

module.exports = router;