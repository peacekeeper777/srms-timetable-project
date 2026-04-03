const express = require("express");
const router = express.Router();
const controller = require("../controllers/timetableController");

router.post("/add-slot", controller.addSlot);
router.get("/timetable/:userId", controller.getTimetable);
router.delete("/delete-slot/:id", controller.deleteSlot);
router.put("/update-slot/:id", controller.updateSlot);

module.exports = router;