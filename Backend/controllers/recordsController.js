const mongoose = require("mongoose");
const Record = require("../models/Record");

const SUPPORTED_OBJECTS = new Set([
  "Contact",
  "Account",
  "Lead",
  "Opportunity",
  "Case",
  "Task",
]);

const isSupportedObject = (objectName) => SUPPORTED_OBJECTS.has(objectName);

const invalidObject = (res) =>
  res.status(400).json({
    success: false,
    message: "Unsupported Salesforce object.",
  });

const toResponseRecord = (record) => ({ Id: String(record._id), ...record.data });

const listRecords = async (req, res, next) => {
  try {
    const { objectName } = req.params;
    if (!isSupportedObject(objectName)) return invalidObject(res);

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);
    const search = String(req.query.search || "").trim().toLowerCase();
    const allRecords = await Record.find({ owner: req.user._id, objectName }).sort({ createdAt: -1 }).lean();
    const filteredRecords = search
      ? allRecords.filter(({ data }) =>
          Object.values(data).some((value) => String(value).toLowerCase().includes(search))
        )
      : allRecords;
    const total = filteredRecords.length;

    res.json({
      records: filteredRecords.slice((page - 1) * limit, page * limit).map(toResponseRecord),
      total,
      page,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    });
  } catch (error) {
    next(error);
  }
};

const getRecord = async (req, res, next) => {
  try {
    const { objectName, id } = req.params;
    if (!isSupportedObject(objectName)) return invalidObject(res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ success: false, message: "Record not found." });
    }

    const record = await Record.findOne({ _id: id, owner: req.user._id, objectName }).lean();
    if (!record) return res.status(404).json({ success: false, message: "Record not found." });
    res.json(toResponseRecord(record));
  } catch (error) {
    next(error);
  }
};

const sanitizeRecord = (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;

  const record = {};
  for (const [field, value] of Object.entries(data || {})) {
    const fieldName = field.trim();
    if (
      fieldName !== "Id" &&
      fieldName !== "attributes" &&
      /^[A-Za-z][A-Za-z0-9_]*$/.test(fieldName)
    ) {
      record[fieldName] = value;
    }
  }
  return record;
};

const createRecord = async (req, res, next) => {
  try {
    const { objectName } = req.params;
    if (!isSupportedObject(objectName)) return invalidObject(res);

    const fields = sanitizeRecord(req.body);
    if (!fields || !Object.keys(fields).length) {
      return res.status(400).json({ success: false, message: "Provide at least one record field." });
    }

    const record = await Record.create({ owner: req.user._id, objectName, data: fields });
    res.status(201).json(toResponseRecord(record));
  } catch (error) {
    next(error);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const { objectName, id } = req.params;
    if (!isSupportedObject(objectName)) return invalidObject(res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ success: false, message: "Record not found." });
    }

    const record = await Record.findOne({ _id: id, owner: req.user._id, objectName });
    if (!record) return res.status(404).json({ success: false, message: "Record not found." });

    const fields = sanitizeRecord(req.body);
    if (!fields || !Object.keys(fields).length) {
      return res.status(400).json({ success: false, message: "Provide at least one valid record field." });
    }

    record.data = { ...record.data, ...fields };
    record.markModified("data");
    await record.save();
    res.json(toResponseRecord(record));
  } catch (error) {
    next(error);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    const { objectName, id } = req.params;
    if (!isSupportedObject(objectName)) return invalidObject(res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ success: false, message: "Record not found." });
    }

    const record = await Record.findOneAndDelete({ _id: id, owner: req.user._id, objectName });
    if (!record) return res.status(404).json({ success: false, message: "Record not found." });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { listRecords, getRecord, createRecord, updateRecord, deleteRecord };
