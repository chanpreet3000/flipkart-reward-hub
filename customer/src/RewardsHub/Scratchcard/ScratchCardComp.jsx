import React, { useRef, useState } from "react";
import ScratchCard from "react-scratchcard";
import "./styles.css";
import IMG from "../../raw/Safeimagekit-resized-img.png";
import { TaskContractAddress } from "../../config.js";
import TaskAbi from "../../TaskContract.json";
import { ethers } from "ethers";
import { axiosInstance } from "../../axios";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useNavigate } from "react-router-dom";

const ScratchCardComp = () => {
  const [value, setValue] = useState(Math.floor(Math.random() * 50));
  const [popOut, setPopOut] = useState(false);
  const [boughtPopOut, setBoughtPopOut] = useState(false);
  const navigate = useNavigate();

  const settings = {
    width: 350,
    height: 350,
    image: IMG,
    finishPercent: 80,
    onComplete: () => {
      setPopOut(true);
    },
  };

  const getLoyaltyCoins = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const response = await axiosInstance.post(`/api/customer/scratch_card/credit`, {
        amount: value,
      });
      const { customerWalletId, newCustomerIpfsCid } = response.data;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const TaskContract = new ethers.Contract(TaskContractAddress, TaskAbi.abi, signer);
      await TaskContract.setCid(customerWalletId, newCustomerIpfsCid);
      setBoughtPopOut(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="scratch-card">
      <div className="container">
        <ScratchCard {...settings}>
          <div className="inner-div">
            <h2>You won {value} coins</h2>
          </div>
        </ScratchCard>
      </div>
      {popOut && (
        <div className="bought-pop-out">
          <div className="container">
            <div className="wrapper">
              <div>You won {value} Loyalty Coins!</div>
              <div className="loyalty-wrapper">
                <div className="btn-wrapper">
                  <div
                    className="get-loyalty"
                    onClick={async () => {
                      await getLoyaltyCoins();
                    }}
                  >
                    Get {value}
                  </div>
                  <div
                    className="not-now"
                    onClick={() => {
                      setPopOut(false);
                    }}
                  >
                    <div>Not now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {boughtPopOut && (
        <div className="bought-pop-out">
          <div className="container">
            <div className="wrapper">
              <div>
                <VerifiedIcon style={{ color: "green", fontSize: "40px" }} />
                <h1>
                  Credited{" "}
                  <img
                    src="https://rukminim2.flixcart.com/lockin/32/32/images/super_coin_icon_22X22.png?q=90"
                    style={{ width: "25px" }}
                  />{" "}
                  {value + " "}
                </h1>
              </div>
              <div className="loyalty-wrapper">
                <div className="btn-wrapper">
                  <div
                    className="get-loyalty"
                    onClick={() => {
                      setBoughtPopOut(false);
                      navigate("/rewards_hub");
                    }}
                  >
                    Rewards Hub
                  </div>
                  <div
                    className="not-now"
                    onClick={() => {
                      setBoughtPopOut(false);
                      navigate("/");
                    }}
                  >
                    <div>Shop Other Products</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScratchCardComp;
