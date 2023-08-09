require("dotenv").config();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;

const handleUserSignUp = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send(`Account with email ${req.body.email} already exists`);

  const data = req.body;
  const encryptedPassword = await bcrypt.hash(req.body.password, 10);

  await User.create({
    name: {
      firstName: data.first_name,
      lastName: data.last_name,
    },
    email: data.email,
    password: encryptedPassword,
    phone: {
      countryCode: data.countryCode,
      phoneNumber: data.phoneNumber,
    },
    address: {
      streetAddress: data.streetAddress,
      zipCode: data.zipCode,
      city: data.city,
      state: data.state,
      country: data.country,
    },
  });
  return res.status(200).send({ success: true });
};

const handleUserLogin = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send(`Account with email ${req.body.email} does not exists`);

  const check = await bcrypt.compare(req.body.password, user.password);
  if (!check) return res.status(400).send(`Please check your details`);

  const token = jwt.sign(
    {
      email: user.email,
      password: user.password,
    },
    JWT_KEY
  );
  res.cookie("token", token);
  return res.status(200).send({ success: true });
};

module.exports = { handleUserSignUp, handleUserLogin };