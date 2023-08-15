import React from "react";
import "./styles.scss";

export default function DealCard({ ele }) {
  return (
    <div className="deal-card">
      <div className="wrapper">
        <div className="title">{ele.name}</div>
        <div>from {ele.retailerName}</div>
        <div className="coupon-area">
          <div>{ele.coupon_code}</div>
        </div>
        <div>
          <img
            src="https://rukminim2.flixcart.com/lockin/32/32/images/super_coin_icon_22X22.png?q=90"
            style={{ width: "15px" }}
          />
          {" " + ele.price}
        </div>
        <div className="coupon-brand">COUPON CODE</div>
      </div>
    </div>
  );
}
