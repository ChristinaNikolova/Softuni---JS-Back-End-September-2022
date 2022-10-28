const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { trimBody } = require('../middleware/trimBody');
const { getAll, create, getById, join, deleteById, edit } = require('../services/trips');
const { mapErrors, tripViewModel } = require('../utils/mappers');

router.get('/trips', async (req, res) => {
    const trips = (await getAll()).map(tripViewModel);
    res.render('trips', { title: 'All Trips', trips });
});

router.get('/create', isUser(), (req, res) => {
    res.render('create', { title: 'Create Trip' });
});

router.post('/create', isUser(), trimBody(), async (req, res) => {
    const userId = req.session.user._id;
    const trip = {
        start: req.body.start,
        end: req.body.end,
        date: req.body.date,
        time: req.body.time,
        carImage: req.body.carImage,
        carBrand: req.body.carBrand,
        seats: Number(req.body.seats),
        price: Number(req.body.price),
        description: req.body.description,
        creator: userId,
    };

    try {
        await create(trip);
        res.redirect('/trips');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('create', { title: 'Create Trip', trip, errors });
    }
});

router.get('/trips/:id', async (req, res) => {
    const tripId = req.params.id;
    const trip = tripViewModel(await getById(tripId));

    if (trip.buddies) {
        trip.listOfBuddies = trip.buddies.map((b) => b.email).join(', ');
    }

    if (req.session.user) {
        trip.hasUser = true;
        const userId = req.session.user._id;

        if (userId === trip.creator._id.toString()) {
            trip.isCreator = true;
        } else {
            trip.isJoined = trip.buddies.map((b) => b._id.toString()).includes(userId);
        }
    }

    res.render('details', { title: trip.start + '-' + trip.end, trip });
});

router.get('/join/:id', isUser(), async (req, res) => {
    const tripId = req.params.id;
    const trip = tripViewModel(await getById(tripId));
    const userId = req.session.user._id;

    try {
        if (userId === trip.creator._id.toString()) {
            throw new Error('Creator can not join this trip');
        }

        await join(tripId, userId);
        res.redirect('/trips/' + tripId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const trips = (await getAll()).map(tripViewModel);
        res.render('trips', { title: 'All Trips', trips, errors });
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    const tripId = req.params.id;
    const trip = tripViewModel(await getById(tripId));
    const userId = req.session.user._id;

    try {
        if (userId !== trip.creator._id.toString()) {
            throw new Error('Only creator can delete this trip');
        }

        await deleteById(tripId);
        res.redirect('/trips')
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        const trips = (await getAll()).map(tripViewModel);
        res.render('trips', { title: 'All Trips', trips, errors });
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    const tripId = req.params.id;
    const trip = tripViewModel(await getById(tripId));
    const userId = req.session.user._id;

    if (userId !== trip.creator._id.toString()) {
        return res.redirect('/trips/' + tripId);
    }

    res.render('edit', { title: 'Edit Trip', trip });
});

router.post('/edit/:id', isUser(), trimBody(), async (req, res) => {
    const tripId = req.params.id;
    const dbTrip = tripViewModel(await getById(tripId));
    const userId = req.session.user._id;

    const trip = {
        _id: dbTrip._id,
        start: req.body.start,
        end: req.body.end,
        date: req.body.date,
        time: req.body.time,
        carImage: req.body.carImage,
        carBrand: req.body.carBrand,
        seats: Number(req.body.seats),
        price: Number(req.body.price),
        description: req.body.description,
    };

    try {
        if (userId !== dbTrip.creator._id.toString()) {
            throw new Error('Only creator can edit this trip');
        }

        await edit(tripId, trip);
        res.redirect('/trips/' + tripId);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('edit', { title: 'Edit Trip', trip, errors });
    }
});

module.exports = router;