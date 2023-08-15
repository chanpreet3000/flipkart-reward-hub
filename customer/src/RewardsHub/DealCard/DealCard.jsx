import React from "react";
import "./styles.scss";
import { Link } from "react-router-dom";

export default function DealCard({ ele }) {
  return (
    <div className="deal-card">
      <div className="deal-card-wrapper">
        <div className="title">{ele.name}</div>
        <div>from {ele.retailerName}</div>
        <div style={{ marginTop: "1rem" }}>
          <div className="coupon-brand">COUPON CODE</div>
          <Link to={`/rewards_hub/deals/${ele._id}`} style={{ textDecoration: "none" }}>
            <div className="homepage__nav-signup-outline-btn">
              <div style={{ textAlign: "center" }}>
                BUY for{" "}
                <img
                  src="https://rukminim2.flixcart.com/lockin/32/32/images/super_coin_icon_22X22.png?q=90"
                  style={{ width: "13px" }}
                />
                {" " + ele.price}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
