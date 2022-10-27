const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { trimBody } = require('../middleware/trimBody');
const { getAll, create, getById, buy, deleteById, edit, search } = require('../services/cryptos');
const { mapErrors, cryptoViewModel } = require('../utils/mappers');

router.get('/cryptos', async (req, res) => {
    const cryptos = (await getAll()).map(cryptoViewModel);
    res.render('cryptos', { title: 'All Cryptos', cryptos });
});

router.get('/create', isUser(), (req, res) => {
    res.render('create', { title: 'Create Crypto' });
});

router.post('/create', isUser(), trimBody(), async (req, res) => {
    const userId = req.session.user._id;
    let crypto = {
        name: req.body.name.toLowerCase(),
        image: req.body.image,
        price: Number(req.body.price),
        description: req.body.description,
        payment: req.body.payment.toLowerCase(),
        owner: userId,
    };

    try {
        await create(crypto);
        res.redirect('/cryptos');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        crypto = Object.assign({
            isWallet: req.body.payment === "crypto-wallet",
            isCredit: req.body.payment === "credit-card",
            isDebit: req.body.payment === "debit-card",
            isPaypal: req.body.payment === "paypal",
        }, crypto);
        res.render('create', { title: 'Create Crypto', crypto, errors })
    }
});

router.get('/cryptos/:id', async (req, res) => {
    const cryptoId = req.params.id;
    const crypto = cryptoViewModel(await getById(cryptoId));

    if (req.session.user) {
        const userId = req.session.user._id;
        crypto.hasUser = true;

        if (userId === crypto.owner._id.toString()) {
            crypto.isOwner = true;
        } else {
            crypto.isBought = crypto.buyers.map((b) => b._id.toString()).includes(userId);
        }
    }

    res.render('details', { title: crypto.name, crypto });
});

router.get('/buy/:id', isUser(), async (req, res) => {
    const cryptoId = req.params.id;
    const crypto = cryptoViewModel(await getById(cryptoId));
    const userId = req.session.user._id;

    try {
        if (userId === crypto.owner._id.toString()) {
            throw new Error('Owner can not buy this crypto');
        }

        await buy(cryptoId, userId);
        res.redirect('/cryptos/' + cryptoId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const cryptos = (await getAll()).map(cryptoViewModel);
        res.render('cryptos', { title: 'All Cryptos', cryptos, errors });
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    const cryptoId = req.params.id;
    const crypto = cryptoViewModel(await getById(cryptoId));
    const userId = req.session.user._id;

    try {
        if (userId !== crypto.owner._id.toString()) {
            throw new Error('Only owner can delete this crypto');
        }

        await deleteById(cryptoId);
        res.redirect('/cryptos')
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const cryptos = (await getAll()).map(cryptoViewModel);
        res.render('cryptos', { title: 'All Cryptos', cryptos, errors });
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    const cryptoId = req.params.id;
    let crypto = cryptoViewModel(await getById(cryptoId));
    const userId = req.session.user._id;

    if (userId !== crypto.owner._id.toString()) {
        return res.redirect('/cryptos/' + cryptoId);
    }

    crypto = Object.assign({
        isWallet: crypto.payment === "crypto-wallet",
        isCredit: crypto.payment === "credit-card",
        isDebit: crypto.payment === "debit-card",
        isPaypal: crypto.payment === "paypal",
    }, crypto);

    res.render('edit', { title: crypto.name, crypto });
});

router.post('/edit/:id', isUser(), trimBody(), async (req, res) => {
    const cryptoId = req.params.id;
    const dbCrypto = cryptoViewModel(await getById(cryptoId));
    const userId = req.session.user._id;

    let crypto = {
        _id: dbCrypto._id,
        name: req.body.name.toLowerCase(),
        image: req.body.image,
        price: Number(req.body.price),
        description: req.body.description,
        payment: req.body.payment.toLowerCase(),
    };

    try {
        if (userId !== dbCrypto.owner._id.toString()) {
            throw new Error('Only owner can edit this crypto');
        }

        await edit(cryptoId, crypto);
        res.redirect('/cryptos/' + cryptoId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        crypto = Object.assign({
            isWallet: crypto.payment === "crypto-wallet",
            isCredit: crypto.payment === "credit-card",
            isDebit: crypto.payment === "debit-card",
            isPaypal: crypto.payment === "paypal",
        }, crypto);
        res.render('edit', { title: crypto.name, crypto, errors });
    }
});

router.get('/search', isUser(), trimBody(), async (req, res) => {
    const name = req.query.name || '';
    const payment = req.query.payment;
    let cryptos;

    if (payment) {
        cryptos = (await search(name.toLowerCase(), payment.toLowerCase())).map(cryptoViewModel);
    } else {
        cryptos = (await getAll()).map(cryptoViewModel);
    }

    const result = {
        cryptos,
        name,
        isWallet: payment === "crypto-wallet",
        isCredit: payment === "credit-card",
        isDebit: payment === "debit-card",
        isPaypal: payment === "paypal",
    };

    res.render('search', { title: 'Search Page', result });
});

module.exports = router;