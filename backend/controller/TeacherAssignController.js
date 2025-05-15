const TeacherAssignment = require('../models/TeacherAssignment');
const Teacher = require('../models/Teachers');

exports.assignTeacher = async (req, res) => {
    try {
        const { teacherId, subject, className, sectionName, academicYear } = req.body;

        // Find teacher and validate
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        // Find existing assignment or create new one
        let assignment = await TeacherAssignment.findOne({
            teacherId,
            academicYear
        });

        if (!assignment) {
            // Create new assignment
            assignment = new TeacherAssignment({
                teacherId,
                name: teacher.name,
                teachingSubjects: [{ name: subject }],
                classAssignments: [{
                    className,
                    sections: [{ sectionName, subject }]
                }],
                academicYear
            });
        } else {
            // Update existing assignment
            // Add subject if not exists
            if (!assignment.teachingSubjects.some(s => s.name === subject)) {
                assignment.teachingSubjects.push({ name: subject });
            }

            // Find or create class assignment
            let classAssignment = assignment.classAssignments.find(
                ca => ca.className === className
            );

            if (!classAssignment) {
                assignment.classAssignments.push({
                    className,
                    sections: [{ sectionName, subject }]
                });
            } else {
                // Add section if not exists
                if (!classAssignment.sections.some(
                    s => s.sectionName === sectionName && s.subject === subject
                )) {
                    classAssignment.sections.push({ sectionName, subject });
                }
            }
        }

        await assignment.save();

        res.status(200).json({
            success: true,
            message: 'Teacher assigned successfully',
            data: assignment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error assigning teacher',
            error: error.message
        });
    }
};

exports.getTeacherAssignments = async (req, res) => {
    try {
        const { academicYear } = req.query;
        const assignments = await TeacherAssignment.find({
            academicYear,
            active: true
        });

        res.status(200).json({
            success: true,
            data: assignments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching assignments',
            error: error.message
        });
    }
};

exports.updateTeacherAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { subject, className, sectionName } = req.body;

        const assignment = await TeacherAssignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Add logic to update specific section/subject assignment
        // This will depend on your specific update requirements

        await assignment.save();

        res.status(200).json({
            success: true,
            message: 'Assignment updated successfully',
            data: assignment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating assignment',
            error: error.message
        });
    }
};

exports.removeTeacherAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { className, sectionName, subject } = req.query;

        const assignment = await TeacherAssignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Remove specific section assignment
        const classIndex = assignment.classAssignments.findIndex(
            ca => ca.className === className
        );

        if (classIndex > -1) {
            const sectionIndex = assignment.classAssignments[classIndex].sections.findIndex(
                s => s.sectionName === sectionName && s.subject === subject
            );

            if (sectionIndex > -1) {
                assignment.classAssignments[classIndex].sections.splice(sectionIndex, 1);

                // Remove class if no sections left
                if (assignment.classAssignments[classIndex].sections.length === 0) {
                    assignment.classAssignments.splice(classIndex, 1);
                }

                // Remove subject if not used in any section
                const subjectStillUsed = assignment.classAssignments.some(ca =>
                    ca.sections.some(s => s.subject === subject)
                );

                if (!subjectStillUsed) {
                    const subjectIndex = assignment.teachingSubjects.findIndex(
                        s => s.name === subject
                    );
                    if (subjectIndex > -1) {
                        assignment.teachingSubjects.splice(subjectIndex, 1);
                    }
                }

                await assignment.save();
            }
        }

        res.status(200).json({
            success: true,
            message: 'Assignment removed successfully',
            data: assignment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error removing assignment',
            error: error.message
        });
    }
};