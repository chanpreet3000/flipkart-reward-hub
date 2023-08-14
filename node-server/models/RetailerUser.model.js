import mongoose from "mongoose";

const RetailerUserSchema = mongoose.Schema(
  {
    retailerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    walledId: { type: String, required: true},
    ipfsPath: { type: String, required: true },
  },
  { timestamps: true }
);

const RetailerUser = mongoose.model("RetailUser", RetailerUserSchema);
export default RetailerUser;
