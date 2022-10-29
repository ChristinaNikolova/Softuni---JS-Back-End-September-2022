const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { trimBody } = require('../middleware/trimBody');
const { create, getById, enroll, getAll, deleteById, edit, searchByTitle } = require('../services/courses');
const { mapErrors, courseViewModel } = require('../utils/mappers');

router.get('/create', isUser(), (req, res) => {
    res.render('create', { title: 'Create Course' });
});

router.post('/create', isUser(), trimBody(), async (req, res) => {
    const userId = req.session.user._id;
    const course = {
        title: req.body.title.toLowerCase(),
        description: req.body.description,
        image: req.body.image,
        duration: req.body.duration,
        creator: userId,
    };

    try {
        await create(course);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('create', { title: 'Create Course', course, errors })
    }
});

router.get('/courses/:id', isUser(), async (req, res) => {
    const courseId = req.params.id;
    const course = courseViewModel(await getById(courseId));
    const userId = req.session.user._id;

    if (userId === course.creator._id.toString()) {
        course.isCreator = true;
    } else {
        course.isEnrolled = course.students.map((s) => s._id.toString()).includes(userId);
    }

    res.render('details', { title: course.title, course });
});

router.get('/enroll/:id', isUser(), async (req, res) => {
    const courseId = req.params.id;
    const course = courseViewModel(await getById(courseId));
    const userId = req.session.user._id;

    try {
        if (userId === course.creator._id.toString()) {
            throw new Error('Creator can not enroll to this course');
        }

        await enroll(courseId, userId);
        res.redirect('/courses/' + courseId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const courses = (await getAll()).map(courseViewModel);
        res.render('user-home', { title: 'Home Page', courses, errors });
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    const courseId = req.params.id;
    const course = courseViewModel(await getById(courseId));
    const userId = req.session.user._id;

    try {
        if (userId !== course.creator._id.toString()) {
            throw new Error('Only creator can delete this course');
        }

        await deleteById(courseId);
        res.redirect('/')
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const courses = (await getAll()).map(courseViewModel);
        res.render('user-home', { title: 'Home Page', courses, errors });
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    const courseId = req.params.id;
    const course = courseViewModel(await getById(courseId));
    const userId = req.session.user._id;

    if (userId !== course.creator._id.toString()) {
        return res.redirect('/courses/' + courseId);
    }

    res.render('edit', { title: course.title, course });
});

router.post('/edit/:id', isUser(), trimBody(), async (req, res) => {
    const courseId = req.params.id;
    const dbCourse = courseViewModel(await getById(courseId));
    const userId = req.session.user._id;

    const course = {
        _id: dbCourse._id,
        title: req.body.title.toLowerCase(),
        description: req.body.description,
        image: req.body.image,
        duration: req.body.duration,
    };

    try {
        if (userId !== dbCourse.creator._id.toString()) {
            throw new Error('Only creator can edit this course');
        }

        await edit(courseId, course);
        res.redirect('/courses/' + courseId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('edit', { title: course.title, course, errors });
    }
});

router.get('/search', isUser(), trimBody(), async (req, res) => {
    const search = req.query.search.toLowerCase() || '';
    const courses = (await searchByTitle(search)).map(courseViewModel);
    const result = {
        search,
        courses,
    };

    res.render('user-home', { title: 'Home Page', result });
});

module.exports = router;