const express = require('express');
const router = express.Router();
const teacherController = require('../controller/TeacherController');

router.post('/add-teacher', teacherController.addTeacher);
router.get('/all-teachers/:academicId', teacherController.getTeachers);
router.get('/get-teacher/:teacherId', teacherController.getTeacherById);
router.put('/edit-teacher/:teacherId', teacherController.updateTeacher);
router.delete('/delete-teacher/:teacherId', teacherController.deleteTeacher);

module.exports = router;