const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { trimBody } = require('../middleware/trimBody');
const { getAll, create, getById, share, deleteById, edit } = require('../services/publications');
const { mapErrors, publicationViewModel } = require('../utils/mappers');

router.get('/publications', async (req, res) => {
    const publications = (await getAll()).map(publicationViewModel);
    res.render('publications', { title: 'All Publications', publications });
});

router.get('/create', isUser(), (req, res) => {
    res.render('create', { title: 'Create Publication' });
});

router.post('/create', isUser(), trimBody(), async (req, res) => {
    const userId = req.session.user._id;
    const publication = {
        title: req.body.title,
        technique: req.body.technique,
        picture: req.body.picture,
        certificate: req.body.certificate.toLowerCase(),
        author: userId,
    };

    try {
        await create(publication);
        res.redirect('/publications');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('create', { title: 'Create Publication', publication, errors })
    }
});

router.get('/publications/:id', async (req, res) => {
    const publicationId = req.params.id;
    const publication = publicationViewModel(await getById(publicationId));

    if (req.session.user) {
        publication.hasUser = true;
        const userId = req.session.user._id;

        if (userId === publication.author._id.toString()) {
            publication.isAuthor = true;
        } else {
            publication.isShared = publication.users.map((u) => u._id.toString()).includes(userId);
        }
    }

    res.render('details', { title: publication.title, publication });
});

router.get('/share/:id', isUser(), async (req, res) => {
    const publicationId = req.params.id;
    const publication = publicationViewModel(await getById(publicationId));
    const userId = req.session.user._id;

    try {
        if (userId === publication.author._id.toString()) {
            throw new Error('Author can not share the publication');
        }

        await share(publicationId, userId);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const publications = (await getAll()).map(publicationViewModel);
        res.render('publications', { title: 'All Publications', publications, errors });
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    const publicationId = req.params.id;
    const publication = publicationViewModel(await getById(publicationId));
    const userId = req.session.user._id;

    try {
        if (userId !== publication.author._id.toString()) {
            throw new Error('Only author can delete this publication');
        }

        await deleteById(publicationId);
        res.redirect('/publications')
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const publications = (await getAll()).map(publicationViewModel);
        res.render('publications', { title: 'All Publications', publications, errors });
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    const publicationId = req.params.id;
    const publication = publicationViewModel(await getById(publicationId));
    const userId = req.session.user._id;

    if (userId !== publication.author._id.toString()) {
        return res.redirect('/publications/' + publicationId);
    }

    res.render('edit', { title: 'Edit Publication', publication });
});

router.post('/edit/:id', isUser(), trimBody(), async (req, res) => {
    const publicationId = req.params.id;
    const dbPublication = publicationViewModel(await getById(publicationId));
    const userId = req.session.user._id;

    const publication = {
        _id: dbPublication._id,
        title: req.body.title,
        technique: req.body.technique,
        picture: req.body.picture,
        certificate: req.body.certificate.toLowerCase(),
    };

    try {
        if (userId !== dbPublication.author._id.toString()) {
            throw new Error('Only author can edit this publication');
        }

        await edit(publicationId, publication);
        res.redirect('/publications/' + publicationId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('edit', { title: 'Edit Publication', publication, errors });
    }
});

module.exports = router;