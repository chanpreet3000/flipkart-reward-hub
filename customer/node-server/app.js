import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { errorHandler, restrictToLoggedInUsersOnly } from './middleware/index.js';
import userRouter from './routes/user.js';
import productsRouter from './routes/products.js';
import dashboardRouter from './routes/dashboard.js';
import loyaltyRouter from './routes/loyalty.js';

const app = express();

// Starting middlewares
const FRONTEND_URL = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

//Routes
app.use("/api/user", userRouter);
app.use("/api/products", productsRouter);
app.use("/api/dashboard", restrictToLoggedInUsersOnly, dashboardRouter);
app.use("/api/loyalty", restrictToLoggedInUsersOnly, loyaltyRouter);

// Error handler
app.use(errorHandler);

// Connecting Database and Server
const PORT = process.env.PORT;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected!");
    app.listen(PORT, () => {
      console.log(`Server Started and listening to ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
