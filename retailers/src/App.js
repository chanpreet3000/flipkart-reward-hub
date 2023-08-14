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
import RewardsHub from "./RewardsHub/RewardsHub";
import CoinActivity from "./RewardsHub/CoinActivity/CoinActivity";
import Deals from "./Dashboard/Deals/Deals";
import CreateDeal from "./Dashboard/CreateDeal/CreateDeal";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Homepage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="rewards_hub" element={<RewardsHub />} />
          <Route path="rewards_hub/coin_activity" element={<CoinActivity />} />
          <Route path="dashboard" element={<PrivateRoutes />}>
            <Route index element={<DashboardLayout />} />
            <Route path="products" element={<SellProducts />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="deals" element={<Deals />} />
            <Route path="deals/create" element={<CreateDeal />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
