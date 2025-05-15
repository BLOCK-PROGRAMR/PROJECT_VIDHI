const express = require("express");
const {
  createClass,
  getAllClasses,
  updateClass,
  deleteClass,
  getClassDetails,
} = require("../controller/Classcontroller");

const router = express.Router();

router.post("/create-class", createClass); // Create a class
router.get("/get-classes/:acadId", getAllClasses); // Get all classes
// router.put("/classes/:id", editClass);        // Edit a class
router.delete("/delete-class/:id", deleteClass);
router.get("/get-class/:classId", getClassDetails); // Delete a class
router.put("/update/:classId", updateClass);

module.exports = router;
