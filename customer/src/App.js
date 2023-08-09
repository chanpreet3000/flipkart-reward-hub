import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import CustomerHomepage from "./Homepage/homepage.component";
import CustomerDashboardLayout from "./Dashboard/dashboard_layout.component";
import CustomerLogin from "./Login/login.component";
import CustomerSignUp from "./Signup/signup.component";
import CustomerNavbar from "./Navbar/navbar.component";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerNavbar />}>
          <Route index element={<CustomerHomepage />} />
          <Route path="login" element={<CustomerLogin />} />
          <Route path="signup" element={<CustomerSignUp />} />
          <Route path="dashboard/*" element={<CustomerDashboardLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
