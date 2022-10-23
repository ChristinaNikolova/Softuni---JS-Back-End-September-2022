const authController = require('../controllers/auth');
// const homeController = require('../controllers/home');
// const postsController = require('../controllers/posts');

module.exports = (app) => {
    app.use(authController);
    // app.use(homeController);
    // app.use(postsController);

    // app.get('*', (req, res) => {
    //     res.render('404', { title: 'Page not found' });
    // });
}