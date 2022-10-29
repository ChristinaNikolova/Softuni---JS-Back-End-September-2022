const router = require('express').Router();
const { getAll } = require('../services/hotels');
const { hotelViewModel } = require('../utils/mappers');

router.get('/', async (req, res) => {
    const hotels = (await getAll()).map(hotelViewModel);
    res.render('home', { title: 'Home Page', hotels });
});

module.exports = router;