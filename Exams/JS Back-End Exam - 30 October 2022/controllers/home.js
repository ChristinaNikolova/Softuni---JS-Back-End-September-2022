const router = require('express').Router();
const { getLastThree } = require('../services/blogs');
const { blogViewModel } = require('../utils/mappers');

router.get('/', async (req, res) => {
    const blogs = (await getLastThree()).map(blogViewModel);
    res.render('home', { title: 'Home Page', blogs });
});

module.exports = router;