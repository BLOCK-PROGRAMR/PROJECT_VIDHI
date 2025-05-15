const mongoose = require("mongoose");

const homeworkSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    homeWork: {
      type: String,
      required: true,
    },
    fileLink: {
      type: String,
      required: false, // Optional
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Homework", homeworkSchema);
