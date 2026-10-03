import api from './axios.js';

/**
 * GET /student/reviews -> every teacher review, newest first.
 * The axios interceptor already unwraps the body, so this resolves to
 * `{ success, count, data: [...] }`.
 */
export const ShowReviews = () => {
    return api.get('/student/reviews');
};

/** POST /student/reviews -> publishes a review under the signed-in student. */
export const CreateReview = (reviewData) => {
    return api.post('/student/reviews', reviewData);
};
