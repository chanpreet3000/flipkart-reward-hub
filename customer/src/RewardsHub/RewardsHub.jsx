import React, { useEffect, useState } from "react";
import "./styles.css";
import { axiosInstance } from "../axios";
import { Link, useNavigate } from "react-router-dom";
import DealCard from "./DealCard/DealCard";
export default function RewardsHub() {
  const [userLoyaltyData, setUserLoyaltyData] = useState(null);
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get("/api/customer/loyalty");
      setUserLoyaltyData(response.data.data);

      const dealsResponse = await axiosInstance.get("/api/customer/deals");
      setDeals(dealsResponse.data.deals);
    };
    fetchData();
  }, []);

  return userLoyaltyData === null ? (
    <h1>Loading User data. This can take upto 2 minutes....</h1>
  ) : (
    <div className="loyalty">
      <div className="wrapper">
        <h1>Flipkart Loyalty Reward Hub</h1>
        <div className="game">
          <Link to="/rewards_hub/spin_wheel">
            <div className="game-wrapper">
              <div className="game-img" />
              <p>Spin a wheel</p>
            </div>
          </Link>
          <Link to="/rewards_hub/scratch_card">
            <div className="game-wrapper">
              <div className="game-img-scratch" />
              <p>Scratch a card</p>
            </div>
          </Link>
        </div>
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
          <div className="plus-deals"></div>
          <div className="plus-deals-container">
            {deals.map((ele, ind) => {
              return <DealCard ele={ele} key={ind} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
