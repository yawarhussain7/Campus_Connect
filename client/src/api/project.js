import api from './axios.js';

export const uploadProject = (projectData) => {
    return api.post('/student/projects/upload', projectData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const ShowProjects = () => {
    return api.get('/student/projects')
}

export const downloadProject = (id) => {
    return api.get(`/student/projects/download/${id}`, {
        responseType: 'blob'
    })
}
