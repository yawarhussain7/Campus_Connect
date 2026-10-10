import api from './axios.js';
export const ShowReviews = () => {
    return api.get('/student/reviews');
};
export const CreateReview = (reviewData) => {
    return api.post('/student/reviews', reviewData);
};
