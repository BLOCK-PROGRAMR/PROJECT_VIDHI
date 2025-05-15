const express = require("express");
const branchController = require("../controller/Branchcontroller");
const router = express.Router();

router.post("/create-branch", branchController.createBranch);
router.get("/get-branches", branchController.getBranches);
router.delete("/delete-branch/:branchId", branchController.deleteBranch);
router.put("/update-branch/:branchId", branchController.updateBranch);
router.get("/get-branch/:branchId", branchController.getBranchById);

module.exports = router;
