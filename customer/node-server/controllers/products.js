import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  return res.status(200).send({ success: true, products });
};

export const getProductById = async (req, res) => {
  const productId = req.params["id"];
  const product = await Product.findById(productId);
  return res.status(200).send({ success: true, product });
};
