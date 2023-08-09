const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: {
      countryCode: { type: String },
      phoneNumber: { type: String },
    },
    address: {
      streetAddress: { type: String },
      zipCode: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
