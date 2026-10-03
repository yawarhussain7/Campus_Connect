import api, { API_BASE_URL } from './axios.js'

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

/** Absolute URL for an uploaded PDF so it can be opened in a new tab. */
export const paperFileUrl = (fileUrl)=>{
    if (!fileUrl) return ''
    if (/^https?:\/\//i.test(fileUrl)) return fileUrl

    return `${API_BASE_URL}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`
}