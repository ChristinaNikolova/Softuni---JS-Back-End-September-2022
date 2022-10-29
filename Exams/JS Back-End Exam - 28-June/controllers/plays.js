const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { trimBody } = require('../middleware/trimBody');
const { create, getById, like, getAll, deleteById, edit, sortByCriteria } = require('../services/plays');
const { mapErrors, playViewModel } = require('../utils/mappers');

router.get('/create', isUser(), (req, res) => {
    res.render('create', { title: 'Create Play' });
});

router.post('/create', isUser(), trimBody(), async (req, res) => {
    const userId = req.session.user._id;
    const play = {
        title: req.body.title.toLowerCase(),
        description: req.body.description,
        image: req.body.image,
        isPublic: req.body.isPublic ? true : false,
        creator: userId,
    };

    try {
        await create(play);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('create', { title: 'Create Play', play, errors })
    }
});

router.get('/plays/:id', isUser(), async (req, res) => {
    const playId = req.params.id;
    const play = playViewModel(await getById(playId));
    const userId = req.session.user._id;

    if (userId === play.creator._id.toString()) {
        play.isCreator = true;
    } else {
        play.isLiked = play.likes.map((l) => l._id.toString()).includes(userId);
    }

    res.render('details', { title: play.title, play });
});

router.get('/like/:id', isUser(), async (req, res) => {
    const playId = req.params.id;
    const play = playViewModel(await getById(playId));
    const userId = req.session.user._id;

    try {
        if (userId === play.creator._id.toString()) {
            throw new Error('Creator can not like the play');
        }

        await like(playId, userId);
        res.redirect('/plays/' + playId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const plays = (await getAll()).map(playViewModel);
        res.render('home', { title: 'Home Page', plays, errors });
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    const playId = req.params.id;
    const play = playViewModel(await getById(playId));
    const userId = req.session.user._id;

    try {
        if (userId !== play.creator._id.toString()) {
            throw new Error('Only creator can delete this play');
        }

        await deleteById(playId);
        res.redirect('/')
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const plays = (await getAll()).map(playViewModel);
        res.render('home', { title: 'Home Page', plays, errors });
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    const playId = req.params.id;
    const play = playViewModel(await getById(playId));
    const userId = req.session.user._id;

    if (userId !== play.creator._id.toString()) {
        return res.redirect('/plays/' + playId);
    }

    res.render('edit', { title: play.title, play });
});

router.post('/edit/:id', isUser(), trimBody(), async (req, res) => {
    const playId = req.params.id;
    const dbPlay = playViewModel(await getById(playId));
    const userId = req.session.user._id;

    const play = {
        _id: dbPlay._id,
        title: req.body.title.toLowerCase(),
        description: req.body.description,
        image: req.body.image,
        isPublic: req.body.isPublic ? true : false,
    };

    try {
        if (userId !== dbPlay.creator._id.toString()) {
            throw new Error('Only creator can edit this play');
        }

        await edit(playId, play);
        res.redirect('/plays/' + playId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('edit', { title: play.title, play, errors });
    }
});

router.get('/sort/:criteria', isUser(), async (req, res) => {
    const criteria = req.params.criteria;
    const plays = (await sortByCriteria(criteria)).map(playViewModel);

    res.render('home', { title: 'Home Page', plays });
});

module.exports = router;