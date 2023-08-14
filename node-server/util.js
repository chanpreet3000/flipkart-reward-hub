import dotenv from "dotenv";
dotenv.config();
import { create } from "ipfs-http-client";
const client = create(process.env.IPFS_ORIGIN);

export const errorHandler = (error, req, res, next) => {
  console.error(error);
  res.status(500).send("Something went wrong!");
};

export const getJSONFromCid = async (cid) => {
  const response = client.cat(cid);
  for await (const itr of response) {
    let data = Buffer.from(itr).toString();
    return JSON.parse(data);
  }
  return null;
};

export const storeJSONToIpfs = async (data) => {
  const response = await client.add(JSON.stringify(data));
  return response.path;
};

export const tryCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res);
  } catch (error) {
    return next(error);
  }
};
