import React, { useEffect, useState } from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../axios";
import ProductCard from "./ProductCard/ProductCard";

export default function SellProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance
        .get("/api/dashboard/sell-product")
        .then((response) => {
          setProducts(response.data.products);
        })
        .catch((err) => {});
    };

    fetchData();
  }, []);
  return (
    <div className="sell-products__container">
      <div className="sell-products__header">
        <h1>Your Products</h1>
        <Link to="/dashboard/sell-products/create">
          <button className="homepage__nav-inverse-btn">Sell a new Product</button>
        </Link>
      </div>
      
      <div className="sell-products__items">
        {products.map((product, ind) => {
          return <ProductCard data={product}/>;
        })}
      </div>
    </div>
  );
}
