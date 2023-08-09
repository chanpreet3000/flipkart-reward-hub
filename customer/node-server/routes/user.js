const express = require("express");
const router = express.Router();
const { tryCatch } = require("../tryCatch");
const { handleUserSignUp, handleUserLogin } = require("../controllers/user");

router.post("/signup", tryCatch(handleUserSignUp));
router.post("/login", tryCatch(handleUserLogin));

module.exports = router;
