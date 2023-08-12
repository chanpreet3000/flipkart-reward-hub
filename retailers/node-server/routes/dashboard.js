import express from 'express';
const router = express.Router();

import { tryCatch } from '../tryCatch.js';
import { getDashboardData, getAllProducts, createProduct } from '../controllers/dashboard.js';

router.get("/", tryCatch(getDashboardData));
router.get("/sell-product", tryCatch(getAllProducts));
router.post("/sell-product/create", tryCatch(createProduct));

export default router;
