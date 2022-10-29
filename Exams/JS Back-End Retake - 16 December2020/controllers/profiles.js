const { isUser } = require('../middleware/guards');
const { getReservationsByUser } = require('../services/profiles');

const router = require('express').Router();

router.get('/profile', isUser(), async (req, res) => {
    const userId = req.session.user._id;
    const hotels = await getReservationsByUser(userId);

    res.render('profile', { title: 'Profile Page', hotels });
});

module.exports = router;