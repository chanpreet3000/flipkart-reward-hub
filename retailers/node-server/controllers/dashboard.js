const Product = require("../models/product.model");

const getDashboardData = async (req, res) => {
  return res.status(200).send({ success: true, user_data: req.user });
};

const getAllProducts = async (req, res) => {
  console.log(req.user);
  const products = await Product.find({ user_id: req.user._id });
  return res.status(200).send({ success: true, products });
};

const createProduct = async (req, res) => {
  try {
    console.log(req.user.name);
    const product = await Product.create({ ...req.body, user_id: req.user._id, retailer_name: req.user.name.firstName });
    return res.status(200).send({ success: true, product });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = { getDashboardData, getAllProducts, createProduct };
