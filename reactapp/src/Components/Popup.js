import React, { useState } from "react";
import "./Popup.css";

export default function Popup({ message, type, onClose, onConfirm }) {
  const [verifyCode, setVerifyCode] = useState("");

  let popupClassName = "popup ";
  if (type === "error") {
    popupClassName += "error";
  } else if (type === "confirmation") {
    popupClassName += "confirmation";
  } else if (type === "verify") {
    popupClassName += "verify";
  }

  return (
    <div className={popupClassName}>
      <div className="content">
        {type !== "verify" && <p>{message}</p>}
        {type === "confirmation" && (
          <div className="button-container">
            <button
              className="btn_confirmation"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Yes
            </button>
            <button className="btn_confirmation" onClick={onClose}>
              No
            </button>
          </div>
        )}
        {type === "error" && (
          <button className="ok" onClick={onClose}>
            OK
          </button>
        )}
        {type === "verify" && (
          <div className="verify-form">
            <input
              type="text"
              maxLength={6}
              placeholder="Code"
              onChange={(e) => {
                setVerifyCode(e.target.value);
              }}
            ></input>
            <div className="button-container">
              <button className="btn_confirmation" onClick={onClose}>
                Cancel
              </button>
              <button
                className="form-submit"
                type="submit"
                onClick={(e) => {
                  onConfirm(verifyCode);
                }}
              >
                Verify
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
