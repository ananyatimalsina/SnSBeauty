import React, { useEffect, useState } from "react";
import UserModel from "../Models/UserModel";
import "./AuthPage.css";
import Popup from "../Components/Popup";
import { Navigation, isAuth } from "../utils";
import { Navigate } from "react-router-dom";
import parsePhoneNumber from "libphonenumber-js";

// TODO Fix popup
export default function AuthPage() {
  const [selectedForm, setSelectedForm] = useState("login-form");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [currentVerify, setCurrentVerify] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  useEffect(() => {
    if (popupMessage !== "") {
      setShowPopup(true);
    }
  }, [popupMessage]);

  function login(e) {
    // make sure the Phone number is an actual Phone number
    const phoneNumber = parsePhoneNumber(phone, "US");

    if (!phoneNumber.isValid() && !phoneNumber.isPossible()) {
      setPopupMessage("Please enter a valid Phone number.");
      return;
    }

    // make sure password isn't empty
    if (password === "") {
      setPopupMessage("Please enter a password.");
      return;
    }

    // make sure the password is at least 8 characters long
    if (password.length < 8) {
      setPopupMessage(
        "Please enter a password that is at least 8 characters long."
      );
      return;
    }

    const user = new UserModel(phone, password);

    user.login().then((data) => {
      if (!data || !data.token) {
        setPopupMessage(data ? data.detail : "An error occurred.");
      } else {
        localStorage.setItem("token", data.token);
        Navigation.home();
      }
    });
  }

  function signup(e) {
    // make sure the Phone number is an actual Phone number
    const phoneNumber = parsePhoneNumber(phone, "US");

    if (!phoneNumber.isValid() && !phoneNumber.isPossible()) {
      setPopupMessage("Please enter a valid Phone number.");
      return;
    }

    // make sure password isn't empty
    if (password === "") {
      setPopupMessage("Please enter a password.");
      return;
    }

    // make sure the password is at least 8 characters long
    if (password.length < 8) {
      setPopupMessage(
        "Please enter a password that is at least 8 characters long."
      );

      return;
    }

    // make sure the passwords match
    if (password !== password2) {
      setPopupMessage("Passwords do not match.");

      return;
    }

    const user = new UserModel(phone, password);
    user.signup().then((data) => {
      if (!data) {
        setPopupMessage(data ? data.detail : "An error occurred.");
      } else {
        setCurrentVerify("signup");
        setShowVerify(true);
      }
    });
  }

  function reset(e) {
    // make sure the Phone number is an actual Phone number
    const phoneNumber = parsePhoneNumber(phone, "US");

    if (!phone === "" && !phoneNumber.isValid() && !phoneNumber.isPossible()) {
      setPopupMessage("Please enter a valid Phone number.");
      return;
    }

    // make sure password isn't empty
    if (password === "") {
      setPopupMessage("Please enter a password.");
      return;
    }

    // make sure the password is at least 8 characters long
    if (password.length < 8) {
      setPopupMessage(
        "Please enter a password that is at least 8 characters long."
      );

      return;
    }

    // make sure the passwords match
    if (password !== password2) {
      setPopupMessage("Passwords do not match.");

      return;
    }

    const user = new UserModel(phone, password);
    user.resetPassword().then((data) => {
      if (!data) {
        setPopupMessage(data ? data.detail : "An error occurred.");
      } else {
        setCurrentVerify("reset");
        setShowForgot(false);
        setShowVerify(true);
      }
    });
  }

  function verify(e) {
    if (currentVerify === "") {
      return;
    }
    const user = new UserModel(phone, password);
    if (currentVerify === "signup") {
      user.verifySignup(verifyCode).then((data) => {
        if (!data || !data.token) {
          setPopupMessage(data ? data.detail : "An error occurred.");
        } else {
          localStorage.setItem("token", data.token);
          Navigation.home();
        }
      });
    }
    if (currentVerify === "reset") {
      user.verifyResetPassword(verifyCode).then((data) => {
        if (!data || !data.token) {
          setPopupMessage(data ? data.detail : "An error occurred.");
        } else {
          localStorage.setItem("token", data.token);
          Navigation.home();
        }
      });
    }
    setCurrentVerify("");
  }

  if (isAuth()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="authContainer">
      {showPopup && (
        <Popup
          message={popupMessage}
          type="error"
          onClose={() => {
            setShowPopup(false);
            setPopupMessage("");
          }}
        />
      )}
      <button
        className="homeButton"
        onClick={() => {
          Navigation.home();
        }}
      >
        <svg
          class={`icon LogoAuth ${
            selectedForm === "signup-form" ? "rotate" : ""
          }`}
          id="IconLogo"
          data-name="IconLogo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 239.32 528.99"
        >
          <path
            id="S2"
            class="icon-item s2"
            d="m238.92,475.44c-3.15-2.59-6.44-5.02-9.42-7.79-7.9-7.36-14.11-16.26-21.61-23.99-6.42-6.61-12.08-13.91-17.6-21.19-12.37-16.31-24.1-33.11-34.62-50.74-7.76-13.01-14.25-26.65-19.47-40.78-3.81-10.32-7.32-20.85-9.58-31.7-4.36-20.92-6.56-42.05-5.11-63.38,1.1-16.17,4.05-32.08,8.19-47.8,3.46-13.17,9.15-25.31,15.59-37.18,4.91-9.06,11-17.26,17.56-25.21,7.09-8.59,15.34-15.96,23.5-23.4,2.74-2.5,6.18-4.63,9.99-5.51,2.85-.66,5.16.74,6.58,3.07,2.12,3.48,2.53,7.17.13,10.8-3.24,4.89-7.39,9-11.26,13.36-5.46,6.16-9.52,13.35-14.38,19.94-6.1,8.28-10.27,17.49-13.87,26.9-4.67,12.21-8.93,24.57-10.84,37.7-1.42,9.79-1.97,19.6-3.04,29.38-1.45,13.27,1.07,26.15,1.93,39.17.33,4.94,1.98,10.03,3.05,14.97,1.27,5.89,2.31,11.95,3.84,17.78,2.63,10.01,5.84,19.9,9.32,29.66,7.78,21.82,16.66,43.25,27.21,63.85,10.85,21.21,22.87,41.82,36.3,61.56,2.41,3.55,5.31,6.76,7.99,10.13-.13.14-.26.28-.39.42Z"
          />
          <path
            id="and"
            class="icon-item and"
            d="m107.51,268.65c-1.6,9.47-2.41,19.14-8.65,27.18-4.35,5.6-9.43,10.16-16.27,12.29-1.73.54-2.09,1.21-2.08,2.79.04,5.24.17,10.49-.11,15.72-.35,6.61-1.85,13.01-4.12,19.25-.51,1.41-1.31,1.68-2.45,1.66-5.99-.1-10.51,2.37-13.67,7.48-.99,1.6-2.36,2.91-4.46,2.91-2.2,0-4.97.89-6.31-1.08-1.11-1.64,1.25-3.21,2.05-4.81,2.9-5.84,3.93-12.16,4.99-18.49,1.3-7.78,1.29-15.68.64-23.42-.77-9.2-2.71-18.32-4.37-27.43-1.57-8.65-3.11-17.32-5.24-25.84-2.29-9.16-3.88-18.42-4.92-27.76-1.65-14.89-2.87-29.71-.53-44.77,1.91-12.31,5.35-24.12,9.77-35.58,2.3-5.95,6.73-11.09,10.24-16.57,5.68-8.86,13.36-15.85,21.4-22.46,2.88-2.37,6.11-4.31,9.68-5.46,1.89-.61,4.23-.95,5.22,1.35.85,1.98-.59,3.28-2.2,4.58-15.84,12.77-28.19,28.1-36.08,47.11-3,7.22-4.71,14.57-6.35,22.11,8.11.8,15.73,3.07,23.11,5.93,11.18,4.34,14.24,11.2,10.82,23.88-2.92,10.82-10.24,17.74-20.27,22.05-1.25.54-.97,1.1-.79,1.97,1.8,9.05,3.9,18.03,6.43,26.91.51,1.8,1.4,2.03,2.89,1.24,11.57-6.17,20.27-14.56,22.57-28.23,1.19-7.09,2.14-14.17,1.97-21.36.26,0,.51.01.77.02,3.52,11.83,6.12,23.82,6.36,36.22-.02,6.87-.03,13.75-.05,20.62Z"
          />
          <path
            id="S1"
            class="icon-item"
            d="m174.56,528.99c-9.03-7.22-17.89-14.7-25.84-23.11-8.02-8.49-15.62-17.38-23.42-26.08-11.16-12.45-21.29-25.74-31.53-38.93-7.47-9.62-14.23-19.81-21.87-29.28-5.79-7.16-11.23-14.7-16.42-22.14-5.38-7.71-10.87-15.62-15.48-23.99-4.15-7.54-9.3-14.53-13.27-22.14-4.05-7.77-7.55-15.87-10.67-24.06-4.75-12.45-8.69-25.17-11.06-38.33-1.32-7.31-2-14.69-2.75-22.08-1.46-14.45-2.72-28.89-2.08-43.39.71-16.26,3.09-32.26,7.1-48.12,4.18-16.55,10.59-32.12,17.55-47.6,4.46-9.91,10.04-19.18,15.11-28.74,4.07-7.67,8.4-15.2,12.57-22.82,3.73-6.82,7.35-13.77,10.51-20.78,2.54-5.61,5.45-11.44,6.57-17.61.85-4.68,3.02-9,3.18-13.81.18-5.21.47-10.42.73-15.63,0-.06.19-.11.61-.34,3.62,4.39,4.53,9.76,5.42,15.14,2.41,14.5-.81,28.43-4.69,42.18-4.19,14.87-11.59,28.44-18.02,42.4-10.76,23.39-22.11,46.56-29.56,71.29-3.94,13.06-7.16,26.3-9.37,39.86-2.32,14.2-3.9,28.36-3.42,42.69.3,9.04,1.85,17.98,3.08,26.96,2.04,14.81,6.27,28.79,11.92,42.42,8.44,20.35,19.36,39.41,31.62,57.67,19.51,29.05,39.62,57.69,61.25,85.2,14.54,18.49,28.5,37.49,44.81,54.54,2.6,2.72,5.8,4.97,7.4,8.64Z"
          />
        </svg>
      </button>

      <div
        className={`credential_view ${
          showVerify !== true && showForgot !== true ? "" : "hidden"
        }`}
      >
        <div className="toggle-buttons">
          <button
            className={`toggle-button ${
              selectedForm === "login-form" ? "selected" : ""
            }`}
            id="login-toggle-button"
            onClick={() => setSelectedForm("login-form")}
          >
            Login
          </button>
          <button
            className={`toggle-button ${
              selectedForm === "signup-form" ? "selected" : ""
            }`}
            id="signup-toggle-button"
            onClick={() => {
              setSelectedForm("signup-form");
            }}
          >
            Sign Up
          </button>
        </div>
        <div
          id="login-form"
          className={`form-fields ${
            selectedForm === "login-form" ? "selected" : ""
          }`}
        >
          <input
            type="tel"
            placeholder="Phone"
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          ></input>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <button
            className="forgot-password"
            onClick={() => {
              setPassword("");
              setPassword2("");
              setShowForgot(true);
            }}
          >
            Forgot Password?
          </button>
          <button className="form-submit" type="submit" onClick={login}>
            Login
          </button>
        </div>
        <div
          id="signup-form"
          className={`form-fields ${
            selectedForm === "signup-form" ? "selected" : ""
          }`}
        >
          <input
            type="tel"
            placeholder="Phone"
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          ></input>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => {
              setPassword2(e.target.value);
            }}
          ></input>
          <button className="form-submit" type="submit" onClick={signup}>
            Sign Up
          </button>
        </div>
      </div>
      <div className={`forgot_view ${showForgot === true ? "" : "hidden"}`}>
        <div id="forgot-form" className="form-fields selected">
          <input
            type="tel"
            placeholder="Phone"
            value={phone ? phone : ""}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          ></input>
          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <input
            type="password"
            placeholder="Confirm New Password"
            onChange={(e) => {
              setPassword2(e.target.value);
            }}
          ></input>
          <button className="form-submit" type="submit" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
      <div className={`verify_view ${showVerify === true ? "" : "hidden"}`}>
        <div id="verify-form" className="form-fields selected">
          <input
            type="text"
            maxLength={6}
            placeholder="Code"
            onChange={(e) => {
              setVerifyCode(e.target.value);
            }}
          ></input>
          <button className="form-submit" type="submit" onClick={verify}>
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
