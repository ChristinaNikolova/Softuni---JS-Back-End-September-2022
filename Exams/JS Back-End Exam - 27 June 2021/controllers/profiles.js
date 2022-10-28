const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { getTripsByUserId } = require('../services/profiles');
const { tripViewModel } = require('../utils/mappers');

router.get('/profile', isUser(), async (req, res) => {
    const userId = req.session.user._id;
    const trips = (await getTripsByUserId(userId)).map(tripViewModel);

    res.render('profile', { title: 'Profile Page', trips });
});

module.exports = router;