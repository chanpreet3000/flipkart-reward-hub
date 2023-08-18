import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CustomerUser from "../models/CustomerUser.model.js";
import OrderHistory from "../models/OrderHistory.model.js";
import Product from "../models/Product.model.js";
import { getJSONFromCid, storeJSONToIpfs, tryCatch } from "../util.js";
import RetailerUser from "../models/RetailerUser.model.js";
import Deal from "../models/Deal.model.js";
import DealOrderHistory from "../models/DealOrderHistory.model.js";
const JWT_KEY = process.env.JWT_KEY;
const customerToken = "customerToken";
//
//
//
//
//API CUSTOMER ROUTES HANDLERS
const restrictToCustomerOnly = async (req, res, next) => {
  try {
    const token = req.cookies[customerToken];
    const decoded = jwt.verify(token, JWT_KEY);
    const customer = await CustomerUser.findOne({
      email: decoded.email,
      password: decoded.password,
    });
    if (!customer) return res.status(401).send("Invalid or Expired Token");
    req.customer = customer;
    next();
  } catch (err) {
    return res.status(401).send("CustomerUser not authorized");
  }
};
const handleCustomerSignUp = async (req, res) => {
  const user = await CustomerUser.findOne({ email: req.body.email });
  if (user) return res.status(400).send(`Account with email ${req.body.email} already exists`);

  const data = req.body;
  const encryptedPassword = await bcrypt.hash(req.body.password, 10);

  // Storing the Initial Transaction Data in IPFS.
  const ipfsPath = await storeJSONToIpfs({
    amount: 25,
    transactionList: [],
    updated_at: Date.now(),
    created_at: Date.now(),
  });

  await CustomerUser.create({
    name: {
      firstName: data.first_name,
      lastName: data.last_name,
    },
    email: data.email,
    password: encryptedPassword,
    walletId: data.walletId,
    ipfsPath: ipfsPath,
  });
  return res.status(200).send({ success: true });
};

const handleCustomerLogin = async (req, res) => {
  const user = await CustomerUser.findOne({ email: req.body.email });
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
  res.cookie(customerToken, token);
  return res.status(200).send({ success: true });
};

const getCustomerDashboardData = async (req, res) => {
  return res.status(200).send({ success: true, user_data: req.customer });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  return res.status(200).send({ success: true, products });
};

const getProductById = async (req, res) => {
  const productId = req.params["id"];
  const product = await Product.findById(productId);
  return res.status(200).send({ success: true, product });
};

const createCustomerOrderHistory = async (req, res) => {
  const order_history = await OrderHistory.create({
    userId: req.customer._id,
    productId: req.body.product_id,
    amount: req.body.amount,
  });
  return res.status(200).send({ success: true, order_history });
};

const getCustomerOrderHistory = async (req, res) => {
  const orders = await OrderHistory.find({ userId: req.customer._id });
  return res.status(200).send({ success: true, orders });
};

const creditLoyaltyCoinsToCustomer = async (req, res) => {
  const retailer = await RetailerUser.findById(req.body.retailer_id);
  const customer = req.customer;
  const amount = req.body.amount;
  const productId = req.body.product_id;
  const name = req.body.name;

  const retailerIpfsData = await getJSONFromCid(retailer.ipfsPath);
  const customerIpfsData = await getJSONFromCid(customer.ipfsPath);

  //Retailer Update
  retailerIpfsData.amount -= amount;
  retailerIpfsData.transactionList.push({
    created_at: Date.now(),
    amount: amount,
    productId: productId,
    customerId: customer._id,
    type: "Debited",
    msg: `${customer.firstName + " " + customer.lastName} purchased your product "${name}"`,
  });
  retailerIpfsData.updated_at = Date.now();

  //Customer Update
  customerIpfsData.amount += amount;
  customerIpfsData.transactionList.push({
    created_at: Date.now(),
    amount: amount,
    productId: productId,
    type: "Credited",
    msg: `You purchased a product ${name}`,
  });
  customerIpfsData.updated_at = Date.now();

  const newRetailerIpfsCid = await storeJSONToIpfs(retailerIpfsData);
  const newCustomerIpfsCid = await storeJSONToIpfs(customerIpfsData);

  await RetailerUser.updateOne({ _id: retailer._id }, { $set: { ipfsPath: newRetailerIpfsCid } });
  await CustomerUser.updateOne({ _id: customer._id }, { $set: { ipfsPath: newCustomerIpfsCid } });
  return res.status(200).send({
    success: true,
    newRetailerIpfsCid,
    newCustomerIpfsCid,
    retailerWalletId: retailer.walletId,
    customerWalletId: customer.walletId,
  });
};

const getCustomerLoyaltyCoins = async (req, res) => {
  const customer = req.customer;
  const customerIpfsData = await getJSONFromCid(customer.ipfsPath);
  return res.status(200).send({ success: "true", data: customerIpfsData });
};

const getAllDeals = async (req, res) => {
  const deals = await Deal.find({});
  return res.status(200).send({ success: true, deals });
};

const getDealById = async (req, res) => {
  const dealId = req.params["id"];
  const deal = await Deal.findById(dealId);
  return res.status(200).send({ success: "true", deal });
};

const createDealOrderHistory = async (req, res) => {
  await DealOrderHistory.create({
    userId: req.customer._id,
    dealId: req.body.deal_id,
    amount: req.body.amount,
  });
  //
  const deal = await Deal.findById(req.body.deal_id);
  const retailer = await RetailerUser.findById(deal.retailerId);
  const customer = req.customer;
  const amount = req.body.amount;
  const productId = req.body.deal_id;

  const retailerIpfsData = await getJSONFromCid(retailer.ipfsPath);
  const customerIpfsData = await getJSONFromCid(customer.ipfsPath);

  //Retailer Update
  retailerIpfsData.amount += amount;
  retailerIpfsData.transactionList.push({
    created_at: Date.now(),
    amount: amount,
    productId: productId,
    customerId: customer._id,
    type: "Credited",
    msg: `${customer.name.firstName + " " + customer.name.lastName} purchased your deal "${deal.name}"`,
  });
  retailerIpfsData.updated_at = Date.now();

  //Customer Update
  customerIpfsData.amount -= amount;
  customerIpfsData.transactionList.push({
    created_at: Date.now(),
    amount: amount,
    productId: productId,
    type: "Debited",
    msg: `You purchased a deal ${deal.name}`,
  });
  customerIpfsData.updated_at = Date.now();

  const newRetailerIpfsCid = await storeJSONToIpfs(retailerIpfsData);
  const newCustomerIpfsCid = await storeJSONToIpfs(customerIpfsData);

  await RetailerUser.updateOne({ _id: retailer._id }, { $set: { ipfsPath: newRetailerIpfsCid } });
  await CustomerUser.updateOne({ _id: customer._id }, { $set: { ipfsPath: newCustomerIpfsCid } });
  return res.status(200).send({
    success: true,
    newRetailerIpfsCid,
    newCustomerIpfsCid,
    retailerWalletId: retailer.walletId,
    customerWalletId: customer.walletId,
  });
};

const getCustomerDealsOrderHistory = async (req, res) => {
  const deals = await DealOrderHistory.find({ userId: req.customer._id });
  return res.status(200).send({ success: true, deals });
};

const creditScratchCardLoyaltyCoinsToCustomer = async (req, res) => {
  const customer = req.customer;
  const amount = req.body.amount;

  const customerIpfsData = await getJSONFromCid(customer.ipfsPath);
  //Customer Update
  customerIpfsData.amount += amount;
  customerIpfsData.transactionList.push({
    created_at: Date.now(),
    amount: amount,
    productId: "",
    type: "Credited",
    msg: `You won ${amount} in Scratch Card`,
  });
  customerIpfsData.updated_at = Date.now();

  const newCustomerIpfsCid = await storeJSONToIpfs(customerIpfsData);

  await CustomerUser.updateOne({ _id: customer._id }, { $set: { ipfsPath: newCustomerIpfsCid } });
  return res.status(200).send({
    success: true,
    newCustomerIpfsCid,
    customerWalletId: customer.walletId,
  });
};

const creditSpinWheelLoyaltyCoinsToCustomer = async (req, res) => {
  const customer = req.customer;
  const amount = req.body.amount;

  const customerIpfsData = await getJSONFromCid(customer.ipfsPath);
  //Customer Update
  customerIpfsData.amount += amount;
  customerIpfsData.transactionList.push({
    created_at: Date.now(),
    amount: amount,
    productId: "",
    type: "Credited",
    msg: `You won ${amount} in Spin Wheel`,
  });
  customerIpfsData.updated_at = Date.now();

  const newCustomerIpfsCid = await storeJSONToIpfs(customerIpfsData);

  await CustomerUser.updateOne({ _id: customer._id }, { $set: { ipfsPath: newCustomerIpfsCid } });
  return res.status(200).send({
    success: true,
    newCustomerIpfsCid,
    customerWalletId: customer.walletId,
  });
};
//
//
//
//
//API CUSTOMER ROUTES
router.post("/user/signup", tryCatch(handleCustomerSignUp));
router.post("/user/login", tryCatch(handleCustomerLogin));
router.get("/products", tryCatch(getAllProducts));
router.get("/products/:id", tryCatch(getProductById));
router.get("/dashboard", restrictToCustomerOnly, tryCatch(getCustomerDashboardData));
router.post("/orders/new", restrictToCustomerOnly, tryCatch(createCustomerOrderHistory));
router.get("/orders", restrictToCustomerOnly, tryCatch(getCustomerOrderHistory));
router.get("/loyalty", restrictToCustomerOnly, tryCatch(getCustomerLoyaltyCoins));
router.post("/loyalty/credit", restrictToCustomerOnly, tryCatch(creditLoyaltyCoinsToCustomer));
router.get("/deals", restrictToCustomerOnly, tryCatch(getAllDeals));
router.get("/deals/:id", restrictToCustomerOnly, tryCatch(getDealById));
router.post("/deals_history/create", restrictToCustomerOnly, tryCatch(createDealOrderHistory));
router.get("/deals_history", restrictToCustomerOnly, tryCatch(getCustomerDealsOrderHistory));
router.post("/scratch_card/credit", restrictToCustomerOnly, tryCatch(creditScratchCardLoyaltyCoinsToCustomer));
router.post("/spin_wheel/credit", restrictToCustomerOnly, tryCatch(creditSpinWheelLoyaltyCoinsToCustomer));

export default router;
