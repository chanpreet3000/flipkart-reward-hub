import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import RetailerUser from '../models/retailer_user.model.js';
const JWT_KEY = process.env.JWT_KEY;

export const errorHandler = (error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something went wrong!");
};
export const restrictToLoggedInUsersOnly = async (req, res, next) => {
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
