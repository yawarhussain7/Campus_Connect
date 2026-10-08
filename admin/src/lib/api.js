
export const API_BASE_URL = "http://localhost:8080";

async function request(path, { method = "GET", body } = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      "Cannot reach the CampusConnect API — is the server running on port 8080?"
    );
  }

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    // Empty or non-JSON body: the status code below still decides the result.
  }

  if (!response.ok || payload?.success === false) {
    const error = new Error(
      payload?.message || `Request failed with status ${response.status}`
    );

    error.status = response.status;
    error.errors = payload?.errors;

    throw error;
  }

  return payload;
}

/** First zod field error, for a precise toast, when the API sent one. */
export function apiErrorMessage(error) {
  const first = Object.values(error?.errors ?? {})[0];

  return Array.isArray(first) && first.length > 0
    ? first[0]
    : error?.message || "Something went wrong";
}

/** Signs in and leaves the httpOnly token cookie on this origin. */
export const loginRequest = (email, password) =>
  request("/auth/signIn", { method: "POST", body: { email, password } });

export const logoutRequest = () => request("/auth/logout", { method: "POST" });

/** Asks the server to email a password-reset link (same flow the student app uses). */
export const forgotPasswordRequest = (email) =>
  request("/auth/forget-password", { method: "POST", body: { email } });

/** GET /admin/:collection/all — the raw Mongo documents, newest first. */
export const listRequest = async (collection) => {
  const payload = await request(`/admin/${collection}/all`);

  return payload.data ?? [];
};

export const createRequest = (collection, values) =>
  request(`/admin/${collection}`, { method: "POST", body: values });

export const updateRequest = (collection, id, values) =>
  request(`/admin/${collection}/${id}`, { method: "PUT", body: values });

export const deleteRequest = (collection, id) =>
  request(`/admin/${collection}/${id}`, { method: "DELETE" });