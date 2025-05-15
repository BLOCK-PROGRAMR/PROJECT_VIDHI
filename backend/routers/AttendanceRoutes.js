// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const { addAttendance, getAbsentees , getMonthlyAbsents, updateAbsentees } = require('../controller/AttendanceController');

// Route to create attendance
router.post('/add', addAttendance);

// Route to get attendance by filters
router.get('/get-absentees', getAbsentees);

router.put('/update-absentees', updateAbsentees);


// Route 2: Get the number of absents for each student in a specific month
router.get('/monthly-absents/:branchId/:academicId/:classId/:sectionId/:month', getMonthlyAbsents);


module.exports = router;
