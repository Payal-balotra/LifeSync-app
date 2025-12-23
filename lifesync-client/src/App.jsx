import React from "react";

import AppShell from "./app/AppShell";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;
