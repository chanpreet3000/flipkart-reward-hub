import Product from "../models/product.model.js";

export const getDashboardData = async (req, res) => {
  return res.status(200).send({ success: true, user_data: req.user });
};

export const getAllProducts = async (req, res) => {
  const products = await Product.find({ user_id: req.user._id });
  return res.status(200).send({ success: true, products });
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, user_id: req.user._id, retailer_name: req.user.retailer_name });
    return res.status(200).send({ success: true, product });
  } catch (err) {
    res.status(400).send(err.message);
  }
};
