const Crypto = require('../models/Crypto');

async function getAll() {
    return Crypto.find({});
}

async function search(name, payment) {
    return (await Crypto.find({ payment: payment })).filter((c) => c.name.includes(name));
}

async function create(crypto) {
    const result = new Crypto(crypto);
    await result.save();

    return result;
}

async function getById(id) {
    return Crypto.findById(id);
}

async function buy(cryptoId, userId) {
    const crypro = await Crypto.findById(cryptoId);

    if (crypro.buyers.includes(userId)) {
        throw new Error('User has already bought this crypto');
    }

    crypro.buyers.push(userId);
    await crypro.save();
}

async function deleteById(id) {
    return Crypto.findByIdAndDelete(id);
}

async function edit(id, updatedCrypto) {
    const crypto = await Crypto.findById(id);

    crypto.name = updatedCrypto.name;
    crypto.image = updatedCrypto.image;
    crypto.price = updatedCrypto.price;
    crypto.description = updatedCrypto.description;
    crypto.payment = updatedCrypto.payment;

    await crypto.save();
}

module.exports = {
    getAll,
    create,
    getById,
    buy,
    deleteById,
    edit,
    search,
};
