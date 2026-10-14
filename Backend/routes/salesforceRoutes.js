const express = require("express");

const {
  connectSalesforce,
} = require("../controllers/salesforceController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/salesforce/connect
router.post("/connect", protect, connectSalesforce);

module.exports = router;