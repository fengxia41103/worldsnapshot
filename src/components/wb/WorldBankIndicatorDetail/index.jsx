import { map, sortBy } from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import WorldBankGraph from "@Components/wb/WorldBankGraph";

import { setActiveData } from "@Models/worldbank";

const WorldBankIndicatorDetail = (props) => {
  const { indicator, start = "1960", end = "2023" } = props;

  const activeCountries = useSelector((state) => state.wb.activeCountries);
  const activeData = useSelector((state) => state.wb.activeData);
  const dispatch = useDispatch();

  const getURL = (countryCode) => {
    // Build DHS API url
    const baseUrl = "http://api.worldbank.org/v2/en/countries/";
    const query = `?date=${start}:${end}&format=json&per_page=1000`;

    return `${baseUrl}${countryCode}/indicators/${encodeURI(
      indicator,
    )}${query}`;
  };

  const isExisting = (countryCode, indicator) => {
    const [existing] = activeData.filter(
      (x) => x.countryCode === countryCode && x.indicator === indicator,
    );

    // we already have this data
    if (!!existing) return true;

    return false;
  };

  const cleanData = (data) => {
    const tmp = map(data, (d, index) => {
      const { value, date, country } = d;
      const { id: countryID } = country;

      // Internal data format is a dict.
      return {
        uniqueKey: `${countryID}${index}`,
        country: countryID,
        year: date,
        value: value === null ? 0 : parseFloat(value),
        category: countryID,
        text: [countryID, date].join("-"), // Label for each data point
      };
    });

    // Sort data by "date" field
    return sortBy(tmp, "year");
  };

  useEffect(() => {
    activeCountries.forEach((countryCode) => {
      const theURL = getURL(countryCode);

      if (isExisting(countryCode, indicator)) return;

      // get data from API and save to store
      fetch(theURL)
        .then((response) => response.json())
        .then((data) => {
          const [, values] = data;

          if (!!!values) return;

          const cleanedData = cleanData(values);

          // update store
          dispatch(
            setActiveData({
              countryCode,
              indicator,
              data: cleanedData,
            }),
          );
        });
    });
  }, [activeCountries]);

  return <WorldBankGraph {...{ indicator }} />;
};

export default WorldBankIndicatorDetail;
