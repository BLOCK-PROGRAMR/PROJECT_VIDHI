const mongoose = require("mongoose");

const syllabusSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    examName: {
      type: String,
      required: true,
    },
    academicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    syllabus: {
      type: Map,
      of: String, // Each subject is mapped to its syllabus as a string
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Syllabus", syllabusSchema);
