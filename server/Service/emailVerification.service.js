import crypto from 'crypto'
import { sendEmail } from '../utils/sendEmail.js'
import User from '../Model/auth.model.js'
import renderVerifyEmail from '../utils/generate_code.js'

// How long a verification link stays valid (15 minutes), in milliseconds.
const VERIFICATION_TOKEN_TTL = 15 * 60 * 1000

/**
 * Loads the (unverified) user for `userId`, generates a fresh one-time token,
 * stores only its SHA-256 hash on the account and emails the raw token as part
 * of the verification link.
 *
 * @param {string} userId  Id of the signed-in user requesting a (re)send.
 * @returns {Promise<{message: string}>}
 */
export const sendEmailVerification = async (userId) => {
    const user = await User.findById(userId)

    if (!user) {
        const error = new Error('User not found')
        error.status = 404
        throw error
    }

    // Checked on the document instance — `User.isEmailVerified` reads a static
    // property that is always undefined, so the guard never fired.
    if (user.isEmailVerified) {
        const error = new Error('Your email is already verified')
        error.status = 409
        throw error
    }

    const token = crypto.randomBytes(32).toString('hex')

    // Only the hash is stored, so a leaked database cannot be used to verify
    // any account directly.
    user.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex')
    user.emailVerificationTokenExpire = new Date(Date.now() + VERIFICATION_TOKEN_TTL)

    await user.save()

    const clientURL = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '')
    const verificationURL = `${clientURL}/verify-email?token=${token}`

    const html = renderVerifyEmail(user.name, verificationURL)

    // sendEmail expects a single options object.
    await sendEmail({
        email: user.email,
        subject: 'Verify your CampusConnect email',
        html
    })

    return {
        message: 'Verification link sent to your email'
    }
}

/**
 * Consumes the raw token from the emailed link: hashes it, finds the matching
 * unexpired account and flips `isEmailVerified`.
 *
 * @param {string} token  The raw token from `?token=...`.
 * @returns {Promise<{message: string}>}
 */
export const verifyEmailService = async (token) => {
    if (!token || typeof token !== 'string') {
        const error = new Error('Verification token is required')
        error.status = 400
        throw error
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationTokenExpire: { $gt: new Date() }
    })

    if (!user) {
        const error = new Error('Invalid or expired verification link')
        error.status = 400
        throw error
    }

    user.isEmailVerified = true
    user.emailVerificationToken = null
    user.emailVerificationTokenExpire = null

    await user.save()

    return {
        message: 'Email verified successfully'
    }
}

/**
 * Resend by email for the sign-up flow: the account cannot sign in until the
 * address is verified, so no session can be required here. Unknown or
 * already-verified addresses get the same reply, so this endpoint cannot be
 * used to probe which emails are registered, and a short cooldown keeps it
 * from flooding an inbox.
 *
 * @param {string} email  The address used at sign-up.
 * @returns {Promise<{message: string}>}
 */
export const resendVerificationByEmail = async (email) => {
    const reply = {
        message: 'If that address belongs to an unverified account, a new link is on its way'
    }

    if (!email || typeof email !== 'string') {
        const error = new Error('Email is required')
        error.status = 400
        throw error
    }

    // The token fields are `select: false`, so they must be pulled in
    // explicitly — without this the cooldown below can never see the token
    // that register just minted.
    const user = await User.findOne({ email: email.trim().toLowerCase() })
        .select('+emailVerificationToken +emailVerificationTokenExpire')

    if (!user || user.isEmailVerified) {
        return reply
    }

    // The cooldown runs from when the current link was minted (the full TTL
    // minus whatever is left of it).
    const issuedAt = user.emailVerificationTokenExpire
        ? user.emailVerificationTokenExpire.getTime() - VERIFICATION_TOKEN_TTL
        : 0

    if (user.emailVerificationToken && Date.now() - issuedAt < 60 * 1000) {
        const error = new Error('Please wait a minute before requesting another link')
        error.status = 429
        throw error
    }

    await sendEmailVerification(user._id)

    return reply
}