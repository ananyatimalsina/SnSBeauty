import axios from "axios";
import { getCookie } from "../utils";

class UserModel {
  constructor(phone, password, id = null, token = null) {
    this.phone = phone;
    this.password = password;
    this.id = id;
    this.token = token;
  }

  get json() {
    return JSON.stringify({
      phone: this.phone,
      password: this.password,
      id: this.id,
      token: this.token,
    });
  }

  static fromJson(json) {
    return new UserModel(
      json.user.phone,
      json.user.password,
      json.user.id,
      json.token
    );
  }

  static getEmptyUser() {
    return new UserModel("", "");
  }

  static async getCurrentUser() {
    try {
      const response = await axios.get("/api/getUser", {
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        mode: "same-origin",
      });
      const data = response.data;
      const user = this.fromJson(data);

      return user;
    } catch (error) {
      return error.response.data;
    }
  }

  async sendVerificationCode() {
    try {
      const response = await axios.get("/api/getVerification", {
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

  async login() {
    try {
      const response = await axios.post(
        "/api/login",
        {
          phone: this.phone,
          password: this.password,
        },
        {
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
          mode: "same-origin",
        }
      );
      const data = response.data;

      this.password = data.user.password;
      this.id = data.user.id;
      this.token = data.token;
      return data;
    } catch (error) {
      return error.response.data;
    }
  }

  async signup() {
    try {
      const response = await axios.post(
        "/api/signup",
        {
          phone: this.phone,
        },
        {
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
          mode: "same-origin",
        }
      );
      const data = response.data;

      return data;
    } catch (error) {
      return error.response.data;
    }
  }

  async verifySignup(code) {
    try {
      const response = await axios.post(
        "/api/verifySignup",
        {
          phone: this.phone,
          password: this.password,
          code: code,
        },
        {
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
          mode: "same-origin",
        }
      );
      const data = response.data;

      this.password = data.user.password;
      this.id = data.user.id;
      this.token = data.token;

      return data;
    } catch (error) {
      return error.response.data;
    }
  }

  async resetPassword() {
    try {
      const response = await axios.post(
        "/api/resetPassword",
        {
          phone: this.phone,
        },
        {
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
          mode: "same-origin",
        }
      );
      const data = response.data;

      return data;
    } catch (error) {
      return error.response.data;
    }
  }

  async verifyResetPassword(code) {
    try {
      const response = await axios.post(
        "/api/verifyResetPassword",
        {
          phone: this.phone,
          password: this.password,
          code: code,
        },
        {
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
          mode: "same-origin",
        }
      );
      const data = response.data;

      this.password = data.user.password;
      this.id = data.user.id;
      this.token = data.token;

      return data;
    } catch (error) {
      return error.response.data;
    }
  }

  async edit(password, code) {
    try {
      const response = await axios.put(
        "/api/editUser",
        {
          password: password,
          code: code,
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

      this.password = data.password;
      this.phone = data.phone;

      return data;
    } catch (error) {
      return error.response.data;
    }
  }

  async delete(code) {
    try {
      const response = await axios.delete(
        "/api/deleteUser",
        {
          code: code,
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

      return data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export default UserModel;
