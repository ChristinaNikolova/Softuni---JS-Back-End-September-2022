const Trip = require("../models/Trip");

async function getTripsByUserId(userId) {
    return Trip.find({ creator: userId });
}

module.exports = {
    getTripsByUserId,
}