const express = require("express");
const router = express.Router();
const { tryCatch } = require("../tryCatch");
const { getAllProducts, getProductById } = require("../controllers/products");

router.get("/all", tryCatch(getAllProducts));
router.get("/:id", tryCatch(getProductById));

module.exports = router;
