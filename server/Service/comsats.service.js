import axios from 'axios'
import { load } from 'cheerio'
import dotenv from 'dotenv'

dotenv.config()

const COMSATS_URL = process.env.TEACHER_DATA_URL?.trim()
const REQUEST_TIMEOUT_MS = 30_000

const normaliseText = (value = '') => value.replace(/\s+/g, ' ').trim()

const valueFromLabel = ($, card, labelId) =>
    normaliseText($(card).find(`[id$="${labelId}"]`).first().text())

const parseFacultyCard = ($, card, sourceUrl) => {
    const link = $(card).find(`a[href*="FacultyDetails.aspx"]`).first()
    const href = link.attr('href')

    if (!href) return null

    let profileUrl
    try {
        profileUrl = new URL(href, sourceUrl)
    } catch {
        return null
    }

    const uid = profileUrl.searchParams.get('Uid')
    const name = normaliseText(link.text())

    if (!uid || !name) return null

    const designation = valueFromLabel($, card, 'Label3')
    const department = valueFromLabel($, card, 'Label5')
    const campus = valueFromLabel($, card, 'Label6')

    return {
        uid,
        name,
        designation,
        department,
        campus,
        profileUrl: profileUrl.href,
    }
}

export const scrapeComsatsTeachers = async () => {
    if (!COMSATS_URL) {
        throw new Error('TEACHER_DATA_URL is not configured')
    }

    let response
    try {
        response = await axios.get(COMSATS_URL, {
            timeout: REQUEST_TIMEOUT_MS,
            responseType: 'text',
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (compatible; CampusConnectFacultyDirectory/1.0)',
            },
        })
    } catch (error) {
        console.error('COMSATS directory request failed:', error.message)
        throw new Error(
            `Unable to fetch COMSATS faculty directory${error.response?.status ? ` (HTTP ${error.response.status})` : ''}`
        )
    }

    const $ = load(response.data)
    const teachersByUid = new Map()

    // The source is an ASP.NET DataList rendered as table cells. Scanning the
    // faculty links directly avoids relying on a particular table nesting.
    $('a[href*="FacultyDetails.aspx"]').each((_, link) => {
        const anchor = $(link)
        const card = anchor.closest('td').length
            ? anchor.closest('td')
            : anchor.parent()
        const teacher = parseFacultyCard($, card, COMSATS_URL)

        if (teacher && !teachersByUid.has(teacher.uid)) {
            teachersByUid.set(teacher.uid, teacher)
        }
    })

    if (!teachersByUid.size) {
        throw new Error(
            'No faculty profiles were found in the COMSATS directory response; the website markup may have changed'
        )
    }

    return [...teachersByUid.values()]
}
