import { getUser } from '../Service/auth.service.js'
import {
    createReviewService,
    getAllReviewService,
    findTeacherByNameService,
    totalReviewService
} from '../Service/review.service.js'

import { ReviewSchemaZod } from '../validation/review.validation.js'

// CREATE — the reviewer's identity always comes from the session, never the body.
export const createReview = async (req, res) => {
    try {
        const validate = ReviewSchemaZod.safeParse(req.body)

        if (!validate.success) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data',
                errors: validate.error.flatten().fieldErrors,
            })
        }

        const reviewer = req.user?.id ? await getUser(req.user.id) : null

        // The directory (when it has been synced) is what knows the teacher's
        // designation, photo and campus, so a review borrows them from there.
        const teacher = await findTeacherByNameService(validate.data.teacher)

        const review = await createReviewService({
            ...validate.data,
            student: reviewer?.name || 'Anonymous',
            studentId: reviewer?._id,
            teacherId: teacher?._id,
            teacherRole: validate.data.teacherRole || teacher?.designation || '',
            teacherAvatar: validate.data.teacherAvatar || teacher?.image || '',
            campus: validate.data.campus || teacher?.campus || '',
        })

        res.status(201).json({
            success: true,
            message: 'Review published successfully',
            data: review,
        })
    } catch (error) {
        console.error('Review publish error:', error)
        // Services mark client-side failures (duplicate review) with a `status`;
        // only a genuinely unexpected error stays a 500.
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to publish the review',
        })
    }
}

// GET ALL
export const ShowReviews = async (req, res) => {
    try {
        const reviews = await getAllReviewService()

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const ShowTotalReviewsController = async (req, res) => {
    try {
        const totalReviews = await totalReviewService()
        return res.status(200).json({
            message: 'reviews found successfully',
            success: true,
            data: totalReviews
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}