import React from "react";

import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Spaces from "../pages/Spaces";
import Dashboard from "../pages/Dashboard";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/spaces", element: <Spaces /> },
  { path: "/dashboard/:spaceId", element: <Dashboard /> },
]);
