import express from 'express'

import { getTotalAssignmentController,ShowAssignments } from '../Controller/assignment.controller.js'
import {getTotalPaperController,GetPaper} from '../Controller/paper.controller.js'
import {projectCountController,ShowProjects} from '../Controller/project.controller.js'
import {ShowTotalReviewsController,ShowReviews} from '../Controller/review.controller.js'
import { createRecord, updateRecord, deleteRecord } from '../Controller/admin.controller.js'
import { AdminRoute } from '../middleware/verifyAdmin.js'

const Adminrouter = express.Router()

// Every admin endpoint reads or writes the live database, so the whole router
// sits behind the role check: a valid student session gets a 403 here.
Adminrouter.use(AdminRoute)

Adminrouter.get('/assignments',getTotalAssignmentController)
Adminrouter.get('/assignments/all',ShowAssignments)

Adminrouter.get('/papers',getTotalPaperController)
Adminrouter.get('/papers/all',GetPaper)

Adminrouter.get('/projects',projectCountController)
Adminrouter.get('/projects/all',ShowProjects)

Adminrouter.get('/reviews',ShowTotalReviewsController)
Adminrouter.get('/reviews/all',ShowReviews)

// Full CRUD for the four collections the console manages. The `:id` routes are
// declared last so they can never shadow the `/…/all` list endpoints above.
const COLLECTIONS = ['assignments', 'papers', 'projects', 'reviews']

for (const collection of COLLECTIONS) {
    Adminrouter.post(`/${collection}`, createRecord(collection))
    Adminrouter.put(`/${collection}/:id`, updateRecord(collection))
    Adminrouter.delete(`/${collection}/:id`, deleteRecord(collection))
}

export default Adminrouter