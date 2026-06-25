import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    type:{
        type: String,
        enum: ['info', 'success', 'warning', 'error'],
        default: 'info'
    },
    isRead:{
        type: Boolean,
        default: false
    },
    link:{
        type: String,
        default: null
    }
},{
    timestamps: true
})

const Notification = mongoose.model('Notification', NotificationSchema)
export default Notification