

const Exam = require("../models/Exam");
const AcademicYear = require("../models/Acyear");

// Add a new exam
exports.addExam = async (req, res) => {
  try {
    const { branchId, examName, classId, academicId, sectionId, subjects } = req.body;

    // Check if an exam with the same name, section, and academic year already exists
    const existingExam = await Exam.findOne({
      examName,
      sectionId,
      academicId,
    });
    if (existingExam) {
      return res.status(400).json({
        success: false,
        message: "Exam already exists for this section in the academic year",
      });
    }

    // Create a new exam
    const newExam = new Exam({
      branchId,
      examName,
      academicId,
      classId,
      sectionId,
      subjects,
    });

    const savedExam = await newExam.save();

    // Add the exam reference to the AcademicYear's exams array
    await AcademicYear.findByIdAndUpdate(academicId, {
      $push: { exams: savedExam._id },
    });

    return res.status(201).json({
      success: true,
      message: "Exam added successfully",
      data: savedExam,
    });
  } catch (error) {
    console.error("Error adding exam: ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add exam",
      error: error.message,
    });
  }
};

// Get all exams for a specific academic year, class, and section
exports.getAllExamsByClassSection = async (req, res) => {
  try {
    const { sectionId, classId, branchId } = req.params;

    // Find all exams related to the specific section and class
    const exams = await Exam.find({ sectionId, classId, branchId })
      .populate("branchId", { name: 1 }) // Populate branch info if needed
      .populate("classId", { name: 1 })
      .populate("academicId", { year: 1 })
      .populate("sectionId", { name: 1 });

    return res.status(200).json({ success: true, data: exams });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch exams",
      error: error.message,
    });
  }
};

// Get all exams
exports.getAllExams = async (req, res) => {
  try {
    const { branchId } = req.params;
    const exams = await Exam.find({ branchId })
      .populate("branchId", { name: 1 }) // Populate branch info if needed
      .populate("classId", { name: 1 })
      .populate("academicId", { year: 1 })
      .populate("sectionId", { name: 1 });

    return res.status(200).json({ success: true, data: exams });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch exams",
      error: error.message,
    });
  }
};

// Update an exam
exports.updateExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const updatedData = req.body;

    // Update the exam
    const updatedExam = await Exam.findByIdAndUpdate(examId, updatedData, {
      new: true,
    });
    if (!updatedExam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: updatedExam,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update exam",
      error: error.message,
    });
  }
};

// Delete an exam
exports.deleteExam = async (req, res) => {
  try {
    const { examId } = req.params;

    // Find and delete the exam
    const deletedExam = await Exam.findByIdAndDelete(examId);
    if (!deletedExam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    // Remove the exam reference from the AcademicYear's exams array
    await AcademicYear.findByIdAndUpdate(deletedExam.academicId, {
      $pull: { exams: deletedExam._id },
    });

    return res.status(200).json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete exam",
      error: error.message,
    });
  }
};
