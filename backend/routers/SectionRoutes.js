const express = require("express");
const router = express.Router();
const {
  addSection,
  getAllSections,
  updateSection,
  deleteSection,
  getSectionsByClass,
} = require("../controller/Sectioncontroller");
router.post("/addsection/:classId", addSection);
router.get("/getallsections/:classId", getAllSections);
router.put("/update/:secId", updateSection);
router.delete("/delete/:classId/:sectionId", deleteSection);
router.get("/getall/:className/:acadId", getSectionsByClass);
module.exports = router;
