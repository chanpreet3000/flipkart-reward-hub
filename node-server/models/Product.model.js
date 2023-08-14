import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    warranty: {
      type: String,
    },
    specifications: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    retailerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    retailerName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
