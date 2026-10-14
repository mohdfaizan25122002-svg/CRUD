const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    objectName: { type: String, required: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

recordSchema.index({ owner: 1, objectName: 1, createdAt: -1 });

module.exports = mongoose.model("Record", recordSchema);
