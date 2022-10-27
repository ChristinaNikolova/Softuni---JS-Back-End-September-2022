const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const auctionsController = require('../controllers/auctions');

module.exports = (app) => {
    app.use(authController);
    app.use(homeController);
    app.use(auctionsController);

    app.get('*', (req, res) => {
        res.render('404', { title: 'Page not found' });
    });
}