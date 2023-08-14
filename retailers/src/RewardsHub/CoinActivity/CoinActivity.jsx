import React, { useEffect, useState } from "react";
import "./styles.css";
import { axiosInstance } from "../../axios";
import CoinActivityItem from "./CoinActivityItem";
import { useNavigate } from "react-router-dom";

export default function CoinActivity() {
  const [errorMessage, setErrorMessage] = useState("");
  const [userLoyaltyData, setUserLoyaltyData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get("/api/retailer/loyalty");
      response.data.data.transactionList.sort((a, b) => b.created_at - a.created_at);
      setUserLoyaltyData(response.data.data);
    };
    fetchData();
  }, []);
  return userLoyaltyData === null ? (
    <h1>Loading User data. This can take upto 2 minutes....</h1>
  ) : (
    <div className="loyalty">
      <div style={{ width: "50%", marginTop: "2rem" }}>
        <button
          className="homepage__nav-inverse-btn"
          onClick={() => {
            navigate("/rewards_hub");
          }}
        >
          Return to reward hub
        </button>
      </div>
      <div className="wrapper">
        <h3>
          Loyalty Coin Balance{" "}
          <img
            src="https://rukminim2.flixcart.com/lockin/32/32/images/super_coin_icon_22X22.png?q=90"
            style={{ width: "15px" }}
          />
          {" " + userLoyaltyData.amount}
        </h3>
        <div>
          <img
            src="https://rukminim2.flixcart.com/lockin/2000/2000/images/non-plus-coinbalance-slice.jpg?q=50"
            style={{ width: "100%", cursor: "pointer" }}
          />
        </div>
        <div>
          <img
            src=" https://rukminim2.flixcart.com/lockin/2000/2000/images/Recent-Coin-activity__1533290148.png?q=50"
            style={{ width: "100%", cursor: "pointer" }}
          />
        </div>
        <div className="activity-wrapper">
          {userLoyaltyData.transactionList.map((ele, ind) => {
            return <CoinActivityItem ele={ele} key={ind} />;
          })}
        </div>
      </div>
    </div>
  );
}
