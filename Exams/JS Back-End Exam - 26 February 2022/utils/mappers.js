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

function adViewModel(ad) {
    return {
        _id: ad._id,
        headline: ad.headline,
        location: ad.location,
        companyName: ad.companyName,
        companyDescription: ad.companyDescription,
        author: authorViewModel(ad.author),
        users: ad.users.map(usersViewModel),
        createdAt: ad.createdAt,
    }
}

function authorViewModel(author) {
    return {
        _id: author._id,
        email: author.email,
    };
}

function usersViewModel(user) {
    return {
        _id: user._id,
        email: user.email,
        skills: user.skills,
    };
}

module.exports = {
    mapErrors,
    adViewModel,
};