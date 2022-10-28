const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const publicationsController = require('../controllers/publications');
const profilesController = require('../controllers/profiles');

module.exports = (app) => {
    app.use(authController);
    app.use(homeController);
    app.use(publicationsController);
    app.use(profilesController);

    app.get('*', (req, res) => {
        res.render('404', { title: 'Page not found' });
    });
}