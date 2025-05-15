const express = require("express");
const branchController = require("../controller/Branchcontroller");
const academicYearController = require("../controller/Academicyearcontroller");
const classController = require("../controller/Classcontroller");
const usercontroller = require("../controller/Usercontroller");

const router = express.Router();

router.post("/signin", usercontroller.login);

module.exports = router;
