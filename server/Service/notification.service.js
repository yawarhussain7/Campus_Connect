import Notification from "../Model/notification.model.js";

export const getNotifications = async(userId)=>{
    try{
        const notifications = await Notification.find({userId}).sort({createdAt: -1})
        return notifications
    }catch(error){
        console.error(error)
        throw new Error(error.message)
    }
}

export const markAsRead = async(notificationId, userId)=>{
    try{
        const notification = await Notification.findOneAndUpdate(
            {_id: notificationId, userId},
            {isRead: true},
            {new: true}
        )
        if(!notification) throw new Error('Notification not found')
        return notification
    }catch(error){
        console.error(error)
        throw new Error(error.message)
    }
}

export const markAllAsRead = async(userId)=>{
    try{
        await Notification.updateMany(
            {userId, isRead: false},
            {isRead: true}
        )
        return true
    }catch(error){
        console.error(error)
        throw new Error(error.message)
    }
}

export const createNotification = async(userId, title, message, type='info', link=null)=>{
    try{
        const notification = await Notification.create({userId, title, message, type, link})
        return notification
    }catch(error){
        console.error(error)
        throw new Error(error.message)
    }
}