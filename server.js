const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); // HTTP request logger
const entryRoutes = require("./routes/entryRoutes");
const userRoutes = require("./routes/userRoutes");
const timerRoutes = require("./routes/timerRoutes");
const reportRoutes = require("./routes/reportRoutes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // JSON bodysini parse eder
app.use(morgan("dev")); // İstekleri loglar

// Routes
app.use("/api/entries", entryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/timer", timerRoutes);
app.use("/api/report", reportRoutes);

// Error handler middleware (en sona koyulmalı)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

