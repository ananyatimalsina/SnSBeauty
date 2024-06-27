import axios from "axios";
import { getCookie } from "../utils";
import ServiceModel from "./ServiceModel";

class AppointmentModel {
  constructor(
    service,
    date,
    time,
    status = "pending",
    id = null,
    isDeletable = false
  ) {
    this.service = service;
    this.date = date;
    this.time = time;
    this.status = status;
    this.id = id;
    this.isDeletable = isDeletable;
  }

  get json() {
    return JSON.stringify({
      service: this.service.json(),
      date: this.date,
      time: this.time,
      status: this.status,
      id: this.id,
      isDeletable: this.isDeletable,
    });
  }

  static fromJson(json) {
    return new AppointmentModel(
      ServiceModel.fromJson(json.service),
      json.date,
      json.time,
      json.status,
      json.id,
      json.isDeletable
    );
  }

  static async getAppointments() {
    try {
      const response = await axios.get("/api/getAppointments", {
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        mode: "same-origin",
      });
      const data = response.data;
      const appointments = [];

      console.log(data);

      for (let i = 0; i < data.length; i++) {
        appointments.push(this.fromJson(data[i]));
      }

      console.log(appointments);

      return appointments;
    } catch (error) {
      return error.response.data;
    }
  }

  async add() {
    try {
      const response = await axios.post(
        "/api/addAppointment",
        {
          date: this.date,
          service: this.service,
          time: this.time,
        },
        {
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          mode: "same-origin",
        }
      );
      const data = response.data;

      this.status = data.status;
      this.id = data.id;

      return data;
    } catch (error) {
      return error.response.data;
    }
  }

  async delete() {
    if (this.isDeletable) {
      try {
        const response = await axios.delete("/api/deleteAppointment", {
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          data: {
            id: this.id,
          },
          mode: "same-origin",
        });

        return response.data;
      } catch (error) {
        return error.response.data;
      }
    } else {
      return {
        error: "You cannot delete this appointment",
      };
    }
  }
}

export default AppointmentModel;
