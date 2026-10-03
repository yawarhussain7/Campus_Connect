// The profile the shell shows is whatever Settings last saved.

const STORAGE_KEY = "campus-connect-admin:settings:v1";

export const DEFAULT_PROFILE = {
  name: "Yawar Hussain",
  email: "yawarhussain793@gmail.com",
  role: "Administrator",
};

/** Current profile, falling back to the seeded admin when nothing is saved. */
export function readProfile() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return DEFAULT_PROFILE;

    const stored = JSON.parse(raw);

    return {
      name: String(stored?.name || DEFAULT_PROFILE.name),
      email: String(stored?.email || DEFAULT_PROFILE.email),
      role: String(stored?.role || DEFAULT_PROFILE.role),
    };
  } catch {
    // Unreadable JSON or a blocked localStorage: show the default profile.
    return DEFAULT_PROFILE;
  }
}
