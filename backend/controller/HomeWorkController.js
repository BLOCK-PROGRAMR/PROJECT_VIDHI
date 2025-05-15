const Homework = require("../models/HomeWork");

// Create Homework (POST)
exports.createHomework = async (req, res) => {
  try {
    const { branchId, classId, sectionId, date, subject, homeWork, fileLink } = req.body;
    console.log("body createhome work: ", req.body)

    // Validate required fields
    if (!branchId || !classId || !sectionId || !date || !subject || !homeWork) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    const newHomework = new Homework({
      branchId,
      classId,
      sectionId,
      date,
      subject,
      homeWork,
      fileLink,
    });

    const savedHomework = await newHomework.save();
    res.status(201).json({
      success: true,
      message: "Homework created successfully.",
      data: savedHomework,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Homework (DELETE)
exports.deleteHomework = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedHomework = await Homework.findByIdAndDelete(id);

    if (!deletedHomework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Homework deleted successfully.",
      data: deletedHomework, // Returning the deleted document if needed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Homework (GET)
exports.getHomeworks = async (req, res) => {
  try {
    const { branchId, classId, sectionId, date } = req.query;

    const filter = {};
    if (branchId) filter.branchId = branchId;
    if (classId) filter.classId = classId;
    if (sectionId) filter.sectionId = sectionId;
    if (date) filter.date = new Date(date); // Parse date if provided

    const homeworks = await Homework.find(filter)
      .populate("branchId classId sectionId") // Populate related fields if necessary
      .sort({ date: -1 }); // Sort by date (most recent first)

    res.status(200).json({
      success: true,
      data: homeworks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Homework (PUT)
exports.updateHomework = async (req, res) => {
  try {
    const { id } = req.params;
    const { branchId, classId, sectionId, date, subject, homeWork, fileLink } = req.body;

    const updatedHomework = await Homework.findByIdAndUpdate(
      id,
      {
        branchId,
        classId,
        sectionId,
        date,
        subject,
        homeWork,
        fileLink,
      },
      { new: true } // Return the updated document
    );

    if (!updatedHomework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Homework updated successfully.",
      data: updatedHomework,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
