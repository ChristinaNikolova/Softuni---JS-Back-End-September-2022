const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const housingsController = require('../controllers/housings');

module.exports = (app) => {
    app.use(authController);
    app.use(homeController);
    app.use(housingsController);

    app.get('*', (req, res) => {
        res.render('404', { title: 'Page not found' });
    });
}