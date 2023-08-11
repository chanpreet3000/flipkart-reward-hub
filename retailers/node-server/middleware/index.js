require("dotenv").config();
const jwt = require("jsonwebtoken");
const RetailerUser = require("../models/retailer_user.model");
const JWT_KEY = process.env.JWT_KEY;

const errorHandler = (error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something went wrong!");
};

const restrictToLoggedInUsersOnly = async (req, res, next) => {
  try {
    const token = req.cookies.retailer_token;
    const decoded = jwt.verify(token, JWT_KEY);
    const user = await RetailerUser.findOne({
      email: decoded.email,
      password: decoded.password,
    });
    if (!user) return res.status(401).send("Invalid or Expired Token");
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send("RetailerUser not authorized");
  }
};

module.exports = { errorHandler, restrictToLoggedInUsersOnly };
