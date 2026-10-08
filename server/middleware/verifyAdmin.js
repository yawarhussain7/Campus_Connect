import jwt from "jsonwebtoken";
import User from "../Model/auth.model.js";

/**
 * Guards every /admin route: the JWT cookie is verified exactly like
 * ProtectedRoute, then the account's role is re-checked against the database so
 * a stale token from before a role change cannot keep admin access.
 *
 * 401 = no/invalid session, 403 = signed in but not an admin.
 */
export const AdminRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    let decode;

    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      const expired = error.name === "TokenExpiredError";

      return res.status(401).json({
        success: false,
        message: expired
          ? "Session expired, please sign in again"
          : "Invalid token, please sign in again",
      });
    }

    const user = await User.findById(decode.id).select("role email name");

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    req.user = { id: user._id, email: user.email, name: user.name, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
};