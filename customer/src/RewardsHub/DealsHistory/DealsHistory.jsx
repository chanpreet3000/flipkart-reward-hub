import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../axios";
import DealCard from "../DealCard/DealCard";
import "./styles.scss";
import FullDealCard from "../FullDealCard/FullDealCard";

export default function DealsHistory() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance
        .get("/api/customer/deals_history")
        .then((response) => {
          response.data.deals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(response.data.deals);
        })
        .catch((err) => {});
    };

    fetchData();
  }, []);
  return (
    <div className="deals-history">
      <h1>Deals History</h1>
      <div className="deals-history-container">
        {orders.map((ele, ind) => {
          return <FullDealCard ele={ele} key={ind} />;
        })}
      </div>
    </div>
  );
}
