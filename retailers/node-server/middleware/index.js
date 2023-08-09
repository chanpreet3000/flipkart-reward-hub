require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const JWT_KEY = process.env.JWT_KEY;

const errorHandler = (error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something went wrong!");
};

const restrictToLoggedInUsersOnly = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, JWT_KEY);
    const user = await User.findOne({
      email: decoded.email,
      password: decoded.password,
    });
    if (!user) return res.status(401).send("Invalid or Expired Token");
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send("User not authorized");
  }
};

module.exports = { errorHandler, restrictToLoggedInUsersOnly };
