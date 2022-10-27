const router = require('express').Router();
const { getFirstThree } = require('../services/ads');
const { adViewModel } = require('../utils/mappers');

router.get('/', async (req, res) => {
    const ads = (await getFirstThree()).map(adViewModel);
    res.render('home', { title: 'Home Page', ads });
});

module.exports = router;