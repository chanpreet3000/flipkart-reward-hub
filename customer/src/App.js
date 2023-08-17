import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import CustomerHomepage from "./Homepage/homepage.component";
import CustomerLogin from "./Login/login.component";
import CustomerSignUp from "./Signup/signup.component";
import CustomerNavbar from "./Navbar/navbar.component";
import ShopProducts from "./Homepage/ShopProducts/ShopProducts";
import ProductInfo from "./Homepage/ProductInfo/ProductInfo";
import RewardsHub from "./RewardsHub/RewardsHub";
import CoinActivity from "./RewardsHub/CoinActivity/CoinActivity";
import OrderHistory from "./OrderHistory/OrderHistory";
import DealInfo from "./RewardsHub/DealInfo/DealInfo";
import DealsHistory from "./RewardsHub/DealsHistory/DealsHistory";
import ScratchCardComp from "./RewardsHub/Scratchcard/ScratchCardComp";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerNavbar />}>
          <Route index element={<CustomerHomepage />} />
          <Route path="login" element={<CustomerLogin />} />
          <Route path="signup" element={<CustomerSignUp />} />
          <Route path="products" element={<ShopProducts />} />
          <Route path="products/:id" element={<ProductInfo />} />
          <Route path="rewards_hub" element={<RewardsHub />} />
          <Route path="rewards_hub/coin_activity" element={<CoinActivity />} />
          <Route path="order_history" element={<OrderHistory />} />
          <Route path="rewards_hub/deals_history" element={<DealsHistory />} />
          <Route path="rewards_hub/deals/:id" element={<DealInfo />} />
          <Route path="rewards_hub/spin_wheel" element={<DealInfo />} />
          <Route path="rewards_hub/scratch_card" element={<ScratchCardComp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
