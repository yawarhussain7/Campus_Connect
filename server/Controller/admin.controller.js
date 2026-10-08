import {
  listRecordsService,
  createRecordService,
  updateRecordService,
  deleteRecordService,
} from "../Service/admin.service.js";

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