const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { trimBody } = require('../middleware/trimBody');
const { getAll, create, getById, rent, deleteById, edit, searchByType } = require('../services/housings');
const { mapErrors, housingViewModel } = require('../utils/mappers');

router.get('/housings', async (req, res) => {
    const housings = (await getAll()).map(housingViewModel);
    res.render('housings', { title: 'All Housings', housings });
});

router.get('/create', isUser(), (req, res) => {
    res.render('create', { title: 'Create Housing' });
});

router.post('/create', isUser(), trimBody(), async (req, res) => {
    const userId = req.session.user._id;
    const housing = {
        name: req.body.name,
        type: req.body.type.toLowerCase(),
        year: Number(req.body.year),
        city: req.body.city,
        image: req.body.image,
        description: req.body.description,
        pieces: Number(req.body.pieces),
        owner: userId,
    };

    try {
        await create(housing);
        res.redirect('/housings');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('create', { title: 'Create Housing', housing, errors })
    }
});

router.get('/housings/:id', async (req, res) => {
    const housingId = req.params.id;
    const housing = housingViewModel(await getById(housingId));

    if (housing.renters) {
        housing.listOfRenters = housing.renters.map((r) => r.name).join(', ');
    }

    if (req.session.user) {
        housing.hasUser = true;
        const userId = req.session.user._id;

        if (userId === housing.owner._id.toString()) {
            housing.isOwner = true;
        } else {
            housing.isRented = housing.renters.map((r) => r._id.toString()).includes(userId);
        }
    }

    res.render('details', { title: housing.name, housing });
});

router.get('/rent/:id', isUser(), async (req, res) => {
    const housingId = req.params.id;
    const housing = housingViewModel(await getById(housingId));
    const userId = req.session.user._id;

    try {
        if (userId === housing.owner._id.toString()) {
            throw new Error('Owner can not rent the housing');
        }

        await rent(housingId, userId);
        res.redirect('/housings/' + housingId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const housings = (await getAll()).map(housingViewModel);
        res.render('housings', { title: 'All Housings', housings, errors });
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    const housingId = req.params.id;
    const housing = housingViewModel(await getById(housingId));
    const userId = req.session.user._id;

    try {
        if (userId !== housing.owner._id.toString()) {
            throw new Error('Only owner can delete this housing');
        }

        await deleteById(housingId);
        res.redirect('/housings')
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const housings = (await getAll()).map(housingViewModel);
        res.render('housings', { title: 'All Housings', housings, errors });
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    const housingId = req.params.id;
    const housing = housingViewModel(await getById(housingId));
    const userId = req.session.user._id;

    if (userId !== housing.owner._id.toString()) {
        return res.redirect('/housings/' + housingId);
    }

    res.render('edit', { title: 'Edit Housing', housing });
});

router.post('/edit/:id', isUser(), trimBody(), async (req, res) => {
    const housingId = req.params.id;
    const dbHousing = housingViewModel(await getById(housingId));
    const userId = req.session.user._id;

    const housing = {
        _id: dbHousing._id,
        name: req.body.name,
        type: req.body.type.toLowerCase(),
        year: Number(req.body.year),
        city: req.body.city,
        image: req.body.image,
        description: req.body.description,
        pieces: Number(req.body.pieces),
    };

    try {
        if (userId !== dbHousing.owner._id.toString()) {
            throw new Error('Only owner can edit this housing');
        }

        await edit(housingId, housing);
        res.redirect('/housings/' + housingId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('edit', { title: 'Edit Housing', housing, errors });
    }
});

router.get('/search', isUser(), (req, res) => {
    res.render('search', { title: 'Search Page' });
});

router.post('/search', isUser(), trimBody(), async (req, res) => {
    const search = req.body.search.toLowerCase() || '';
    const housings = (await searchByType(search)).map(housingViewModel);
    const result = {
        housings,
        search,
        isSearched: true,
    };

    res.render('search', { title: 'Search Page', result });
});

module.exports = router;