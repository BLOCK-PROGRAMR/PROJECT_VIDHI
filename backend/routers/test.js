
const express = require("express");
const router = express.Router();
router.get("/test", (req, res) => {
    res.send("testing route was working clealry");

});
module.exports = router