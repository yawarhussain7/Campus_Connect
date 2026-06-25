import api from './axios';

export const Uploadassignment = (assignmentData) => {
    return api.post('/assignment/upload', assignmentData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const ShowAllassignment = ()=>{
    return api.get('/assignment/assignments')
}
export const downloadAssignment = (filename) => {
    return api.get(`/assignment/download/${filename}`, {
        responseType: 'blob'
    })
}
