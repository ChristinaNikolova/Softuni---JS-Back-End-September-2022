const Auction = require('../models/Auction');

async function getAll() {
    return Auction.find({isClosed: false});
}

async function create(auction) {
    const result = new Auction(auction);
    await result.save();

    return result;
}

async function getById(id) {
    return Auction.findById(id).populate('author', 'firstName lastName');
}

async function bid(auctionId, userId, value, userFirstName, userLastName) {
    const auction = await Auction.findById(auctionId);

    if (auction.currentWinner === userId) {
        throw new Error('User is the current winner');
    }

    if (auction.price >= value) {
        throw new Error('Price should be higher that the current price');
    }

    auction.bidders.push(userId);
    auction.price = value;
    auction.currentWinner = userId;
    auction.currentWinnerFullName = userFirstName + ' ' + userLastName;
    await auction.save();
}

async function deleteById(id) {
    return Auction.findByIdAndDelete(id);
}

async function edit(id, updatedAuction) {
    const auction = await Auction.findById(id);

    auction.title = updatedAuction.title;
    auction.category = updatedAuction.category;
    auction.image = updatedAuction.image;
    auction.description = updatedAuction.description;

    if (!auction.currentWinner) {
        auction.price = updatedAuction.price;
    }

    await auction.save();
}

async function closeById(auctionId) {
    const auction = await Auction.findById(auctionId);
    auction.isClosed = true;
    await auction.save();
}

async function getClosedByUser(userId) {
    return Auction.find({ isClosed: true, author: userId });
}

module.exports = {
    getAll,
    create,
    getById,
    bid,
    edit,
    deleteById,
    closeById,
    getClosedByUser,
};
