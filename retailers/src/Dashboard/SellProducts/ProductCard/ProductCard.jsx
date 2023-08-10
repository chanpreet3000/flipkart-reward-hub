import React from "react";
import "./styles.css";

export default function ProductCard({ data }) {
  const date = new Date(data.createdAt);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return (
    <div className="product">
      <div className="image">
        <img src={data.image} draggable={false}/>
      </div>
      <div className="container">
        <div className="title">
          <div>{data.name}</div>
          <div>₹{data.price}</div>
        </div>
        <div className="description">{data.description}</div>
        <div className="description">{data.specifications}</div>
        <div className="date">You created this product on {formattedDate}</div>
      </div>
    </div>
  );
}
