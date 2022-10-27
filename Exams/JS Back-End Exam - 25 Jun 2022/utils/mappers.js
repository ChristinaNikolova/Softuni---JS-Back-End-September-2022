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

function cryptoViewModel(crypto) {
    return {
        _id: crypto._id,
        name: crypto.name,
        image: crypto.image,
        price: crypto.price,
        description: crypto.description,
        payment: crypto.payment,
        buyers: crypto.buyers,
        owner: crypto.owner,
    }
}

// function authorViewModel(author) {
//     return {
//         _id: author._id,
//         firstName: author.firstName,
//         lastName: author.lastName,
//     };
// }

// function votesViewModel(user) {
//     return {
//         _id: user._id,
//         email: user.email,
//     };
// }

module.exports = {
    mapErrors,
    cryptoViewModel,
};