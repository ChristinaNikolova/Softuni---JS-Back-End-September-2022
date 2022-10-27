const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const cryptosController = require('../controllers/cryptos');

module.exports = (app) => {
    app.use(authController);
    app.use(homeController);
    app.use(cryptosController);

    app.get('*', (req, res) => {
        res.render('404', { title: 'Page not found' });
    });
}