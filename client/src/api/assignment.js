import api from './axios';

export const Uploadassignment = (assignmentData) => {
    return api.post('/student/upload', assignmentData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const ShowAllassignment = ()=>{
    return api.get('/student/assignments')
}
export const downloadAssignment = (id) => {
    return api.get(`/student/download/${id}`, {
        responseType: 'blob'
    })
}
