import express from 'express';
const router = express.Router();
export default router;

import { tryCatch } from '../tryCatch.js';
import { getDashboardData } from '../controllers/dashboard.js';

router.get("/", tryCatch(getDashboardData));