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

function publicationViewModel(publication) {
    return {
        _id: publication._id,
        title: publication.title,
        technique: publication.technique,
        picture: publication.picture,
        certificate: publication.certificate,
        author: authorViewModel(publication.author),
        users: publication.users,
    }
}

function authorViewModel(author) {
    return {
        _id: author._id,
        username: author.username,
    };
}

module.exports = {
    mapErrors,
    publicationViewModel,
};