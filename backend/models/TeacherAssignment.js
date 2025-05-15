const mongoose = require('mongoose');

const sectionAssignmentSchema = new mongoose.Schema({
    sectionName: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    }
});

const classAssignmentSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true
    },
    sections: [sectionAssignmentSchema]
});

const teacherAssignmentSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    teachingSubjects: [{
        name: {
            type: String,
            required: true
        }
    }],
    classAssignments: [classAssignmentSchema],
    academicYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicYear',
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TeacherAssignment', teacherAssignmentSchema);