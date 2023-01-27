import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import routes from "@/routes";

import { setIndicators } from "@Models/worldbank";

const App = () => {
  const dispatch = useDispatch();
  const API =
    "http://api.worldbank.org/v2/indicators?format=json&per_page=17000";

  useEffect(() => {
    fetch(API)
      .then((response) => response.json())
      .then((data) => {
        const [summary, indicators] = data;
        const { total } = summary;

        // update store
        dispatch(setIndicators(indicators));
      });
  }, [API]);

  // goto where
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default App;
