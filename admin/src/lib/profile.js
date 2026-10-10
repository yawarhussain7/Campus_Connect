// The profile the shell shows is whatever Settings last saved — Settings
// keeps that copy in step with the server (GET/PUT /admin/profile).

import { readSession } from "./session";

const STORAGE_KEY = "campus-connect-admin:settings:v1";

export const DEFAULT_PROFILE = {
  name: "Yawar Hussain",
  email: "yawarhussain793@gmail.com",
  role: "Administrator",
  avatar: null,
};

/** The stored role 'admin' reads back as the display label Settings uses. */
export function displayRole(role) {
  return role === "admin" ? "Administrator" : role || DEFAULT_PROFILE.role;
}

/** Current profile, falling back to the signed-in session, then the seed. */
export function readProfile() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      // Fresh sign-in, Settings never opened: show the account Login saved.
      const session = readSession();

      if (!session) return DEFAULT_PROFILE;

      return {
        name: String(session.name || DEFAULT_PROFILE.name),
        email: String(session.email || DEFAULT_PROFILE.email),
        role: displayRole(session.role),
        avatar: session.avatar || null,
      };
    }

    const stored = JSON.parse(raw);

    return {
      name: String(stored?.name || DEFAULT_PROFILE.name),
      email: String(stored?.email || DEFAULT_PROFILE.email),
      role: displayRole(stored?.role),
      avatar: stored?.avatar || null,
    };
  } catch {
    // Unreadable JSON or a blocked localStorage: show the default profile.
    return DEFAULT_PROFILE;
  }
}
