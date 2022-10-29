const Hotel = require('../models/Hotel');

async function getAll() {
    return Hotel.find({}).sort({ freeRooms: -1 });
}

async function create(hotel) {
    let result = await getHotelByName(hotel.name);

    if (result) {
        throw new Error('Name is already taken');
    }

    result = new Hotel(hotel);
    await result.save();

    return result;
}

async function getById(id) {
    return Hotel.findById(id);
}

async function book(hotelId, userId) {
    const hotel = await Hotel.findById(hotelId);

    if (hotel.guests.includes(userId)) {
        throw new Error('User has already booked this hotel');
    }

    if (!hotel.freeRooms) {
        throw new Error('There are no free rooms');
    }

    hotel.guests.push(userId);
    hotel.freeRooms--;
    await hotel.save();
}

async function deleteById(id) {
    return Hotel.findByIdAndDelete(id);
}

async function edit(id, updatedHotel) {
    const hotel = await Hotel.findById(id);

    if (hotel.name.toLowerCase() !== updatedHotel.name.toLowerCase()) {
        const result = await getHotelByName(updatedHotel.name);

        if (result) {
            throw new Error('Name is already taken');
        }
    }

    hotel.name = updatedHotel.name;
    hotel.city = updatedHotel.city;
    hotel.rooms = updatedHotel.rooms;
    hotel.freeRooms = updatedHotel.freeRooms;
    hotel.image = updatedHotel.image;

    await hotel.save();
}

async function getHotelByName(name) {
    const hotel = await Hotel.findOne({ name }).collation({ locale: 'en', strength: 2 });
    return hotel;
}

module.exports = {
    getAll,
    create,
    getById,
    book,
    deleteById,
    edit,
};
