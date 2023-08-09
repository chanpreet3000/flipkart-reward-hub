const express = require("express");
const router = express.Router();
const { tryCatch } = require("../tryCatch");
const { getDashboardData } = require("../controllers/dashboard");

router.get("/", tryCatch(getDashboardData));

module.exports = router;
