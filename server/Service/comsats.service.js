import axios from 'axios'
// cheerio 1.x is ESM-only and ships no default export. The previous
// `import cheerio from 'cheerio'` threw "does not provide an export named
// 'default'" the moment this module loaded, taking the whole server down.
import { load } from 'cheerio'
// to get the teacher data for the cui website it will extract the data and sent 
const COMSATS_URL =
    "https://ww2.comsats.edu.pk/faculty/FacultyAtoZ.aspx";



/** Every faculty card links here, and the uid is what identifies the teacher. */
const FACULTY_LINK = /FacultyDetails\.aspx\?Uid=(\d+)/i;

/** Collapses a card's text into its non-empty, whitespace-normalised lines. */
const cardLines = ($, card) =>
    $(card)
        .text()
        .split("\n")
        .map((line) => line.replace(/\s+/g, " ").trim())
        .filter(Boolean);

/**
 * Reads one faculty card. A card reads
 *   Name / Designation / <Department> / "Department," / <Campus> / "Campus"
 * so the two label lines mark where the department and the campus end.
 */
const parseFacultyCard = ($, card) => {
    const link = $(card).find("a[href*=FacultyDetails]").first()
    const href = link.attr("href")
    const match = String(href || "").match(FACULTY_LINK)

    const name = link.text().replace(/\s+/g, " ").trim()

    if (!match || !name) {
        return null;
    }

    const lines = cardLines($, card)
    const departmentIndex = lines.indexOf("Department,")
    const campusIndex = lines.indexOf("Campus")

    return {
        uid: match[1],
        name,
        designation:
            departmentIndex > 0
                ? lines.slice(1, departmentIndex - 1).join(" ")
                : lines[1] || "",
        department: departmentIndex > 0 ? lines[departmentIndex - 1] : "",
        campus: campusIndex > 0 ? lines[campusIndex - 1] : "",
        profileUrl: new URL(href, COMSATS_URL).href,
    }
}

export const scrapeComsatsTeachers = async () => {
    try {
        const response = await axios.get(COMSATS_URL, {
            timeout: 30000,
            // The page is HTML, so make sure axios hands it over unparsed.
            responseType: "text",

            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/142.0 Safari/537.36",
            }
        })

        const $ = load(response.data)

        // Reading the cards (instead of every anchor) keeps navigation links such
        // as "Forgot Password" out of the list, and the uid de-duplicates the
        // teachers the A-Z page repeats across rows.
        const teachersByUid = new Map()

        $("table td").each((index, card) => {
            const teacher = parseFacultyCard($, card)

            if (teacher && !teachersByUid.has(teacher.uid)) {
                teachersByUid.set(teacher.uid, teacher)
            }
        })

        return [...teachersByUid.values()]

    } catch (error) {
        console.error(
            "COMSATS scraping error:",
            error.message
        );

        throw new Error("Unable to scrape COMSATS faculty data");
    }
}

