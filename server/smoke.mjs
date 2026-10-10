
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

import User from './Model/auth.model.js'
import Assignment from './Model/assignment.model.js'
import PastPaper from './Model/pastpaper.model.js'
import Project from './Model/project.model.js'
import Review from './Model/review.model.js'

const BASE = process.env.SMOKE_BASE_URL || 'http://localhost:8080'
const stamp = Date.now()
const credentials = {
  name: 'Smoke Test Student',
  email: `smoke-${stamp}@example.com`,
  password: 'smoke-pass-123',
  gender: 'male',
}

const results = []
let cookie = ''

const record = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

const parseSetCookie = (res) => {
  const raw = typeof res.headers.getSetCookie === 'function'
    ? res.headers.getSetCookie()
    : [res.headers.get('set-cookie')].filter(Boolean)
  return raw
    .filter(Boolean)
    .map((c) => c.split(';')[0])
    .join('; ')
}

const call = async (method, path, { body, formData, expect, responseType = 'json' } = {}) => {
  const headers = {}
  if (cookie) headers.cookie = cookie
  if (body && !formData) headers['content-type'] = 'application/json'

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: formData || (body ? JSON.stringify(body) : undefined),
  })

  const setCookie = parseSetCookie(res)
  if (setCookie) cookie = setCookie

  let payload = null
  if (responseType === 'blob') {
    const buf = Buffer.from(await res.arrayBuffer())
    payload = { bytes: buf.length }
  } else {
    try {
      payload = await res.json()
    } catch {
      payload = null
    }
  }

  const ok = res.status === expect
  record(`${method} ${path} -> ${expect}`, ok, ok ? `got ${res.status}` : `got ${res.status}: ${JSON.stringify(payload)?.slice(0, 200)}`)
  return { status: res.status, payload }
}

/** Tiny PDF header is enough for the mimetype-based multer filters. */
const pdfBytes = Buffer.from('%PDF-1.4\n% smoke test\n%%EOF\n')
const makePdfForm = (fields) => {
  const form = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, String(value))
  }
  form.append('file', new Blob([pdfBytes], { type: 'application/pdf' }), 'smoke.pdf')
  return form
}

const verifyAccountDirectly = async (email) => {
  await mongoose.connect(process.env.MONGO_URI)
  await User.updateOne({ email }, { $set: { isEmailVerified: true } })
  await mongoose.disconnect()
}

/**
 * Removes every artefact this run (and earlier aborted runs) created, so the
 * development database and uploads/ folders stay clean between runs.
 */
const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const removeFile = (fileUrl) => {
      if (!fileUrl) return
      const abs = path.join(process.cwd(), fileUrl.replace(/^\//, ''))
      fs.rmSync(abs, { force: true })
    }

    const smokeEmail = /^smoke-\d+@example\.com$/
    const [assignments, papers, projects, users] = await Promise.all([
      Assignment.find({ title: 'Smoke assignment title' }),
      PastPaper.find({ subject: 'Smoke Paper Subject' }),
      Project.find({ title: 'Smoke project' }),
      User.find({ email: smokeEmail }),
    ])

    for (const doc of [...assignments, ...papers, ...projects]) removeFile(doc.fileUrl)
    for (const user of users) removeFile(user.avatar)

    await Assignment.deleteMany({ title: 'Smoke assignment title' })
    await PastPaper.deleteMany({ subject: 'Smoke Paper Subject' })
    await Project.deleteMany({ title: 'Smoke project' })
    await Review.deleteMany({ teacher: 'Smoke Teacher' })
    await User.deleteMany({ email: smokeEmail })

    console.log('\nCleaned up smoke-test rows and uploaded files')
  } catch (error) {
    console.error('Cleanup failed:', error.message)
  } finally {
    await mongoose.disconnect().catch(() => {})
  }
}

const main = async () => {
  console.log(`Smoke testing ${BASE}\n`)

  // 1. Public catalogue endpoints the portal renders without a session.
  await call('GET', '/student/assignments', { expect: 200 })
  await call('GET', '/student/past-papers', { expect: 200 })
  await call('GET', '/student/projects', { expect: 200 })
  await call('GET', '/student/reviews', { expect: 200 })
  await call('GET', '/cui-teachers', { expect: 200 })

  // 2. Protected endpoints must refuse an anonymous caller.
  cookie = ''
  await call('GET', '/student/me', { expect: 401 })
  await call('GET', '/student/dashboard', { expect: 401 })
  await call('GET', '/student/', { expect: 401 })

  // 3. Sign-up (email verification is applied directly to skip the real inbox).
  await call('POST', '/auth/signUp', { body: credentials, expect: 201 })
  await call('POST', '/auth/signUp', { body: credentials, expect: 409 })

  await verifyAccountDirectly(credentials.email)

  // 4. Sign-in: bad password rejected, good password issues the session cookie.
  cookie = ''
  await call('POST', '/auth/signIn', {
    body: { email: credentials.email, password: 'wrong-password' },
    expect: 401,
  })
  cookie = ''
  await call('POST', '/auth/signIn', {
    body: { email: credentials.email, password: credentials.password },
    expect: 200,
  })
  if (!cookie) record('session cookie issued on login', false, 'no set-cookie header')
  else record('session cookie issued on login', true)

  // 5. Profile (Settings page + AppContext bootstrap).
  const me = await call('GET', '/student/me', { expect: 200 })
  if (me.payload?.data?.email === credentials.email) {
    record('/student/me returns the signed-in student', true)
  } else {
    record('/student/me returns the signed-in student', false, JSON.stringify(me.payload?.data?.email))
  }
  await call('PUT', '/student/update', {
    body: { name: 'Smoke Test Student', gender: 'male' },
    expect: 200,
  })
  // Avatar upload (multipart, field name `avatar`).
  {
    const form = new FormData()
    form.append('name', 'Smoke Test Student')
    form.append('avatar', new Blob([Buffer.from([0xff, 0xd8, 0xff, 0xd9])], { type: 'image/jpeg' }), 'avatar.jpg')
    await call('PUT', '/student/update', { formData: form, expect: 200 })
  }

  // 6. Dashboard + notifications.
  const dash = await call('GET', '/student/dashboard', { expect: 200 })
  if (dash.payload?.data && typeof dash.payload.data === 'object') {
    record('dashboard payload has data', true)
  } else {
    record('dashboard payload has data', false, JSON.stringify(dash.payload)?.slice(0, 200))
  }
  const notes = await call('GET', '/student/', { expect: 200 })
  const firstNote = Array.isArray(notes.payload?.data) ? notes.payload.data[0] : null
  if (firstNote?._id) {
    await call('PUT', `/student/read/${firstNote._id}`, { expect: 200 })
  }
  await call('PUT', '/student/read-all', { expect: 200 })

  // 7. Assignments: upload -> list -> download.
  const assignment = await call('POST', '/student/upload', {
    formData: makePdfForm({
      title: 'Smoke assignment title',
      description: 'Automated smoke test assignment description',
      subject: 'Smoke Subject',
      instructor: 'Smoke Instructor',
      semester: 'Semester 4',
      course: 'CS101',
      dueDate: '2026-12-01',
      status: 'Pending',
    }),
    expect: 201,
  })
  const assignmentId = assignment.payload?.data?._id
  if (assignmentId) {
    const list = await call('GET', '/student/assignments', { expect: 200 })
    const found = (list.payload?.data || []).some((row) => row._id === assignmentId)
    record('uploaded assignment appears in the list', found)
    const dl = await call('GET', `/student/download/${assignmentId}`, { expect: 200, responseType: 'blob' })
    record('assignment download returns bytes', dl.payload.bytes > 0, `${dl.payload.bytes} bytes`)
  }

  // 8. Past papers: upload -> list -> download.
  const paper = await call('POST', '/student/past-papers/upload', {
    formData: makePdfForm({
      subject: 'Smoke Paper Subject',
      instructor: 'Smoke Instructor',
      semester: 'Semester 6',
      exam: 'Mid',
      year: '2025',
      hasSolution: 'true',
      batch: '2023',
      department: 'Computer Science',
    }),
    expect: 201,
  })
  const paperId = paper.payload?.data?._id
  if (paperId) {
    const list = await call('GET', '/student/past-papers', { expect: 200 })
    const found = (list.payload?.data || []).some((row) => row._id === paperId)
    record('uploaded paper appears in the list', found)
    await call('GET', `/student/past-papers/download/${paperId}`, { expect: 200, responseType: 'blob' })
  }

  // 9. Projects: upload (with repo) -> list -> download.
  const project = await call('POST', '/student/projects/upload', {
    formData: makePdfForm({
      title: 'Smoke project',
      desc: 'Automated smoke test project description',
      course: 'CS201',
      subject: 'Software Engineering',
      dueDate: '2026-12-15',
      status: 'Submitted',
      repo: 'https://github.com/example/smoke',
      semester: 'Semester 6',
      department: 'Computer Science',
    }),
    expect: 201,
  })
  const projectId = project.payload?.data?._id
  if (projectId) {
    const list = await call('GET', '/student/projects', { expect: 200 })
    const found = (list.payload?.data || []).some((row) => row._id === projectId)
    record('uploaded project appears in the list', found)
    await call('GET', `/student/projects/download/${projectId}`, { expect: 200, responseType: 'blob' })
  }

  // 10. Teacher review: list -> publish (a duplicate must answer 409, not 500).
  await call('GET', '/student/reviews', { expect: 200 })
  const reviewBody = {
    teacher: 'Smoke Teacher',
    rating: 5,
    comment: 'Clear explanations and fair assessments.',
    courseCode: 'CS101',
    courseName: 'Introduction to Computing',
    semester: 'Semester 4',
  }
  await call('POST', '/student/reviews', { body: reviewBody, expect: 201 })
  await call('POST', '/student/reviews', { body: reviewBody, expect: 409 })

  // 11. Sign-out ends the session.
  await call('POST', '/auth/logout', { expect: 200 })
  await call('GET', '/student/me', { expect: 401 })

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
  if (failed.length) {
    console.log('Failing checks:')
    for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`)
  }

  await cleanup()
  process.exit(failed.length ? 1 : 0)
}

main().catch((error) => {
  console.error('Smoke test crashed:', error)
  process.exit(1)
})

