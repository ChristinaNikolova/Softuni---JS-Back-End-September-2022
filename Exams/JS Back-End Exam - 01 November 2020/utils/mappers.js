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

function courseViewModel(course) {
    return {
        _id: course._id,
        title: course.title,
        description: course.description,
        image: course.image,
        duration: course.duration,
        creator: course.creator,
        students: course.students,
        studentsCount: course.studentsCount,
        createdAt: createdAtViewModel(course.createdAt),
    }
}

function createdAtViewModel(createdAt) {
    const result = createdAt.toLocaleDateString('en-US', { weekday: 'short' })
        + ' '
        + createdAt.toLocaleString('en-US', { month: 'short' })
        + ' '
        + createdAt.getDate()
        + ' '
        + createdAt.getHours()
        + ':'
        + createdAt.getMinutes()
        + ':'
        + createdAt.getSeconds();

    return result;
}

module.exports = {
    mapErrors,
    courseViewModel,
};