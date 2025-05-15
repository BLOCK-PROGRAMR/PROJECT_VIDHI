const express = require("express");
const router = express.Router();
const {  createSyllabus , updateSyllabus , getAllSyllabus ,deleteSyllabus } = require("../controller/SyllabusController.js")

// Create Syllabus
router.post("/:branchId/syllabus", createSyllabus );

// Update Syllabus
router.put("/:branchId/syllabus/:id", updateSyllabus );

// Get All Syllabus by branchId and academicId
router.get("/:branchId/syllabus/:academicId", getAllSyllabus);

router.delete("/:syllabusId", deleteSyllabus);

module.exports = router;
