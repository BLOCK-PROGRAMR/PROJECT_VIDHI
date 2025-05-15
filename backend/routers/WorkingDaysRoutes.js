
const express = require("express");
const router = express.Router();
const {createWorkingDays , getWorkingDays , updateWorkingDays} = require("../controller/WorkingDaysController");

// Route to create working days
router.post("/", createWorkingDays);

// Route to view working days
router.get("/:branchId/:academicId", getWorkingDays);

// Route to update working days
router.put("/:branchId/:academicId", updateWorkingDays);

module.exports = router;
