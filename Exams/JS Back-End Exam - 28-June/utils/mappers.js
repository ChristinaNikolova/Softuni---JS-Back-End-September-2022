function mapErrors(err) {
    if (Array.isArray(err)) {
        return err;
    } else if (err.name == 'ValidationError') {
        return Object.values(err.errors).map(e => ({ msg: e.message }));
    } else if (typeof err.message == 'string') {
        return [{ msg: err.message }];
    } else {
        return [{ msg: 'Request error' }];
    }
}

function playViewModel(play) {
    return {
        _id: play._id,
        title: play.title,
        description: play.description,
        image: play.image,
        isPublic: play.isPublic,
        creator: play.creator,
        likes: play.likes,
        likesCount: play.likesCount,
        createdAt: play.createdAt,
    }
}

module.exports = {
    mapErrors,
    playViewModel,
};