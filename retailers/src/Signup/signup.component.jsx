import React, { useEffect, useState } from "react";
import InputField from "../components/InputField/input_field";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../axios";
import ErrorIcon from "@mui/icons-material/Error";

const Signup = () => {
  const [form, setForm] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [walletId, setWalletId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Flipkart Signup";
  }, []);

  const validateInput = () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email) === false) {
      setErrorMessage("Email is Invalid");
      return false;
    }
    if (form.retailer_name.length < 3) {
      setErrorMessage("First name should have atleast 3 characters");
      return false;
    }
    if (form.password.length < 8) {
      setErrorMessage("Password should be of at least 8 characters");
      return false;
    }
    if (form.password !== form.confirm_password) {
      setErrorMessage("Confirm password is not same as password");
      return false;
    }
    if (!walletId) {
      setErrorMessage("Please connect your wallet");
      return false;
    }
    return true;
  };

  const handleForm = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };
  const registerUser = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    setSuccessMessage("");
    setErrorMessage("");
    setDisabled(true);
    axiosInstance
      .post("api/user/signup", { ...form, walletId })
      .then(() => {
        navigate("/login", { state: { success: true } });
      })
      .catch((error) => {
        setErrorMessage(error.response.data);
        console.error(error);
      })
      .finally(() => {
        setDisabled(false);
      });
  };
  const connectWallet = () => {
    setErrorMessage("");
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          walletConnected(result[0]);
        })
        .catch((err) => {
          setErrorMessage(err);
        });
    } else {
      setErrorMessage("Please Install MetaMask!");
    }
  };
  const walletConnected = (account) => {
    setWalletId(account);
  };
  return (
    <>
      <form onSubmit={registerUser}>
        <div className="signup-form__wrapper">
          <div className="signup__background"></div>
          <div className="signup__form-container">
            <div className="signup-form">
              <h1 className="signup__form-title">Hi There!</h1>
              <h3>Create your account</h3>
              <div className="signup-form_inputs">
                <InputField
                  style={{ flex: "1" }}
                  label="Retailer Name"
                  id="retailer_name"
                  type="text"
                  placeholder="Apple"
                  onChange={handleForm}
                />
                <InputField
                  label="Email"
                  id="email"
                  type="email"
                  placeholder="johndoe@gmail.com"
                  onChange={handleForm}
                />
                <InputField
                  label="Password"
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  onChange={handleForm}
                />
                <InputField
                  label="Confirm password"
                  id="confirm_password"
                  type="password"
                  placeholder="Same as password"
                  onChange={handleForm}
                />
                {walletId === null ? (
                  <div className="signup-form-wallet" onClick={connectWallet}>
                    <div className="btn">Connect your wallet</div>
                  </div>
                ) : (
                  <div className="signup-form-wallet-connected">
                    <ErrorIcon style={{ color: "white" }} />
                    <div className="wrapper">
                      <div className="title">MetaMask Walled Connected!</div>
                      <div>{walletId}</div>
                    </div>
                  </div>
                )}
                <div className="signup-form__agreement-label">
                  By Signing up, I agree to all Terms and Privacy Policy.
                </div>
                <div className="error_message">{errorMessage}</div>
                <input type="submit" className="standard_btn" value="Register" disabled={disabled} />
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  Have an account?{" "}
                  <Link
                    to={"/login"}
                    style={{
                      textDecoration: "none",
                      color: "rgb(0, 102, 255)",
                      fontWeight: "bold",
                    }}
                    replace={true}
                  >
                    Login
                  </Link>
                </div>
                {successMessage && <div className="success_message">{successMessage}</div>}
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Signup;
