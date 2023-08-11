import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../axios";
import "./styles.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";

export default function ProductInfo() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [popOut, setPopOut] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance
        .get(`/api/products/${id}`)
        .then((response) => {
          setProduct(response.data.product);
        })
        .catch((err) => {});
    };

    fetchData();
  }, []);
  const date = new Date(product?.createdAt);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const getCoinValue = (price) => {
    if (price < 2000) {
      return 1;
    }
    return Math.min(100, Math.floor(0.01 * price));
  };

  const checkIfLoggedIn = async () => {
    try {
      await axiosInstance.get("/api/dashboard");
      return true;
    } catch (error) {
      return false;
    }
  };

  const buyTheProduct = async () => {
    const check = await checkIfLoggedIn();
    if (check) {
      setPopOut(true);
    } else {
      navigate("/login");
    }
  };
  const closePopOut = () => {
    setPopOut(false);
  };

  return product ? (
    <>
      <div className="productinfo container">
        <div className="image-container">
          <img src={product.image} className="image" draggable={false} />
          <div>
            <div
              className="add-to-cart"
              onClick={async () => {
                await buyTheProduct();
              }}
            >
              <div>
                <ShoppingCartIcon style={{ color: "white" }} />
                <div>BUY NOW</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="wrapper">
            <h2>
              <strong>{product.name}</strong>
            </h2>
            <img
              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
              style={{ width: "75px", height: "20px" }}
            />
            <h1>
              <strong>₹{product.price}</strong>
            </h1>
            <h3>Description</h3>
            <div>{product.description}</div>
            <h3>Specifications</h3>
            <div>{product.specifications}</div>
            <h3>Sold By</h3>
            <div>
              <strong>{product.retailer_name}</strong> on <strong>{formattedDate}</strong>
            </div>
            <h3>
              You will get{" "}
              <img
                src="https://rukminim2.flixcart.com/lockin/32/32/images/super_coin_icon_22X22.png?q=90"
                style={{ width: "15px" }}
              />{" "}
              {getCoinValue(product.price)} for this purchase.
            </h3>
          </div>
        </div>
      </div>
      {popOut && (
        <div className="pop-out">
          <div className="container">
            <div className="close" onClick={closePopOut}>
              <CloseIcon />
            </div>

            <div>
              <img src={product.image} className="image" draggable={false} />
            </div>
            <div className="wrapper">
              <h2>Are you sure you want to buy {product.name}</h2>
              <div>This product is being sold by {product.retailer_name}</div>
              <div>{product.description}</div>
              <div>{product.specifications}</div>
              <h3>
                You will get{" "}
                <img
                  src="https://rukminim2.flixcart.com/lockin/32/32/images/super_coin_icon_22X22.png?q=90"
                  style={{ width: "15px" }}
                />{" "}
                {getCoinValue(product.price)} for this purchase.
              </h3>
              <div className="add-to-cart">
                <div>
                  <ShoppingCartIcon style={{ color: "white" }} />
                  <div>BUY NOW</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <></>
  );
}
