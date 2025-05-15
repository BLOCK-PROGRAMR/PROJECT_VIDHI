const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  fees: [
    {
      feeType: {
        type: String,
        // removed required so feeName is not mandatory during creation
      },
      amount: {
        type: Number,
        // removed required so amount is not mandatory during creation
      },
    },
  ],
});

// Ensure section names are unique within the same class
sectionSchema.index({ name: 1, classId: 1 }, { unique: true });

module.exports = mongoose.model("Section", sectionSchema);
