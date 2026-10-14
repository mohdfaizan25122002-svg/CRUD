const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  listRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordsController");

const router = express.Router();

router.use(protect);
router.route("/:objectName").get(listRecords).post(createRecord);
router.route("/:objectName/:id").get(getRecord).put(updateRecord).delete(deleteRecord);

module.exports = router;
