const Trip = require('../models/Trip');

async function getAll() {
    return Trip.find({});
}

async function create(trip) {
    const result = new Trip(trip);
    await result.save();

    return result;
}

async function getById(id) {
    return Trip.findById(id).populate('creator', 'email').populate('buddies', 'email');
}

async function join(tripId, userId) {
    const trip = await Trip.findById(tripId);

    if (trip.buddies.includes(userId)) {
        throw new Error('User has already joined this trip');
    }

    if (!trip.seats) {
        throw new Error('There are not avaiable seats');
    }

    trip.buddies.push(userId);
    trip.seats--;
    await trip.save();
}

async function deleteById(id) {
    return Trip.findByIdAndDelete(id);
}

async function edit(id, updatedTrip) {
    const trip = await Trip.findById(id);

    trip.start = updatedTrip.start;
    trip.end = updatedTrip.end;
    trip.date = updatedTrip.date;
    trip.time = updatedTrip.time;
    trip.carImage = updatedTrip.carImage;
    trip.carBrand = updatedTrip.carBrand;
    trip.seats = updatedTrip.seats;
    trip.price = updatedTrip.price;
    trip.description = updatedTrip.description;

    await trip.save();
}

module.exports = {
    getAll,
    create,
    getById,
    join,
    deleteById,
    edit,
};
