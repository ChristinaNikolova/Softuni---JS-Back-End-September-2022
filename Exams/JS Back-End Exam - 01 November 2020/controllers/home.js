const router = require('express').Router();
const { getAll, getTopThree } = require('../services/courses');
const { courseViewModel } = require('../utils/mappers');

router.get('/', async (req, res) => {
    let result = {};
    let template = '';

    if (req.session.user) {
        template = 'user-home';
        result.courses = (await getAll()).map(courseViewModel);
    } else {
        template = 'guest-home';
        result.courses = (await getTopThree()).map(courseViewModel);
    }

    res.render(template, { title: 'Home Page', result });
});

module.exports = router;