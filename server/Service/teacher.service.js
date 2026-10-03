import TeacherModel from '../Model/teacher.model.js'
import { scrapeComsatsTeachers } from '../Service/comsats.service.js'

// Columns the review surfaces read. The faculty list is a few thousand rows, so
// the list endpoint returns only these instead of the whole document.
const DIRECTORY_FIELDS =
    'name uid designation department campus image profileUrl'

export const getAllTeacher = async () => {
    return await TeacherModel.find()
        .select(DIRECTORY_FIELDS)
        .sort({ name: 1 })
        .lean()
}

export const getTeacherById = async (id) => {
    return await TeacherModel.findById(id)
}

export const scrapeAndSaveTeachers = async () => {

    const teachers = await scrapeComsatsTeachers()

    if (!teachers.length) {
        return { total: 0, created: 0, updated: 0 }
    }

    const scrapedAt = new Date()

    // One upsert per teacher, keyed on the COMSATS uid, so re-running the sync
    // refreshes the directory instead of duplicating it. A single bulkWrite also
    // replaces the per-teacher findOne round trip the loop used to make.
    const result = await TeacherModel.bulkWrite(
        teachers.map((teacher) => ({
            updateOne: {
                filter: { uid: teacher.uid },
                update: {
                    $set: {
                        ...teacher,
                        source: 'COMSATS',
                        lastScrapedAt: scrapedAt,
                    },
                },
                upsert: true,
            },
        })),
        { ordered: false }
    )

    return {
        total: teachers.length,
        created: result.upsertedCount,
        updated: result.matchedCount,
    }

}