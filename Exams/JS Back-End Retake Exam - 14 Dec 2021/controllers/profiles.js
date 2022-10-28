const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { getPublicationByUser, getSharedByUser } = require('../services/profiles');

router.get('/profile', isUser(), async (req, res) => {
    const userId = req.session.user._id;
    const myPublications = await getPublicationByUser(userId);
    const myShared = await getSharedByUser(userId);

    const result = {
        myPublications,
        myShared,
    };

    res.render('profile', { title: 'Profile Page', result });
});

module.exports = router;