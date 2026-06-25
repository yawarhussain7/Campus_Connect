import express from 'express'
import { ProtectedRoute } from '../middleware/verifyToken.js'
import { getNotificationsController, markAsReadController, markAllAsReadController } from '../Controller/notification.controller.js'

const notificationRoute = express.Router()

notificationRoute.get('/', ProtectedRoute, getNotificationsController)
notificationRoute.put('/read/:id', ProtectedRoute, markAsReadController)
notificationRoute.put('/read-all', ProtectedRoute, markAllAsReadController)

export default notificationRoute