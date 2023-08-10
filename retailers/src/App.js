import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Homepage from "./Homepage/homepage.component";
import DashboardLayout from "./Dashboard/dashboard_layout.component";
import Login from "./Login/login.component";
import SignUp from "./Signup/signup.component";
import Navbar from "./Navbar/navbar.component";
import PrivateRoutes from "./PrivateRoute";
import SellProducts from "./Dashboard/SellProducts/SellProducts";
import CreateProduct from "./Dashboard/CreateProduct/CreateProduct";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Homepage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="dashboard" element={<PrivateRoutes />}>
            <Route index element={<DashboardLayout />} />
            <Route path="sell-products" element={<SellProducts />} />
            <Route path="sell-products/create" element={<CreateProduct />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
