import React, { useEffect } from "react";
import Navbar from "../Navbar/navbar.component";
import { Link } from "react-router-dom";
import "./styles.css";
const Homepage = () => {
  useEffect(() => {
    document.title = "Flipkart";
  }, []);

  return (
    <>
      <div className="homepage-container">
        <div className="background-image">
          <div>
            <div className="homepage-title">Flipkart For Retailers</div>
            <div className="homepage-description">
              Quickly Search and find the desired payment using our advanced search feature. Stay orfanized and
              easilysplit payments to multiple
            </div>
            <div>
              <div className="hompage-button-container">
                <Link to="/signup">
                  <button className="homepage__nav-inverse-btn">Get Started</button>
                </Link>
                <Link to="/dashboard">
                  <button className="homepage__nav-inverse-btn">Dashboard</button>
                </Link>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
};
export default Homepage;
