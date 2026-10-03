// Who is allowed to sign in to the admin console.
//
// This console runs entirely in the browser on local sample data, so the check
// below is demo-grade: anyone able to read this bundle can read the password.
// A production deployment must verify the credentials on the API instead — the
// server already stores a `role` of 'user' | 'admin' on every account — and this
// file should then keep only the non-secret identity details.

/**
 * Accounts allowed into the admin panel. These mirror the admin created by the
 * `server/seed.js` script (name, email and password); that file cannot be
 * imported here because it opens a database connection on load. Add an entry to
 * let another admin in; the email is matched case-insensitively.
 *
 * Seeded admin: yawarhussain793@gmail.com / yawar793
 */
export const ADMIN_ACCOUNTS = [
  {
    name: "Yawar Hussain",
    email: "yawarhussain793@gmail.com",
    password: "yawar793",
    role: "Administrator",
  },
];

/** The public identity of an account, without the password. */
function toProfile(account) {
  return { name: account.name, email: account.email, role: account.role };
}

/** The allowlisted admin with this email, or null. Case-insensitive. */
export function findAdminByEmail(email) {
  const needle = String(email ?? "").trim().toLowerCase();

  if (!needle) return null;

  return (
    ADMIN_ACCOUNTS.find((account) => account.email.toLowerCase() === needle) ?? null
  );
}

/** True when the email belongs to an allowlisted admin. */
export function isAdminEmail(email) {
  return findAdminByEmail(email) !== null;
}

/**
 * Returns the admin's profile when both the email and password match an
 * allowlisted account, otherwise null.
 */
export function verifyAdminCredentials(email, password) {
  const account = findAdminByEmail(email);

  if (!account || account.password !== String(password ?? "")) return null;

  return toProfile(account);
}
