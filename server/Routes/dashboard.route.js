import express from 'express'
import {dashboardStat} from '../Controller/dashboard.controller.js'

const dashboartRoute = express.Router()
dashboartRoute.get('/dashboard',dashboardStat)

export default dashboartRoute;
