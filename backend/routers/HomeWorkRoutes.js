const express = require("express");
const router = express.Router();
const homeworkController = require("../controller/HomeWorkController");

// Create Homework (POST)
router.post("/", homeworkController.createHomework);

// Get Homework (GET)
router.get("/", homeworkController.getHomeworks);

// Update Homework (PUT)
router.put("/:id", homeworkController.updateHomework);
// Delete Homework (DELETE)
router.delete("/:id", homeworkController.deleteHomework);

module.exports = router;
