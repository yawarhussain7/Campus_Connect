import api from './axios';

export const Uploadassignment = (assignmentData) => {
    return api.post('/assignment/upload', assignmentData)
}
