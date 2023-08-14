import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.scss";
import InputField from "../../components/InputField/input_field";
import { axiosInstance } from "../../axios";

export default function CreateDeal() {
  const [form, setForm] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handleForm = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = async (e) => {
    setErrorMessage("");
    //
    await axiosInstance
      .post("/api/retailer/deals/create", {
        ...form,
        image: previewImage,
      })
      .then((response) => {
        navigate("/dashboard/deals");
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(error?.response?.data);
      });
  };

  return (
    <div className="create-product">
      <div className="header">
        <h1>Create a new Deal</h1>
        <Link to="/dashboard/deals">
          <button className="homepage__nav-inverse-btn">See all your deals</button>
        </Link>
      </div>
      <div className="container">
        <div>{previewImage && <img src={previewImage} alt="Preview" />}</div>
        <div>
          <div className="form">
            <h2>Deal Details</h2>
            <InputField label="Name" id="name" type="text" placeholder="15% off on iPhone 14" onChange={handleForm} />
            <InputField
              label="Coupon Code"
              id="coupon_code"
              type="text"
              placeholder="Coupon Code for the offer"
              onChange={handleForm}
            />
            <InputField label="Price" id="price" type="text" placeholder="500 Loyalty Coins" onChange={handleForm} />
            <div>
              <h4>Deal image</h4>
              <input type="file" onChange={handleFileChange} />
            </div>
            <div className="error_message">{errorMessage}</div>
            <button className="homepage__nav-inverse-btn" onClick={handleCreateProduct}>
              Create Deal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
