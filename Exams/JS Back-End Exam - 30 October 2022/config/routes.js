const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const blogsController = require('../controllers/blogs');
const profilesController = require('../controllers/profiles');

module.exports = (app) => {
    app.use(authController);
    app.use(homeController);
    app.use(blogsController);
    app.use(profilesController);

    app.get('*', (req, res) => {
        res.render('404', { title: 'Page not found' });
    });
}