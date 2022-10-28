const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const postsController = require('../controllers/posts');
const profilesController = require('../controllers/profiles');

module.exports = (app) => {
    app.use(authController);
    app.use(homeController);
    app.use(postsController);
    app.use(profilesController);

    app.get('*', (req, res) => {
        res.render('404', { title: 'Page not found' });
    });
}