import { Navigate, Outlet } from "react-router-dom";

import { isAdminEmail } from "../../lib/adminAuth";
import { readSession } from "../../lib/session";

/**
 * Sends anyone without a valid admin session to the sign-in page. The stored
 * session's email is re-checked against the allowlist so that a hand-edited
 * localStorage entry cannot grant access on its own.
 */
export default function RequireAuth() {
  const session = readSession();

  if (!session || !isAdminEmail(session.email)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
