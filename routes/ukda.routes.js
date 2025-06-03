const express = require("express");
const router = express.Router();
const { dailyEmail, weeklyEmail, monthlyEmail } = require("../controllers/email.js");

router.get("/daydailyem", dailyEmail);
router.get("/emailDigitalWeekly", weeklyEmail);
router.get("/emailDigitalMonthly", monthlyEmail);

module.exports = router;