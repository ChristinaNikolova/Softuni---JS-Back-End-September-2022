const router = require('express').Router();
const { getLastThree } = require('../services/housings');
const { housingViewModel } = require('../utils/mappers');

router.get('/', async (req, res) => {
    const housings = (await getLastThree()).map(housingViewModel);
    res.render('home', { title: 'Home Page', housings });
});

module.exports = router;