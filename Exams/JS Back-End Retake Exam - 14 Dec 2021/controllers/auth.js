const router = require('express').Router();
const { register, login } = require("../services/users");
const { isGuest, isUser } = require("../middleware/guards");
const { mapErrors } = require("../utils/mappers");
const { trimBody } = require('../middleware/trimBody');

router.get('/register', isGuest(), (req, res) => {
    res.render('register', { title: 'Register Page' });
});

router.post('/register', isGuest(), trimBody(), async (req, res) => {
    try {
        if (req.body.password.length < 3) {
            throw new Error('Password should be at least 3 characters long');
        }

        if (req.body.password != req.body.repass) {
            throw new Error('Passwords don\'t match');
        }

        const user = await register(
            req.body.username,
            req.body.password,
            req.body.address,
        );

        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const user = {
            username: req.body.username,
            address: req.body.address,
        };

        res.render('register', { title: 'Register Page', user, errors });
    }
});

router.get('/login', isGuest(), (req, res) => {
    res.render('login', { title: 'Login Page' });
});

router.post('/login', isGuest(), trimBody(), async (req, res) => {
    try {
        const user = await login(
            req.body.username,
            req.body.password,
        );

        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const user = {
            username: req.body.username,
        };

        res.render('login', { title: 'Login Page', user, errors });
    }
});

router.get('/logout', isUser(), (req, res) => {
    delete req.session.user;
    res.redirect('/');
});

module.exports = router;