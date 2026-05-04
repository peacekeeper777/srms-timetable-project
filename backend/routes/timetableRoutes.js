const express = require("express");
const router = express.Router();

const controller = require("../controllers/timetableController");
const validateSchedule = require("../middleware/validateSchedule");

router.post("/add-slot", validateSchedule, controller.addSlot);

router.get("/timetable/:userId", controller.getTimetable);
router.delete("/delete-slot/:id", controller.deleteSlot);
router.put("/update-slot/:id", controller.updateSlot);

router.get("/availability", controller.getAvailability);

module.exports = router;
