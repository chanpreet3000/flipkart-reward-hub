import express from "express";
const router = express.Router();
import { tryCatch } from "../tryCatch.js";
import { handleUserSignUp, handleUserLogin } from "../controllers/user.js";

router.post("/signup", tryCatch(handleUserSignUp));
router.post("/login", tryCatch(handleUserLogin));
export default router;
