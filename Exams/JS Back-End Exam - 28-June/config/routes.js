const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const playsController = require('../controllers/plays');

module.exports = (app) => {
    app.use(authController);
    app.use(homeController);
    app.use(playsController);
}