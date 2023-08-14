import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import InputField from "../../components/InputField/input_field";
import { axiosInstance } from "../../axios";

export default function CreateProduct() {
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
      .post("/api/retailer/products/create", {
        ...form,
        image: previewImage,
      })
      .then((response) => {
        navigate("/dashboard/products");
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(error?.response?.data);
      });
  };

  return (
    <div className="create-product">
      <div className="header">
        <h1>Create a new Product</h1>
        <Link to="/dashboard/products">
          <button className="homepage__nav-inverse-btn">See all your products</button>
        </Link>
      </div>
      <div className="container">
        <div>{previewImage && <img src={previewImage} alt="Preview" />}</div>
        <div>
          <div className="form">
            <h2>Product Details</h2>
            <InputField label="Name" id="name" type="text" placeholder="Apple iPhone 14 Pro" onChange={handleForm} />
            <InputField
              label="Description"
              id="description"
              type="text"
              placeholder="Enter product description..."
              onChange={handleForm}
            />
            <InputField label="Price" id="price" type="text" placeholder="59000" onChange={handleForm} />
            <InputField label="Warranty" id="warranty" type="text" placeholder="6 months" onChange={handleForm} />
            <InputField
              label="Specifications"
              id="specifications"
              type="text"
              placeholder="Blue color, 8 gb ram"
              onChange={handleForm}
            />
            <div>
              <h3>Product image(atleast one)</h3>
              <input type="file" onChange={handleFileChange} />
            </div>
            <div className="error_message">{errorMessage}</div>
            <button className="homepage__nav-inverse-btn" onClick={handleCreateProduct}>
              Create Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
