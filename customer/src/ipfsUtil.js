import dotenv from "dotenv";
dotenv.config();
import { create } from "ipfs-http-client";
const client = create(process.env.IPFS_ORIGIN);

export const getJSONFromCid = async (cid) => {
  const response = client.cat(cid);
  let data = "";
  for await (const itr of response) {
    data += Buffer.from(itr).toString();
  }
  return JSON.parse(data);
};

export const storeJSONToIpfs = async (data) => {
  const response = await client.add(JSON.stringify(data));
  return response.path;
};
