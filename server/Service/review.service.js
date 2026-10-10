import Review from '../Model/review.model.js'
import TeacherModel from '../Model/teacher.model.js'

// Create a review
export const createReviewService = async (data) => {
   
    const courseFilter = data.courseCode
        ? { courseCode: data.courseCode }
        : data.courseName
            ? { courseName: data.courseName }
            : {}

    const existingReview = await Review.findOne({
        teacher: data.teacher,
        // `null` (not `undefined`, which mongoose strips) keeps the check scoped
        // to the signed-in student instead of every reviewer of that teacher.
        studentId: data.studentId || null,
        ...courseFilter,
    })

    if (existingReview) {
        // A duplicate is the client's mistake, not a server fault — 409 so the
        // composer can show the message instead of "something went wrong".
        const error = new Error('You have already submitted a review for this teacher and course.')
        error.status = 409
        throw error
    }
    
    return await Review.create(data)
}

// Get every review, newest first
export const getAllReviewService = async () => {
    return await Review.find().sort({ createdAt: -1 })
}

/**
 * The directory entry for a teacher, matched on their name. Reviews are written
 * by name, so the designation, photo and campus are filled in from here when the
 * directory has been synced and left empty when it has not.
 */
export const findTeacherByNameService = async (name) => {
    if (!name) return null

    // The name is student-typed, so escape it before it becomes a pattern.
    const escaped = String(name).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    return await TeacherModel.findOne({
        name: { $regex: `^${escaped}$`, $options: 'i' },
    }).lean()
}

export const totalReviewService = async () => {
    return await TeacherModel.countDocuments()
}