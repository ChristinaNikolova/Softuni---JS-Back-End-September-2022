const Play = require('../models/Play');

async function getTopThree() {
    return Play.find({ isPublic: true }).sort({ likesCount: -1 }).limit(3);
}

async function getAll() {
    return Play.find({ isPublic: true }).sort({ createdAt: -1 });
}

async function create(play) {
    let result = await getPlayByTitle(play.title);

    if (result) {
        throw new Error('Title is already taken');
    }

    result = new Play(play);
    await result.save();

    return result;
}

async function getById(id) {
    return Play.findById(id);
}

async function like(playId, userId) {
    const play = await Play.findById(playId);

    if (play.likes.includes(userId)) {
        throw new Error('User has already liked this play');
    }

    play.likes.push(userId);
    play.likesCount++;
    await play.save();
}

async function deleteById(id) {
    return Play.findByIdAndDelete(id);
}

async function edit(id, updatedPlay) {
    const play = await Play.findById(id);

    if (play.title !== updatedPlay.title) {
        const result = await getPlayByTitle(updatedPlay.title);

        if (result) {
            throw new Error('Title is already taken');
        }
    }

    play.title = updatedPlay.title;
    play.description = updatedPlay.description;
    play.image = updatedPlay.image;
    play.isPublic = updatedPlay.isPublic;

    await play.save();
}

async function sortByCriteria(criteria) {
    return Play.find({}).sort({ [criteria]: -1 });
}

async function getPlayByTitle(title) {
    const play = await Play.findOne({ title }).collation({ locale: 'en', strength: 2 });
    return play;
}

module.exports = {
    getTopThree,
    getAll,
    create,
    getById,
    like,
    deleteById,
    edit,
    sortByCriteria,
};
