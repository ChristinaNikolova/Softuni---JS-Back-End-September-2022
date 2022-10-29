const Course = require('../models/Course');

async function getTopThree() {
    return Course.find({}).sort({ studentsCount: -1 }).limit(3);
}

async function getAll() {
    return Course.find({}).sort({ createdAt: 1 });
}

async function create(course) {
    let result = await getCourseByTitle(course.title);

    if (result) {
        throw new Error('Title is already taken');
    }

    result = new Course(course);
    await result.save();

    return result;
}

async function getById(id) {
    return Course.findById(id);
}

async function enroll(courseId, userId) {
    const course = await Course.findById(courseId);

    if (course.students.includes(userId)) {
        throw new Error('User is already enrolled');
    }

    course.students.push(userId);
    course.studentsCount++;
    await course.save();
}

async function deleteById(id) {
    return Course.findByIdAndDelete(id);
}

async function edit(id, updatedCourse) {
    const course = await Course.findById(id);

    if (course.title !== updatedCourse.title) {
        const result = await getCourseByTitle(updatedCourse.title);

        if (result) {
            throw new Error('Title is already taken');
        }
    }

    course.title = updatedCourse.title;
    course.description = updatedCourse.description;
    course.image = updatedCourse.image;
    course.duration = updatedCourse.duration;

    await course.save();
}

async function searchByTitle(search) {
    return (await Course.find({})).filter((c) => c.title.includes(search));
}

async function getCourseByTitle(title) {
    const course = await Course.findOne({ title }).collation({ locale: 'en', strength: 2 });
    return course;
}

module.exports = {
    getTopThree,
    getAll,
    create,
    getById,
    enroll,
    deleteById,
    edit,
    searchByTitle,
};
