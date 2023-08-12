import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
const JWT_KEY = process.env.JWT_KEY;

export const errorHandler = (error, req, res, next) => {
  console.error(error);
  res.status(500).send("Something went wrong!");
};

export const restrictToLoggedInUsersOnly = async (req, res, next) => {
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
    return res.status(401).send("User not authorized");
  }
};
