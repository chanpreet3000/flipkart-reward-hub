import express from "express";
const router = express.Router();
import { tryCatch } from '../tryCatch.js';
import { giveLoyaltyCoins } from '../controllers/loyalty.js';

router.post("/give_loyalty_coins", tryCatch(giveLoyaltyCoins));
export default router;
