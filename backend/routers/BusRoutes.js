const express = require("express");
const {
  addBus,
  updateBus,
  deleteBus,
  getAllBuses,
  searchBusesByPlace,getVehicleStudents
} = require("../controller/BusController");

const router = express.Router();

router.post("/add-bus", addBus);
router.get("/all-buses/:academicId", getAllBuses);
router.delete("/del-bus/:busId", deleteBus);
router.put("/upd-bus/:busId", updateBus);
router.post("/getBusByPlace/:academicId",searchBusesByPlace);
router.get('/vehicle-students/:busId', getVehicleStudents);
module.exports = router;
