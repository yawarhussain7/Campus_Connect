import { getNotifications, markAsRead, markAllAsRead } from "../Service/notification.service.js"

export const getNotificationsController = async(req,res)=>{
    try{
        const userId = req.user.id
        const notifications = await getNotifications(userId)
        res.status(200).send({
            success:true,
            data:notifications
        })
    }catch(error){
        console.error(error.message)
        res.status(500).send({
            message:'Internal Server Error',
            success:false,
            error:error.message
        })
    }
}

export const markAsReadController = async(req,res)=>{
    try{
        const userId = req.user.id
        const {id} = req.params
        const notification = await markAsRead(id, userId)
        res.status(200).send({
            success:true,
            message:"Notification marked as read",
            data:notification
        })
    }catch(error){
        console.error(error.message)
        res.status(500).send({
            message:'Internal Server Error',
            success:false,
            error:error.message
        })
    }
}

export const markAllAsReadController = async(req,res)=>{
    try{
        const userId = req.user.id
        await markAllAsRead(userId)
        res.status(200).send({
            success:true,
            message:"All notifications marked as read"
        })
    }catch(error){
        console.error(error.message)
        res.status(500).send({
            message:'Internal Server Error',
            success:false,
            error:error.message
        })
    }
}