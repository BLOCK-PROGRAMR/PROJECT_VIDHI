const Marks = require("../models/Marks");
const Student = require("../models/student");
const Exam = require("../models/Exam");
const Class = require("../models/Classes");
const Section = require("../models/sections");
// const Subject = require("../models/Subject");

// Add new marks
exports.addMarks = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { studentId, examId, academicId, classId, sectionId, subjectMarks } = req.body;

    // Validate required data
    if (!studentId || !examId || !academicId || !classId || !sectionId || !subjectMarks) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Check if student, exam, class, and section exist
    const [student, exam, classData, section] = await Promise.all([
      Student.findById(studentId),
      Exam.findById(examId),
      Class.findById(classId),
      Section.findById(sectionId)
    ]);

    if (!student || !exam || !classData || !section) {
      return res.status(404).json({
        success: false,
        message: "Invalid data provided - one or more entities not found"
      });
    }

    // Check if marks already exist
    const existingMarks = await Marks.findOne({
      studentId,
      examId,
      branchId
    });

    if (existingMarks) {
      return res.status(400).json({
        success: false,
        message: "Marks already exist for this student in the exam"
      });
    }

    // Validate subject marks against exam subjects
    const validSubjects = exam.subjects.map(s => s._id.toString());
    const invalidSubjects = subjectMarks.filter(
      sm => !validSubjects.includes(sm.subjectId.toString())
    );

    if (invalidSubjects.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject IDs provided"
      });
    }

    // Create marks entry
    const newMarks = new Marks({
      branchId,
      studentId,
      examId,
      academicId,
      classId,
      sectionId,
      subjectMarks,
    });

    const savedMarks = await newMarks.save();

    res.status(201).json({
      success: true,
      message: "Marks added successfully",
      data: savedMarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add marks",
      error: error.message
    });
  }
};

// Get marks report for an exam
exports.getMarksReport = async (req, res) => {
  try {
    const { examId, classId, sectionId, branchId } = req.params;

    // Get exam details first
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found"
      });
    }

    // Get all marks for this exam
    const allMarks = await Marks.find({
      examId,
      classId,
      sectionId,
      branchId
    }).populate('studentId', 'name');

    if (!allMarks.length) {
      return res.status(404).json({
        success: false,
        message: "No marks found for this exam"
      });
    }

    // Process marks data
    const studentsData = allMarks.map(mark => {
      const total = mark.subjectMarks.reduce((sum, subj) => sum + subj.marksObtained, 0);
      const maxTotal = exam.subjects.reduce((sum, subj) => sum + subj.marks, 0);
      const percentage = ((total / maxTotal) * 100).toFixed(2);

      const subjects = mark.subjectMarks.map(subj => {
        const examSubject = exam.subjects.find(
          es => es._id.toString() === subj.subjectId.toString()
        );
        return {
          name: examSubject.name,
          marks: subj.marksObtained,
          maxMarks: examSubject.marks,
          passMarks: examSubject.passMarks,
          isPassed: subj.marksObtained >= examSubject.passMarks
        };
      });

      const hasFailed = subjects.some(subj => !subj.isPassed);

      return {
        id: mark.studentId._id,
        name: mark.studentId.name,
        subjects,
        total,
        percentage: parseFloat(percentage),
        isPassed: !hasFailed
      };
    });

    // Separate pass and fail students
    const passStudents = studentsData
      .filter(student => student.isPassed)
      .sort((a, b) => b.percentage - a.percentage);

    const failStudents = studentsData
      .filter(student => !student.isPassed)
      .sort((a, b) => b.percentage - a.percentage);

    // Generate subject-wise report
    const subjectReport = exam.subjects.map(subject => {
      const subjectResults = studentsData.map(student =>
        student.subjects.find(s => s.name === subject.name)
      );

      return {
        name: subject.name,
        passCount: subjectResults.filter(r => r.isPassed).length,
        failCount: subjectResults.filter(r => !r.isPassed).length,
        maxMarks: subject.marks,
        passMarks: subject.passMarks
      };
    });

    // Get class and section names
    const [classDetails, sectionDetails] = await Promise.all([
      Class.findById(classId),
      Section.findById(sectionId)
    ]);

    res.status(200).json({
      success: true,
      data: {
        examName: exam.examName,
        className: classDetails.name,
        sectionName: sectionDetails.name,
        passStudents,
        failStudents,
        subjectReport,
        totalStudents: studentsData.length,
        passPercentage: ((passStudents.length / studentsData.length) * 100).toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate marks report",
      error: error.message
    });
  }
};

// Get all marks
exports.getAllMarks = async (req, res) => {
  try {
    const { branchId } = req.params;

    const marks = await Marks.find({ branchId })
      .populate("studentId", "name")
      .populate("examId", "examName")
      .populate("classId", "name")
      .populate("sectionId", "name")
      .populate("subjectMarks.subjectId", "name");

    res.status(200).json({
      success: true,
      message: "Marks retrieved successfully",
      data: marks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve marks",
      error: error.message
    });
  }
};

// Get marks by student ID
exports.getMarksByStudent = async (req, res) => {
  try {
    const { branchId, studentId } = req.params;

    const marks = await Marks.find({ branchId, studentId })
      .populate("examId", "examName")
      .populate("classId", "name")
      .populate("sectionId", "name")

    if (!marks.length) {
      return res.status(404).json({
        success: false,
        message: "No marks found for this student"
      });
    }

    res.status(200).json({
      success: true,
      message: "Marks retrieved successfully",
      data: marks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve marks",
      error: error.message
    });
  }
};

// Update marks
exports.updateMarks = async (req, res) => {
  try {
    const { branchId, id } = req.params;
    const updates = req.body;

    const updatedMarks = await Marks.findOneAndUpdate(
      { _id: id, branchId },
      updates,
      { new: true }
    );

    if (!updatedMarks) {
      return res.status(404).json({
        success: false,
        message: "Marks not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Marks updated successfully",
      data: updatedMarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update marks",
      error: error.message
    });
  }
};

// Delete marks
exports.deleteMarks = async (req, res) => {
  try {
    const { branchId, id } = req.params;

    const deletedMarks = await Marks.findOneAndDelete({ _id: id, branchId });

    if (!deletedMarks) {
      return res.status(404).json({
        success: false,
        message: "Marks not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Marks deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete marks",
      error: error.message
    });
  }
};

//geteexambyID
exports.getExamById = async (req, res) => {
  try {
    const { examId, branchId } = req.params;

    const exam = await Exam.findOne({ _id: examId, branchId })
      .populate('subjects')
      .populate('classId', 'name')
      .populate('sectionId', 'name');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Exam retrieved successfully",
      data: exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve exam",
      error: error.message
    });
  }
};
