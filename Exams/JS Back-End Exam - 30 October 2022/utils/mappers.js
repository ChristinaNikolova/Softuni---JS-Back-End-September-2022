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

function blogViewModel(blog) {
    return {
        _id: blog._id,
        title: blog.title,
        image: blog.image,
        content: blog.content,
        category: blog.category,
        owner: ownerViewModel(blog.owner),
        followList: blog.followList.map(followListViewModel),
        createdAt: blog.createdAt,
    }
}

function ownerViewModel(owner) {
    return {
        _id: owner._id,
        email: owner.email,
    };
}

function followListViewModel(followList) {
    return {
        _id: followList._id,
        email: followList.email,
    };
}

module.exports = {
    mapErrors,
    blogViewModel,
};