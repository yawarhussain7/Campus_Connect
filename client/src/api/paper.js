import api from './axios.js'

export const PaperUpload = (paperData)=>{
    return api.post('/student/past-papers/upload',paperData,{
        headers:{
            'Content-Type':'multipart/form-data'
        }
    })
}
export const ShowPapers = ()=>{
    return api.get('/student/past-papers')
}

export const downloadPaper = (id)=>{
    return api.get(`/student/past-papers/download/${id}`,{
        responseType:'blob'
    })
}