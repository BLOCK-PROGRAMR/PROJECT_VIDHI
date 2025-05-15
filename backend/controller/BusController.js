const Bus = require("../models/Bus");
const AcademicYear = require("../models/Acyear");
const Student = require("../models/student"); // Add this import

// Add a new bus
exports.addBus = async (req, res) => {
  try {
    const {
      busNo,
      vehicleNo,
      driverName,
      driverPhone,
      destination,
      viaTowns,
      academicId,
    } = req.body;

    // Check if bus number already exists for the academic year
    const existingBus = await Bus.findOne({ busNo, academicId });
    if (existingBus) {
      return res.status(400).json({
        success: false,
        message: "Bus number already exists for this academic year",
      });
    }

    const newBus = new Bus({
      busNo,
      vehicleNo,
      driverName,
      driverPhone,
      destination,
      viaTowns,
      academicId,
    });

    const savedBus = await newBus.save();

    // Add bus reference to the AcademicYear's buses array
    await AcademicYear.findByIdAndUpdate(academicId, {
      $push: { buses: savedBus._id },
    });

    return res.status(201).json({
      success: true,
      message: "Bus added successfully",
      data: savedBus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add bus",
      error: error.message,
    });
  }
};

// Get all buses for a specific academic year
exports.getAllBuses = async (req, res) => {
  try {
    const { academicId } = req.params;

    // Find all buses related to the specific academic year
    const buses = await Bus.find({ academicId });
    return res.status(200).json({ success: true, data: buses });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch buses",
      error: error.message,
    });
  }
};

exports.searchBusesByPlace = async (req, res) => {
  try {
    const { academicId } = req.params;
    const { place } = req.body;

    // Validate input
    if (typeof place !== 'string' || place.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "place must be a non-empty string",
      });
    }

    // Find buses that have the specified place in the viaTowns array and match the academic year ID
    const buses = await Bus.find({
      academicId,
      viaTowns: { $elemMatch: { $eq: place } }
    });

    if (buses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No buses found for the given criteria",
      });
    }

    return res.status(200).json({ success: true, data: buses });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to search buses",
      error: error.message,
    });
  }
};

// Update a bus
exports.updateBus = async (req, res) => {
  try {
    const { busId } = req.params;
    const updatedData = req.body;

    // Update the bus
    const updatedBus = await Bus.findByIdAndUpdate(busId, updatedData, {
      new: true,
    });
    if (!updatedBus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Bus updated successfully",
      data: updatedBus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update bus",
      error: error.message,
    });
  }
};

// Delete a bus
exports.deleteBus = async (req, res) => {
  try {
    const { busId } = req.params;

    // Find and delete the bus
    const deletedBus = await Bus.findByIdAndDelete(busId);
    if (!deletedBus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    // Remove the bus reference from the AcademicYear's buses array
    await AcademicYear.findByIdAndUpdate(deletedBus.academicId, {
      $pull: { buses: deletedBus._id },
    });

    return res
      .status(200)
      .json({ success: true, message: "Bus deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete bus",
      error: error.message,
    });
  }
};

// Get vehicle students
exports.getVehicleStudents = async (req, res) => {
  try {
    const { busId } = req.params;
    
    // Find students who use this bus
    const students = await Student.find({
      'transport': true,
      'transportDetails.bus': busId
    })
    .populate('class.id', 'name') // Populate class name
    .populate('section.id', 'name'); // Populate section name

    if (!students || students.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No students found for this vehicle'
      });
    }

    // Transform the data to match the expected format
    const transformedStudents = students.map(student => ({
      ...student.toObject(),
      class: {
        name: student.class.id?.name || student.class.name,
        id: student.class.id?._id || student.class.id
      },
      section: {
        name: student.section.id?.name || student.section.name,
        id: student.section.id?._id || student.section.id
      }
    }));

    res.status(200).json({
      success: true,
      data: transformedStudents
    });

  } catch (error) {
    console.error('Error fetching vehicle students:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicle students',
      error: error.message
    });
  }
};