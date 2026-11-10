const express = require("express");
const path = require("path");
const analyzeRoute = require("./routes/analyzeRoute");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));
app.use("/api/analyze", analyzeRoute);
app.use(errorHandler);
module.exports = app;
