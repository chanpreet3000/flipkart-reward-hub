import React, { useEffect, useState } from "react";
import "./styles.scss";
import { axiosInstance } from "../../axios";

export default function FullDealCard({ ele }) {
  const [deal, setDeal] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      console.log(ele);
      await axiosInstance
        .get(`/api/customer/deals/${ele.dealId}`)
        .then((response) => {
          setDeal(response.data.deal);
        })
        .catch((err) => {});
    };

    fetchData();
  }, []);
  return (
    <div className="deal-card">
      <div className="wrapper">
        <div className="title">{deal?.name}</div>
        <div>from {deal?.retailerName}</div>
        <div className="coupon-area">
          <div>{deal?.coupon_code}</div>
        </div>
        <div>
          <img
            src="https://rukminim2.flixcart.com/lockin/32/32/images/super_coin_icon_22X22.png?q=90"
            style={{ width: "15px" }}
          />
          {" " + deal?.price}
        </div>
        <div className="coupon-brand">COUPON CODE</div>
      </div>
    </div>
  );
}
