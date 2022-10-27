const Ad = require('../models/Ad');

async function getFirstThree() {
    return Ad.find({}).sort({ createdAt: 1 }).limit(3);
}

async function getAll() {
    return Ad.find({});
}

async function create(ad) {
    const result = new Ad(ad);
    await result.save();

    return result;
}

async function getById(id) {
    return Ad.findById(id).populate('author', 'email').populate('users', 'email skills');
}

async function apply(adId, userId) {
    const ad = await Ad.findById(adId);

    if (ad.users.includes(userId)) {
        throw new Error('User has already applied');
    }

    ad.users.push(userId);
    await ad.save();
}

async function deleteById(id) {
    return Ad.findByIdAndDelete(id);
}

async function edit(id, updatedAd) {
    const ad = await Ad.findById(id);

    ad.headline = updatedAd.headline;
    ad.location = updatedAd.location;
    ad.companyName = updatedAd.companyName;
    ad.companyDescription = updatedAd.companyDescription;

    await ad.save();
}

async function getAdsByAuthorEmail(email) {
    return (await Ad.find({}).populate('author', 'email')).filter((a) => a.author.email === email.toLowerCase());
}

module.exports = {
    getFirstThree,
    getAll,
    create,
    getById,
    apply,
    deleteById,
    edit,
    getAdsByAuthorEmail,
};
