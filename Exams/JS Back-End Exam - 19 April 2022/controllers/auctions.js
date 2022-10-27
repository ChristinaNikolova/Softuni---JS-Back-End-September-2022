const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { trimBody } = require('../middleware/trimBody');
const { getAll, create, getById, bid, edit, deleteById, closeById, getClosedByUser } = require('../services/auctions');
const { mapErrors, auctionViewModel } = require('../utils/mappers');

router.get('/auctions', async (req, res) => {
    const auctions = (await getAll()).map(auctionViewModel);
    res.render('auctions', { title: 'All Auctions', auctions });
});

router.get('/create', isUser(), (req, res) => {
    res.render('create', { title: 'Create Auction' });
});

router.post('/create', isUser(), trimBody(), async (req, res) => {
    const userId = req.session.user._id;
    let auction = {
        title: req.body.title,
        category: req.body.category.toLowerCase() === 'estate' ? 'real estate' : req.body.category.toLowerCase(),
        image: req.body.image,
        price: Number(req.body.price),
        description: req.body.description,
        author: userId,
    };

    try {
        await create(auction);
        res.redirect('/auctions');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        auction = Object.assign({
            isEstate: req.body.category === 'estate',
            isVehicles: req.body.category === 'vehicles',
            isFurniture: req.body.category === 'furniture',
            isElectronics: req.body.category === 'electronics',
            isOther: req.body.category === 'other',
        }, auction);
        res.render('create', { title: 'Create Auction', auction, errors })
    }
});

router.get('/auctions/:id', async (req, res) => {
    const auctionId = req.params.id;
    const auction = auctionViewModel(await getById(auctionId));

    if (req.session.user) {
        const userId = req.session.user._id;
        auction.hasUser = true;

        if (userId === auction.author._id.toString()) {
            auction.isAuthor = true;
        } else {
            auction.isWinner = auction.currentWinner === userId;
        }
    }

    res.render('details', { title: auction.title, auction });
});

router.post('/bid/:id', isUser(), trimBody(), async (req, res) => {
    const auctionId = req.params.id;
    const auction = auctionViewModel(await getById(auctionId));
    const userId = req.session.user._id;
    const value = Number(req.body.value);

    try {
        if (userId === auction.author._id.toString()) {
            throw new Error('Author can not bid');
        }

        await bid(auctionId, userId, value, req.session.user.firstName, req.session.user.lastName);
        res.redirect('/auctions/' + auctionId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const auctions = (await getAll()).map(auctionViewModel);
        res.render('auctions', { title: 'All Auctions', auctions, errors });
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    const auctionId = req.params.id;
    let auction = auctionViewModel(await getById(auctionId));
    const userId = req.session.user._id;

    if (userId !== auction.author._id.toString()) {
        return res.redirect('/auctions/' + auctionId);
    }

    auction = Object.assign({
        isEstate: auction.category === 'real estate',
        isVehicles: auction.category === 'vehicles',
        isFurniture: auction.category === 'furniture',
        isElectronics: auction.category === 'electronics',
        isOther: auction.category === 'other',
    }, auction);

    res.render('edit', { title: 'Edit Auction', auction });
});

router.post('/edit/:id', isUser(), trimBody(), async (req, res) => {
    const auctionId = req.params.id;
    const dbAuction = auctionViewModel(await getById(auctionId));
    const userId = req.session.user._id;

    let auction = {
        _id: dbAuction._id,
        title: req.body.title,
        category: req.body.category.toLowerCase() === 'estate' ? 'real estate' : req.body.category.toLowerCase(),
        image: req.body.image,
        price: Number(req.body.price),
        description: req.body.description,
    };

    try {
        if (userId !== dbAuction.author._id.toString()) {
            throw new Error('Only author can edit this auction');
        }

        await edit(auctionId, auction);
        res.redirect('/auctions/' + auctionId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        auction = Object.assign({
            isEstate: auction.category === 'estate',
            isVehicles: auction.category === 'vehicles',
            isFurniture: auction.category === 'furniture',
            isElectronics: auction.category === 'electronics',
            isOther: auction.category === 'other',
        }, auction);
        res.render('edit', { title: 'Edit Auction', auction, errors });
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    const auctionId = req.params.id;
    const auction = auctionViewModel(await getById(auctionId));
    const userId = req.session.user._id;

    try {
        if (userId !== auction.author._id.toString()) {
            throw new Error('Only author can delete this auction');
        }

        await deleteById(auctionId);
        res.redirect('/auctions')
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const auctions = (await getAll()).map(auctionViewModel);
        res.render('auctions', { title: 'All Auctions', auctions, errors });
    }
});

router.get('/close/:id', isUser(), async (req, res) => {
    const auctionId = req.params.id;
    const auction = auctionViewModel(await getById(auctionId));
    const userId = req.session.user._id;

    try {
        if (userId !== auction.author._id.toString()) {
            throw new Error('Only author can close this auction');
        }

        if (!auction.currentWinner) {
            throw new Error('You can not close this auction, because there is no winner');
        }

        await closeById(auctionId);
        res.redirect('/closed')
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const auctions = (await getAll()).map(auctionViewModel);
        res.render('auctions', { title: 'All Auctions', auctions, errors });
    }
});

router.get('/closed', isUser(), async (req, res) => {
    const userId = req.session.user._id;
    const auctions = (await getClosedByUser(userId)).map(auctionViewModel);

    res.render('closed', { title: 'Closed Auctions', auctions });
});

module.exports = router;