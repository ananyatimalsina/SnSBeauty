import React, { useEffect, useState } from "react";

import "./SettingsPage.css";

import Popup from "../Components/Popup";

import { Navigation, isAuth } from "../utils";

import { Navigate } from "react-router-dom";
import UserModel from "../Models/UserModel";

export default function SettingsPage() {
  const [user, setUser] = useState(UserModel.getEmptyUser());
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [currentVerify, setCurrentVerify] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");

  useEffect(() => {
    if (confirmMessage !== "") {
      setShowConfirm(true);
    }
  }, [confirmMessage]);

  useEffect(() => {
    if (popupMessage !== "") {
      setShowPopup(true);
    }
  }, [popupMessage]);

  useEffect(() => {
    UserModel.getCurrentUser().then((userData) => {
      setUser(userData);
    });
  }, []);

  useEffect(() => {
    setPhone(user.phone);
  }, [user]);

  const handleBackClick = () => {
    Navigation.home();
  };

  const handleLogoutClick = () => {
    Navigation.logout();
  };

  function editAccount(e) {
    e.preventDefault();

    if (password === "" && repeatPassword === "") {
      setPopupMessage("No edits to make!");
      return;
    }

    if (password !== repeatPassword) {
      setPopupMessage("Passwords don't match");
      return;
    }

    user.sendVerificationCode().then((userData) => {
      setCurrentVerify("edit");
      setShowVerify(true);
    });
  }

  function deleteAccount(e) {
    setConfirmMessage(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
  }

  function verify(code) {
    if (currentVerify !== "") {
      if (currentVerify === "edit") {
        user.edit(password, code).then((userData) => {
          setCurrentVerify("");
          setShowVerify(false);
        });
      } else if (currentVerify === "delete") {
        user.delete(code).then((userData) => {
          localStorage.removeItem("token");
          Navigation.auth();
        });
      }
    }
  }

  if (!isAuth()) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="settingsContainer">
      {showVerify && (
        <Popup
          type="verify"
          onClose={() => {
            setShowVerify(false);
          }}
          onConfirm={(code) => {
            verify(code);
          }}
        />
      )}
      {showConfirm && (
        <Popup
          message={confirmMessage}
          type="confirmation"
          onConfirm={(e) => {
            user.sendVerificationCode().then((userData) => {
              setCurrentVerify("delete");
              setShowVerify(true);
            });
          }}
          onClose={() => {
            setShowConfirm(false);
            setConfirmMessage("");
          }}
        />
      )}
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
      <div className="header">
        <button className="back-btn" onClick={handleBackClick}>
          <svg
            className="Back"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 8 8"
          >
            <path d="M1.066 2.96l3.736 3.737-1.037 1.036L.03 3.998z" />
            <path d="M1.607 3.16h6.375v1.684H1.607z" />
            <path d="M.023 4.004L3.758.267l1.037 1.036L1.06 5.04z" />
          </svg>
        </button>
        <h1>Settings</h1>
        <button className="logout-btn" onClick={handleLogoutClick}>
          <svg
            className="Logout"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 120 120"
          >
            <path
              d="M107.36 71.768L65.052 29.46l11.74-11.738L119.1 60.03z"
              fill="#010101"
            />
            <path d="M41 50.446h60.21V69.5H41z" fill="#010101" />
            <path
              d="M119.15 59.957L76.858 102.28l-11.74-11.722 42.312-42.33zM5 8.5h17v103H5z"
              fill="#010101"
            />
            <path d="M5 5h48v17H5zm0 92h48v17H5z" fill="#010101" />
          </svg>
        </button>
      </div>
      <div className="settingsForm">
        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={phone}
          required
          readOnly="true"
          disabled="true"
        />

        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength="8"
          required
        />

        <label htmlFor="repeat-password">Repeat New Password:</label>
        <input
          type="password"
          id="repeat-password"
          name="repeat-password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          minLength="8"
          required
        />

        <button className="form-submit" type="submit" onClick={editAccount}>
          Save Changes
        </button>

        <button className="delete_account" onClick={deleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
