import mongoose from "mongoose";

const DealOrderHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DealOrderHistory = mongoose.model("DealOrderHistory", DealOrderHistorySchema);
export default DealOrderHistory;
