import express from 'express';
const router = express.Router();
export default router;

import { tryCatch } from '../tryCatch.js';
import { getAllProducts, getProductById } from '../controllers/products.js';


router.get("/all", tryCatch(getAllProducts));
router.get("/:id", tryCatch(getProductById));
