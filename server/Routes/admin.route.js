import express from 'express'

import { getTotalAssignmentController,ShowAssignments } from '../Controller/assignment.controller.js'
import {getTotalPaperController,GetPaper} from '../Controller/paper.controller.js'
import {projectCountController,ShowProjects} from '../Controller/project.controller.js'
import {ShowTotalReviewsController,ShowReviews} from '../Controller/review.controller.js'
import { createRecord, updateRecord, deleteRecord, listUsers, countUsers, createUser, updateUser, deleteUser, verifyUserEmail, blockUser } from '../Controller/admin.controller.js'
import { getProfileController, updateProfileController } from '../Controller/profile.controller.js'
import { uploadAvatar } from '../middleware/profileUpload.middleware.js'
import { AdminRoute } from '../middleware/verifyAdmin.js'

const Adminrouter = express.Router()


Adminrouter.use(AdminRoute)

Adminrouter.get('/profile', getProfileController)
Adminrouter.put('/profile', uploadAvatar, updateProfileController)

Adminrouter.get('/assignments',getTotalAssignmentController)
Adminrouter.get('/assignments/all',ShowAssignments)

Adminrouter.get('/papers',getTotalPaperController)
Adminrouter.get('/papers/all',GetPaper)

Adminrouter.get('/projects',projectCountController)
Adminrouter.get('/projects/all',ShowProjects)

Adminrouter.get('/reviews',ShowTotalReviewsController)
Adminrouter.get('/reviews/all',ShowReviews)

// Registered accounts: list + counter plus full CRUD — passwords are hashed by
// the service, responses never carry secret fields, and deleting your own
// account is refused.
Adminrouter.get('/users', countUsers)
Adminrouter.get('/users/all', listUsers)
Adminrouter.post('/users', createUser)
Adminrouter.put('/users/:id', updateUser)
Adminrouter.delete('/users/:id', deleteUser)

// Targeted account flags: mark an address verified without the emailed link,
// and block / unblock (body { isblock }). The two-segment paths are declared
// after the plain `:id` routes — Express matches the full path, so they can
// never shadow PUT /users/:id. Blocking applies immediately: both auth
// middlewares re-read `isblock` from the database on every request.
Adminrouter.put('/users/:id/verify-email', verifyUserEmail)
Adminrouter.put('/users/:id/block', blockUser)

// Full CRUD for the four collections the console manages. The `:id` routes are
// declared last so they can never shadow the `/…/all` list endpoints above.
const COLLECTIONS = ['assignments', 'papers', 'projects', 'reviews']

for (const collection of COLLECTIONS) {
    Adminrouter.post(`/${collection}`, createRecord(collection))
    Adminrouter.put(`/${collection}/:id`, updateRecord(collection))
    Adminrouter.delete(`/${collection}/:id`, deleteRecord(collection))
}

export default Adminrouter