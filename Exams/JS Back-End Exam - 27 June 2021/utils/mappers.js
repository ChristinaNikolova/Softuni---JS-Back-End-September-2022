function mapErrors(err) {
    if (Array.isArray(err)) {
        return err;
    } else if (err.name == 'ValidationError') {
        return Object.values(err.errors).map(e => ({ msg: e.message }));
    } else if (typeof err.message == 'string') {
        return [{ msg: err.message }];
    } else {
        return [{ msg: 'Request error' }];
    }
}

function tripViewModel(trip) {
    return {
        _id: trip._id,
        start: trip.start,
        end: trip.end,
        date: trip.date,
        time: trip.time,
        carImage: trip.carImage,
        carBrand: trip.carBrand,
        seats: trip.seats,
        price: trip.price,
        description: trip.description,
        creator: creatorViewModel(trip.creator),
        buddies: trip.buddies.map(buddyViewModel),
    }
}

function creatorViewModel(creator) {
    return {
        _id: creator._id,
        email: creator.email,
    }
}

function buddyViewModel(buddy) {
    return {
        _id: buddy._id,
        email: buddy.email,
    };
}

module.exports = {
    mapErrors,
    tripViewModel,
};