const router = require('express').Router();
const { register, login } = require("../services/users");
const { isGuest, isUser } = require("../middleware/guards");
const { mapErrors } = require("../utils/mappers");

//const PASSWORD_PATTERN = /^[a-zA-z0-9]{3,}$/;

router.get('/register', isGuest(), (req, res) => {
    res.render('register', { title: 'Register Page' });
});

// TODO CHECK!!!
router.post('/register', isGuest(), async (req, res) => {
    try {
        if (req.body.password.trim().length < 4) {
            throw new Error('Password should be at least 4 characters long');
        }

        // if (!req.body.password.trim().match(PASSWORD_PATTERN)) {
        //     throw new Error('Password should contain only english letters and digits');
        // }

        if (req.body.password.trim() != req.body.repass.trim()) {
            throw new Error('Passwords don\'t match');
        }

        // CHECK PROPS
        const user = await register(
            req.body.firstName.trim(),
            req.body.lastName.trim(),
            req.body.email.trim(),
            req.body.password.trim(),
        );

        // CHECK REDIRECT
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const user = {
            firstName: req.body.firstName.trim(),
            lastName: req.body.lastName.trim(),
            email: req.body.email.trim(),
        };

        res.render('register', { title: 'Register Page', user, errors });
    }
});

router.get('/login', isGuest(), (req, res) => {
    res.render('login', { title: 'Login Page' });
});

router.post('/login', isGuest(), async (req, res) => {
    // CHECK PROPS
    try {
        const user = await login(
            req.body.email.trim(),
            req.body.password.trim(),
        );

        // CHECK REDIRECT
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const user = {
            email: req.body.email.trim(),
        };

        res.render('login', { title: 'Login Page', user, errors });
    }
});

router.get('/logout', isUser(), (req, res) => {
    delete req.session.user;
    // CHECK REDIRECT
    res.redirect('/');
});

module.exports = router;