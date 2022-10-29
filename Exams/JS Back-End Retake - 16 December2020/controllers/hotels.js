const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { trimBody } = require('../middleware/trimBody');
const { create, getById, book, getAll, deleteById, edit } = require('../services/hotels');
const { mapErrors, hotelViewModel } = require('../utils/mappers');

router.get('/create', isUser(), (req, res) => {
    res.render('create', { title: 'Create Hotel' });
});

router.post('/create', isUser(), trimBody(), async (req, res) => {
    const userId = req.session.user._id;
    const hotel = {
        name: req.body.name,
        city: req.body.city,
        rooms: Number(req.body.rooms),
        freeRooms: Number(req.body.rooms),
        image: req.body.image,
        owner: userId,
    };

    try {
        await create(hotel);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('create', { title: 'Create Hotel', hotel, errors })
    }
});

router.get('/hotels/:id', isUser(), async (req, res) => {
    const hotelId = req.params.id;
    const hotel = hotelViewModel(await getById(hotelId));
    const userId = req.session.user._id;

    if (userId === hotel.owner._id.toString()) {
        hotel.isOwner = true;
    } else {
        hotel.isBooked = hotel.guests.map((g) => g._id.toString()).includes(userId);
    }

    res.render('details', { title: hotel.name, hotel })
});

router.get('/book/:id', isUser(), async (req, res) => {
    const hotelId = req.params.id;
    const hotel = hotelViewModel(await getById(hotelId));
    const userId = req.session.user._id;

    try {
        if (userId === hotel.owner._id.toString()) {
            throw new Error('Owner can not book this room');
        }

        await book(hotelId, userId);
        res.redirect('/hotels/' + hotelId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const hotels = (await getAll()).map(hotelViewModel);
        res.render('home', { title: 'Home Page', hotels, errors });
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    const hotelId = req.params.id;
    const hotel = hotelViewModel(await getById(hotelId));
    const userId = req.session.user._id;

    try {
        if (userId !== hotel.owner._id.toString()) {
            throw new Error('Only owner can delete this hotel');
        }

        await deleteById(hotelId);
        res.redirect('/')
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const hotels = (await getAll()).map(hotelViewModel);
        res.render('home', { title: 'Home Page', hotels, errors });
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    const hotelId = req.params.id;
    const hotel = hotelViewModel(await getById(hotelId));
    const userId = req.session.user._id;

    if (userId !== hotel.owner._id.toString()) {
        return res.redirect('/hotels/' + hotelId);
    }

    res.render('edit', { title: hotel.name, hotel });
});

router.post('/edit/:id', isUser(), trimBody(), async (req, res) => {
    const hotelId = req.params.id;
    const dbHotel = hotelViewModel(await getById(hotelId));
    const userId = req.session.user._id;

    const hotel = {
        _id: dbHotel._id,
        name: req.body.name,
        city: req.body.city,
        rooms: Number(req.body.rooms),
        freeRooms: Number(req.body.rooms) - dbHotel.guests.length,
        image: req.body.image,
    };

    try {
        if (userId !== dbHotel.owner._id.toString()) {
            throw new Error('Only owner can edit this hotel');
        }

        await edit(hotelId, hotel);
        res.redirect('/hotels/' + hotelId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('edit', { title: hotel.name, hotel, errors });
    }
});

module.exports = router;