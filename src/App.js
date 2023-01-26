import React from "react";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import routes from "@/routes";

import GlobalStore from "@Models/store";

const App = () => {
  // goto where
  const router = createBrowserRouter(routes);

  return (
    <Provider store={GlobalStore}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
