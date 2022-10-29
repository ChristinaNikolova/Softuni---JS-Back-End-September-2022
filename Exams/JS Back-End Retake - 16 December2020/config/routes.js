const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const hotelsController = require('../controllers/hotels');
const profilesController = require('../controllers/profiles');

module.exports = (app) => {
    app.use(authController);
    app.use(homeController);
    app.use(hotelsController);
    app.use(profilesController);
}