import TeacherModel from '../Model/teacher.model.js'
import { scrapeComsatsTeachers } from '../Service/comsats.service.js'

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
        throw new Error('COMSATS faculty scrape returned no teachers; no records were changed')
    }

    const scrapedAt = new Date()

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