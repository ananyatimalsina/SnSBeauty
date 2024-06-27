import React, { useEffect, useState } from "react";
import ServiceModel from "../Models/ServiceModel";

import "./ServicesPage.css";
import Header from "../Components/Header";
import Loading from "../Components/Loading";
import { Navigation } from "../utils";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [fullServices, setFullServices] = useState([]);
  const [query, setQuery] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (firstLoad === true) {
      setFirstLoad(false);
      document.querySelector(".search-box").focus();
      document.querySelector(".services").classList.remove("active");

      ServiceModel.getServices("").then((services) => {
        setFullServices(services);
        setServices(services);
      });
    } else {
      if (query !== "") {
        ServiceModel.searchServiceByName(fullServices, query).then(
          (results) => {
            setServices(results);
          }
        );
      } else {
        setServices(fullServices);
      }
    }
  }, [query, firstLoad, fullServices]);

  function renderServices() {
    if (services && services.length > 0) {
      document.querySelector(".services").classList.add("active");
      return services.map((service) => (
        <div
          key={service.name}
          className="service"
          onClick={() => {
            Navigation.service(service.name);
          }}
        >
          <img src={service.image} alt={service.name} />
          <h3>
            {service.name} - {service.price}$
          </h3>
        </div>
      ));
    } else {
      return <Loading />;
    }
  }

  return (
    <>
      <Header query={query} setQuery={setQuery} />
      <div className="container">
        <div className="services">{renderServices()}</div>
      </div>
    </>
  );
}
