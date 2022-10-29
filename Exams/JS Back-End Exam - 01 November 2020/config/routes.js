const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const coursesController = require('../controllers/courses');

module.exports = (app) => {
    app.use(authController);
    app.use(homeController);
    app.use(coursesController);
}