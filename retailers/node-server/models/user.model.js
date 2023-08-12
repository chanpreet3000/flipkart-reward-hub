import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    walletId: { type: String, required: true },
    ipfsPath: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
