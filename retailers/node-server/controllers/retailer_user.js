import dotenv from "dotenv";
dotenv.config();

import RetailerUser from "../models/retailer_user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const JWT_KEY = process.env.JWT_KEY;
import { create } from "ipfs-http-client";
const client = create("http://192.168.1.11:5001");

export const handleUserSignUp = async (req, res) => {
  const user = await RetailerUser.findOne({ email: req.body.email });
  if (user) return res.status(400).send(`Account with email ${req.body.email} already exists`);

  const data = req.body;
  const encryptedPassword = await bcrypt.hash(req.body.password, 10);
  
  // Storing the Initial Transaction Data in IPFS.
  const initialLoyaltyData = JSON.stringify({
    amount: 25,
    transactionList: [],
    updated_at: Date.now(),
    created_at: Date.now(),
  });
  const ipfsResponse = await client.add(initialLoyaltyData);

  console.log(data);
  await RetailerUser.create({
    retailer_name: data.retailer_name,
    email: data.email,
    password: encryptedPassword,
    walledId: data.walletId,
    ipfsPath: ipfsResponse.path,
  });
  return res.status(200).send({ success: true });
};

export const handleUserLogin = async (req, res) => {
  const user = await RetailerUser.findOne({ email: req.body.email });
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
  res.cookie("retailer_token", token);
  return res.status(200).send({ success: true });
};
