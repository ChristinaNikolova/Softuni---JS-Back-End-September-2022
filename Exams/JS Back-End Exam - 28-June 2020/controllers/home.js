const { getAll, getTopThree } = require('../services/plays');
const { playViewModel } = require('../utils/mappers');

const router = require('express').Router();

router.get('/', async (req, res) => {
    let plays = [];

    if (req.session.user) {
        plays = (await getAll()).map(playViewModel);
    } else {
        plays = (await getTopThree()).map(playViewModel);
    }

    res.render('home', { title: 'Home Page', plays });
});

module.exports = router;