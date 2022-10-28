const router = require('express').Router();
const { getAll } = require('../services/publications');
const { publicationViewModel } = require('../utils/mappers');

router.get('/', async (req, res) => {
    const publications = (await getAll()).map(publicationViewModel);
    res.render('home', { title: 'Home Page', publications });
});

module.exports = router;