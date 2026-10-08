import bcrypt from "bcrypt";

import Assignment from "../Model/assignment.model.js";
import PastPaper from "../Model/pastpaper.model.js";
import Project from "../Model/project.model.js";
import Review from "../Model/review.model.js";
import User from "../Model/auth.model.js";

import { assignmentSchemaZod } from "../validation/assign.validation.js";
import { PastPaperSchemaZod } from "../validation/paper.validatoin.js";
import { ProjectSchemaZod } from "../validation/project.validation.js";
import { ReviewSchemaZod } from "../validation/review.validation.js";

const CONFIG = {
  assignments: {
    model: Assignment,
    schema: assignmentSchemaZod,
    passthrough: ["fileUrl", "fileName", "originalName", "fileSize"],
  },
  papers: {
    model: PastPaper,
    schema: PastPaperSchemaZod,
    passthrough: ["fileUrl", "fileName", "originalName", "fileSize"],
  },
  projects: {
    model: Project,
    schema: ProjectSchemaZod,
    passthrough: ["fileUrl", "fileName", "originalName", "fileSize"],
  },
  reviews: {
    model: Review,
    schema: ReviewSchemaZod,
    passthrough: ["student"],
  },
};

// Never accepted from a request body: identity and bookkeeping columns only
// the server may set (or, for uploadedBy, keep from the original document).
const PROTECTED = ["_id", "id", "__v", "createdAt", "updatedAt", "uploadedBy"];

const resolve = (collection) => {
  const config = CONFIG[collection];

  if (!config) {
    const error = new Error(`Unknown admin collection: ${collection}`);
    error.status = 404;
    throw error;
  }

  return config;
};

const omit = (source, keys) => {
  const output = { ...source };

  for (const key of keys) delete output[key];

  return output;
};

/** Copies `keys` across only when the value is actually present. */
const pickDefined = (source, keys) => {
  const output = {};

  for (const key of keys) {
    if (source[key] !== undefined) output[key] = source[key];
  }

  return output;
};

/** Parse errors shaped like the rest of the API: { success, message, errors }. */
const invalid = (zodError) => {
  const error = new Error("Invalid data");
  error.status = 400;
  error.errors = zodError.flatten().fieldErrors;
  throw error;
};

/** Every record, newest first — the order the admin tables expect. */
export const listRecordsService = async (collection) => {
  const { model } = resolve(collection);

  return await model.find().sort({ createdAt: -1 });
};

export const createRecordService = async (collection, body, adminId) => {
  const config = resolve(collection);
  const validate = config.schema.safeParse(body);

  if (!validate.success) invalid(validate.error);

  const record = {
    ...validate.data,
    ...pickDefined(body, config.passthrough),
    uploadedBy: adminId,
  };

  return await config.model.create(record);
};

export const updateRecordService = async (collection, id, body) => {
  const config = resolve(collection);
  const current = await config.model.findById(id);

  if (!current) {
    const error = new Error("Record not found");
    error.status = 404;
    throw error;
  }

  // Validate the *merged* document, so a partial update still has to produce a
  // record the model accepts.
  const merged = { ...current.toObject(), ...body };
  const validate = config.schema.safeParse(
    omit(merged, [...config.passthrough, ...PROTECTED])
  );

  if (!validate.success) invalid(validate.error);

  const update = {
    ...validate.data,
    ...pickDefined(merged, config.passthrough),
    uploadedBy: current.uploadedBy,
  };

  return await config.model.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
};

export const deleteRecordService = async (collection, id) => {
  const { model } = resolve(collection);
  const removed = await model.findByIdAndDelete(id);

  if (!removed) {
    const error = new Error("Record not found");
    error.status = 404;
    throw error;
  }

  return removed;
};

/* -------------------------------------------------------------------------
 * Accounts. Written here rather than through CONFIG because passwords have to
 * be hashed and the secret fields stripped from every response.
 * ---------------------------------------------------------------------- */

/** A user document minus password / reset-token material. */
const toSafeUser = (doc) => {
  const safe = doc.toObject();

  delete safe.password;
  delete safe.resetPasswordToken;
  delete safe.resetPasswordTokenExpire;

  return safe;
};

const duplicateEmail = () => {
  const error = new Error("An account with that email already exists");
  error.status = 409;
  return error;
};

export const createUserService = async ({ name, email, password, role, avatar }) => {
  const normalised = String(email).toLowerCase();

  if (await User.findOne({ email: normalised })) throw duplicateEmail();

  // Same 10-round hash the register flow uses, never the plain password.
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: normalised,
    password: hashedPassword,
    role,
    avatar: avatar || null,
  });

  return toSafeUser(user);
};

export const updateUserService = async (id, { name, email, role, password, avatar }) => {
  // `+password` loads the field explicitly: it is select:false, and save()
  // validates the required password path even when nothing changed.
  const user = await User.findById(id).select("+password");

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const normalised = String(email).toLowerCase();
  const clash = await User.findOne({ email: normalised });

  if (clash && String(clash._id) !== String(id)) throw duplicateEmail();

  user.name = name;
  user.email = normalised;
  user.role = role;
  user.avatar = avatar || null;

  // Blank keeps the current password; anything else is a new hash.
  if (password) user.password = await bcrypt.hash(password, 10);

  await user.save();

  return toSafeUser(user);
};

export const deleteUserService = async (id, adminId) => {
  // An admin must never be able to lock the console out by deleting themself.
  if (String(id) === String(adminId)) {
    const error = new Error("You cannot delete your own account");
    error.status = 400;
    throw error;
  }

  const removed = await User.findByIdAndDelete(id);

  if (!removed) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return toSafeUser(removed);
};