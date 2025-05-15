const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema(
  {
    branchId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Branch",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    academicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
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
    subjectMarks: [
      {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
        marksObtained: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

marksSchema.index({ studentId: 1, examId: 1 }, { unique: true });
module.exports = mongoose.model("Marks", marksSchema);
