const express = require("express");
const router = express.Router();
const { tryCatch } = require("../tryCatch");
const { getDashboardData, getAllProducts, createProduct } = require("../controllers/dashboard");

router.get("/", tryCatch(getDashboardData));
router.get("/sell-product", tryCatch(getAllProducts));
router.post("/sell-product/create", tryCatch(createProduct));

module.exports = router;
