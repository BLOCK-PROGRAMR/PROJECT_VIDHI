const express = require("express");

const router = express.Router();
const { Addtown, getallTowns,editTown,deleteTown } = require("../controller/TownController");

router.post("/add", Addtown);
router.get("/alltowns/:academicId", getallTowns);
router.put("/edit/:townId",editTown);
router.delete("/del/:townId",deleteTown);
module.exports = router;
