import { Navigate, Outlet } from "react-router-dom";

import { readSession } from "../../lib/session";

/**
 * Sends anyone without a valid admin session to the sign-in page. The stored
 * session must carry the `admin` role the server reported at sign-in, so a
 * hand-edited localStorage entry (which cannot forge the httpOnly cookie the
 * API needs anyway) grants nothing on its own.
 */
export default function RequireAuth() {
  const session = readSession();

  if (!session || session.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
