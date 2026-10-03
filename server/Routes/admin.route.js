import express from 'express'

import { getTotalAssignmentController } from '../Controller/assignment.controller.js'
import {getTotalPaperController} from '../Controller/paper.controller.js'
import {projectCountController} from '../Controller/project.controller.js'
import {ShowTotalReviewsController} from '../Controller/review.controller.js'

const Adminrouter = express.Router()

Adminrouter.get('/assignments',getTotalAssignmentController)
Adminrouter.get('/papers',getTotalPaperController)
Adminrouter.get('/projects',projectCountController)
Adminrouter.get('/reviews',ShowTotalReviewsController)

export default Adminrouter