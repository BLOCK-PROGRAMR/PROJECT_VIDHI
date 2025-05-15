const express = require("express");
const Town = require("../models/Towns");
const AcademicYear = require("../models/Acyear"); // Import AcademicYear model
const router = express.Router();
const mongoose = require("mongoose");
// Add town with uniqueness check and associate with academic year
exports.Addtown = async (req, res) => {
  const { townName, amount, halts, academicId } = req.body;

  try {
    // Check for uniqueness of town name
    const existingTown = await Town.findOne({ townName, academicId });
    if (existingTown) {
      return res.status(400).json({
        message: "Town name must be unique within the academic year.",
      });
    }

    // Create new town
    const newTown = new Town({ townName, amount, halts, academicId });
    const savedTown = await newTown.save();

    // Push town ID into the corresponding academic year
    await AcademicYear.findByIdAndUpdate(
      academicId,
      { $addToSet: { towns: savedTown._id } }, // Use $addToSet to avoid duplicates
      { new: true }
    );

    res.status(201).json({
      success: true,
      error: false,
      message: "town added succesfully",
      data: savedTown,
    });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

//editing 
exports.editTown = async (req, res) => {
  const {  townId } = req.params; // Extract ID from request parameters
  const { townName, amount, halts, academicId, Terms } = req.body; // Extract data from request body

  if (!mongoose.Types.ObjectId.isValid(townId)) {
    return res.status(400).json({ message: "Invalid Town ID" });
  }

  try {
    const updatedTown = await Town.findByIdAndUpdate(
      townId,
      { townName, amount, halts, academicId, Terms },
      { new: true, runValidators: true } // `new: true` returns the updated document
    );

    if (!updatedTown) {
      return res.status(404).json({ message: "Town not found" });
    }

    return res.status(200).json({ success: true, data: updatedTown });
  } catch (error) {
    console.error("Error updating town:", error);
    return res.status(500).json({ message: "Error updating town", error: error.message });
  }
};
// Delete Town Controller
exports.deleteTown = async (req, res) => {
  const { townId } = req.params; // Extract ID from request parameters
  if (!mongoose.Types.ObjectId.isValid(townId)) {
    return res.status(400).json({ message: "Invalid Town ID" });
  }

  try {
    // Find the town to delete
    const townToDelete = await Town.findById(townId);
    if (!townToDelete) {
      return res.status(404).json({ message: "Town not found" });
    }

    // Delete the town
    await Town.findByIdAndDelete(townId);

    // Remove town ID from associated Academic record
    await AcademicYear.updateMany(
      { _id: townToDelete.academicId }, // Find Academic record by academicId
      { $pull: { towns: townId } } // Remove town ID from towns array
    );

    return res.status(200).json({ success: true, message: "Town deleted successfully" });
  } catch (error) {
    console.error("Error deleting town:", error);
    return res.status(500).json({ message: "Error deleting town", error: error.message });
  }
};

exports.getallTowns = async (req, res) => {
  const { academicId } = req.params;

  try {
    // Find all towns that match the given academicId
    const towns = await Town.find({ academicId });

    // If no towns are found, return a message
    if (towns.length === 0) {
      return res
        .status(404)
        .json({ message: "No towns found for this academic year." });
    }

    res.status(200).json({ success: true, data: towns });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// module.exports = router;
