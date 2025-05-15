const express = require("express");
const router = express.Router();

const usercontroller = require("../controller/Usercontroller");
// Assign admin to branch
router.post("/assign-admin", usercontroller.assignBranchAdmin);

// Get all branch admins
router.get("/alladmins", usercontroller.getAllBranchAdmins);
router.get("/admin/:adminId",usercontroller.getBranchAdmin);
router.put("/edit-admin/:adminId",usercontroller.editBranchAdmin);
router.delete("/del-admin/:adminId", usercontroller.deleteBranchAdmin);

module.exports = router;
