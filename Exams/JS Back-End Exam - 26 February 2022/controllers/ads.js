const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { trimBody } = require('../middleware/trimBody');
const { getAll, create, getById, apply, deleteById, edit, getAdsByAuthorEmail } = require('../services/ads');
const { mapErrors, adViewModel } = require('../utils/mappers');

router.get('/ads', async (req, res) => {
    const ads = (await getAll()).map(adViewModel);
    res.render('ads', { title: 'All Ads', ads });
});

router.get('/create', isUser(), (req, res) => {
    res.render('create', { title: 'Create Ad' });
});

router.post('/create', isUser(), trimBody(), async (req, res) => {
    const userId = req.session.user._id;
    const ad = {
        headline: req.body.headline,
        location: req.body.location,
        companyName: req.body.companyName,
        companyDescription: req.body.companyDescription,
        author: userId,
    }

    try {
        await create(ad);
        res.redirect('/ads');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('create', { title: 'Create Ad', ad, errors })
    }
});

router.get('/ads/:id', async (req, res) => {
    const adId = req.params.id;
    const ad = adViewModel(await getById(adId));

    if (req.session.user) {
        const userId = req.session.user._id;
        ad.hasUser = true;

        if (userId === ad.author._id.toString()) {
            ad.isAuthor = true;
        } else {
            ad.hasApplied = ad.users.map((u) => u._id.toString()).includes(userId);
        }
    }

    res.render('details', { title: ad.headline, ad });
});

router.get('/apply/:id', isUser(), async (req, res) => {
    const adId = req.params.id;
    const ad = adViewModel(await getById(adId));
    const userId = req.session.user._id;

    try {
        if (userId === ad.author._id.toString()) {
            throw new Error('Author can not apply for this ad');
        }

        await apply(adId, userId);
        res.redirect('/ads/' + adId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const ads = (await getAll()).map(adViewModel);
        res.render('ads', { title: 'All Ads', ads, errors });
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    const adId = req.params.id;
    const ad = adViewModel(await getById(adId));
    const userId = req.session.user._id;

    try {
        if (userId !== ad.author._id.toString()) {
            throw new Error('Only author can delete this ad');
        }

        await deleteById(adId);
        res.redirect('/ads')
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const ads = (await getAll()).map(adViewModel);
        res.render('ads', { title: 'All Ads', ads, errors });
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    const adId = req.params.id;
    const ad = adViewModel(await getById(adId));
    const userId = req.session.user._id;

    if (userId !== ad.author._id.toString()) {
        return res.redirect('/ads/' + adId);
    }

    res.render('edit', { title: ad.headline, ad });
});

router.post('/edit/:id', isUser(), trimBody(), async (req, res) => {
    const adId = req.params.id;
    const dbAd = adViewModel(await getById(adId));
    const userId = req.session.user._id;

    const ad = {
        _id: dbAd._id,
        headline: req.body.headline,
        location: req.body.location,
        companyName: req.body.companyName,
        companyDescription: req.body.companyDescription,
    }

    try {
        if (userId !== dbAd.author._id.toString()) {
            throw new Error('Only author can edit this ad');
        }

        await edit(adId, ad);
        res.redirect('/ads/' + adId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('edit', { title: ad.headline, ad, errors });
    }
});

router.get('/search', isUser(), (req, res) => {
    res.render('search', { title: 'Search Page' });
});

router.post('/search', isUser(), trimBody(), async (req, res) => {
    const email = req.body.email;
    const ads = (await getAdsByAuthorEmail(email)).map(adViewModel);
    const result = {
        ads,
        email,
        isSearched: true,
    };

    res.render('search', { title: 'Search Page', result });
});

module.exports = router;