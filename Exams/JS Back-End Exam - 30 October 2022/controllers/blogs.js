const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { trimBody } = require('../middleware/trimBody');
const { getAll, create, getById, follow, deleteById, edit } = require('../services/blogs');
const { mapErrors, blogViewModel } = require('../utils/mappers');

router.get('/blogs', async (req, res) => {
    const blogs = (await getAll()).map(blogViewModel);
    res.render('blogs', { title: 'All Blogs', blogs });
});

router.get('/create', isUser(), (req, res) => {
    res.render('create', { title: 'Create Blog' });
});

router.post('/create', isUser(), trimBody(), async (req, res) => {
    const userId = req.session.user._id;
    const blog = {
        title: req.body.title,
        image: req.body.image,
        content: req.body.content,
        category: req.body.category,
        owner: userId,
    };

    try {
        await create(blog);
        res.redirect('/blogs');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('create', { title: 'Create Blog', blog, errors })
    }
});

router.get('/blogs/:id', async (req, res) => {
    const blogId = req.params.id;
    const blog = blogViewModel(await getById(blogId));

    if (blog.followList) {
        blog.list = blog.followList.map((f) => f.email).join(', ');
    }

    if (req.session.user) {
        blog.hasUser = true;
        const userId = req.session.user._id;

        if (userId === blog.owner._id.toString()) {
            blog.isOwner = true;
        } else {
            blog.isFollowed = blog.followList.map((f) => f._id.toString()).includes(userId);
        }
    }

    res.render('details', { title: blog.title, blog });
});

router.get('/follow/:id', isUser(), async (req, res) => {
    const blogId = req.params.id;
    const blog = blogViewModel(await getById(blogId));
    const userId = req.session.user._id;

    try {
        if (userId === blog.owner._id.toString()) {
            throw new Error('Owner can not follow the blog');
        }

        await follow(blogId, userId);
        res.redirect('/blogs/' + blogId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const blogs = (await getAll()).map(blogViewModel);
        res.render('blogs', { title: 'All Blogs', blogs, errors });
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    const blogId = req.params.id;
    const blog = blogViewModel(await getById(blogId));
    const userId = req.session.user._id;

    try {
        if (userId !== blog.owner._id.toString()) {
            throw new Error('Only owner can delete this blog');
        }

        await deleteById(blogId);
        res.redirect('/blogs')
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const blogs = (await getAll()).map(blogViewModel);
        res.render('blogs', { title: 'All Blogs', blogs, errors });
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    const blogId = req.params.id;
    const blog = blogViewModel(await getById(blogId));
    const userId = req.session.user._id;

    if (userId !== blog.owner._id.toString()) {
        return res.redirect('/blogs/' + blogId);
    }

    res.render('edit', { title: blog.title, blog });
});

router.post('/edit/:id', isUser(), trimBody(), async (req, res) => {
    const blogId = req.params.id;
    const dbBlog = blogViewModel(await getById(blogId));
    const userId = req.session.user._id;

    const blog = {
        _id: dbBlog._id,
        title: req.body.title,
        image: req.body.image,
        content: req.body.content,
        category: req.body.category,
    };

    try {
        if (userId !== dbBlog.owner._id.toString()) {
            throw new Error('Only owner can edit this blog');
        }

        await edit(blogId, blog);
        res.redirect('/blogs/' + blogId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('edit', { title: blog.title, blog, errors });
    }
});

module.exports = router;