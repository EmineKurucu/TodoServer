const express = require("express");
const router = express.Router();

const {getDailyReport} = require("../controller/ReportControllers/dailyReportController");
const {postWeeklyReport} = require("../controller/ReportControllers/postWeeklyNote");
const {getWeeklyReport} = require("../controller/ReportControllers/weeklyReportController");
const verifyToken = require("../middleware/authMiddleware");



router.get("/report/daily", verifyToken, getDailyReport);
router.get("/report/weekly", verifyToken, getWeeklyReport);

router.post("/report/weekly-note", verifyToken, postWeeklyReport);


module.exports = router;