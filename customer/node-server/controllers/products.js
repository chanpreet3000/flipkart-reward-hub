const Product = require("../models/product.model");

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  return res.status(200).send({ success: true, products });
};

module.exports = { getAllProducts };
