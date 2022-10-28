const Publication = require('../models/Publication');

async function getAll() {
    return Publication.find({});
}

async function create(publication) {
    const result = new Publication(publication);
    await result.save();

    return result;
}

async function getById(id) {
    return Publication.findById(id).populate('author', 'username');
}

async function share(publicationId, userId) {
    const publication = await Publication.findById(publicationId);

    if (publication.users.includes(userId)) {
        throw new Error('User has already shared');
    }

    publication.users.push(userId);
    await publication.save();
}

async function deleteById(id) {
    return Publication.findByIdAndDelete(id);
}

async function edit(id, updatedPublication) {
    const publication = await Publication.findById(id);

    publication.title = updatedPublication.title;
    publication.technique = updatedPublication.technique;
    publication.picture = updatedPublication.picture;
    publication.certificate = updatedPublication.certificate;

    await publication.save();
}

module.exports = {
    getAll,
    create,
    getById,
    share,
    deleteById,
    edit,
};
