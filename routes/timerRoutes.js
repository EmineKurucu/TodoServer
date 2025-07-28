const express = require("express");
const router = express.Router();
const startTimer = require("../controller/Timer/startTimer");
const stopTimer = require("../controller/Timer/stopTimer");
const getActiveTimer = require("../controller/Timer/getActiveTimer");
const getDailyDuration = require("../controller/Timer/getDailyDuration");
const getWeeklyDuration = require("../controller/Timer/getWeeklyDuration");
const verifyToken = require("../middleware/authMiddleware");

router.post("/timer/start", startTimer);
router.post("/timer/stop", verifyToken, stopTimer);

router.get("/timer/active", verifyToken, getActiveTimer);

router.get("/timer/daily-duration", verifyToken, getDailyDuration);
router.get("/timer/weekly-duratin", verifyToken, getWeeklyDuration);

module.exports = router;


