const Syllabus = require("../models/Syllabus");
const mongoose = require('mongoose');

// Create Syllabus
exports.createSyllabus = async (req, res) => {
  try {
    const { branchId } = req.params; // Branch ID in params
    const { classId, sectionId, examName, academicId, syllabus } = req.body; // Remaining fields in the body

    // Check if a syllabus for the same exam, class, and section already exists
    const existingSyllabus = await Syllabus.findOne({
      branchId,
      classId,
      sectionId,
      examName,
      academicId,
    });

    if (existingSyllabus) {
      return res.status(400).json({
        success: false,
        message: "Syllabus already exists for the given exam and section.",
      });
    }

    // Create new syllabus
    const newSyllabus = new Syllabus({
      branchId,
      classId,
      sectionId,
      examName,
      academicId,
      syllabus,
    });

    const savedSyllabus = await newSyllabus.save();

    return res.status(201).json({
      success: true,
      message: "Syllabus created successfully.",
      data: savedSyllabus,
    });
  } catch (error) {
    console.error("Error creating syllabus:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create syllabus.",
      error: error.message,
    });
  }
};

// Update Syllabus
exports.updateSyllabus = async (req, res) => {
  try {
    const { branchId } = req.params; // Branch ID in params
    const { id } = req.params; // Syllabus ID to be updated
    const { syllabus } = req.body; // Only updating syllabus

    // Check if the syllabus exists
    const existingSyllabus = await Syllabus.findOne({
      _id: id,
      branchId,
    });

    if (!existingSyllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found.",
      });
    }

    // Update the syllabus
    existingSyllabus.syllabus = syllabus;
    const updatedSyllabus = await existingSyllabus.save();

    return res.status(200).json({
      success: true,
      message: "Syllabus updated successfully.",
      data: updatedSyllabus,
    });
  } catch (error) {
    console.error("Error updating syllabus:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update syllabus.",
      error: error.message,
    });
  }
};


// Get All Syllabus by branchId and academicId
exports.getAllSyllabus = async (req, res) => {
    try {
      const { branchId, academicId } = req.params;
  
      // Fetch all syllabi based on branchId and academicId
      const syllabi = await Syllabus.find({ branchId, academicId });
  
      if (!syllabi || syllabi.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No syllabi found for the given branch and academic year.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Syllabi retrieved successfully.",
        data: syllabi,
      });
    } catch (error) {
      console.error("Error fetching syllabi:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch syllabi.",
        error: error.message,
      });
    }
  };

exports.deleteSyllabus = async (req, res) => {
const { syllabusId } = req.params;

try {
    // Check if syllabusId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(syllabusId)) {
    return res.status(400).json({ message: "Invalid syllabus ID" });
    }

    // Find and delete the syllabus document
    const syllabus = await Syllabus.findByIdAndDelete(syllabusId);

    if (!syllabus) {
    return res.status(404).json({ message: "Syllabus not found" });
    }

    return res.status(200).json({ message: "Syllabus deleted successfully" });
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
}
};
  