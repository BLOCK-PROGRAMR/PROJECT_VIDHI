const express = require("express");
const {
  addMarks,
  getAllMarks,
  getMarksByStudent,
  updateMarks,
  deleteMarks,
  getMarksReport,
  getExamById
} = require("../controller/MarksController");
const protect = require("../middleware/Authtoken");

const router = express.Router();

// Add marks
router.post("/:branchId", protect.authMiddleware, addMarks);

// Get marks report for an exam
router.get("/report/:examId/:classId/:sectionId/:branchId", protect.authMiddleware, getMarksReport);

// Get all marks
router.get("/:branchId", protect.authMiddleware, getAllMarks);

// Get marks by student
router.get("/:studentId/:branchId", protect.authMiddleware, getMarksByStudent);

router.get('/exam/:examId/:branchId', getExamById);

// Update marks
router.put("/:id/:branchId", protect.authMiddleware, updateMarks);

// Delete marks
router.delete("/:id/:branchId", protect.authMiddleware, deleteMarks);

module.exports = router;