import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { axiosInstance } from "../axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Cookies from "js-cookie";

const Navbar = () => {
  const navRef = useRef();
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const popUpRef = useRef(null);
  const [accountPopoutVisible, setAccountPopoutVisible] = useState(false);

  const toggleNavbar = () => {
    navRef.current.classList.toggle("responsive");
  };

  const handlerUserSignOut = () => {
    Cookies.remove("token", { path: "/" });
    navigate(`/login`);
  };

  const handleDocumentClick = (event) => {
    if (accountPopoutVisible && popUpRef.current && !popUpRef.current.contains(event.target)) {
      setAccountPopoutVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/dashboard");
        setUserData(response.data.user_data);
      } catch (err) {
        setUserData(null);
        console.log(err);
      }
    };

    fetchData();
  }, [location]);
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
            <Link to="http://localhost:3000">
              <button className="homepage__nav-signup-outline-btn">For Customers</button>
            </Link>
            <div className="navbar-close" onClick={toggleNavbar}>
              <CloseIcon />
            </div>
            {userData !== null && (
              <div
                className="dashboard__top-nav-menu-profile-card"
                ref={popUpRef}
                onClick={(event) => {
                  event.stopPropagation();
                  setAccountPopoutVisible(!accountPopoutVisible);
                }}
              >
                <div className="dashboard__top-nav-menu-profile-card-photo">
                  <AccountCircleIcon style={{ fontSize: "40px", color: "white" }} />
                </div>
                {accountPopoutVisible && (
                  <div className="dashboard_profile-popout">
                    <div className="dashboard__top-nav-menu-profile-card-name">{userData.retailer_name}</div>
                    <Link to="/dashboard" className="dashboard_profile-popout-item">
                      Dashboard
                    </Link>
                    <Link to="/dashboard/sell-products" className="dashboard_profile-popout-item">
                      All Products
                    </Link>
                    <Link to="/dashboard/sell-products/create" className="dashboard_profile-popout-item">
                      Create A Product
                    </Link>
                    <Link to="#" className="dashboard_profile-popout-item">
                      Report a bug
                    </Link>
                    <button className="dashboard_profile-logout-btn" onClick={handlerUserSignOut}>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
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
