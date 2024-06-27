import axios from "axios";
import { getCookie } from "../utils";

class ServiceModel {
  constructor(name, description, price, duration, image) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.duration = duration;
    this.image = image;
  }

  get json() {
    return JSON.stringify({
      name: this.name,
      description: this.description,
      price: this.price,
      duration: this.duration,
      image: this.image,
    });
  }

  static fromJson(json) {
    return new ServiceModel(
      json.name,
      json.description,
      json.price,
      json.duration,
      json.image
    );
  }

  static getEmptyService() {
    return new ServiceModel("", "", "", "", "");
  }

  static async getServices(filter = "") {
    try {
      const response = await axios.get("/api/getServices", {
        params: {
          filter: filter,
        },
      });

      const data = response.data;

      const services = [];

      for (let i = 0; i < data.length; i++) {
        services.push(this.fromJson(data[i]));
      }

      return services;
    } catch (error) {
      return error.response.data;
    }
  }

  static async checkDate(date, service) {
    try {
      const response = await axios.get("/api/checkDate", {
        params: {
          date: date,
          service: service,
        },
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        mode: "same-origin",
      });
      const data = response.data;

      return data;
    } catch (error) {
      return error.response.data;
    }
  }

  static async getServiceByName(serviceName = "") {
    try {
      const response = await axios.get("/api/getServiceByName", {
        params: {
          name: serviceName,
        },
      });
      const data = response.data;

      return this.fromJson(data);
    } catch (error) {
      return error.response.data;
    }
  }

  static async searchServiceByName(services, query) {
    const results = services.filter((service) => {
      const serviceName = service.name.toLowerCase();
      const lowerCaseQuery = query.toLowerCase();

      // Check if the service name contains the query
      return serviceName.includes(lowerCaseQuery);
    });

    return results;
  }
}

export default ServiceModel;
