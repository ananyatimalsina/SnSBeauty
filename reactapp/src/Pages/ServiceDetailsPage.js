import React, { useState, useEffect } from "react";
import ServiceModel from "../Models/ServiceModel";
import AppointmentModel from "../Models/AppointmentModel";

import "./ServiceDetailsPage.css";
import { useQuery, isAuth, Navigation } from "../utils";
import Popup from "../Components/Popup";
import Loading from "../Components/Loading";
import Header from "../Components/Header";

import { Navigate } from "react-router-dom";

export default function ServiceDetailsPage() {
  const [service, setService] = useState(ServiceModel.getEmptyService());
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("--:--");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  let query = useQuery();

  useEffect(() => {
    if (popupMessage !== "") {
      setShowPopup(true);
    }
  }, [popupMessage]);

  useEffect(() => {
    document.querySelector(".service-details").classList.remove("active");
    ServiceModel.getServiceByName(query.get("s")).then((serviceData) => {
      setService(serviceData);
    });
  }, [query]);

  useEffect(() => {
    if (selectedDate !== "") {
      const date = new Date(selectedDate);
      const now = new Date();
      if (date < now) {
        setPopupMessage("Please select a date in the future.");
        setSelectedDate("");
      }
      else if (date > new Date(now.getFullYear(), now.getMonth() + 2, 0)) {
        setPopupMessage("Please select a date within two months.");
        setSelectedDate("");
      } else {
        ServiceModel.checkDate(selectedDate, service.name).then((times) => {
          if (times.error) {
            setPopupMessage(times.error);
            setSelectedDate("");
          }
          else if (times.length === 0) {
            setPopupMessage("No available times for this date.");
            setSelectedDate("");
          } else {
            setAvailableTimes(times);
            setSelectedTime(times[0]);
          }
        });
      }
    }
  }, [selectedDate, service.name]);

  function handleSubmit(event) {
    const appointment = new AppointmentModel(
      service.name,
      selectedDate,
      selectedTime
    );

    appointment.add().then((data) => {
      if (!data || !data.success) {
        setPopupMessage(data ? data.error : "An error occurred.");
      } else {
        Navigation.appointments();
      }
    });
  }

  function renderAvailableTimes() {
    if (availableTimes.length === 0) {
      return <option value="--:--">--:--</option>;
    } else {
      return availableTimes.map((time) => (
        <option key={time} value={time}>
          {time}
        </option>
      ));
    }
  }

  function renderService() {
    if (service.name) {
      document.querySelector(".service-details").classList.add("active");
      return (
        <>
          <div className="top_down_info">
            <img src={service.image} alt={service.name} />
            <p>{service.description}</p>
          </div>
          <div className="service-info">
            <h1 className="service-title">{service.name}</h1>
            <p className="service-duration">
              Estimated Duration: {service.duration} mins
            </p>
            <p className="service-price">Price: ${service.price}</p>

            <div className="booking-form">
              <div className="form-group">
                <label htmlFor="booking-date">Select Date:</label>
                <input
                  type="date"
                  id="booking-date"
                  name="booking-date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="booking-time">Select Time:</label>
                <select
                  disabled={!selectedDate}
                  id="booking-time"
                  name="booking-time"
                  value={selectedTime}
                  onChange={(e) => {
                    setSelectedTime(e.target.value);
                  }}
                >
                  {renderAvailableTimes()}
                </select>
              </div>
              <div className="form-group">
                <button
                  disabled={!selectedDate || selectedTime === "--:--"}
                  className="book-button"
                  onClick={handleSubmit}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className="centeredLoading">
          <Loading />
        </div>
      );
    }
  }

  if (!isAuth()) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Header
        onFocus={() => {
          Navigation.home();
        }}
      />
      <div className="service-details">
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
        {renderService()}
      </div>
    </>
  );
}
