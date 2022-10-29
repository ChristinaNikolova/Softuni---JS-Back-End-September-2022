const Hotel = require("../models/Hotel");

async function getReservationsByUser(userId) {
    return (await Hotel.find({}))
        .filter((h) => h.guests.includes(userId))
        .map((h) => h.name)
        .join(', ');
}

module.exports = {
    getReservationsByUser,
}