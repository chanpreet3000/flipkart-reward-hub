import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { errorHandler } from "./util.js";
import customerRouter, { loyaltyCoinDecay } from "./routes/customer.js";
import retailerRouter from "./routes/retailer.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

//Routes
app.use("/api/customer", customerRouter);
app.use("/api/retailer", retailerRouter);

// Error handler
app.use(errorHandler);

async function decay() {
  await loyaltyCoinDecay();
}
setInterval(decay, 1 * 60 * 1000);

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
