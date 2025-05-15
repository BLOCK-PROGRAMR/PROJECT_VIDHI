const express = require('express');
const router = express.Router();
const teacherAssignmentController = require('../controller/TeacherAssignController');

// Assign a teacher
router.post('/assign', teacherAssignmentController.assignTeacher);

// Get all assignments
router.get('/assignments', teacherAssignmentController.getTeacherAssignments);

// Update assignment
router.put('/assignment/:assignmentId', teacherAssignmentController.updateTeacherAssignment);

// Remove assignment
router.delete('/assignment/:assignmentId', teacherAssignmentController.removeTeacherAssignment);

module.exports = router;