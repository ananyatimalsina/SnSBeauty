import React, { useState, useEffect } from "react";
import AppointmentModel from "../Models/AppointmentModel";
import Popup from "../Components/Popup";
import Loading from "../Components/Loading";
import "./AppointmentsPage.css";
import { Navigation, isAuth } from "../utils";
import Header from "../Components/Header";

import { Navigate } from "react-router-dom";

export default function AppointmentsPage(
  leadingAction = () => {
    Navigation.home();
  }
) {
  const [appointments, setAppointments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    AppointmentModel.getAppointments().then((appointmentsData) => {
      setAppointments(appointmentsData);
      setShowLoading(false);
    });
  }, []);

  useEffect(() => {
    if (popupMessage !== "") {
      setShowPopup(true);
    }
  }, [popupMessage]);

  function deleteAppointment(appointment) {
    appointment.delete().then((response) => {
      const newAppointments = appointments.filter(
        (newAppointment) => newAppointment.id !== appointment.id
      );
      setAppointments(newAppointments);
    });
  }

  function renderAppointments() {
    if (appointments && appointments.length > 0) {
      document.querySelector(".services").classList.add("active");

      return appointments.map((appointment) => (
        <div className="service">
          <button
            className="delete-btn"
            onClick={() => {
              setSelectedAppointment(appointment);
              setPopupMessage("Are you sure you want to delete this?");
            }}
            disabled={!appointment.isDeletable}
          >
            <svg
              className="Delete"
              id="Delete"
              data-name="Delete"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 268.62 503.18"
            >
              <path d="m225.18,344.93c-10.17-.07-19.72,2.85-29.21,6.04-14.61,4.9-27.96,12.18-40.09,21.65-3.71,2.9-7.26,6.03-10.69,9.26-8.17,7.68-13.58,5.6-20.02-.54-10.54-10.05-22.42-18.18-35.4-24.43-13.87-6.68-28.6-11.03-44.15-11.98-4.45-.27-7.29-4.2-7.23-9.86.05-5.33,2.09-7.55,7.55-7.33,10.82.43,21.4,2.39,31.86,5.29,14.43,4,27.58,10.54,39.89,18.91,5.16,3.51,9.82,7.64,14.25,12.03,1.7,1.69,2.7,2.15,4.92.12,11.08-10.13,23.33-18.83,37.04-24.91,13.47-5.98,27.48-10.61,42.58-10.54,4.3.02,8.59-.77,12.89-.85,5.96-.12,8,1.95,7.93,7.51-.08,6.23-3,9.64-8.27,9.65-1.28,0-2.56,0-3.84,0Z" />
              <path d="m261.12,0C235.93,46.45,12.64,170.16,12.64,170.16L0,132.61,261.12,0Z" />
              <path
                class="cap"
                d="m12.57,266.02h248.55v137.64c0,50.79-41.24,92.03-92.03,92.03h-64.5c-50.79,0-92.03-41.24-92.03-92.03v-137.64h0Z"
              />
              <rect
                class="brows"
                x="12.57"
                y="196.77"
                width="138.84"
                height="19.69"
                rx="9.85"
                ry="9.85"
              />
              <rect
                class="brows"
                x="161.61"
                y="196.77"
                width="99.51"
                height="19.69"
                rx="9.85"
                ry="9.85"
              />
            </svg>
          </button>
          <div className="appointmentInfo">
            <div className="info" id={appointment.id}>
              <h2>{appointment.date}</h2>
              <h2>{appointment.time}</h2>
              <h2>{appointment.status}</h2>
            </div>
            <div
              className="appointmentService"
              key={appointment.service.name}
              onClick={() => {
                Navigation.service(appointment.service.name);
              }}
              onMouseOver={(e) => {
                document.getElementById(appointment.id).classList.add("hide");
              }}
              onMouseOut={(e) => {
                document
                  .getElementById(appointment.id)
                  .classList.remove("hide");
              }}
            >
              <img
                src={appointment.service.image}
                alt={appointment.service.name}
              />
              <h3>
                {appointment.service.name} - {appointment.service.price}$
              </h3>
            </div>
          </div>
        </div>
      ));
    } else {
      return <h1 className="appointmentHeading">No Appointments</h1>;
    }
  }

  if (!isAuth()) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Header title="appointments" leading="back" />
      <div className="container">
        {showPopup && (
          <Popup
            message={popupMessage}
            type="confirmation"
            onClose={() => {
              setShowPopup(false);
              setPopupMessage("");
            }}
            onConfirm={() => {
              deleteAppointment(selectedAppointment);
            }}
          />
        )}
        <div className="services">
          {showLoading && <Loading />} {!showLoading && renderAppointments()}
        </div>
      </div>
    </>
  );
}
