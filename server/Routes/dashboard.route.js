import express from 'express'
import {dashboardStat} from '../Controller/dashboard.controller.js'
import { ProtectedRoute } from '../middleware/verifyToken.js';

const dashboartRoute = express.Router()
dashboartRoute.get('/dashboard',ProtectedRoute,dashboardStat)

export default dashboartRoute;
