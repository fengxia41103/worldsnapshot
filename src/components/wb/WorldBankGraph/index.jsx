import * as d3 from "d3";
import {
  concat,
  countBy,
  flatten,
  forEach,
  groupBy,
  keys,
  map,
  sortBy,
} from "lodash";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { HighchartGraph } from "@fengxia41103/storybook";

import ShowResource from "@Components/common/ShowResource";

const WorldBankGraph = (props) => {
  const { countryCode, indicator, start = "1960", end = "2023" } = props;

  const getUrl = () => {
    // Build DHS API url
    const baseUrl = "http://api.worldbank.org/v2/en/countries/";
    const query = `?date=${start}:${end}&format=json&per_page=1000`;

    return `${baseUrl}${countryCode}/indicators/${indicator}${query}`;
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

  const render_data = (data) => {
    const [, values] = data;

    if (!!!values) return null;

    const cleaned = cleanData(values);
    const chartData = [
      {
        name: countryCode,
        data: cleaned.map((x) => x.value),
      },
    ];

    // Render graphs
    const footer = "Source: The World Bank";
    return (
      <HighchartGraph
        title={countryCode}
        type="column"
        categories={cleaned.map((c) => c.year)}
        data={chartData}
        footer={footer}
      />
    );
  };

  return <ShowResource resource={getUrl()} on_success={render_data} />;
};

WorldBankGraph.propTypes = {
  countryCode: PropTypes.string.isRequired,
  indicator: PropTypes.string.isRequired,
  start: PropTypes.string,
  end: PropTypes.string,
};

export default WorldBankGraph;
