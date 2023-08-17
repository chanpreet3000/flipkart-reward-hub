import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../axios";

export default function CoinActivityItem({ ele }) {
  const [product, setProduct] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance
        .get(`/api/retailer/products/${ele.productId}`)
        .then((response) => {
          setProduct(response.data.product);
        })
        .catch((err) => {});
    };

    fetchData();
  }, []);

  function timestampToDDMMYYYY(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div>
      <div className="activity-item">
        <div className="activity-item-wrapper">
          <div>
            <img src={product?.image} />
          </div>
          <div>
            <div>{ele.msg}</div>
            <div className="grey">
              {ele.type} on {timestampToDDMMYYYY(ele.created_at)}
            </div>
          </div>
        </div>
        {ele.type === "Credited" && <div className="credit">+{ele.amount}</div>}
        {ele.type === "Debited" && <div className="debit">-{ele.amount}</div>}
      </div>
    </div>
  );
}
