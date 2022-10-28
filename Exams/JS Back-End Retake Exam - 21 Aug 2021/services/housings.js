const Housing = require('../models/Housing');

async function getLastThree() {
    return Housing.find({}).sort({ createdAt: -1 }).limit(3);
}

async function getAll() {
    return Housing.find({});
}

async function create(housing) {
    const result = new Housing(housing);
    await result.save();

    return result;
}

async function getById(id) {
    return Housing.findById(id).populate('renters', 'name');
}

async function rent(housingId, userId) {
    const housing = await Housing.findById(housingId);

    if (housing.renters.includes(userId)) {
        throw new Error('User has already rented');
    }

    if (!housing.pieces) {
        throw new Error('No pieces avaiable');
    }

    housing.renters.push(userId);
    housing.pieces--;
    await housing.save();
}

async function deleteById(id) {
    return Housing.findByIdAndDelete(id);
}

async function edit(id, updatedHousing) {
    const housing = await Housing.findById(id);

    housing.name = updatedHousing.name;
    housing.type = updatedHousing.type;
    housing.year = updatedHousing.year;
    housing.city = updatedHousing.city;
    housing.image = updatedHousing.image;
    housing.description = updatedHousing.description;
    housing.pieces = updatedHousing.pieces;

    await housing.save();
}

async function searchByType(search) {
    return (await Housing.find({})).filter((h) => h.type.includes(search));
}

module.exports = {
    getLastThree,
    getAll,
    create,
    getById,
    rent,
    deleteById,
    edit,
    searchByType,
};
