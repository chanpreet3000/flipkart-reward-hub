import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import DealCard from "../DealCard/DealCard";
import "./styles.scss";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VerifiedIcon from "@mui/icons-material/Verified";
import { TaskContractAddress } from "../../config.js";
import TaskAbi from "../../TaskContract.json";
import { ethers } from "ethers";

export default function DealInfo() {
  const [deal, setDeal] = useState(null);

  const [popOut, setPopOut] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get(`/api/customer/deals/${id}`);
      setDeal(response.data.deal);
    };
    fetchData();
  }, [id]);

  const buyTheProduct = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const response = await axiosInstance.post(`/api/customer/deals_history/create`, {
        deal_id: deal._id,
        amount: deal.price,
      });
      const { customerWalletId, newCustomerIpfsCid, newRetailerIpfsCid, retailerWalletId } = response.data;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const TaskContract = new ethers.Contract(TaskContractAddress, TaskAbi.abi, signer);
      await TaskContract.setCustomerRetailer(
        retailerWalletId,
        customerWalletId,
        newRetailerIpfsCid,
        newCustomerIpfsCid
      );
      setPopOut(true);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="deal-info">
      {deal && <DealCard ele={deal} />}
      <div
        className="add-to-cart"
        onClick={async () => {
          await buyTheProduct();
        }}
      >
        <div>
          <ShoppingCartIcon style={{ color: "white" }} />
          <div>BUY NOW</div>
        </div>
      </div>
      {popOut && (
        <div className="bought-pop-out">
          <div className="container">
            <div className="wrapper">
              <div>
                <VerifiedIcon style={{ color: "green", fontSize: "40px" }} />
                <h1> Purchased {" " + deal.name} Coupon</h1>
              </div>
              <div>
                Debited{" "}
                <img
                  src="https://rukminim2.flixcart.com/lockin/32/32/images/super_coin_icon_22X22.png?q=90"
                  style={{ width: "25px" }}
                />{" "}
                {deal.price}
              </div>
              <div className="loyalty-wrapper">
                <div className="btn-wrapper">
                  <div
                    className="get-loyalty"
                    onClick={() => {
                      setPopOut(false);
                      navigate("/rewards_hub/deals_history");
                    }}
                  >
                    Deals History
                  </div>
                  <div
                    className="not-now"
                    onClick={() => {
                      setPopOut(false);
                      navigate("/rewards_hub");
                    }}
                  >
                    <div>Rewards Hub</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
