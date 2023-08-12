import RetailerUser from "../models/retailer_user.model.js";
import { create } from "ipfs-http-client";
import User from "../models/user.model.js";
const client = create("http://192.168.1.11:5001");

// http://192.168.1.11:8081/ipfs/CID
const getJSONFromCid = async (cid) => {
  const response = client.cat(cid);
  for await (const itr of response) {
    let data = Buffer.from(itr).toString();
    return JSON.parse(data);
  }
  return null;
};

const storeJSONToIpfs = async (data) => {
  const response = await client.add(JSON.stringify(data));
  return response.path;
};

export const giveLoyaltyCoins = async (req, res) => {
  const retailer = await RetailerUser.findById(req.body.retailer_id);
  const customer = req.user;
  const amount = req.body.amount;
  const productId = req.body.product_id;

  const customerIpfsData = await getJSONFromCid(customer.ipfsPath);
  customerIpfsData.amount += 25;
  const newCustomerIpfsCid = await storeJSONToIpfs(customerIpfsData);
  await User.updateOne({ _id: customer._id }, { $set: { ipfsPath: newCustomerIpfsCid } });
};
