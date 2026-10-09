import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Directory of this file. ESM has no __dirname, so derive it from the module URL.
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const templatePath = path.join(__dirname, 'verifyEmail.html')

// The template never changes while the server runs, so read it once on import.
const template = fs.readFileSync(templatePath, 'utf-8')

/**
 * Escapes a value before it is interpolated into the HTML email. Without this a
 * name containing markup would be injected straight into the message.
 */
const escapeHtml = (value = '') =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

/**
 * Fills the `verifyEmail.html` template: {{name}} and {{verificationURL}}.
 *
 * @param {string} name             Recipient's display name.
 * @param {string} verificationURL  Link that opens the app on the code screen.
 * @returns {string} The ready-to-send HTML body.
 */
const renderVerifyEmail = (name, verificationURL) => {
    return template
        .replaceAll('{{name}}', escapeHtml(name || 'there'))
        .replaceAll('{{verificationURL}}', escapeHtml(verificationURL))
}

export default renderVerifyEmail
