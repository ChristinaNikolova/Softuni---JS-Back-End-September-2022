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

function housingViewModel(housing) {
    return {
        _id: housing._id,
        name: housing.name,
        type: housing.type,
        year: housing.year,
        city: housing.city,
        image: housing.image,
        description: housing.description,
        pieces: housing.pieces,
        owner: housing.owner,
        renters: housing.renters.map(renterViewModel),
        createdAt: housing.createdAt,
    }
}

function renterViewModel(renter) {
    return {
        _id: renter._id,
        name: renter.name,
    };
}

module.exports = {
    mapErrors,
    housingViewModel,
};