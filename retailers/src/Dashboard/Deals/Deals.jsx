import React, { useEffect, useState } from "react";
import "./styles.scss";
import { axiosInstance } from "../../axios";
import { Link } from "react-router-dom";
import DealCard from "./DealCard/DealCard";
export default function Deals() {
  const [deals, setDeals] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance
        .get("/api/retailer/deals")
        .then((response) => {
          setDeals(response.data.deals);
        })
        .catch((err) => {});
    };

    fetchData();
  }, []);
  return (
    <div className="deals">
      <div className="container">
        <div className="header">
          <h1>Your Deals</h1>
          <Link to="/dashboard/deals/create">
            <button className="homepage__nav-inverse-btn">Create A New Deal</button>
          </Link>
        </div>

        <div className="items">
          {deals.map((deal, ind) => {
            return <DealCard ele={deal} key={ind} />;
          })}
        </div>
      </div>
    </div>
  );
}
