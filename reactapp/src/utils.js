import { useLocation } from "react-router-dom";
import React from "react";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function isAuth() {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    return true;
  } else {
    return false;
  }
}

class Navigation {
  static auth() {
    window.location.href = "/auth";
  }

  static home() {
    window.location.href = "/";
  }

  static settings() {
    if (!isAuth()) {
      window.location.href = "/auth";
      return;
    }
    window.location.href = "/settings";
  }

  static logout() {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  }

  static appointments() {
    if (!isAuth()) {
      window.location.href = "/auth";
      return;
    }
    window.location.href = "/appointments";
  }

  static service(name) {
    if (!isAuth()) {
      window.location.href = "/auth";
      return;
    }
    window.location.href = "/service?s=" + name;
  }
}

export { useQuery, getCookie, isAuth, Navigation };
