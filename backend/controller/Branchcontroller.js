const Branch = require("../models/Branches");
const users = require("../models/users");
const AcademicYear = require("../models/Acyear");
// Create Branch
exports.createBranch = async (req, res) => {
  try {
    const { name, street, colony, villageTown, phone } = req.body;

    // Check for duplicate branch name
    const existingBranch = await Branch.findOne({ name });
    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: "Branch name already exists. Please choose a different name.",
      });
    }

    // Create a new branch with detailed address fields
    const branch = new Branch({ name, street, colony, villageTown, phone });
    await branch.save();

    res.status(201).json({
      success: true,
      message: "Branch created successfully",
      branch,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Branch
exports.deleteBranch = async (req, res) => {
  const { branchId } = req.params;
  try {
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }

    // Check if the academicYears array is empty
    if (branch.academicYears && branch.academicYears.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Delete all academic years first before deleting the branch",
      });
    }

    // Delete branch admin if exists
    if (branch.branchAdmin) {
      await users.findByIdAndDelete(branch.branchAdmin);
    }

    // Finally, delete the branch
    await Branch.findByIdAndDelete(branchId);

    res.status(200).json({
      success: true,
      message: "Branch and admin deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Branches
exports.getBranches = async (req, res) => {
  try {
    const branches = await Branch.find(); // Fetch all branches from the database
    res.status(200).json({ success: true, branches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//update branch code
// Update Branch
exports.updateBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { name, street, colony, villageTown, phone } = req.body;

    // Check if branch exists
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    // Optional: Check for duplicate branch name if name is being updated
    if (name && name !== branch.name) {
      const existingBranch = await Branch.findOne({ name });
      if (existingBranch) {
        return res.status(400).json({
          success: false,
          message:
            "Branch name already exists. Please choose a different name.",
        });
      }
    }

    // Update branch fields
    branch.name = name || branch.name;
    branch.street = street || branch.street;
    branch.colony = colony || branch.colony;
    branch.villageTown = villageTown || branch.villageTown;
    branch.phone = phone || branch.phone;

    await branch.save();

    res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      branch,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//getbranchby id

// Get Branch by ID Controller Function
exports.getBranchById = async (req, res) => {
  const branchId = req.params.branchId;

  try {
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }

    res.status(200).json({ success: true, data: branch });
  } catch (error) {
    console.error("Error fetching branch:", error);
    res.status(500).json({ success: false, message: "Failed to fetch branch" });
  }
};
