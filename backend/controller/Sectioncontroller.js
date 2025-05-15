const Class = require("../models/Classes");
const AcademicYear = require("../models/Acyear");
const Section = require("../models/sections");

// / Add a unique section to a class
exports.addSection = async (req, res) => {
  const { classId } = req.params;
  const { sectionName } = req.body;

  try {
    // Check if section name already exists for the given class
    const existingSection = await Section.findOne({ sectionName, classId });
    if (existingSection) {
      return res.status(400).json({
        success: false,
        message: "Section name must be unique within the class",
      });
    }

    // Create a new section
    const newSection = await Section.create({ name: sectionName, classId });
    await newSection.save();
    // Add the new section's ID to the sections array in the Class document
    await Class.findByIdAndUpdate(
      classId,
      { $push: { sections: newSection._id } },
      { new: true }
    );

    res.json({ success: true, data: newSection });
  } catch (error) {
    console.error("Error adding section:", error);
    res.status(500).json({ success: false, message: "Failed to add section" });
  }
};

exports.updateSection = async (req, res) => {
  const { secId } = req.params;
  const { name } = req.body;

  try {
    // Find the section to get its classId
    const section = await Section.findById(secId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    // Check if a different section with the same name exists within the same class
    const duplicateSection = await Section.findOne({
      name,
      classId: section.classId,
      _id: { $ne: secId },
    });
    if (duplicateSection) {
      return res.status(400).json({
        success: false,
        message: "Section name must be unique within the class",
      });
    }

    // Update the section name
    section.name = name;
    const updatedSection = await section.save();

    res.json({ success: true, data: updatedSection });
  } catch (error) {
    console.error("Error updating section:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update section" });
  }
};

exports.deleteSection = async (req, res) => {
  const { classId, sectionId } = req.params;

  try {
    // Delete the section from the Section collection
    const deletedSection = await Section.findByIdAndDelete(sectionId);
    if (!deletedSection) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    // Remove the section's ID from the sections array in the Class document
    await Class.findByIdAndUpdate(
      classId,
      { $pull: { sections: sectionId } },
      { new: true }
    );

    res.json({ success: true, message: "Section deleted successfully" });
  } catch (error) {
    console.error("Error deleting section:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete section" });
  }
};

exports.getAllSections = async (req, res) => {
  const { classId } = req.params;

  try {
    // Find all sections by classId and select only the name field
    const sections = await Section.find({ classId });

    // Map the sections to extract only the name field
    // const sectionNames = sections.map((section) => section.name);
    res.json({ success: true, data: sections });
  } catch (error) {
    console.error("Error fetching section names:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getSectionsByClass = async (req, res) => {
  const { className, acadId } = req.params;

  try {
    // Find the class by name
    console.log(className, acadId);
    const classData = await Class.findOne({
      name: className,
      academicYear: acadId,
    }).populate("sections");

    if (!classData) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }

    // Return sections from the found class
    res.status(200).json({ success: true, data: classData.sections });
  } catch (error) {
    console.error("Error fetching sections:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching sections" });
  }
};
