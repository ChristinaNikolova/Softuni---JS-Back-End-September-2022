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

function auctionViewModel(auction) {
    return {
        _id: auction._id,
        title: auction.title,
        description: auction.description,
        category: auction.category,
        image: auction.image,
        price: auction.price,
        author: authorViewModel(auction.author),
        bidders: auction.bidders,
        currentWinner: auction.currentWinner,
        currentWinnerFullName: auction.currentWinnerFullName,
        isClosed: auction.isClosed,
    }
}

function authorViewModel(author) {
    return {
        _id: author._id,
        firstName: author.firstName,
        lastName: author.lastName,
    };
}

module.exports = {
    mapErrors,
    auctionViewModel,
};