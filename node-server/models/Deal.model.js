import mongoose from "mongoose";

const DealSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    coupon_code: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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

const Deal = mongoose.model("Deal", DealSchema);
export default Deal;
