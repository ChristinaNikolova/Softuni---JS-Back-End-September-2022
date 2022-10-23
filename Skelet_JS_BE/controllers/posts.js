// const router = require('express').Router();
// const { isUser } = require('../middleware/guards');
// const { getAll, create, getById, vote, deleteById, edit, getPostsByAuthor } = require('../services/posts');
// const { mapErrors, postViewModel } = require('../utils/mappers');

// router.get('/posts', async (req, res) => {
//     const posts = (await getAll()).map(postViewModel);
//     res.render('posts', { title: 'All Posts', posts });
// });

// router.get('/create', isUser(), (req, res) => {
//     res.render('create', { title: 'Create Post' });
// });

// router.post('/create', isUser(), async (req, res) => {
//     const userId = req.session.user._id;
//     NUMBER
//     const post = {
//         title: req.body.title.trim(),
//         keyword: req.body.keyword.trim(),
//         location: req.body.location.trim(),
//         date: req.body.date.trim(),
//         image: req.body.image.trim(),
//         description: req.body.description.trim(),
//         author: userId,
//     };

//     try {
//         await create(post);
//         res.redirect('/posts');
//     } catch (err) {
//         console.error(err);
//         const errors = mapErrors(err);
//         res.render('create', { title: 'Create Post', post, errors })
//     }
// });

// router.get('/posts/:id', async (req, res) => {
//     const postId = req.params.id;
//     const post = postViewModel(await getById(postId));

//     if (post.votes) {
//         post.listOfVotes = post.votes.map((v) => v.email).join(', ');
//     }

//     if (req.session.user) {
//         post.hasUser = true;
//         const userId = req.session.user._id;

//         if (userId === post.author._id.toString()) {
//             post.isAuthor = true;
//         } else {
//             post.hasVoted = post.votes.map((v) => v._id.toString()).includes(userId);
//         }
//     }

//     res.render('details', { title: post.title, post });
// });

// router.get('/vote/:id/:type', isUser(), async (req, res) => {
//     const postId = req.params.id;
//     const post = postViewModel(await getById(postId));
//     const userId = req.session.user._id;
//     const value = req.params.type === 'up' ? 1 : -1;

//     try {
//     if (userId === post.author._id.toString()) {
//         throw new Error('Creator can not vote the post');
//     }

//         await vote(postId, userId, value);
//         res.redirect('/posts/' + postId);
//     } catch (err) {
//         console.error(err);
//         const errors = mapErrors(err);
//         const posts = (await getAll()).map(postViewModel);
//         res.render('posts', { title: 'All Posts', posts, errors });
//     }
// });

// router.get('/delete/:id', isUser(), async (req, res) => {
//     const postId = req.params.id;
//     const post = postViewModel(await getById(postId));
//     const userId = req.session.user._id;

//     try {
    //     if (userId !== post.author._id.toString()) {
//         throw new Error('Only creator can delete this post');
//     }

//         await deleteById(postId);
//         res.redirect('/posts')
//     } catch (err) {
//         console.error(err);
//         const errors = mapErrors(err);
//         const posts = (await getAll()).map(postViewModel);
//         res.render('posts', { title: 'All Posts', posts, errors });
//     }
// });

// router.get('/edit/:id', isUser(), async (req, res) => {
//     const postId = req.params.id;
//     const post = postViewModel(await getById(postId));
//     const userId = req.session.user._id;

//     if (userId !== post.author._id.toString()) {
//         return res.redirect('/posts/' + postId);
//     }

//     res.render('edit', { title: 'Edit Post', post });
// });

// router.post('/edit/:id', isUser(), async (req, res) => {
//     const postId = req.params.id;
//     const dbPost = postViewModel(await getById(postId));
//     const userId = req.session.user._id;

//     NUMBER
//     const post = {
//         _id: dbPost._id,
//         title: req.body.title.trim(),
//         keyword: req.body.keyword.trim(),
//         location: req.body.location.trim(),
//         date: req.body.date.trim(),
//         image: req.body.image.trim(),
//         description: req.body.description.trim(),
//     };

//     try {
    //     if (userId !== dbPost.author._id.toString()) {
//         throw new Error('Only creator can edit this post');
//     }

//         await edit(postId, post);
//         res.redirect('/posts/' + postId);
//     } catch (err) {
//         console.error(err);
//         const errors = mapErrors(err);
//         res.render('edit', { title: 'Edit Post', post, errors });
//     }
// });

// router.get('/profile', isUser(), async (req, res) => {
//     const userId = req.session.user._id;
//     const posts = (await getPostsByAuthor(userId)).map(postViewModel);

//     res.render('profile', { title: 'Profile Page', posts });
// });

// module.exports = router;