import express from 'express'
import { createReview, ShowReviews } from '../Controller/review.controller.js'
import { ProtectedRoute } from '../middleware/verifyToken.js'

const reviewRoute = express.Router()

// Reading the reviews matches the other student catalogue endpoints; publishing
// one needs a session because the row is signed with the reviewer's name.
reviewRoute.get('/reviews', ShowReviews)

reviewRoute.post('/reviews', ProtectedRoute, createReview)

export default reviewRoute
