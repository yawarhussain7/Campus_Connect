import PastPaper from '../Model/pastpaper.model.js'

const  CreatePaperService = async(data)=>{
    return await PastPaper.create(data)
}

const GetPastPaperService = async()=>{
    return await PastPaper.find().sort({ createdAt: -1 })
}

const GetPaperByIdService = async(id)=>{
    return await PastPaper.findById(id)
}

const GetTotalPapaperService = async()=>{
    return await PastPaper.countDocuments()
}

export {
    CreatePaperService,
    GetPastPaperService,
    GetTotalPapaperService,
    GetPaperByIdService
}