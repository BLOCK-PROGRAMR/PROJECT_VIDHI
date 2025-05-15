const mongoose = require("mongoose");

const workingDaysSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  academicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
    required: true,
  },
  months: {
    june: { type: Number, default: 0 },
    july: { type: Number, default: 0 },
    august: { type: Number, default: 0 },
    september: { type: Number, default: 0 },
    october: { type: Number, default: 0 },
    november: { type: Number, default: 0 },
    december: { type: Number, default: 0 },
    january: { type: Number, default: 0 },
    february: { type: Number, default: 0 },
    march: { type: Number, default: 0 },
    april: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("WorkingDays", workingDaysSchema);
