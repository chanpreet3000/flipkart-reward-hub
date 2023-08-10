require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { errorHandler, restrictToLoggedInUsersOnly } = require("./middleware");
const userRouter = require("./routes/user");
const productsRouter = require("./routes/products");
const dashboardRouter = require("./routes/dashboard");
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
