import React from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@/App.css";
import GlobalContext from "@/context";
import routes from "@/routes";

const App = () => {
  // goto where
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default App;
