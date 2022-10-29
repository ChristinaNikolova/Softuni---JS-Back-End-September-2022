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

function hotelViewModel(hotel) {
    return {
        _id: hotel._id,
        name: hotel.name,
        city: hotel.city,
        image: hotel.image,
        rooms: hotel.rooms,
        freeRooms: hotel.freeRooms,
        owner: hotel.owner,
        guests: hotel.guests,
    }
}

module.exports = {
    mapErrors,
    hotelViewModel,
};