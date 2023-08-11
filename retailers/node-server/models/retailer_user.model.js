const mongoose = require("mongoose");

const RetailerUserSchema = mongoose.Schema(
  {
    retailer_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const RetailerUser = mongoose.model("RetailUser", RetailerUserSchema);
module.exports = RetailerUser;
