const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const adsController = require('../controllers/ads');

module.exports = (app) => {
    app.use(authController);
    app.use(homeController);
    app.use(adsController);

    app.get('*', (req, res) => {
        res.render('404', { title: 'Page not found' });
    });
}