import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Product from "../models/Product.model.js";
import { getJSONFromCid, storeJSONToIpfs, tryCatch } from "../util.js";
import RetailerUser from "../models/RetailerUser.model.js";
import Deal from "../models/Deal.model.js";
const JWT_KEY = process.env.JWT_KEY;
const retailerToken = "retailerToken";

//
//
//
//
//API RETAILER ROUTES HANDLERS
const restrictToRetailerOnly = async (req, res, next) => {
  try {
    const token = req.cookies[retailerToken];
    const decoded = jwt.verify(token, JWT_KEY);
    const retailer = await RetailerUser.findOne({
      email: decoded.email,
      password: decoded.password,
    });
    if (!retailer) return res.status(401).send("Invalid or Expired Token");
    req.retailer = retailer;
    next();
  } catch (err) {
    return res.status(401).send("Retailer User not authorized");
  }
};

const handleRetailerSignup = async (req, res) => {
  const user = await RetailerUser.findOne({ email: req.body.email });
  if (user) return res.status(400).send(`Account with email ${req.body.email} already exists`);

  const data = req.body;
  const encryptedPassword = await bcrypt.hash(req.body.password, 10);

  // Storing the Initial Transaction Data in IPFS.
  const ipfsPath = await storeJSONToIpfs({
    amount: 5000,
    transactionList: [],
    updatedAt: Date.now(),
    createdAt: Date.now(),
  });

  await RetailerUser.create({
    retailerName: data.retailer_name,
    email: data.email,
    password: encryptedPassword,
    walledId: data.walletId,
    ipfsPath: ipfsPath,
  });
  return res.status(200).send({ success: true });
};

const handleRetailerLogin = async (req, res) => {
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
  res.cookie(retailerToken, token);
  return res.status(200).send({ success: true });
};

const getProductById = async (req, res) => {
  const productId = req.params["id"];
  const product = await Product.findById(productId);
  return res.status(200).send({ success: true, product });
};

const getRetailerProducts = async (req, res) => {
  const products = await Product.find({ retailerId: req.retailer._id });
  return res.status(200).send({ success: true, products });
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      retailerId: req.retailer._id,
      retailerName: req.retailer.retailerName,
    });
    return res.status(200).send({ success: true, product });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getRetailerDashboardData = async (req, res) => {
  return res.status(200).send({ success: true, user_data: req.retailer });
};

const getRetailerLoyaltyCoins = async (req, res) => {
  const retailer = req.retailer;
  const retailerIpfsData = await getJSONFromCid(retailer.ipfsPath);
  return res.status(200).send({ success: "true", data: retailerIpfsData });
};

const getRetailerDeals = async (req, res) => {
  const deals = await Deal.find({ retailerId: req.retailer._id });
  return res.status(200).send({ success: true, deals });
};

const createDeal = async (req, res) => {
  try {
    const deal = await Deal.create({
      ...req.body,
      retailerId: req.retailer._id,
      retailerName: req.retailer.retailerName,
    });
    return res.status(200).send({ success: true, deal });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

//
//
//
//
//API RETAILER ROUTES
router.post("/user/signup", tryCatch(handleRetailerSignup));
router.post("/user/login", tryCatch(handleRetailerLogin));
router.get("/products/:id", tryCatch(getProductById));
router.get("/products", restrictToRetailerOnly, tryCatch(getRetailerProducts));
router.post("/products/create", restrictToRetailerOnly, tryCatch(createProduct));
router.get("/dashboard", restrictToRetailerOnly, tryCatch(getRetailerDashboardData));
router.get("/loyalty", restrictToRetailerOnly, tryCatch(getRetailerLoyaltyCoins));
router.get("/deals", restrictToRetailerOnly, tryCatch(getRetailerDeals));
router.post("/deals/create", restrictToRetailerOnly, tryCatch(createDeal));

export default router;
