const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");

router.post("/add-subject", subjectController.addSubject);
router.get("/subjects/:userId", subjectController.getSubjects);

module.exports = router;