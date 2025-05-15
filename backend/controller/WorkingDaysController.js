
const WorkingDays = require("../models/WorkingDays");


exports.createWorkingDays = async (req, res) => {
  try {
    const { branchId, academicId, months } = req.body;

    // Check if working days already exist for the given branchId and academicId
    const existingWorkingDays = await WorkingDays.findOne({ branchId, academicId });

    if (existingWorkingDays) {
      return res.status(400).json({ message: "Working days with this branchId and academicId already exist." });
    }

    // Create a new working days entry if it doesn't exist
    const newWorkingDays = new WorkingDays({ branchId, academicId, months });
    const savedWorkingDays = await newWorkingDays.save();

    res.status(201).json(savedWorkingDays);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get working days by ID
exports.getWorkingDays = async (req, res) => {
    try {
      const { branchId, academicId } = req.params;
  
      // Find working days based on branchId and academicId
      const workingDays = await WorkingDays.findOne({ branchId, academicId })
        .populate("branchId academicId");
  
      // If no record is found
      if (!workingDays) {
        return res.status(404).json({ message: "Working days not found" });
      }
  
      // Send the working days data
      res.status(200).json({ success: true, data: workingDays });
    } catch (err) {
      // Handle errors
      res.status(500).json({ success: false, error: err.message });
    }
  };
  

// Update working days
exports.updateWorkingDays = async (req, res) => {
  try {
    const { branchId, academicId } = req.params;
    const updatedData = req.body;

    // Find and update the working days document based on branchId and academicId
    const updatedWorkingDays = await WorkingDays.findOneAndUpdate(
      { branchId, academicId },
      updatedData,
      { new: true } // Return the updated document
    ).populate("branchId academicId");

    // If no record is found
    if (!updatedWorkingDays) {
      return res.status(404).json({ message: "Working days not found" });
    }

    // Return the updated data
    res.status(200).json({ success: true, data: updatedWorkingDays });
  } catch (err) {
    // Handle errors
    res.status(500).json({ success: false, error: err.message });
  }
};
