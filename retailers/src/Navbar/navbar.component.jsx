import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./styles.css";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { axiosInstance } from "../axios";

const Navbar = () => {
  const navRef = useRef();
  const [userData, setUserData] = useState(null);
  const toggleNavbar = () => {
    navRef.current.classList.toggle("responsive");
  };
  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance
        .get("/api/dashboard")
        .then((response) => {
          setUserData(response.data.user_data);
        })
        .catch((err) => {
          setUserData(null);
        });
    };

    fetchData();
  }, []);
  return (
    <>
      <nav className="homepage__nav" ref={navRef}>
        <div className="homepage__nav-wrapper">
          <div className="homepage__nav-brand">
            <Link to={"/"}>
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png" />
              <div>For Retailers</div>
            </Link>
          </div>

          <div className="homepage__nav-search-container">
            <input
              type="text"
              placeholder="Search for products, brands and more"
              className="homepage__nav-search-input"
            />
            <SearchIcon />
          </div>

          <div className="homepage__nav-btn-wrapper">
            {userData === null && (
              <>
                <Link to="/login">
                  <button className="homepage__nav-login-btn">Login</button>
                </Link>
                <Link to="/signup">
                  <button className="homepage__nav-signup-btn">Get Started</button>
                </Link>
              </>
            )}
            <Link to="/retailers">
              <button className="homepage__nav-signup-outline-btn">For Customers</button>
            </Link>
            <div className="navbar-close" onClick={toggleNavbar}>
              <CloseIcon />
            </div>
          </div>
          <div className="navbar-menu" onClick={toggleNavbar}>
            <MenuIcon />
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};
export default Navbar;
