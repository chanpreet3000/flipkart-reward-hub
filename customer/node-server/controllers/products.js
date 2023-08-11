const Product = require("../models/product.model");

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  return res.status(200).send({ success: true, products });
};

const getProductById = async (req, res) => {
  const productId = req.params["id"];
  const product = await Product.findById(productId);
  return res.status(200).send({ success: true, product });
};

module.exports = { getAllProducts, getProductById };
