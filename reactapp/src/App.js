import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ServicesPage from "./Pages/ServicesPage";
import ServiceDetailsPage from "./Pages/ServiceDetailsPage";
import AuthPage from "./Pages/AuthPage";
import "./General.css";
import AppointmentsPage from "./Pages/AppointmentsPage";
import SettingsPage from "./Pages/SettingsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ServicesPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/service",
    element: <ServiceDetailsPage />,
  },
  {
    path: "/appointments",
    element: <AppointmentsPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
