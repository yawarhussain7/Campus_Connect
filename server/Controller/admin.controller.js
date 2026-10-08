import {
  listRecordsService,
  createRecordService,
  updateRecordService,
  deleteRecordService,
  createUserService,
  updateUserService,
  deleteUserService,
} from "../Service/admin.service.js";
import User from "../Model/auth.model.js";
import { AdminUserCreateZod, AdminUserUpdateZod } from "../validation/user.validation.js";

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
  try {
    const record = await createRecordService(collection, req.body, req.user?.id);

    res.status(201).json({
      success: true,
      message: "Record created successfully",
      data: record,
    });
  } catch (error) {
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