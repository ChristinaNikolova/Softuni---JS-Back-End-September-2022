const Publication = require("../models/Publication");

async function getPublicationByUser(userId) {
    return (await Publication.
        find({ author: userId }))
        .map((p) => p.title)
        .join(', ');
}

async function getSharedByUser(userId) {
    return (await Publication
        .find({}))
        .filter((p) => p.users.includes(userId))
        .map((p) => p.title)
        .join(', ');
}

module.exports = {
    getPublicationByUser,
    getSharedByUser,
}