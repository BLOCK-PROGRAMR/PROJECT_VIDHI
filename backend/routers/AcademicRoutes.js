const express = require("express");
const router = express.Router();
const Academicyearcontroller = require("../controller/Academicyearcontroller");

router.post("/add/:branchId", Academicyearcontroller.createAcademicYear);
router.get("/view/:branchId", Academicyearcontroller.getAcademicYears);
router.delete(
  "/delete/:branchId/:academicYearId",
  Academicyearcontroller.deleteAcademicYear
);
router.put("/edit/:academicYearId", Academicyearcontroller.editAcademicYear);
router.get("/allstudents/:academicyearid",Academicyearcontroller.getStudentCountByAcademicYear)
module.exports = router;
