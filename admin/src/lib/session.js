// A tiny stand-in for real authentication: the console runs on local sample
// data, so signing in only records who is signed in for this browser.

const STORAGE_KEY = "campus-connect-admin:session:v1";

/** The signed-in admin, or null when there is no usable session. */
export function readSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    const session = JSON.parse(raw);

    if (!session || typeof session.email !== "string") return null;

    return session;
  } catch {
    // Unreadable JSON or a blocked localStorage: treat as signed out.
    return null;
  }
}

/** Records a signed-in admin so the shell survives a reload. */
export function saveSession(session) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...session, signedInAt: new Date().toISOString() })
    );
  } catch {
    // A full or disabled localStorage must not break sign-in.
  }
}

/** Forgets the current admin. */
export function clearSession() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clean up when storage is unavailable.
  }
}
