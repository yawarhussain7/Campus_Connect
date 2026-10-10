import jwt from "jsonwebtoken";
import User from "../Model/auth.model.js";

export const AdminRoute = async (req, res, next) => {
  try {

    const candidates = [req.cookies?.admin_token, req.cookies?.token].filter(
      Boolean
    );

    if (candidates.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    let decode = null;
    let expired = false;

    for (const candidate of candidates) {
      try {
        decode = jwt.verify(candidate, process.env.JWT_SECRET);
        break;
      } catch (error) {
        // Try the next cookie; only remember expiry for the message below.
        if (error.name === "TokenExpiredError") expired = true;
      }
    }

    if (!decode) {
      return res.status(401).json({
        success: false,
        message: expired
          ? "Session expired, please sign in again"
          : "Invalid token, please sign in again",
      });
    }

    const user = await User.findById(decode.id).select("role email name isblock");

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }
    if (user.isblock) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Contact an administrator to restore access.",
        code: "ACCOUNT_BLOCKED",
      });
    }

    req.user = { id: user._id, email: user.email, name: user.name, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
};