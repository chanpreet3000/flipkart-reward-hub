import React, { useEffect, useState } from "react";
import "./styles.css";
import { axiosInstance } from "../axios";
import { useNavigate } from "react-router-dom";

export default function RewardsHub() {
  const [errorMessage, setErrorMessage] = useState("");
  const [userLoyaltyData, setUserLoyaltyData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get("/api/retailer/loyalty");
      setUserLoyaltyData(response.data.data);
    };
    fetchData();
  }, []);

  return userLoyaltyData === null ? (
    <h1>Loading User data. This can take upto 2 minutes....</h1>
  ) : (
    <div className="loyalty">
      <div className="wrapper">
        <h1>Flipkart Loyalty Reward Hub</h1>
        <h3 style={{ marginTop: "2rem" }}>
          Loyalty Coin Balance{" "}
          <img
            src="https://rukminim2.flixcart.com/lockin/32/32/images/super_coin_icon_22X22.png?q=90"
            style={{ width: "15px" }}
          />
          {" " + userLoyaltyData.amount}
        </h3>
        <div className="btn-wrapper">
          <div
            onClick={() => {
              navigate("/rewards_hub/coin_activity");
            }}
          >
            <img
              src="https://rukminim2.flixcart.com/lockin/2000/2000/images/coin-act-dt.png?q=50"
              style={{ width: "100%", cursor: "pointer" }}
            />
          </div>
          <div>
            <img
              src="https://rukminim2.flixcart.com/lockin/2000/2000/images/01AvailExtra.jpg?q=50"
              style={{ width: "100%", cursor: "pointer" }}
            />
          </div>
          <div>
            <img
              src="https://rukminim2.flixcart.com/lockin/2000/2000/images/02TrendyProd.jpg?q=50"
              style={{ width: "100%", cursor: "pointer" }}
            />
          </div>
          <div>
            <img
              src="https://rukminim2.flixcart.com/lockin/2000/2000/images/rewards-dt1.png?q=50"
              style={{ width: "100%", cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
