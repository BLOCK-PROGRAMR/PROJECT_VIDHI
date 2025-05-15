const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    // Replace 'address' with specific fields
    street: {
      type: String,
      required: true,
    },
    colony: {
      type: String,
      required: true,
    },
    villageTown: {
      type: String, // renamed village/town to be a single field
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    branchAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    academicYears: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademicYear",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branch", branchSchema);
