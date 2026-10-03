import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Directory of this file. ESM has no __dirname, so derive it from the module URL.
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const templatePath = path.join(__dirname, 'resetPassword.html')

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
 * Fills the `resetPassword.html` template: {{name}} and {{resetURL}}.
 *
 * @param {string} name      Recipient's display name.
 * @param {string} resetURL  One-time link that opens the reset form.
 * @returns {string} The ready-to-send HTML body.
 */
const resetPasswordEmail = (name, resetURL) => {
    return template
        .replaceAll('{{name}}', escapeHtml(name || 'there'))
        .replaceAll('{{resetURL}}', escapeHtml(resetURL))
}

export default resetPasswordEmail
