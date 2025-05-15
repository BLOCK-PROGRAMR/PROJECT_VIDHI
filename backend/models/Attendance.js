// models/Attendance.js
const mongoose = require('mongoose');

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  academicId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'AcademicYear' },
  branchId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Branch' },
  classId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Class' },
  sectionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Section' },
  date: { type: Date, required: true },
  absentees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],  // Array of student IDs
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
