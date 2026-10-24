import {
  listRecordsService,
  createRecordService,
  updateRecordService,
  deleteRecordService,
  createUserService,
  updateUserService,
  deleteUserService,
  verifyUserEmailService,
  setUserBlockService,
} from "../Service/admin.service.js";
import User from "../Model/auth.model.js";
import fs from "fs";
import { verifyEducationalContent } from "../Service/verifyEducationalContent.service.js";
import {
  AdminUserCreateZod,
  AdminUserUpdateZod,
  AdminUserBlockZod,
} from "../validation/user.validation.js";

const sendError = (res, error) =>
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Something went wrong",
    ...(error.errors ? { errors: error.errors } : {}),
  });

/** GET /admin/:collection/all — the list every admin screen renders. */
export const listRecords = (collection) => async (req, res) => {
  try {
    const data = await listRecordsService(collection);

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    sendError(res, error);
  }
};

/** POST /admin/:collection — create from the admin's record form. */
export const createRecord = (collection) => async (req, res) => {
  const file = req.file;
  let verifyingContent = false;

  try {
    const body = { ...(req.body ?? {}) };
    const needsVerifiedFile = collection === "assignments" || collection === "papers";

    if (collection === "papers") {
      body.year = body.year ? Number.parseInt(body.year, 10) : undefined;
      body.hasSolution = body.hasSolution === true || body.hasSolution === "true";
    }

    if (needsVerifiedFile && !file) {
      return res.status(400).json({
        success: false,
        message: "Upload the actual assignment or paper file.",
      });
    }

    if (needsVerifiedFile) {
      verifyingContent = true;
      const verification = await verifyEducationalContent(
        await fs.promises.readFile(file.path),
        {
          mimeType: file.mimetype,
          subject: body.subject,
          resourceType: collection === "papers" ? "past examination paper" : "assignment",
          metadata: {
            title: body.title,
            description: body.description,
            course: body.course,
            exam: body.exam,
            semester: body.semester,
            year: body.year,
            department: body.department,
          },
        }
      );
      verifyingContent = false;

      if (verification.status !== "approved") {
        await fs.promises.unlink(file.path).catch(() => {});
        return res.status(422).json({
          success: false,
          message: `Upload rejected: ${verification.reason || "the file is not verified as educational content related to the selected subject."}`,
        });
      }

      Object.assign(body, {
        fileUrl: `/uploads/${collection === "papers" ? "papers" : "assignments"}/${file.filename}`,
        fileName: file.filename,
        originalName: file.originalname,
        fileSize: file.size,
      });
    }

    const record = await createRecordService(collection, body, req.user?.id);

    res.status(201).json({
      success: true,
      message: "Record created successfully",
      data: record,
    });
  } catch (error) {
    if (file?.path) await fs.promises.unlink(file.path).catch(() => {});
    if (verifyingContent) {
      return res.status(503).json({
        success: false,
        message: "Educational content verification is unavailable. Please try again later.",
      });
    }
    sendError(res, error);
  }
};

/** PUT /admin/:collection/:id — full-form update, validated as a merged doc. */
export const updateRecord = (collection) => async (req, res) => {
  try {
    const record = await updateRecordService(collection, req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: record,
    });
  } catch (error) {
    sendError(res, error);
  }
};

/** DELETE /admin/:collection/:id */
export const deleteRecord = (collection) => async (req, res) => {
  try {
    await deleteRecordService(collection, req.params.id);

    res.status(200).json({ success: true, message: "Record deleted successfully" });
  } catch (error) {
    sendError(res, error);
  }
};

/**
 * GET /admin/users/all — every registered account, newest first. The password
 * is select:false on the model; the reset token fields are stripped here so
 * they never reach the browser, leaving only what the Users table shows.
 */
export const listUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-resetPasswordToken -resetPasswordTokenExpire")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    sendError(res, error);
  }
};

/** GET /admin/users — how many accounts exist (mirrors the other counters). */
export const countUsers = async (req, res) => {
  try {
    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: total,
    });
  } catch (error) {
    sendError(res, error);
  }
};

/** POST /admin/users — create an account (password is hashed in the service). */
export const createUser = async (req, res) => {
  try {
    const validate = AdminUserCreateZod.safeParse(req.body);

    if (!validate.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
        errors: validate.error.flatten().fieldErrors,
      });
    }

    const user = await createUserService(validate.data);

    res.status(201).json({ success: true, message: "User created successfully", data: user });
  } catch (error) {
    sendError(res, error);
  }
};

/** PUT /admin/users/:id — edit name / email / role, optionally reset password. */
export const updateUser = async (req, res) => {
  try {
    const validate = AdminUserUpdateZod.safeParse(req.body);

    if (!validate.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
        errors: validate.error.flatten().fieldErrors,
      });
    }

    const user = await updateUserService(req.params.id, validate.data);

    res.status(200).json({ success: true, message: "User updated successfully", data: user });
  } catch (error) {
    sendError(res, error);
  }
};

/** DELETE /admin/users/:id — removing your own account is refused (400). */
export const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.params.id, req.user?.id);

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    sendError(res, error);
  }
};

/**
 * PUT /admin/users/:id/verify-email — marks the account's address as verified
 * without the emailed link (404 unknown, 409 already verified). The updated,
 * secret-stripped account goes back so the Users table can refresh in place.
 */
export const verifyUserEmail = async (req, res) => {
  try {
    const user = await verifyUserEmailService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: user,
    });
  } catch (error) {
    sendError(res, error);
  }
};

/**
 * PUT /admin/users/:id/block — body { isblock: true|false } blocks or unblocks
 * the account. Refuses your own account (400) and a redundant state (409).
 */
export const blockUser = async (req, res) => {
  try {
    const validate = AdminUserBlockZod.safeParse(req.body);

    if (!validate.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
        errors: validate.error.flatten().fieldErrors,
      });
    }

    const user = await setUserBlockService(req.params.id, validate.data.isblock, req.user?.id);

    res.status(200).json({
      success: true,
      message: validate.data.isblock ? "User blocked successfully" : "User unblocked successfully",
      data: user,
    });
  } catch (error) {
    sendError(res, error);
  }
};