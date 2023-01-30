import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import routes from "@/routes";

import { setCountries, setIndicators } from "@Models/worldbank";

const App = () => {
  const dispatch = useDispatch();

  const COUNTRIES_API =
    "http://api.worldbank.org/v2/en/countries?format=json&per_page=1000";
  const INDICATORS_API =
    "http://api.worldbank.org/v2/indicators?format=json&per_page=100";

  useEffect(() => {
    // get countries
    fetch(COUNTRIES_API)
      .then((response) => response.json())
      .then((data) => {
        const [, countries] = data;

        // update store
        dispatch(setCountries(countries));
      });

    // get indicators
    fetch(INDICATORS_API)
      .then((response) => response.json())
      .then((data) => {
        const [, indicators] = data;

        // update store
        dispatch(setIndicators(indicators));
      });
  }, [INDICATORS_API, COUNTRIES_API]);

  // goto where
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default App;
