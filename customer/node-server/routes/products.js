const express = require("express");
const router = express.Router();
const { tryCatch } = require("../tryCatch");
const { getAllProducts } = require("../controllers/products");

router.get("/all", tryCatch(getAllProducts));

module.exports = router;
