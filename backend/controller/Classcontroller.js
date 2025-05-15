const Class = require("../models/Classes");
const AcademicYear = require("../models/Acyear");
const mongoose = require("mongoose");

// Create Class
exports.createClass = async (req, res) => {
  try {
    const { name, academicYear, mainSubjects, additionalSubjects } = req.body;

    // Check if a class with the same name already exists in the given academic year
    const existingClass = await Class.findOne({
      name,
      academicYear,
    });

    if (existingClass) {
      return res.status(400).json({
        success: false,
        message:
          "Class with the same name already exists for this academic year",
      });
    }

    // Create a new class with separate main and additional subjects
    const newClass = new Class({
      name,
      academicYear,
      subjects: {
        mainSubjects,
        additionalSubjects, // It is okay if additionalSubjects is empty or undefined
      },
    });

    // Save the new class
    await newClass.save();

    // Add the class to the academic year's classes array
    await AcademicYear.findByIdAndUpdate(academicYear, {
      $push: { classes: newClass._id },
    });

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create class",
      error: error.message,
    });
  }
};

// Get All Classes
exports.getAllClasses = async (req, res) => {
  try {
    // Get the academicYear ID from the query parameters
    const { acadId } = req.params;
    console.log("academic id is", acadId);
    // Define the query object

    // If academicYear is provided, add it to the query

    // Fetch the classes, optionally filtering by academicYear
    const classes = await Class.find({ academicYear: acadId });
    // Uncomment the lines below if you need to populate related fields
    // .populate("sections") // Populate section details
    // .populate("academicYear"); // Populate academic year details

    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve classes",
      error: error.message,
    });
  }
};

// Delete Class
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the class by id
    const classData = await Class.findById(id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Check if the sections array is empty
    if (classData.sections.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete class because it has sections. Remove all sections before deleting the class.",
      });
    }

    // Remove the class reference from the academic year
    await AcademicYear.findByIdAndUpdate(classData.academicYear, {
      $pull: { classes: classData._id },
    });

    // Proceed with class deletion
    await Class.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete class",
      error: error.message,
    });
  }
};

//getclass by id
exports.getClassDetails = async (req, res) => {
  const { classId } = req.params;
  // classId = new mongoose.Types.ObjectId(classId);
  try {
    const classData = await Class.findById(classId);
    if (!classData) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }
    res.json({ success: true, data: classData });
  } catch (error) {
    console.error("Error fetching class details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//update class
// Update class with subjects and check for uniqueness
exports.updateClass = async (req, res) => {
  try {
    const { classId } = req.params; // Extract classId from URL parameters
    const { name, academicYear, mainSubjects, additionalSubjects } = req.body;
    console.log("main subjects ", mainSubjects);
    console.log("addirtional sub", additionalSubjects);

    // Check if another class with the same name already exists in the academic year
    const existingClass = await Class.findOne({
      _id: { $ne: classId }, // Exclude the current class from the check
      name,
      academicYear,
    });

    if (existingClass) {
      return res.status(400).json({
        success: false,
        message:
          "Class with the same name already exists for this academic year",
      });
    }

    // Update class with new details, including updated subjects
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      {
        name,
        academicYear,
        subjects: {
          mainSubjects,
          additionalSubjects,
        },
      },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      data: updatedClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update class",
      error: error.message,
    });
  }
};
