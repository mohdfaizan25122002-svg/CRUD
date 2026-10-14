const User = require("../models/User");

const {
  createSalesforceUser,
} = require("../services/salesforceService");

// ==========================
// CONNECT USER TO SALESFORCE
// ==========================
const connectSalesforce = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.salesforceId) {
      return res.status(200).json({
        success: true,
        message: "User already connected to Salesforce",
        salesforceId: user.salesforceId,
      });
    }

    const result = await createSalesforceUser(user);

    user.salesforceId = result.salesforceId;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Salesforce connected successfully",
      salesforceId: user.salesforceId,
    });
  } catch (error) {
    console.error("Salesforce Controller Error:", error);

    res.status(500).json({
      success: false,
      message: "Salesforce connection failed",
    });
  }
};

module.exports = {
  connectSalesforce,
};