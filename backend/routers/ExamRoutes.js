

const express = require("express");
const {
  addExam,
  updateExam,
  deleteExam,
  getAllExamsByClassSection,
  getAllExams
} = require("../controller/ExamController");

const router = express.Router();

// Route to add a new exam
router.post("/add-exam", addExam);

// Route to get all exams for a specific class and section
router.get("/all-exams/:classId/:sectionId/:branchId", getAllExamsByClassSection);

router.get("/all-exams/:branchId", getAllExams);


// Route to delete a specific exam by ID
router.delete("/delete-exam/:examId", deleteExam);

// Route to update a specific exam by ID
router.put("/update-exam/:examId", updateExam);

module.exports = router;

